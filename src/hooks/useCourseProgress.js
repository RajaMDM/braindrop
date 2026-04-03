import { useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useMemory } from './useMemory.js';
import { useXP } from './useXP.js';
import { COURSES } from '../data/courses.js';

/**
 * useCourseProgress — Course progression, unlock logic, lesson completion.
 *
 * CRITICAL: read-only functions (getCourseProgress, isChapterUnlocked) must
 * read from the `memory` state object, NOT call loadMemory() which triggers
 * a setState and causes infinite re-renders.
 *
 * Only write functions (completeLesson) may call loadMemory() + saveMemory().
 */
export function useCourseProgress() {
  const { grade, subject, activeChapter, setActiveChapter } = useApp();
  const { memory, loadMemory, saveMemory } = useMemory();
  const { addXP } = useXP();

  const getCourse = useCallback(() => {
    return COURSES[grade]?.[subject] || null;
  }, [grade, subject]);

  /** Read-only: uses memory state, no setState call. */
  const getCourseProgress = useCallback(() => {
    const course = getCourse();
    if (!course) return null;

    const cp = memory.profile?.courseProgress || {};
    let totalLessons = 0, completedLessons = 0, chaptersComplete = 0;

    course.chapters.forEach((ch) => {
      totalLessons += ch.lessons.length;
      const prog = cp[ch.id];
      const done = prog?.completed?.length || 0;
      completedLessons += done;
      if (done >= ch.lessons.length) chaptersComplete++;
    });

    return {
      totalLessons, completedLessons,
      pct: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
      chaptersComplete, totalChapters: course.chapters.length,
    };
  }, [getCourse, memory]);

  /** Read-only: uses memory state, no setState call. */
  const isChapterUnlocked = useCallback((chapterIndex) => {
    if (chapterIndex < 2) return true;
    const course = getCourse();
    if (!course) return false;

    const cp = memory.profile?.courseProgress || {};
    const prevCh = course.chapters[chapterIndex - 1];
    const prevProg = cp[prevCh.id];
    return prevProg && prevProg.completed && prevProg.completed.length >= prevCh.lessons.length;
  }, [getCourse, memory]);

  /** Write: calls loadMemory + saveMemory (only triggered by user action, not render). */
  const completeLesson = useCallback((chId, lessonName) => {
    const mem = loadMemory();
    if (!mem.profile.courseProgress) mem.profile.courseProgress = {};
    if (!mem.profile.courseProgress[chId]) {
      mem.profile.courseProgress[chId] = { completed: [], started: new Date().toISOString().split('T')[0], done: false };
    }

    const cp = mem.profile.courseProgress[chId];
    if (!cp.completed.includes(lessonName)) { cp.completed.push(lessonName); addXP(20); }

    const course = getCourse();
    let showCert = null;
    if (course) {
      const ch = course.chapters.find((c) => c.id === chId);
      if (ch && cp.completed.length >= ch.lessons.length && !cp.done) {
        cp.done = true;
        addXP(50);
        // Check full subject completion
        const allCp = mem.profile.courseProgress;
        const allDone = course.chapters.every(c => allCp[c.id]?.done);
        if (allDone) { addXP(100); showCert = subject; }
      }
    }
    saveMemory(mem);
    return showCert;
  }, [loadMemory, saveMemory, getCourse, addXP, subject]);

  const selectLesson = useCallback((chId, lessonIdx) => {
    const course = getCourse();
    if (!course) return null;
    const ch = course.chapters.find((c) => c.id === chId);
    if (!ch) return null;
    const lesson = ch.lessons[lessonIdx];
    if (!lesson) return null;
    return { chId, lesson };
  }, [getCourse]);

  const selectChapter = useCallback((chId) => {
    setActiveChapter(activeChapter === chId ? null : chId);
  }, [activeChapter, setActiveChapter]);

  return { getCourse, getCourseProgress, isChapterUnlocked, completeLesson, selectLesson, selectChapter };
}
