import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CertificateOverlay({ subject, userName, onClose }) {
  // Fire confetti on mount
  useEffect(() => {
    let confettiModule;
    import('canvas-confetti').then((mod) => {
      confettiModule = mod.default || mod;
      if (typeof confettiModule === 'function') {
        confettiModule({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#b44aff', '#ff6b9d', '#00f5d4', '#fee440', '#4cc9f0'],
        });
      }
    }).catch(() => {
      // canvas-confetti not available — graceful degradation
    });
  }, []);

  const subjectNames = {
    mathematics: 'Mathematics',
    science: 'Science',
    english: 'English',
    'social-science': 'Social Science',
    hindi: 'Hindi',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg3)',
          border: '2px solid var(--ny)',
          borderRadius: 20, padding: 40, textAlign: 'center',
          maxWidth: 440, width: '90%',
          boxShadow: '0 0 60px rgba(254,228,64,.2)',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>{'\uD83C\uDF93'}</div>
        <div style={{
          fontSize: '1.5rem', fontWeight: 700,
          background: 'linear-gradient(135deg,#fee440,#ff6d00)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          Course Complete!
        </div>
        <div style={{ color: 'var(--t2)', fontSize: '.9rem', marginBottom: 20, lineHeight: 1.6 }}>
          Congratulations! You have completed all chapters in{' '}
          <strong style={{ color: 'var(--ny)' }}>{subjectNames[subject] || subject}</strong>.
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ny)', marginBottom: 4 }}>
          {userName}
        </div>
        <div style={{
          fontSize: '.72rem', color: 'var(--t3)',
          fontFamily: "'Space Mono',monospace",
        }}>
          {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          style={{
            marginTop: 24, padding: '10px 24px', borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(135deg,#fee440,#ff6d00)',
            color: '#0b0b14', fontFamily: "'Fredoka',sans-serif",
            fontSize: '.85rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Continue Learning
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
