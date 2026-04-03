import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { T } from '../data/topics.js';

/**
 * useMemory — Per-subject chat memory stored in localStorage.
 *
 * Key format: bd_mem_{grade}_{subject}
 *
 * State shape:
 * {
 *   history: [{ role, text, ts }],
 *   profile: {
 *     topicsCovered: [],
 *     weakAreas: [],
 *     quizScores: [],
 *     quizResults: [],
 *     courseProgress: {},
 *     lastStudied: ''
 *   }
 * }
 */

const EMPTY_MEMORY = {
  history: [],
  profile: {
    topicsCovered: [],
    weakAreas: [],
    quizScores: [],
    quizResults: [],
    courseProgress: {},
    lastStudied: '',
  },
};

function getMemoryKey(grade, subject) {
  return `bd_mem_${grade}_${subject}`;
}

export function useMemory() {
  const { grade, subject } = useApp();
  const [memory, setMemory] = useState(EMPTY_MEMORY);

  /** Load memory for the current grade/subject from localStorage. */
  const loadMemory = useCallback(() => {
    const key = getMemoryKey(grade, subject);
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Backfill fields added after initial release
        if (!parsed.profile) parsed.profile = { ...EMPTY_MEMORY.profile };
        if (!parsed.profile.quizResults) parsed.profile.quizResults = [];
        if (!parsed.profile.courseProgress) parsed.profile.courseProgress = {};
        setMemory(parsed);
        return parsed;
      }
    } catch {
      /* corrupted — start fresh */
    }
    setMemory({ ...EMPTY_MEMORY, profile: { ...EMPTY_MEMORY.profile } });
    return { ...EMPTY_MEMORY, profile: { ...EMPTY_MEMORY.profile } };
  }, [grade, subject]);

  /** Save the given memory object (with size caps matching legacy). */
  const saveMemory = useCallback(
    (mem) => {
      const key = getMemoryKey(grade, subject);
      try {
        // Size caps from legacy saveMemory()
        if (mem.history.length > 60) mem.history = mem.history.slice(-60);
        if (mem.profile.topicsCovered.length > 50)
          mem.profile.topicsCovered = mem.profile.topicsCovered.slice(-50);
        if (mem.profile.quizScores.length > 30)
          mem.profile.quizScores = mem.profile.quizScores.slice(-30);
        if (mem.profile.weakAreas.length > 20)
          mem.profile.weakAreas = mem.profile.weakAreas.slice(-20);
        if (mem.profile.quizResults && mem.profile.quizResults.length > 30)
          mem.profile.quizResults = mem.profile.quizResults.slice(-30);
        localStorage.setItem(key, JSON.stringify(mem));
        setMemory({ ...mem });
      } catch {
        /* best-effort */
      }
    },
    [grade, subject]
  );

  /**
   * updateLearningProfile — Called after each AI exchange.
   * Adds messages to history, detects topics covered and weak areas,
   * records quiz scores.
   */
  const updateLearningProfile = useCallback(
    (userMsg, aiReply) => {
      const mem = loadMemory();
      const ts = new Date().toISOString();

      mem.history.push({ role: 'user', text: userMsg, ts });
      mem.history.push({ role: 'assistant', text: aiReply, ts });

      // Topic detection
      const topics = (T[grade] && T[grade][subject]) || [];
      for (const topic of topics) {
        const prefix = topic.toLowerCase().slice(0, 10);
        if (
          userMsg.toLowerCase().includes(prefix) ||
          aiReply.toLowerCase().includes(prefix)
        ) {
          if (!mem.profile.topicsCovered.includes(topic)) {
            mem.profile.topicsCovered.push(topic);
          }
        }
      }

      // Quiz score extraction
      const correctMatch = aiReply.match(
        /correct|right|well done|great job|perfect/gi
      );
      const wrongMatch = aiReply.match(
        /incorrect|wrong|not quite|try again|almost/gi
      );
      // Only record if we're in quiz-ish context and there is signal
      if (correctMatch || wrongMatch) {
        mem.profile.quizScores.push({
          date: ts.split('T')[0],
          correct: correctMatch ? correctMatch.length : 0,
          wrong: wrongMatch ? wrongMatch.length : 0,
        });
      }

      // Weak area detection
      const weakPatterns = aiReply.match(
        /(?:you (?:need to|should|might want to) (?:work on|practice|review|revisit)|(?:weak|struggle|difficulty) (?:in|with))\s+([^.!?\n]+)/gi
      );
      if (weakPatterns) {
        for (const p of weakPatterns) {
          const area = p
            .replace(
              /^.*?(work on|practice|review|revisit|with|in)\s+/i,
              ''
            )
            .trim();
          if (
            area.length > 3 &&
            area.length < 60 &&
            !mem.profile.weakAreas.includes(area)
          ) {
            mem.profile.weakAreas.push(area);
          }
        }
      }

      mem.profile.lastStudied = new Date().toLocaleDateString('en-IN');
      saveMemory(mem);
      return mem;
    },
    [grade, subject, loadMemory, saveMemory]
  );

  /**
   * getMemoryContext — Returns a formatted string for the system prompt,
   * exactly matching legacy getMemoryContext().
   */
  const getMemoryContext = useCallback(() => {
    const mem = loadMemory();
    if (
      mem.history.length === 0 &&
      mem.profile.topicsCovered.length === 0
    ) {
      return '';
    }

    let ctx =
      '\n\nSTUDENT LEARNING MEMORY (from past sessions \u2014 use to personalize):';

    if (mem.profile.topicsCovered.length > 0) {
      ctx += `\nTopics already covered: ${mem.profile.topicsCovered.join(', ')}`;
    }
    if (mem.profile.weakAreas.length > 0) {
      ctx += `\nAreas needing practice: ${mem.profile.weakAreas.join(', ')}`;
    }
    if (mem.profile.quizScores.length > 0) {
      const recent = mem.profile.quizScores.slice(-5);
      ctx += `\nRecent quizzes: ${recent.reduce((s, q) => s + q.correct, 0)} correct, ${recent.reduce((s, q) => s + q.wrong, 0)} incorrect`;
    }
    if (mem.profile.lastStudied) {
      ctx += `\nLast studied: ${mem.profile.lastStudied}`;
    }
    if (mem.history.length > 0) {
      ctx += '\n\nRecent conversation:';
      const recent = mem.history.slice(-12);
      for (const m of recent) {
        const label = m.role === 'user' ? 'Student' : 'You';
        const text =
          m.text.length > 200 ? m.text.substring(0, 200) + '...' : m.text;
        ctx += `\n${label}: ${text}`;
      }
    }
    ctx +=
      '\n\nUse this memory: reference past topics, build on learning, address weak areas, acknowledge progress.';

    return ctx;
  }, [loadMemory]);

  /** Clear memory for the current grade/subject (preserves XP). */
  const clearMemory = useCallback(() => {
    const key = getMemoryKey(grade, subject);
    localStorage.removeItem(key);
    setMemory({ ...EMPTY_MEMORY, profile: { ...EMPTY_MEMORY.profile } });
  }, [grade, subject]);

  // Auto-load when grade or subject changes
  useEffect(() => {
    loadMemory();
  }, [loadMemory]);

  return {
    memory,
    loadMemory,
    saveMemory,
    updateLearningProfile,
    getMemoryContext,
    clearMemory,
  };
}
