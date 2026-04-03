import { motion } from 'framer-motion';

export default function LessonItem({ name, done, onClick }) {
  return (
    <motion.div
      whileHover={{ borderColor: 'rgba(180,74,255,.15)', color: 'var(--t1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', borderRadius: 7,
        fontSize: '.8rem', color: 'var(--t2)',
        cursor: 'pointer', background: 'var(--bg)',
        border: '1px solid transparent',
        transition: 'all .15s',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1.5px solid ${done ? 'var(--ng)' : 'var(--bd)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '.6rem', flexShrink: 0,
        background: done ? 'var(--ng)' : 'transparent',
        color: done ? '#0b0b14' : 'transparent',
      }}>
        {done ? '\u2713' : ''}
      </div>
      <span style={{ opacity: done ? 0.7 : 1 }}>{name}</span>
    </motion.div>
  );
}
