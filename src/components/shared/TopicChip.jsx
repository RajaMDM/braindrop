import { motion } from 'framer-motion';

export default function TopicChip({ label, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{
        scale: 1.04,
        borderColor: '#ff6b9d',
        color: '#ff6b9d',
        background: 'rgba(255,107,157,.06)',
        y: -1,
        boxShadow: '0 4px 12px rgba(255,107,157,.1)',
      }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick(label)}
      style={{
        padding: '9px 16px', borderRadius: 20,
        background: 'var(--bg3)',
        border: '1px solid var(--bd)',
        color: 'var(--t2)', fontSize: '.8rem', fontWeight: 500,
        cursor: 'pointer', fontFamily: "'Fredoka',sans-serif",
        transition: 'all .2s',
      }}
    >
      {label}
    </motion.button>
  );
}
