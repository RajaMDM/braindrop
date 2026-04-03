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
  if (avail.length === 0) return { teacher: null, classmate1: null, classmate2: null };
  if (avail.length === 1) return { teacher: avail[0], classmate1: avail[0], classmate2: avail[0] };

  const teacherProv = pref !== 'auto' && avail.includes(pref) ? pref : avail[0];
  const freeTiers = ['gemini', 'nvidia', 'groq', 'ollama'];

  const cm1Prov =
    avail.find((p) => p !== teacherProv && freeTiers.includes(p)) ||
    avail.find((p) => p !== teacherProv) ||
    teacherProv;
  const cm2Prov =
    avail.find((p) => p !== teacherProv && p !== cm1Prov && freeTiers.includes(p)) ||
    avail.find((p) => p !== teacherProv && p !== cm1Prov) ||
    cm1Prov;

  return { teacher: teacherProv, classmate1: cm1Prov, classmate2: cm2Prov };
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

      // Determine try order (preferred first, then fallback)
      let tryOrder = [];
      if (preferences.pref !== 'auto' && avail.includes(preferences.pref)) {
        tryOrder = [preferences.pref, ...avail.filter((p) => p !== preferences.pref)];
      } else {
        tryOrder = [...avail];
      }

      // Rate-limit Claude
      if (usage.claude >= DAILY_LIMIT) {
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
   *   classmate1Reply, classmate1AI,
   *   classmate2Reply, classmate2AI
   * }
   */
  const callClassroom = useCallback(
    async (userMsg) => {
      const provs = getClassroomProviders(preferences.pref);
      const agents = getClassroomAgents(grade);

      if (!provs.teacher) {
        return { teacherReply: null, error: 'no_providers' };
      }

      const usage = readUsage();
      const kbContent = getKBForCurrentSubject(userMsg);
      const memoryContext = getMemoryContext();
      const name = preferences.name || user?.name || 'Student';

      // Build history formatted for classroom
      const fmtMsgs = (forRole) =>
        messages.slice(-16).map((m) => {
          if (m.agent === forRole) return { role: 'assistant', text: m.text };
          const label =
            m.agent === 'teacher' ? agents.teacher.name :
            m.agent === 'classmate1' ? agents.classmate1.name :
            m.agent === 'classmate2' ? agents.classmate2.name :
            name;
          return { role: 'user', text: `[${label}]: ${m.text}` };
        });

      const result = {
        teacherReply: null, teacherAI: null,
        classmate1Reply: null, classmate1AI: null,
        classmate2Reply: null, classmate2AI: null,
      };

      // ── Teacher ──
      const teacherSys = buildClassroomPrompt({
        agentRole: 'teacher',
        grade,
        subject,
        name,
        agents,
        kbContent,
        examPatterns: EP[subject] || null,
        memoryContext,
      });

      try {
        result.teacherReply = await callProviderWithSys(
          provs.teacher, userMsg, teacherSys, fmtMsgs('teacher')
        );
        result.teacherAI = AI_PROVIDERS[provs.teacher]?.name;
        lastAIRef.current = provs.teacher;
        usage[provs.teacher] = (usage[provs.teacher] || 0) + 1;
      } catch (err) {
        console.warn('[Classroom] Teacher failed:', err.message);
        writeUsage(usage);
        return result;
      }

      if (!result.teacherReply) {
        writeUsage(usage);
        return result;
      }

      updateLearningProfile(userMsg, result.teacherReply);
      addXP(12);
      incrementQueryCount();

      // ── Classmate 1 ──
      const cm1Sys = buildClassroomPrompt({
        agentRole: 'classmate1',
        grade,
        subject,
        name,
        agents,
        kbContent: '',
        examPatterns: null,
        memoryContext: '',
      });

      const subjectNames = {
        mathematics: 'Mathematics', science: 'Science', english: 'English',
        'social-science': 'Social Science', hindi: 'Hindi',
      };
      const cm1Prompt = `[${agents.teacher.name}] just explained: "${result.teacherReply.substring(0, 400)}"\n\nReact naturally as a student in ${subjectNames[subject] || subject} class.`;

      try {
        result.classmate1Reply = await callProviderWithSys(
          provs.classmate1, cm1Prompt, cm1Sys, fmtMsgs('classmate1')
        );
        result.classmate1AI = AI_PROVIDERS[provs.classmate1]?.name;
        usage[provs.classmate1] = (usage[provs.classmate1] || 0) + 1;
      } catch (err) {
        console.warn('[Classroom] Classmate1 failed:', err.message);
      }

      // ── Classmate 2 ──
      const cm2Sys = buildClassroomPrompt({
        agentRole: 'classmate2',
        grade,
        subject,
        name,
        agents,
        kbContent: '',
        examPatterns: null,
        memoryContext: '',
      });

      const cm2Prompt = result.classmate1Reply
        ? `[${agents.teacher.name}] explained something, then [${agents.classmate1.name}] said: "${result.classmate1Reply.substring(0, 300)}"\n\nReact in character.`
        : `[${agents.teacher.name}] just explained: "${result.teacherReply.substring(0, 400)}"\n\nReact in character.`;

      try {
        result.classmate2Reply = await callProviderWithSys(
          provs.classmate2, cm2Prompt, cm2Sys, fmtMsgs('classmate2')
        );
        result.classmate2AI = AI_PROVIDERS[provs.classmate2]?.name;
        usage[provs.classmate2] = (usage[provs.classmate2] || 0) + 1;
      } catch (err) {
        console.warn('[Classroom] Classmate2 failed:', err.message);
      }

      writeUsage(usage);
      logEvent('chat', {
        user: user?.name || preferences.name || 'Unknown',
        email: user?.email || 'guest',
        subject,
        mode: 'classroom',
        ai: provs.teacher,
        grade,
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
