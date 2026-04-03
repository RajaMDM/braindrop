import { useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useMemory } from './useMemory.js';
import { useXP } from './useXP.js';
import { COURSES } from '../data/courses.js';

/**
 * useCourseProgress — Course progression, unlock logic, lesson completion.
 *
 * Mirrors legacy getCourseProgress / isChapterUnlocked / completeLesson /
 * selectLesson / selectChapter.
 *
 * XP awards:
 *   20 per lesson
 *   50 per chapter completion
 *   100 per subject completion
 */
export function useCourseProgress() {
  const { grade, subject, activeChapter, setActiveChapter } = useApp();
  const { memory, loadMemory, saveMemory } = useMemory();
  const { addXP } = useXP();

  /** Get course data for the current grade/subject (or null). */
  const getCourse = useCallback(() => {
    return COURSES[grade]?.[subject] || null;
  }, [grade, subject]);

  /**
   * getCourseProgress — Returns summary stats:
   * { totalLessons, completedLessons, pct, chaptersComplete, totalChapters }
   */
  const getCourseProgress = useCallback(() => {
    const course = getCourse();
    if (!course) return null;

    const mem = loadMemory();
    const cp = mem.profile.courseProgress || {};

    let totalLessons = 0;
    let completedLessons = 0;
    let chaptersComplete = 0;

    course.chapters.forEach((ch) => {
      totalLessons += ch.lessons.length;
      const prog = cp[ch.id];
      const done = prog?.completed?.length || 0;
      completedLessons += done;
      if (done >= ch.lessons.length) chaptersComplete++;
    });

    return {
      totalLessons,
      completedLessons,
      pct: totalLessons
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
      chaptersComplete,
      totalChapters: course.chapters.length,
    };
  }, [getCourse, loadMemory]);

  /**
   * isChapterUnlocked — First 2 chapters always unlocked.
   * After that, previous chapter must be fully completed.
   */
  const isChapterUnlocked = useCallback(
    (chapterIndex) => {
      if (chapterIndex < 2) return true;
      const course = getCourse();
      if (!course) return false;

      const mem = loadMemory();
      const cp = mem.profile.courseProgress || {};
      const prevCh = course.chapters[chapterIndex - 1];
      const prevProg = cp[prevCh.id];

      return (
        prevProg &&
        prevProg.completed &&
        prevProg.completed.length >= prevCh.lessons.length
      );
    },
    [getCourse, loadMemory]
  );

  /**
   * completeLesson — Mark a lesson as done, award XP, check for chapter/subject
   * completion.  Returns the subject name if a certificate should be shown.
   */
  const completeLesson = useCallback(
    (chId, lessonName) => {
      const mem = loadMemory();
      if (!mem.profile.courseProgress) mem.profile.courseProgress = {};
      if (!mem.profile.courseProgress[chId]) {
        mem.profile.courseProgress[chId] = {
          completed: [],
          started: new Date().toISOString().split('T')[0],
          done: false,
        };
      }

      const cp = mem.profile.courseProgress[chId];

      // Mark lesson
      if (!cp.completed.includes(lessonName)) {
        cp.completed.push(lessonName);
        addXP(20);
      }

      // Check chapter completion
      const course = getCourse();
      let showCert = null;

      if (course) {
        const ch = course.chapters.find((c) => c.id === chId);
        if (ch && cp.completed.length >= ch.lessons.length && !cp.done) {
          cp.done = true;
          addXP(50);

          // Check full subject completion
          const prog = getCourseProgress();
          if (prog && prog.chaptersComplete >= prog.totalChapters) {
            addXP(100);
            showCert = subject;
          }
        }
      }

      saveMemory(mem);
      return showCert;
    },
    [loadMemory, saveMemory, getCourse, getCourseProgress, addXP, subject]
  );

  /**
   * selectLesson — Picks a lesson from a chapter and returns the prompt text
   * for the AI.  The caller should trigger the AI call with this text and
   * then call completeLesson after the reply.
   */
  const selectLesson = useCallback(
    (chId, lessonIdx) => {
      const course = getCourse();
      if (!course) return null;
      const ch = course.chapters.find((c) => c.id === chId);
      if (!ch) return null;
      const lesson = ch.lessons[lessonIdx];
      if (!lesson) return null;
      return { chId, lesson };
    },
    [getCourse]
  );

  /**
   * selectChapter — Toggle active chapter in sidebar.
   */
  const selectChapter = useCallback(
    (chId) => {
      // Toggle: if clicking the already-active chapter, close it
      setActiveChapter(activeChapter === chId ? null : chId);
    },
    [activeChapter, setActiveChapter]
  );

  return {
    getCourse,
    getCourseProgress,
    isChapterUnlocked,
    completeLesson,
    selectLesson,
    selectChapter,
  };
}
