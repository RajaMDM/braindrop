import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useXP } from '../../hooks/useXP.js';
import { useApp } from '../../context/AppContext.jsx';

export default function XPBar({ lastAI }) {
  const { xp, streak, queryCount, level, xpBarPercent } = useXP();
  const { mode } = useApp();
  const prevXP = useRef(xp);
  const barWidth = useMotionValue(0);
  const barWidthStr = useTransform(barWidth, (v) => `${v}%`);

  useEffect(() => {
    animate(barWidth, xpBarPercent, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
  }, [xpBarPercent, barWidth]);

  // Pulse detection
  const justGained = xp > prevXP.current;
  useEffect(() => {
    prevXP.current = xp;
  }, [xp]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '6px 20px',
      background: 'rgba(26,26,46,.6)',
      borderBottom: '1px solid var(--bd)',
      fontSize: '.75rem', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--t3)' }}>
        <span>{'\uD83D\uDD25'}</span>
        <span style={{ color: 'var(--ny)', fontWeight: 700, fontFamily: "'Geist Mono',monospace" }}>{streak}</span>
      </div>
      <motion.div
        animate={justGained ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--t3)' }}
      >
        <span>&#x26A1;</span>
        <span style={{ color: 'var(--ny)', fontWeight: 700, fontFamily: "'Geist Mono',monospace" }}>{xp}</span>
        <span>XP</span>
      </motion.div>
      <div style={{
        flex: 1, height: 6, borderRadius: 3,
        background: 'var(--bg3)', overflow: 'hidden', maxWidth: 200,
      }}>
        <motion.div style={{
          height: '100%', borderRadius: 3,
          background: 'var(--xp)',
          width: barWidthStr,
        }} />
      </div>
      <div style={{
        fontFamily: "'Geist Mono',monospace", fontSize: '.65rem', color: 'var(--t3)',
      }}>
        Lvl {level.l} — {level.n}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--t3)', marginLeft: 'auto' }}>
        <span>{'\uD83D\uDCCA'}</span>
        <span style={{ color: 'var(--ny)', fontWeight: 700, fontFamily: "'Geist Mono',monospace" }}>{queryCount}</span>
        <span>Qs</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--t3)' }}>
        <span>{'\uD83E\uDD16'}</span>
        <span style={{ color: 'var(--ny)', fontWeight: 700, fontFamily: "'Geist Mono',monospace" }}>
          {lastAI || '\u2014'}
        </span>
      </div>
    </div>
  );
}
