import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEventLog } from '../../hooks/useEventLog.js';

export default function StatsModal({ onClose }) {
  const { getLogs, exportCSV } = useEventLog();

  const logs = useMemo(() => getLogs(), [getLogs]);

  // Compute stats
  const stats = useMemo(() => {
    const totalQs = logs.filter((l) => l.type === 'chat').length;
    const uniqueUsers = new Set(logs.map((l) => l.user).filter(Boolean)).size;
    const today = new Date().toDateString();
    const todayQs = logs.filter((l) => l.type === 'chat' && new Date(l.ts).toDateString() === today).length;

    // Top AI
    const aiCounts = {};
    logs.forEach((l) => {
      if (l.ai) aiCounts[l.ai] = (aiCounts[l.ai] || 0) + 1;
    });
    const topAI = Object.entries(aiCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalQs,
      uniqueUsers,
      todayQs,
      topAI: topAI ? `${topAI[0]} (${topAI[1]})` : 'N/A',
    };
  }, [logs]);

  const recentLogs = logs.slice(-20).reverse();

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 18 }}>{'\uD83D\uDCCA'} Usage Dashboard</h2>
      <p style={{ color: 'var(--t2)', fontSize: '.82rem', marginBottom: 12 }}>
        Activity log across all users of this BrainDrop instance.
      </p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '14px 0' }}>
        {[
          { label: 'Total Questions', value: stats.totalQs, color: 'var(--np)' },
          { label: 'Unique Users', value: stats.uniqueUsers, color: 'var(--nc)' },
          { label: "Today's Questions", value: stats.todayQs, color: 'var(--ny)' },
          { label: 'Top AI', value: stats.topAI, color: 'var(--nk)' },
        ].map((s) => (
          <div key={s.label} style={{
            background: 'var(--bg)', border: '1px solid var(--bd)',
            borderRadius: 10, padding: 12, textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.5rem', fontWeight: 700,
              fontFamily: "'Geist Mono',monospace", color: s.color,
            }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--t3)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent log */}
      <h3 style={{ fontSize: '.85rem', marginTop: 16, color: 'var(--np)' }}>Recent Activity Log</h3>
      <div style={{ maxHeight: 250, overflowY: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse', fontSize: '.72rem', marginTop: 12,
        }}>
          <thead>
            <tr>
              {['Time', 'User', 'Subject', 'Mode', 'AI'].map((h) => (
                <th key={h} style={{
                  border: '1px solid var(--bd)', padding: '6px 8px', textAlign: 'left',
                  background: 'rgba(180,74,255,.08)', color: 'var(--np)', fontWeight: 600,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((l, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid var(--bd)', padding: '6px 8px' }}>
                  {l.ts ? new Date(l.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                </td>
                <td style={{ border: '1px solid var(--bd)', padding: '6px 8px' }}>{l.user || ''}</td>
                <td style={{ border: '1px solid var(--bd)', padding: '6px 8px' }}>{l.subject || ''}</td>
                <td style={{ border: '1px solid var(--bd)', padding: '6px 8px' }}>{l.mode || ''}</td>
                <td style={{ border: '1px solid var(--bd)', padding: '6px 8px' }}>{l.ai || ''}</td>
              </tr>
            ))}
            {recentLogs.length === 0 && (
              <tr><td colSpan={5} style={{ border: '1px solid var(--bd)', padding: '12px 8px', textAlign: 'center', color: 'var(--t3)' }}>No activity logged yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportCSV}
          style={{
            padding: '9px 18px', borderRadius: 8, border: '1px solid var(--bd)',
            background: 'var(--bg)', color: 'var(--t2)',
            fontFamily: "'Geist',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          {'\uD83D\uDCE5'} Export CSV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#ff6b9d,#b44aff)', color: '#fff',
            fontFamily: "'Geist',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Close
        </motion.button>
      </div>
    </div>
  );
}
