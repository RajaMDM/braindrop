import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMemory } from '../../hooks/useMemory.js';

export default function ScoresModal({ onClose }) {
  const { memory } = useMemory();

  const quizResults = memory?.profile?.quizResults || [];

  const summary = useMemo(() => {
    if (quizResults.length === 0) return { total: 0, avgAcc: 0, bestScore: 0 };
    const total = quizResults.length;
    const avgAcc = Math.round(quizResults.reduce((s, r) => s + (r.accuracy || 0), 0) / total);
    const bestScore = Math.max(...quizResults.map((r) => r.accuracy || 0));
    return { total, avgAcc, bestScore };
  }, [quizResults]);

  const recentResults = quizResults.slice(-15).reverse();

  return (
    <div style={{ maxWidth: 620 }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 18 }}>{'\uD83C\uDFC6'} Quiz Score History</h2>
      <p style={{ color: 'var(--t2)', fontSize: '.82rem', marginBottom: 12 }}>
        Your quiz and flashcard performance across all subjects.
      </p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '14px 0' }}>
        {[
          { label: 'Total Quizzes', value: summary.total, color: 'var(--np)' },
          { label: 'Avg Accuracy', value: `${summary.avgAcc}%`, color: 'var(--ny)' },
          { label: 'Best Score', value: `${summary.bestScore}%`, color: 'var(--ng)' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg)', border: '1px solid var(--bd)',
            borderRadius: 10, padding: 12, textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.3rem', fontWeight: 700,
              fontFamily: "'Space Mono',monospace", color: s.color,
            }}>{s.value}</div>
            <div style={{ fontSize: '.65rem', color: 'var(--t3)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Results table */}
      <h3 style={{ fontSize: '.85rem', marginTop: 16, color: 'var(--np)' }}>Recent Results</h3>
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse', fontSize: '.72rem', marginTop: 12,
        }}>
          <thead>
            <tr>
              {['Date', 'Subject', 'Topic', 'Score', 'Accuracy'].map((h) => (
                <th key={h} style={{
                  border: '1px solid var(--bd)', padding: '7px 8px', textAlign: 'left',
                  background: 'rgba(180,74,255,.08)', color: 'var(--np)', fontWeight: 600,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentResults.map((r, i) => {
              const accColor = (r.accuracy || 0) >= 80 ? 'var(--ng)' : (r.accuracy || 0) >= 50 ? 'var(--ny)' : 'var(--nr)';
              return (
                <tr key={i}>
                  <td style={{ border: '1px solid var(--bd)', padding: '7px 8px' }}>{r.date || ''}</td>
                  <td style={{ border: '1px solid var(--bd)', padding: '7px 8px' }}>{r.subject || ''}</td>
                  <td style={{ border: '1px solid var(--bd)', padding: '7px 8px' }}>{r.topic || ''}</td>
                  <td style={{ border: '1px solid var(--bd)', padding: '7px 8px' }}>{r.correct || 0}/{r.total || 0}</td>
                  <td style={{ border: '1px solid var(--bd)', padding: '7px 8px', color: accColor, fontWeight: 600 }}>{r.accuracy || 0}%</td>
                </tr>
              );
            })}
            {recentResults.length === 0 && (
              <tr><td colSpan={5} style={{ border: '1px solid var(--bd)', padding: '12px 8px', textAlign: 'center', color: 'var(--t3)' }}>No quiz results yet — try Quiz mode!</td></tr>
            )}
          </tbody>
        </table>
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
