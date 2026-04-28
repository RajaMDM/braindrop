import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useCourseProgress } from '../../hooks/useCourseProgress.js';
import { COURSES } from '../../data/courses.js';
import ChapterCard from './ChapterCard.jsx';
import ChapterDetailView from './ChapterDetailView.jsx';

export default function CourseView() {
  const { grade, subject, activeChapter } = useApp();
  const { getCourseProgress, isChapterUnlocked } = useCourseProgress();

  const courseData = COURSES[grade]?.[subject];
  if (!courseData) return null;

  const progress = getCourseProgress();
  const pct = progress?.pct || 0;

  // If a chapter is selected, render the detail view (F design)
  if (activeChapter) {
    const chapterIndex = courseData.chapters.findIndex((c) => c.id === activeChapter);
    const chapter = courseData.chapters[chapterIndex];
    if (chapter) {
      return (
        <div className="theme-paper" style={{ minHeight: '100%', width: '100%' }}>
          <ChapterDetailView
            chapter={chapter}
            chapterIndex={chapterIndex}
            unlocked={isChapterUnlocked(chapterIndex)}
          />
        </div>
      );
    }
  }

  // Default: course overview (chapter list, F-themed)
  return (
    <div className="theme-paper" style={{ minHeight: '100%', width: '100%' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px', textAlign: 'left' }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <div className="font-hand" style={{
            fontSize: 24, color: 'var(--p-blue)', lineHeight: 1, marginBottom: 2,
            transform: 'rotate(-.5deg)', display: 'inline-block',
          }}>{courseData.name.toLowerCase()} · grade {grade}</div>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap', marginTop: 4,
          }}>
            <h1 style={{
              fontFamily: 'Inter,sans-serif', fontWeight: 700,
              fontSize: 'clamp(28px, 5vw, 40px)', letterSpacing: '-0.02em',
              color: 'var(--p-ink)', margin: 0, lineHeight: 1.05,
            }}>{courseData.name} Course</h1>
            <div className="font-mono-p" style={{
              fontSize: 14, fontWeight: 700, color: pct >= 100 ? 'var(--p-green)' : 'var(--p-blue)',
            }}>{pct}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 8, borderRadius: 4, background: 'var(--p-paper2)',
          marginBottom: 22, overflow: 'hidden', border: '1px solid var(--p-line)',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: pct >= 100 ? 'var(--p-green)' : 'var(--p-blue)',
            }}
          />
        </div>

        {/* Section header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          margin: '4px 0 10px',
        }}>
          <h3 className="font-hand" style={{
            margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--p-ink)',
            lineHeight: 1, transform: 'rotate(-.3deg)', display: 'inline-block',
          }}>Chapters</h3>
          <div className="font-mono-p" style={{
            fontSize: 12, color: 'var(--p-pencil)', letterSpacing: '0.04em',
          }}>{String(progress?.chaptersComplete || 0).padStart(2, '0')} / {String(progress?.totalChapters || 0).padStart(2, '0')} done</div>
        </div>

        {/* Chapter list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {courseData.chapters.map((ch, idx) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <ChapterCard
                chapter={ch}
                index={idx}
                unlocked={isChapterUnlocked(idx)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
