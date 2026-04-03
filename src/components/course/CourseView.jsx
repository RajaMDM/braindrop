import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useCourseProgress } from '../../hooks/useCourseProgress.js';
import { COURSES } from '../../data/courses.js';
import ChapterCard from './ChapterCard.jsx';

export default function CourseView() {
  const { grade, subject } = useApp();
  const { getCourseProgress, isChapterUnlocked } = useCourseProgress();

  const courseData = COURSES[grade]?.[subject];
  if (!courseData) return null;

  const progress = getCourseProgress();
  const pct = progress?.pct || 0;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', width: '100%', textAlign: 'left' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--t1)' }}>
          {courseData.name} Course
        </div>
        <div style={{
          fontFamily: "'Space Mono',monospace", fontSize: '.8rem', fontWeight: 700,
          color: pct >= 100 ? 'var(--ng)' : 'var(--np)',
        }}>
          {pct}%
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 6, borderRadius: 3, background: 'var(--bg3)',
        marginBottom: 16, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 3, background: 'var(--xp)' }}
        />
      </div>

      {/* Chapter list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {courseData.chapters.map((ch, idx) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
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
  );
}
