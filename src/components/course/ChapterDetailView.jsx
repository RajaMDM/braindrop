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
  const statusColor = !unlocked ? 'var(--p-pencil)' : isDone ? 'var(--p-green)' : 'var(--p-blue)';

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

  const halfway = lessonsDone > 0 && lessonsDone < totalLessons;

  return (
    <div style={{
      maxWidth: 880, margin: '0 auto', padding: '24px 18px 60px', textAlign: 'left',
    }}>
      {/* Top bar: back + crumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 13, color: 'var(--p-pencil)', marginBottom: 14, flexWrap: 'wrap',
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'transparent', border: '1px solid var(--p-line)', color: 'var(--p-ink2)',
            padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
            fontFamily: 'Inter,sans-serif', fontWeight: 500,
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
        <div className="font-hand" style={{
          fontSize: 24, color: 'var(--p-blue)', lineHeight: 1, marginBottom: 2,
          transform: 'rotate(-.5deg)', display: 'inline-block',
        }}>chapter {chapterKickerWord(chapterIndex)}</div>
        <h1 style={{
          fontFamily: 'Inter,sans-serif', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em',
          color: 'var(--p-ink)', margin: '4px 0 0',
          fontSize: 'clamp(32px, 6vw, 50px)', position: 'relative', display: 'inline-block',
        }}>
          {lead && <span>{lead} </span>}
          <span style={{ position: 'relative', zIndex: 1 }}>
            {last}
            <span aria-hidden style={{
              position: 'absolute', left: -3, right: -5, bottom: 5, height: 14,
              background: 'var(--p-hl)', zIndex: -1, transform: 'skewX(-6deg) rotate(-1deg)',
            }} />
          </span>
        </h1>
      </div>

      {!unlocked && (
        <div style={{
          margin: '18px 0 24px', padding: '14px 18px',
          background: 'var(--p-paper2)', border: '1.5px dashed var(--p-line2)',
          borderRadius: 12, color: 'var(--p-ink2)', fontSize: 14,
        }}>
          Locked — finish chapter {chapterIndex} first to unlock this one.
        </div>
      )}

      <p style={{
        color: 'var(--p-ink2)', fontSize: 15, lineHeight: 1.55,
        margin: '14px 0 22px', maxWidth: '54ch',
      }}>
        {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'} in this chapter.{' '}
        {halfway && (
          <em className="font-hand" style={{
            fontStyle: 'normal', color: 'var(--p-red)', fontSize: 18,
          }}>halfway through!</em>
        )}
        {isDone && (
          <em className="font-hand" style={{
            fontStyle: 'normal', color: 'var(--p-green)', fontSize: 18,
          }}>chapter complete ★</em>
        )}
      </p>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '0 0 22px',
      }} className="stats-row">
        <Stat label="Mastery" value={masteryPct} suffix="%" />
        <Stat label="Lessons" value={lessonsDone} suffix={`/ ${totalLessons}`} doodle={lessonsDone > 0 ? '★'.repeat(Math.min(lessonsDone, 3)) : ''} />
        <Stat label="Status" customValue={
          <span style={{ color: statusColor }}>{status}</span>
        } />
        <Stat label="XP earned" value={xpEarned} suffix="xp" />
      </div>

      {/* Progress card with ring */}
      {unlocked && (
        <div style={{
          background: 'var(--p-card)', border: '1px solid var(--p-line)', borderRadius: 16,
          padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 18,
          marginBottom: 18, flexWrap: 'wrap',
        }} className="progress-card">
          <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
            <svg width="84" height="84" viewBox="0 0 84 84" style={{ display: 'block' }}>
              <circle cx="42" cy="42" r={RING_R} stroke="var(--p-paper2)" strokeWidth="8" fill="none" />
              <motion.circle
                cx="42" cy="42" r={RING_R}
                stroke={isDone ? 'var(--p-green)' : 'var(--p-blue)'}
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
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--p-ink)',
            }}>{masteryPct}%</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="font-hand" style={{
              fontSize: 20, color: 'var(--p-blue)', lineHeight: 1, marginBottom: 4,
              transform: 'rotate(-.4deg)', display: 'inline-block',
            }}>{nextUp ? 'next up →' : isDone ? 'finished →' : ''}</div>
            <h2 style={{
              margin: '0 0 4px', fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em',
              color: 'var(--p-ink)', fontFamily: 'Inter,sans-serif',
            }}>
              {nextUp || (isDone ? 'All lessons complete' : 'Pick a lesson to start')}
            </h2>
            <p style={{ margin: 0, color: 'var(--p-pencil)', fontSize: 13 }}>
              {isDone ? 'Earned the chapter badge · review anytime'
                : nextUp ? `${nextUpIdx + 1} of ${totalLessons} · tap Resume to mark complete`
                : 'Click any lesson below'}
            </p>
          </div>
          <button
            onClick={handleResume}
            disabled={!nextUp}
            style={{
              fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14,
              background: nextUp ? 'var(--p-ink)' : 'var(--p-pencil)',
              color: 'var(--p-paper)', border: 0,
              padding: '12px 20px', borderRadius: 12, cursor: nextUp ? 'pointer' : 'not-allowed',
              letterSpacing: '0.01em',
              boxShadow: nextUp ? '0 4px 12px rgba(31,44,74,.18)' : 'none',
              flexShrink: 0,
              opacity: nextUp ? 1 : 0.6,
            }}
          >{isDone ? 'Done ★' : 'Resume →'}</button>
        </div>
      )}

      {/* Lessons header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        margin: '14px 0 10px',
      }}>
        <h3 className="font-hand" style={{
          margin: 0, fontSize: 30, fontWeight: 700, color: 'var(--p-ink)',
          lineHeight: 1, transform: 'rotate(-.3deg)', display: 'inline-block',
        }}>What's in here</h3>
        <div className="font-mono-p" style={{
          fontSize: 12, color: 'var(--p-pencil)', letterSpacing: '0.04em',
        }}>{String(totalLessons).padStart(2, '0')} lessons · {String(lessonsDone).padStart(2, '0')} done</div>
      </div>

      {/* Lesson list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

      {/* Friendly footer */}
      {unlocked && !isDone && totalLessons - lessonsDone > 0 && (
        <p className="font-hand" style={{
          marginTop: 22, fontSize: 22, color: 'var(--p-blue)',
          textAlign: 'center', transform: 'rotate(-.4deg)', lineHeight: 1.2,
        }}>
          {lessonsDone} down, {totalLessons - lessonsDone} to go{' '}
          <span style={{ color: 'var(--p-red)' }}>→</span>{' '}
          finish this chapter, earn the badge
        </p>
      )}
      {isDone && (
        <p className="font-hand" style={{
          marginTop: 22, fontSize: 22, color: 'var(--p-green)',
          textAlign: 'center', transform: 'rotate(-.3deg)', lineHeight: 1.2,
        }}>
          chapter complete ★ — review whenever you like
        </p>
      )}

      <style>{`
        @media (max-width: 680px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .progress-card { flex-direction: column !important; align-items: flex-start !important; }
          .progress-card > button { width: 100% !important; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, suffix, customValue, doodle }) {
  return (
    <div style={{
      background: 'var(--p-card)', border: '1px solid var(--p-line)',
      borderRadius: 14, padding: '14px 16px', position: 'relative',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--p-pencil)', marginBottom: 4, fontWeight: 500,
      }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
        color: 'var(--p-ink)', fontFeatureSettings: '"lnum"',
        fontFamily: 'Inter,sans-serif',
      }}>
        {customValue !== undefined ? customValue : (
          <>
            {value}
            {suffix && (
              <small className="font-mono-p" style={{
                fontSize: 12, color: 'var(--p-pencil)', marginLeft: 3,
                fontWeight: 500, letterSpacing: '0.02em',
              }}> {suffix}</small>
            )}
          </>
        )}
      </div>
      {doodle && (
        <div className="font-hand" style={{
          position: 'absolute', top: 6, right: 10,
          fontSize: 18, color: 'var(--p-green)', transform: 'rotate(8deg)',
        }}>{doodle}</div>
      )}
    </div>
  );
}

function LessonRow({ index, name, done, isNext, unlocked, onClick }) {
  return (
    <motion.div
      whileHover={unlocked && !done ? { scale: 1.005 } : {}}
      whileTap={unlocked && !done ? { scale: 0.995 } : {}}
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        columnGap: 14,
        alignItems: 'center',
        background: 'var(--p-card)',
        border: `1px solid ${isNext ? 'var(--p-ink)' : 'var(--p-line)'}`,
        borderRadius: 14, padding: '14px 16px',
        cursor: unlocked && !done ? 'pointer' : (done ? 'default' : 'not-allowed'),
        opacity: unlocked ? 1 : 0.5,
        boxShadow: isNext ? '0 0 0 2px var(--p-hl)' : 'none',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      {/* Check / index */}
      <div style={{
        flexShrink: 0, width: 32, height: 32, borderRadius: 9,
        border: `1.5px solid ${done ? 'var(--p-green)' : isNext ? 'var(--p-ink)' : 'var(--p-ink)'}`,
        background: done ? 'var(--p-green)' : isNext ? 'var(--p-hl)' : 'var(--p-paper)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 13,
        color: done ? '#fff' : isNext ? 'var(--p-ink)' : 'var(--p-pencil)',
      }}>
        {done ? '✓' : isNext ? '▶' : String(index + 1).padStart(2, '0')}
      </div>
      {/* Name */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: done ? 'var(--p-ink2)' : 'var(--p-ink)',
          letterSpacing: '-0.005em',
          textDecoration: done ? 'line-through' : 'none',
          textDecorationColor: done ? 'var(--p-green)' : 'transparent',
          textDecorationThickness: '2px',
        }}>{name}</div>
        <div className="font-mono-p" style={{
          fontSize: 11, color: 'var(--p-pencil)', marginTop: 3, letterSpacing: '0.02em',
        }}>
          {done ? 'completed · +20 xp earned' : isNext ? 'next up · tap to mark complete' : 'queued · tap to mark complete'}
        </div>
      </div>
      {/* Status / star */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: done ? 'var(--p-green)' : isNext ? 'var(--p-ink)' : 'var(--p-pencil)',
          fontWeight: 600, fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap',
        }}>
          {done ? 'Done' : isNext ? 'Next' : 'Up next'}
        </span>
        {done && (
          <span className="font-hand" style={{
            fontSize: 22, color: 'var(--p-red)', lineHeight: 1, transform: 'rotate(-6deg)',
          }}>★</span>
        )}
      </div>
    </motion.div>
  );
}
