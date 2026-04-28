import { motion } from 'framer-motion';
import { useCourseProgress } from '../../hooks/useCourseProgress.js';
import { useMemory } from '../../hooks/useMemory.js';

export default function ChapterCard({ chapter, index, unlocked }) {
  const { selectChapter } = useCourseProgress();
  const { memory } = useMemory();

  const cp = memory.profile?.courseProgress?.[chapter.id];
  const completedLessons = cp?.completed || [];
  const isDone = cp?.done || false;
  const lessonsDone = completedLessons.length;
  const totalLessons = chapter.lessons.length;
  const progressPct = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0;

  const handleClick = () => {
    if (!unlocked) return;
    selectChapter(chapter.id);
  };

  return (
    <motion.div
      whileHover={unlocked ? { y: -1 } : {}}
      whileTap={unlocked ? { scale: 0.995 } : {}}
      onClick={handleClick}
      style={{
        background: 'var(--p-card)',
        border: `1px solid ${isDone ? 'var(--p-green)' : 'var(--p-line)'}`,
        borderRadius: 12,
        padding: '14px 16px',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        opacity: unlocked ? 1 : 0.55,
        transition: 'border-color .2s, transform .15s',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        columnGap: 14,
        alignItems: 'center',
      }}
    >
      {/* Chapter number badge */}
      <div style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 10,
        background: isDone ? 'var(--p-green)' : 'var(--p-paper2)',
        border: `1.5px solid ${isDone ? 'var(--p-green)' : 'var(--p-line2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 14,
        color: isDone ? '#fff' : 'var(--p-ink)',
      }}>
        {!unlocked ? '🔒' : isDone ? '✓' : String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + progress */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: unlocked ? 'var(--p-ink)' : 'var(--p-pencil)',
          letterSpacing: '-0.005em', marginBottom: 4,
        }}>
          {chapter.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            flex: 1, height: 4, borderRadius: 2,
            background: 'var(--p-paper2)', overflow: 'hidden', minWidth: 60, maxWidth: 200,
          }}>
            <div style={{
              height: '100%',
              background: isDone ? 'var(--p-green)' : 'var(--p-blue)',
              width: `${progressPct}%`,
              transition: 'width .4s',
            }} />
          </div>
          <span className="font-mono-p" style={{
            fontSize: 11, color: 'var(--p-pencil)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
          }}>
            {lessonsDone}/{totalLessons}
          </span>
        </div>
      </div>

      {/* Right-side affordance */}
      <div style={{
        fontSize: 16, color: isDone ? 'var(--p-green)' : 'var(--p-pencil)',
        flexShrink: 0, fontFamily: 'Inter,sans-serif', fontWeight: 500,
      }}>
        {!unlocked ? '' : '›'}
      </div>
    </motion.div>
  );
}
