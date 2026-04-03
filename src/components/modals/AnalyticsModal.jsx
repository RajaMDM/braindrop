import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useXP } from '../../hooks/useXP.js';
import { useMemory } from '../../hooks/useMemory.js';
import { useEventLog } from '../../hooks/useEventLog.js';

const SUBJECT_NAMES = {
  mathematics: 'Maths',
  science: 'Science',
  english: 'English',
  'social-science': 'SST',
  hindi: 'Hindi',
};

const SUBJECT_COLORS = {
  mathematics: '#b44aff',
  science: '#00f5d4',
  english: '#fee440',
  'social-science': '#ff6b9d',
  hindi: '#4cc9f0',
};

export default function AnalyticsModal({ onClose }) {
  const { xp, streak } = useXP();
  const { memory } = useMemory();
  const { getLogs } = useEventLog();

  const logs = useMemo(() => getLogs(), [getLogs]);
  const topicsCovered = memory?.profile?.topicsCovered || [];
  const weakAreas = memory?.profile?.weakAreas || [];

  // Subject breakdown from logs
  const subjectStats = useMemo(() => {
    const counts = {};
    logs.filter((l) => l.type === 'chat').forEach((l) => {
      if (l.subject) counts[l.subject] = (counts[l.subject] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([sub, count]) => ({
      subject: sub,
      count,
      pct: Math.round((count / max) * 100),
    }));
  }, [logs]);

  // AI usage from logs
  const aiStats = useMemo(() => {
    const counts = {};
    logs.filter((l) => l.type === 'chat' && l.ai).forEach((l) => {
      counts[l.ai] = (counts[l.ai] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([ai, count]) => ({
      ai,
      count,
      pct: Math.round((count / max) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [logs]);

  // 28-day heatmap
  const heatmap = useMemo(() => {
    const cells = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = logs.filter((l) => l.type === 'chat' && new Date(l.ts).toDateString() === dateStr).length;
      let level = 0;
      if (count >= 1) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;
      cells.push({ level, count, date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) });
    }
    return cells;
  }, [logs]);

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 18 }}>{'\uD83D\uDCC8'} My Progress</h2>
      <p style={{ color: 'var(--t2)', fontSize: '.82rem', marginBottom: 12 }}>
        Your learning journey at a glance.
      </p>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'XP', value: xp, color: 'var(--np)' },
          { label: 'Streak', value: streak, color: 'var(--ny)' },
          { label: 'Topics', value: topicsCovered.length, color: 'var(--nc)' },
          { label: 'Weak Areas', value: weakAreas.length, color: 'var(--nr)' },
        ].map((s) => (
          <div key={s.label} style={{
            textAlign: 'center', padding: 10, background: 'var(--bg)',
            borderRadius: 10, border: '1px solid var(--bd)',
          }}>
            <div style={{
              fontSize: '1.4rem', fontWeight: 700,
              fontFamily: "'Space Mono',monospace", color: s.color,
            }}>{s.value}</div>
            <div style={{ fontSize: '.6rem', color: 'var(--t3)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
        {/* Subject progress */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--bd)',
          borderRadius: 12, padding: 14,
        }}>
          <h4 style={{
            fontSize: '.72rem', color: 'var(--t3)', textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
          }}>Subject Progress</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {subjectStats.map((s) => (
              <div key={s.subject} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.72rem' }}>
                <span style={{ width: 60, color: 'var(--t2)', textAlign: 'right', flexShrink: 0 }}>
                  {SUBJECT_NAMES[s.subject] || s.subject}
                </span>
                <div style={{
                  flex: 1, height: 10, background: 'var(--bg3)',
                  borderRadius: 5, overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.6 }}
                    style={{
                      height: '100%', borderRadius: 5,
                      background: SUBJECT_COLORS[s.subject] || 'var(--np)',
                    }}
                  />
                </div>
                <span style={{
                  width: 32, fontFamily: "'Space Mono',monospace",
                  fontSize: '.65rem', color: 'var(--t3)',
                }}>{s.count}</span>
              </div>
            ))}
            {subjectStats.length === 0 && (
              <div style={{ fontSize: '.72rem', color: 'var(--t3)' }}>No data yet</div>
            )}
          </div>
        </div>

        {/* 28-day heatmap */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--bd)',
          borderRadius: 12, padding: 14,
        }}>
          <h4 style={{
            fontSize: '.72rem', color: 'var(--t3)', textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
          }}>28-Day Activity</h4>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3,
          }}>
            {heatmap.map((cell, i) => {
              const opacities = [0, 0.15, 0.3, 0.5, 0.75];
              const bgColor = cell.level === 0 ? 'var(--bg3)' : `rgba(180,74,255,${opacities[cell.level]})`;
              return (
                <div
                  key={i}
                  title={`${cell.date}: ${cell.count} questions`}
                  style={{
                    aspectRatio: '1', borderRadius: 3,
                    background: bgColor,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--bd)',
          borderRadius: 12, padding: 14,
        }}>
          <h4 style={{
            fontSize: '.72rem', color: 'var(--t3)', textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
          }}>Strengths & Weaknesses</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {topicsCovered.slice(-8).map((t) => (
              <span key={t} style={{
                fontSize: '.68rem', padding: '3px 9px', borderRadius: 6, fontWeight: 500,
                background: 'rgba(57,255,20,.1)', color: 'var(--ng)',
                border: '1px solid rgba(57,255,20,.15)',
              }}>{t}</span>
            ))}
            {weakAreas.slice(-5).map((w) => (
              <span key={w} style={{
                fontSize: '.68rem', padding: '3px 9px', borderRadius: 6, fontWeight: 500,
                background: 'rgba(255,23,68,.08)', color: 'var(--nr)',
                border: '1px solid rgba(255,23,68,.15)',
              }}>{w}</span>
            ))}
            {topicsCovered.length === 0 && weakAreas.length === 0 && (
              <span style={{ fontSize: '.72rem', color: 'var(--t3)' }}>Start studying to see insights</span>
            )}
          </div>
        </div>

        {/* AI Usage */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--bd)',
          borderRadius: 12, padding: 14,
        }}>
          <h4 style={{
            fontSize: '.72rem', color: 'var(--t3)', textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 10, fontWeight: 600,
          }}>AI Usage</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {aiStats.map((s) => (
              <div key={s.ai} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.72rem' }}>
                <span style={{ width: 60, color: 'var(--t2)', textAlign: 'right', flexShrink: 0 }}>{s.ai}</span>
                <div style={{
                  flex: 1, height: 10, background: 'var(--bg3)',
                  borderRadius: 5, overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.6 }}
                    style={{ height: '100%', borderRadius: 5, background: 'var(--np)' }}
                  />
                </div>
                <span style={{
                  width: 32, fontFamily: "'Space Mono',monospace",
                  fontSize: '.65rem', color: 'var(--t3)',
                }}>{s.count}</span>
              </div>
            ))}
            {aiStats.length === 0 && (
              <div style={{ fontSize: '.72rem', color: 'var(--t3)' }}>No AI usage yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#ff6b9d,#b44aff)', color: '#fff',
            fontFamily: "'Fredoka',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Close
        </motion.button>
      </div>
    </div>
  );
}
