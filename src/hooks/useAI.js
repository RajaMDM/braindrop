import { useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useMemory } from './useMemory.js';
import { useRAG } from './useRAG.js';
import { useXP } from './useXP.js';
import { useEventLog } from './useEventLog.js';
import { callProvider, callProviderWithSys } from '../utils/providerCaller.js';
import { buildSystemPrompt, buildClassroomPrompt } from '../utils/systemPrompts.js';
import { AI_PROVIDERS, PROVIDER_ORDER } from '../data/providers.js';
import { CLASSROOM_AGENTS_BY_GRADE, getClassroomAgents } from '../data/classroomAgents.js';
import { EP } from '../data/examPatterns.js';

const STORAGE_KEY = 'bd2';
const DAILY_LIMIT = 50;

/**
 * Read/write usage counters from localStorage('bd2').
 * Resets if the stored date doesn't match today.
 */
function readUsage() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (stored.usage && stored.usage.date === new Date().toDateString()) {
      return stored.usage;
    }
  } catch { /* fresh start */ }
  return {
    claude: 0, gemini: 0, nvidia: 0, openai: 0,
    groq: 0, deepseek: 0, mistral: 0, ollama: 0,
    date: new Date().toDateString(),
  };
}

function writeUsage(usage) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    existing.usage = usage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch { /* best-effort */ }
}

/**
 * Get available providers.
 * All API keys are server-side in the Cloudflare Worker — no localStorage check needed.
 * Returns the providers that have keys configured in the Worker.
 */
function getAvailableProviders() {
  // These 4 providers have keys configured in braindrop-ai-proxy Worker.
  // Groq is included but may fail if key expired — fallback chain handles it.
  return ['nvidia', 'groq', 'gemini', 'claude'];
}

/**
 * Get classroom provider assignments — mirrors legacy getClassroomProviders().
 */
function getClassroomProviders(pref) {
  const avail = getAvailableProviders();
  if (avail.length === 0) return { teacher: null, classmate1: null, classmate2: null, classmate3: null, classmate4: null };
  const teacherProv = pref !== 'auto' && avail.includes(pref) ? pref : avail[0];
  // Distribute classmates across available free-tier providers
  const others = avail.filter(p => p !== teacherProv);
  const pool = others.length > 0 ? others : [teacherProv];
  return {
    teacher: teacherProv,
    classmate1: pool[0 % pool.length],
    classmate2: pool[1 % pool.length],
    classmate3: pool[2 % pool.length],
    classmate4: pool[0 % pool.length], // cycle back
  };
}

/**
 * useAI — Main AI calling hook.
 *
 * Provides:
 *   callAI(userMsg)       — Regular mode, tries providers in PROVIDER_ORDER
 *   callClassroom(userMsg) — Classroom mode with 3 agents
 *   lastAI                 — Name of the last-used provider
 *   availableProviders     — Currently available provider keys
 */
export function useAI() {
  const {
    grade, subject, mode, messages,
    preferences, addMessage, setBusy,
  } = useApp();
  const { user } = useAuth();
  const { getMemoryContext, updateLearningProfile } = useMemory();
  const { getKBForCurrentSubject } = useRAG();
  const { addXP, incrementQueryCount } = useXP();
  const { logEvent } = useEventLog();

  /** Mutable ref for last AI used (avoids re-render churn). */
  const lastAIRef = useRef('');

  /** Build system prompt for the current state. */
  const buildCurrentSysPrompt = useCallback(
    (userMsg) => {
      const kbContent = getKBForCurrentSubject(userMsg);
      const memoryContext = getMemoryContext();
      return buildSystemPrompt({
        grade,
        subject,
        mode,
        name: preferences.name || user?.name || '',
        kbContent,
        examPatterns: EP[subject] || null,
        memoryContext,
      });
    },
    [grade, subject, mode, preferences.name, user?.name, getKBForCurrentSubject, getMemoryContext]
  );

  /**
   * callAI — Regular mode.  Tries each provider in priority order.
   * Returns { reply, usedAI } on success, or { reply: null } if all fail.
   */
  const callAI = useCallback(
    async (userMsg) => {
      const avail = getAvailableProviders();
      if (avail.length === 0) {
        return { reply: null, usedAI: null, error: 'no_providers' };
      }

      const usage = readUsage();
      const systemPrompt = buildCurrentSysPrompt(userMsg);

      // Build history from messages (last 16)
      const history = messages.slice(-16).map((m) => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        text: m.text,
      }));

      // Determine try order
      let tryOrder = [];

      // Quiz and Flashcard modes REQUIRE structured JSON output.
      // Free models (NVIDIA, Groq, Gemini) are unreliable at generating JSON.
      // Force Claude first for these modes — it follows instructions precisely.
      if (mode === 'quiz' || mode === 'flashcard') {
        if (avail.includes('claude')) {
          tryOrder = ['claude', ...avail.filter(p => p !== 'claude')];
        } else {
          tryOrder = [...avail];
        }
      } else if (preferences.pref !== 'auto' && avail.includes(preferences.pref)) {
        tryOrder = [preferences.pref, ...avail.filter((p) => p !== preferences.pref)];
      } else {
        tryOrder = [...avail];
      }

      // Rate-limit Claude (but NOT for quiz/flashcard — those need it)
      if (mode !== 'quiz' && mode !== 'flashcard' && usage.claude >= DAILY_LIMIT) {
        tryOrder = tryOrder.filter((p) => p !== 'claude').concat(
          tryOrder.includes('claude') ? ['claude'] : []
        );
        if (tryOrder[0] === 'claude' && tryOrder.length > 1) {
          tryOrder.push(tryOrder.shift());
        }
      }

      let reply = '';
      let usedAI = '';

      for (const provider of tryOrder) {
        try {
          reply = await callProvider(provider, userMsg, systemPrompt, history);
          usedAI = AI_PROVIDERS[provider].name;
          lastAIRef.current = provider;
          usage[provider] = (usage[provider] || 0) + 1;
          writeUsage(usage);
          break;
        } catch (err) {
          console.warn(`[BrainDrop] ${provider} failed:`, err.message);
          continue;
        }
      }

      // Two-step conversion: if quiz/flashcard mode got plain text (no tags),
      // make a second focused call to convert the content into structured JSON.
      if (reply && mode === 'quiz' && !reply.includes('<quiz-data>') && !reply.includes('"q"') && !reply.includes('"question"')) {
        try {
          const convertPrompt = `Convert the following quiz content into EXACT JSON format. Output ONLY the JSON, nothing else.

Content to convert:
${reply.substring(0, 2000)}

Output this EXACT format (valid JSON array):
<quiz-data>
[{"q":"Question text here?","options":["A) option1","B) option2","C) option3","D) option4"],"answer":0,"explanation":"Why correct","difficulty":"medium","topic":"${subject}"}]
</quiz-data>`;
          const converted = await callProviderWithSys('claude', convertPrompt, 'You are a JSON formatter. Output ONLY the requested JSON wrapped in <quiz-data> tags. No other text.', []);
          if (converted && converted.includes('<quiz-data>')) {
            reply = converted;
          }
        } catch (e) { console.warn('[BrainDrop] Quiz conversion failed:', e.message); }
      }

      if (reply && mode === 'flashcard' && !reply.includes('<flashcard-data>') && !reply.includes('"front"')) {
        try {
          const convertPrompt = `Convert the following flashcard content into EXACT JSON format. Output ONLY the JSON, nothing else.

Content to convert:
${reply.substring(0, 2000)}

Output this EXACT format (valid JSON array):
<flashcard-data>
[{"front":"Question or term","back":"Answer or definition","topic":"${subject}"}]
</flashcard-data>`;
          const converted = await callProviderWithSys('claude', convertPrompt, 'You are a JSON formatter. Output ONLY the requested JSON wrapped in <flashcard-data> tags. No other text.', []);
          if (converted && converted.includes('<flashcard-data>')) {
            reply = converted;
          }
        } catch (e) { console.warn('[BrainDrop] Flashcard conversion failed:', e.message); }
      }

      if (reply) {
        addXP(mode === 'quiz' ? 15 : 10);
        incrementQueryCount();
        updateLearningProfile(userMsg, reply);
        logEvent('chat', {
          user: user?.name || preferences.name || 'Unknown',
          email: user?.email || 'guest',
          subject,
          mode,
          ai: lastAIRef.current,
          grade,
        });
      }

      return { reply: reply || null, usedAI, triedProviders: tryOrder };
    },
    [
      messages, preferences.pref, preferences.name, mode, grade, subject,
      user, buildCurrentSysPrompt, addXP, incrementQueryCount,
      updateLearningProfile, logEvent,
    ]
  );

  /**
   * callClassroom — Classroom mode with teacher + 2 classmates.
   * Each agent uses a different AI provider (when possible).
   *
   * Returns {
   *   teacherReply, teacherAI,
   *   classmates: [{ role, reply, ai }]
   * }
   */
  const callClassroom = useCallback(
    async (userMsg) => {
      const provs = getClassroomProviders(preferences.pref);
      // Load custom student names from localStorage
      let customNames = {};
      try { customNames = JSON.parse(localStorage.getItem('bd_classroom_names') || '{}'); } catch {}
      const agents = getClassroomAgents(grade, customNames);

      if (!provs.teacher) {
        return { teacherReply: null, error: 'no_providers' };
      }

      const usage = readUsage();
      const kbContent = getKBForCurrentSubject(userMsg);
      const memoryContext = getMemoryContext();
      const name = preferences.name || user?.name || 'Student';
      const cmRoles = ['classmate1', 'classmate2', 'classmate3', 'classmate4'].filter(r => agents[r]);

      // Format history with agent labels
      const fmtMsgs = (forRole) =>
        messages.slice(-16).map((m) => {
          if (m.agent === forRole) return { role: 'assistant', text: m.text };
          const agentObj = agents[m.agent];
          const label = agentObj ? agentObj.name : name;
          return { role: 'user', text: `[${label}]: ${m.text}` };
        });

      const result = { teacherReply: null, teacherAI: null, classmates: [] };

      // ── Teacher ──
      const teacherSys = buildClassroomPrompt({
        agentRole: 'teacher', grade, subject, name, agents,
        kbContent, examPatterns: EP[subject] || null, memoryContext,
      });

      try {
        result.teacherReply = await callProviderWithSys(provs.teacher, userMsg, teacherSys, fmtMsgs('teacher'));
        result.teacherAI = AI_PROVIDERS[provs.teacher]?.name;
        lastAIRef.current = provs.teacher;
        usage[provs.teacher] = (usage[provs.teacher] || 0) + 1;
      } catch (err) {
        console.warn('[Classroom] Teacher failed:', err.message);
        writeUsage(usage);
        return result;
      }

      if (!result.teacherReply) { writeUsage(usage); return result; }

      updateLearningProfile(userMsg, result.teacherReply);
      addXP(12);
      incrementQueryCount();

      // ── Classmates (sequential, each builds on previous) ──
      let lastReply = result.teacherReply;
      let lastName = agents.teacher.name;

      for (const role of cmRoles) {
        const agent = agents[role];
        const prov = provs[role] || provs.classmate1;

        const cmSys = buildClassroomPrompt({
          agentRole: role, grade, subject, name, agents,
          kbContent: '', examPatterns: null, memoryContext: '',
        });

        const prompt = `[${lastName}] just said: "${lastReply.substring(0, 350)}"\n\nReact in character as ${agent.name}.`;

        try {
          const reply = await callProviderWithSys(prov, prompt, cmSys, fmtMsgs(role));
          const aiName = AI_PROVIDERS[prov]?.name;
          usage[prov] = (usage[prov] || 0) + 1;
          result.classmates.push({ role, reply, ai: aiName, agent });
          lastReply = reply;
          lastName = agent.name;
        } catch (err) {
          console.warn(`[Classroom] ${role} failed:`, err.message);
        }
      }

      writeUsage(usage);
      logEvent('chat', {
        user: user?.name || preferences.name || 'Unknown',
        email: user?.email || 'guest',
        subject, mode: 'classroom', ai: provs.teacher, grade,
      });

      return result;
    },
    [
      messages, preferences.pref, preferences.name, grade, subject,
      user, getKBForCurrentSubject, getMemoryContext, addXP,
      incrementQueryCount, updateLearningProfile, logEvent,
    ]
  );

  return {
    callAI,
    callClassroom,
    lastAI: lastAIRef.current,
    getAvailableProviders,
  };
}
