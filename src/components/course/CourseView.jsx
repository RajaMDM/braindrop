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

  // If a chapter is selected, render the detail view
  if (activeChapter) {
    const chapterIndex = courseData.chapters.findIndex((c) => c.id === activeChapter);
    const chapter = courseData.chapters[chapterIndex];
    if (chapter) {
      return (
        <div style={{ minHeight: '100%', width: '100%', background: 'var(--bg)' }}>
          <ChapterDetailView
            chapter={chapter}
            chapterIndex={chapterIndex}
            unlocked={isChapterUnlocked(chapterIndex)}
          />
        </div>
      );
    }
  }

  // Default: course overview (chapter list)
  return (
    <div style={{ minHeight: '100%', width: '100%', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px', textAlign: 'left' }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--accent)', fontWeight: 500, marginBottom: 16,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 18, height: 1.5, background: 'var(--accent)' }} />
            {courseData.name.toLowerCase()} · grade {grade}
          </div>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap', marginTop: 4,
          }}>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 400,
              fontSize: 'clamp(28px, 5vw, 42px)', letterSpacing: '-0.025em',
              color: 'var(--text)', margin: 0, lineHeight: 1.05,
              fontVariationSettings: "'opsz' 36",
            }}>{courseData.name} Course</h1>
            <div style={{
              fontFamily: "'Geist Mono', monospace", fontSize: 13,
              fontWeight: 600, color: pct >= 100 ? 'var(--success)' : 'var(--accent)',
              fontFeatureSettings: '"tnum"',
            }}>{pct}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6, borderRadius: 3, background: 'var(--subtle)',
          marginBottom: 22, overflow: 'hidden', border: '1px solid var(--border)',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: pct >= 100 ? 'var(--success)' : 'var(--accent)',
            }}
          />
        </div>

        {/* Section header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          margin: '4px 0 10px',
        }}>
          <h3 style={{
            margin: 0, fontFamily: "'Fraunces', serif", fontWeight: 400,
            fontStyle: 'italic', fontSize: 22, color: 'var(--text)',
            lineHeight: 1, letterSpacing: '-0.01em',
            fontVariationSettings: "'opsz' 24",
          }}>Chapters</h3>
          <div style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 11,
            color: 'var(--text-tert)', letterSpacing: '0.04em',
          }}>{String(progress?.chaptersComplete || 0).padStart(2, '0')} / {String(progress?.totalChapters || 0).padStart(2, '0')} done</div>
        </div>

        {/* Chapter list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {courseData.chapters.map((ch, idx) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.025 }}
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
