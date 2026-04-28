import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useCourseProgress } from '../../hooks/useCourseProgress.js';
import { useMemory } from '../../hooks/useMemory.js';

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

function highlightLastWord(title) {
  const parts = title.trim().split(/\s+/);
  if (parts.length === 1) return { lead: '', last: parts[0] };
  return { lead: parts.slice(0, -1).join(' '), last: parts.at(-1) };
}

function chapterKickerWord(index) {
  const words = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen'];
  return words[index] || `${index + 1}`;
}

export default function ChapterDetailView({ chapter, chapterIndex, unlocked }) {
  const { grade, subject, setActiveChapter, triggerCertificate } = useApp();
  const { getCourse, completeLesson, selectLesson } = useCourseProgress();
  const { memory } = useMemory();

  const course = getCourse();
  const cp = memory.profile?.courseProgress?.[chapter.id];
  const completedLessons = cp?.completed || [];
  const isDone = cp?.done || false;
  const lessonsDone = completedLessons.length;
  const totalLessons = chapter.lessons.length;
  const masteryPct = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0;
  const xpEarned = lessonsDone * 20 + (isDone ? 50 : 0);

  const nextUpIdx = chapter.lessons.findIndex((l) => !completedLessons.includes(l));
  const nextUp = nextUpIdx >= 0 ? chapter.lessons[nextUpIdx] : null;

  const status = !unlocked ? 'Locked' : isDone ? 'Done' : lessonsDone === 0 ? 'New' : 'In progress';
  const statusColor = !unlocked ? 'var(--text-tert)' : isDone ? 'var(--success)' : 'var(--accent)';

  const { lead, last } = highlightLastWord(chapter.title);
  const dashOffset = RING_C * (1 - masteryPct / 100);

  const handleBack = () => setActiveChapter(null);

  const handleLessonClick = (lessonIdx) => {
    const sel = selectLesson(chapter.id, lessonIdx);
    if (!sel) return;
    const cert = completeLesson(chapter.id, sel.lesson);
    if (cert) triggerCertificate(cert);
  };

  const handleResume = () => {
    if (nextUpIdx >= 0) handleLessonClick(nextUpIdx);
  };

  return (
    <div style={{
      maxWidth: 880, margin: '0 auto', padding: '24px 18px 60px', textAlign: 'left',
    }}>
      {/* Top bar: back + crumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 13, color: 'var(--text-muted)', marginBottom: 14, flexWrap: 'wrap',
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)',
            padding: '6px 12px', borderRadius: 'var(--r-sm)', fontSize: 12, cursor: 'pointer',
            fontFamily: "'Geist', sans-serif", fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >← All chapters</button>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{course?.name || subject}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>Grade {grade}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>Chapter {chapterIndex + 1}</span>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontFamily: "'Geist Mono', monospace", fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--accent)', fontWeight: 500, marginBottom: 16,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 18, height: 1.5, background: 'var(--accent)' }} />
          chapter {chapterKickerWord(chapterIndex)}
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 400, lineHeight: 1.05,
          letterSpacing: '-0.025em', color: 'var(--text)', margin: '4px 0 0',
          fontSize: 'clamp(32px, 6vw, 50px)',
          fontVariationSettings: "'opsz' 48",
        }}>
          {lead && <span>{lead} </span>}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {last}
            <span aria-hidden style={{
              position: 'absolute', left: 0, right: 0, bottom: 4,
              height: 1.5, background: 'var(--accent)',
            }} />
          </span>
        </h1>
      </div>

      {!unlocked && (
        <div style={{
          margin: '18px 0 24px', padding: '14px 18px',
          background: 'var(--subtle)', border: '1px dashed var(--border-strong)',
          borderRadius: 'var(--r-md)', color: 'var(--text-muted)', fontSize: 14,
        }}>
          Locked — finish chapter {chapterIndex} first to unlock this one.
        </div>
      )}

      <p style={{
        color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.55,
        margin: '14px 0 22px', maxWidth: '54ch',
      }}>
        {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'} in this chapter
        {lessonsDone > 0 && lessonsDone < totalLessons && ` · ${lessonsDone} done`}
        {isDone && ' · complete'}
      </p>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '0 0 22px',
      }} className="stats-row-qc">
        <Stat label="Mastery" value={masteryPct} suffix="%" />
        <Stat label="Lessons" value={lessonsDone} suffix={`/ ${totalLessons}`} />
        <Stat label="Status" customValue={
          <span style={{ color: statusColor }}>{status}</span>
        } />
        <Stat label="XP earned" value={xpEarned} suffix="xp" />
      </div>

      {/* Progress card with ring */}
      {unlocked && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 18,
          marginBottom: 18, flexWrap: 'wrap',
          boxShadow: 'var(--shadow-subtle)',
        }} className="progress-card-qc">
          <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
            <svg width="84" height="84" viewBox="0 0 84 84" style={{ display: 'block' }}>
              <circle cx="42" cy="42" r={RING_R} stroke="var(--subtle)" strokeWidth="8" fill="none" />
              <motion.circle
                cx="42" cy="42" r={RING_R}
                stroke={isDone ? 'var(--success)' : 'var(--accent)'}
                strokeWidth="8" fill="none"
                strokeDasharray={RING_C}
                initial={{ strokeDashoffset: RING_C }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)',
            }}>{masteryPct}%</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              fontFamily: "'Geist Mono', monospace", fontSize: 11,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--text-tert)', fontWeight: 500, marginBottom: 4,
            }}>
              {nextUp ? 'Next up' : isDone ? 'Complete' : 'Begin'}
            </div>
            <h2 style={{
              margin: '0 0 4px', fontSize: 20, fontWeight: 600,
              letterSpacing: '-0.015em', color: 'var(--text)',
              fontFamily: "'Geist', sans-serif",
            }}>
              {nextUp || (isDone ? 'All lessons complete' : 'Pick a lesson to start')}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>
              {isDone ? 'Chapter badge earned · review anytime'
                : nextUp ? `${nextUpIdx + 1} of ${totalLessons} · tap Resume to mark complete`
                : 'Click any lesson below'}
            </p>
          </div>
          <button
            onClick={handleResume}
            disabled={!nextUp}
            style={{
              fontFamily: "'Geist', sans-serif", fontWeight: 500, fontSize: 14,
              background: nextUp ? 'var(--accent)' : 'var(--subtle)',
              color: nextUp ? 'var(--accent-fg)' : 'var(--text-tert)',
              border: 0, padding: '12px 20px', borderRadius: 'var(--r-md)',
              cursor: nextUp ? 'pointer' : 'not-allowed',
              letterSpacing: '0.01em', flexShrink: 0,
              boxShadow: nextUp ? 'var(--shadow-subtle)' : 'none',
              opacity: nextUp ? 1 : 0.6,
              transition: 'background var(--d-micro) var(--ease)',
            }}
          >{isDone ? 'Done' : 'Resume →'}</button>
        </div>
      )}

      {/* Lessons header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        margin: '14px 0 10px',
      }}>
        <h3 style={{
          margin: 0, fontFamily: "'Fraunces', serif", fontWeight: 400,
          fontStyle: 'italic', fontSize: 22, color: 'var(--text)',
          lineHeight: 1, letterSpacing: '-0.01em',
          fontVariationSettings: "'opsz' 24",
        }}>Lessons</h3>
        <div style={{
          fontFamily: "'Geist Mono', monospace", fontSize: 11,
          color: 'var(--text-tert)', letterSpacing: '0.04em',
        }}>{String(totalLessons).padStart(2, '0')} · {String(lessonsDone).padStart(2, '0')} done</div>
      </div>

      {/* Lesson list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {chapter.lessons.map((lesson, idx) => {
          const lessonDone = completedLessons.includes(lesson);
          const isNext = unlocked && !lessonDone && idx === nextUpIdx;
          return (
            <LessonRow
              key={lesson}
              index={idx}
              name={lesson}
              done={lessonDone}
              isNext={isNext}
              unlocked={unlocked}
              onClick={() => unlocked && handleLessonClick(idx)}
            />
          );
        })}
      </div>

      {/* Footer — quiet, factual */}
      {unlocked && !isDone && totalLessons - lessonsDone > 0 && (
        <p style={{
          marginTop: 22,
          fontFamily: "'Geist Mono', monospace", fontSize: 12,
          color: 'var(--text-tert)', textAlign: 'center', letterSpacing: '0.06em',
        }}>
          {totalLessons - lessonsDone} lesson{totalLessons - lessonsDone === 1 ? '' : 's'} remaining
        </p>
      )}
      {isDone && (
        <p style={{
          marginTop: 22,
          fontFamily: "'Fraunces', serif", fontStyle: 'italic',
          fontSize: 18, color: 'var(--success)', textAlign: 'center',
          fontVariationSettings: "'opsz' 18",
        }}>
          Chapter complete.
        </p>
      )}

      <style>{`
        @media (max-width: 680px) {
          .stats-row-qc { grid-template-columns: repeat(2, 1fr) !important; }
          .progress-card-qc { flex-direction: column !important; align-items: flex-start !important; }
          .progress-card-qc > button { width: 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, suffix, customValue }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)', padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace", fontSize: 10,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--text-tert)', marginBottom: 4, fontWeight: 500,
      }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
        color: 'var(--text)', fontFeatureSettings: '"tnum"',
        fontFamily: "'Geist', sans-serif",
      }}>
        {customValue !== undefined ? customValue : (
          <>
            {value}
            {suffix && (
              <small style={{
                fontFamily: "'Geist Mono', monospace", fontSize: 11,
                color: 'var(--text-tert)', marginLeft: 3,
                fontWeight: 500, letterSpacing: '0.02em',
              }}> {suffix}</small>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function LessonRow({ index, name, done, isNext, unlocked, onClick }) {
  return (
    <motion.div
      whileHover={unlocked && !done ? { borderColor: 'var(--border-strong)' } : {}}
      whileTap={unlocked && !done ? { scale: 0.997 } : {}}
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        columnGap: 14,
        alignItems: 'center',
        background: 'var(--surface)',
        border: `1px solid ${isNext ? 'var(--accent)' : 'var(--border)'}`,
        borderLeftWidth: isNext ? 3 : 1,
        borderRadius: 'var(--r-md)',
        padding: isNext ? '14px 16px 14px 14px' : '14px 16px',
        cursor: unlocked && !done ? 'pointer' : (done ? 'default' : 'not-allowed'),
        opacity: unlocked ? 1 : 0.5,
        transition: 'border-color var(--d-micro) var(--ease)',
      }}
    >
      {/* Check / index */}
      <div style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: 'var(--r-sm)',
        border: `1.5px solid ${done ? 'var(--accent)' : isNext ? 'var(--accent)' : 'var(--border-strong)'}`,
        background: done ? 'var(--accent)' : isNext ? 'var(--accent-soft)' : 'var(--subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 12,
        color: done ? 'var(--accent-fg)' : isNext ? 'var(--accent)' : 'var(--text-tert)',
      }}>
        {done ? '✓' : isNext ? '▸' : String(index + 1).padStart(2, '0')}
      </div>
      {/* Name */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: done ? 'var(--text-muted)' : 'var(--text)',
          letterSpacing: '-0.005em',
        }}>{name}</div>
        <div style={{
          fontFamily: "'Geist Mono', monospace", fontSize: 11,
          color: 'var(--text-tert)', marginTop: 2, letterSpacing: '0.02em',
        }}>
          {done ? 'completed · +20 xp' : isNext ? 'next up' : 'queued'}
        </div>
      </div>
      {/* Status tag */}
      <div style={{
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: done ? 'var(--accent)' : isNext ? 'var(--accent)' : 'var(--text-tert)',
        fontWeight: 600, fontFamily: "'Geist', sans-serif", whiteSpace: 'nowrap',
      }}>
        {done ? 'Done' : isNext ? 'Next' : 'Up next'}
      </div>
    </motion.div>
  );
}
