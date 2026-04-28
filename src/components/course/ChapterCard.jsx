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
      whileHover={unlocked ? { borderColor: 'var(--border-strong)' } : {}}
      whileTap={unlocked ? { scale: 0.997 } : {}}
      onClick={handleClick}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isDone ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: '14px 16px',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        opacity: unlocked ? 1 : 0.55,
        transition: 'border-color var(--d-micro) var(--ease)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        columnGap: 14,
        alignItems: 'center',
      }}
    >
      {/* Chapter number badge */}
      <div style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 'var(--r-sm)',
        background: isDone ? 'var(--accent)' : 'var(--subtle)',
        border: `1px solid ${isDone ? 'var(--accent)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 13,
        color: isDone ? 'var(--accent-fg)' : 'var(--text)',
      }}>
        {!unlocked ? '🔒' : isDone ? '✓' : String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + progress */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 500, color: unlocked ? 'var(--text)' : 'var(--text-tert)',
          letterSpacing: '-0.005em', marginBottom: 4,
        }}>
          {chapter.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            flex: 1, height: 3, borderRadius: 2,
            background: 'var(--subtle)', overflow: 'hidden',
            minWidth: 60, maxWidth: 200,
          }}>
            <div style={{
              height: '100%',
              background: isDone ? 'var(--success)' : 'var(--accent)',
              width: `${progressPct}%`,
              transition: 'width var(--d-medium) var(--ease)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 11,
            color: 'var(--text-tert)', letterSpacing: '0.02em', whiteSpace: 'nowrap',
          }}>
            {lessonsDone}/{totalLessons}
          </span>
        </div>
      </div>

      {/* Right-side affordance */}
      <div style={{
        fontSize: 14, color: isDone ? 'var(--accent)' : 'var(--text-tert)',
        flexShrink: 0, fontFamily: "'Geist', sans-serif", fontWeight: 500,
      }}>
        {!unlocked ? '' : '›'}
      </div>
    </motion.div>
  );
}
