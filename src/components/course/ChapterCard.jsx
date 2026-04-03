import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useCourseProgress } from '../../hooks/useCourseProgress.js';
import { useMemory } from '../../hooks/useMemory.js';
import LessonItem from './LessonItem.jsx';

export default function ChapterCard({ chapter, index, unlocked }) {
  const { activeChapter } = useApp();
  const { selectChapter, completeLesson, selectLesson, getCourse } = useCourseProgress();
  const { showCertificate } = useApp();
  const { loadMemory } = useMemory();

  const isActive = activeChapter === chapter.id;

  // Get progress for this chapter
  const mem = loadMemory();
  const cp = mem.profile?.courseProgress?.[chapter.id];
  const completedLessons = cp?.completed || [];
  const isDone = cp?.done || false;
  const lessonsDone = completedLessons.length;
  const totalLessons = chapter.lessons.length;
  const progressPct = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0;

  const handleClick = () => {
    if (!unlocked) return;
    selectChapter(chapter.id);
  };

  const handleLessonClick = (lessonIdx) => {
    const lesson = selectLesson(chapter.id, lessonIdx);
    if (!lesson) return;
    // Complete the lesson and check for certificate
    const certSubject = completeLesson(chapter.id, lesson.lesson);
    if (certSubject) {
      showCertificate(certSubject);
    }
  };

  let borderColor = 'var(--bd)';
  let bg = 'var(--bg3)';
  if (isDone) borderColor = 'rgba(57,255,20,.2)';
  else if (isActive) { borderColor = 'var(--np)'; bg = 'rgba(180,74,255,.06)'; }

  return (
    <motion.div layout style={{ borderRadius: 10, overflow: 'hidden' }}>
      <div
        onClick={handleClick}
        style={{
          background: bg,
          border: `1px solid ${borderColor}`,
          borderRadius: isActive ? '10px 10px 0 0' : 10,
          padding: '12px 14px',
          cursor: unlocked ? 'pointer' : 'not-allowed',
          opacity: unlocked ? 1 : 0.45,
          transition: 'all .2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Chapter number */}
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: isDone ? 'rgba(57,255,20,.1)' : 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.72rem', fontWeight: 700,
            fontFamily: "'Space Mono',monospace",
            color: isDone ? 'var(--ng)' : 'var(--t3)',
            flexShrink: 0,
            border: `1px solid ${isDone ? 'rgba(57,255,20,.2)' : 'var(--bd)'}`,
          }}>
            {index + 1}
          </div>

          {/* Chapter info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '.85rem', fontWeight: 600,
              color: unlocked ? 'var(--t1)' : 'var(--t3)',
            }}>
              {chapter.title}
            </div>
            <div style={{
              fontSize: '.65rem', color: 'var(--t3)', marginTop: 2,
              fontFamily: "'Space Mono',monospace",
            }}>
              {lessonsDone}/{totalLessons} lessons
            </div>
            {/* Mini progress bar */}
            <div style={{
              height: 4, borderRadius: 2, background: 'var(--bg)',
              marginTop: 6, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: isDone ? 'var(--ng)' : 'var(--np)',
                width: `${progressPct}%`, transition: 'width .4s',
              }} />
            </div>
          </div>

          {/* Icon */}
          <div style={{ fontSize: '.9rem', color: 'var(--t3)', flexShrink: 0 }}>
            {!unlocked ? '\uD83D\uDD12' : isDone ? '\u2705' : isActive ? '\u25BC' : '\u25B6'}
          </div>
        </div>
      </div>

      {/* Expanded lesson list */}
      <AnimatePresence>
        {isActive && unlocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '8px 0 4px 38px',
              display: 'flex', flexDirection: 'column', gap: 4,
              background: bg,
              borderLeft: `1px solid ${borderColor}`,
              borderRight: `1px solid ${borderColor}`,
              borderBottom: `1px solid ${borderColor}`,
              borderRadius: '0 0 10px 10px',
            }}>
              {chapter.lessons.map((lesson, lessonIdx) => (
                <LessonItem
                  key={lessonIdx}
                  name={lesson}
                  done={completedLessons.includes(lesson)}
                  onClick={() => handleLessonClick(lessonIdx)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
