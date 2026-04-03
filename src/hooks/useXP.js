import { useState, useCallback, useMemo } from 'react';
import { LEVELS } from '../data/levels.js';

const STORAGE_KEY = 'bd2';

/**
 * Read the XP / streak / queryCount fields from localStorage('bd2').
 * Returns { xp, str, qc }.
 */
function readXPData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      xp: stored.xp || 0,
      str: stored.str || 0,
      qc: stored.qc || 0,
    };
  } catch {
    return { xp: 0, str: 0, qc: 0 };
  }
}

/**
 * Write XP fields back to localStorage('bd2'), preserving other keys.
 */
function writeXPData(data) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const merged = { ...existing, xp: data.xp, str: data.str, qc: data.qc };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* best-effort */
  }
}

/**
 * useXP — Manages XP, streak, and query count.
 *
 * Reads from and writes to localStorage('bd2') directly, exactly like
 * the legacy gXP / uXP / saveZ flow.
 */
export function useXP() {
  const [xpData, setXpData] = useState(readXPData);

  /** Add XP and increment streak. */
  const addXP = useCallback((amount) => {
    setXpData((prev) => {
      const next = {
        xp: prev.xp + amount,
        str: prev.str + 1,
        qc: prev.qc,
      };
      writeXPData(next);
      return next;
    });
  }, []);

  /** Increment query count (called after each AI response). */
  const incrementQueryCount = useCallback(() => {
    setXpData((prev) => {
      const next = { ...prev, qc: prev.qc + 1 };
      writeXPData(next);
      return next;
    });
  }, []);

  /** Current level object: { x, n, l } */
  const level = useMemo(() => {
    let current = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xpData.xp >= LEVELS[i].x) {
        current = LEVELS[i];
        break;
      }
    }
    return current;
  }, [xpData.xp]);

  /** Next level threshold (for progress bar). */
  const nextLevel = useMemo(() => {
    const idx = LEVELS.findIndex((l) => l === level);
    return LEVELS[idx + 1] || { x: level.x + 500, n: 'Max', l: level.l + 1 };
  }, [level]);

  /** Progress percentage toward the next level (0-100). */
  const xpBarPercent = useMemo(() => {
    const range = nextLevel.x - level.x;
    if (range <= 0) return 100;
    return Math.min(((xpData.xp - level.x) / range) * 100, 100);
  }, [xpData.xp, level, nextLevel]);

  return {
    xp: xpData.xp,
    streak: xpData.str,
    queryCount: xpData.qc,
    level,
    nextLevel,
    xpBarPercent,
    addXP,
    incrementQueryCount,
  };
}
