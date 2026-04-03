import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCharacter } from '../../hooks/useCharacter.js';
import MarkdownRenderer from '../shared/MarkdownRenderer.jsx';

export default function MessageBubble({ message, onGenerateSim }) {
  const { user } = useAuth();
  const { character } = useCharacter();
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        display: 'flex', gap: 12, maxWidth: '82%',
        ...(isUser ? { marginLeft: 'auto', flexDirection: 'row-reverse' } : {}),
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', flexShrink: 0, fontWeight: 700,
        background: isUser
          ? 'linear-gradient(135deg,#fee440,#ff6d00)'
          : 'linear-gradient(135deg,#ff6b9d,#b44aff)',
        boxShadow: isUser
          ? '0 0 10px rgba(254,228,64,.2)'
          : '0 0 10px rgba(180,74,255,.3)',
      }}>
        {isUser ? (character?.emoji || user?.name?.charAt(0) || '?') : '\u26A1'}
      </div>

      {/* Bubble */}
      <div style={{
        padding: '14px 18px', borderRadius: 14,
        fontSize: '.88rem', lineHeight: 1.7, wordBreak: 'break-word',
        ...(isUser ? {
          background: 'rgba(180,74,255,.12)',
          border: '1px solid rgba(180,74,255,.2)',
        } : {
          background: 'var(--bg3)',
          border: '1px solid var(--bd)',
        }),
      }}>
        {isUser ? (
          <div>{message.text}</div>
        ) : (
          <>
            <MarkdownRenderer text={message.text} />
            {/* AI label */}
            {message.ai && (
              <div style={{
                fontSize: '.62rem', color: 'var(--t3)', marginTop: 6,
                fontFamily: "'Space Mono',monospace",
              }}>
                via {message.ai}
              </div>
            )}
            {/* Generate Simulation button */}
            <motion.button
              whileHover={{ scale: 1.03, borderColor: 'var(--np)', y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onGenerateSim(message.text)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 8, padding: '5px 12px', borderRadius: 7,
                border: '1px solid rgba(180,74,255,.2)',
                background: 'rgba(180,74,255,.06)',
                color: 'var(--np)', fontFamily: "'Fredoka',sans-serif",
                fontSize: '.7rem', fontWeight: 500, cursor: 'pointer',
              }}
            >
              &#x26A1; Generate Simulation
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
