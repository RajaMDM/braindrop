import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function InputBar({ onSend, busy }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    if (!text.trim() || busy) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, busy, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback((e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, []);

  return (
    <div style={{
      padding: '12px 18px 16px',
      background: 'rgba(18,18,31,.85)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--bd)',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 10,
        maxWidth: 760, margin: '0 auto',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask me anything..."
          rows={1}
          style={{
            flex: 1, padding: '12px 16px',
            background: 'var(--bg3)',
            border: '1px solid var(--bd)',
            borderRadius: 10, color: 'var(--t1)',
            fontFamily: "'Fredoka',sans-serif", fontSize: '.88rem',
            resize: 'none', outline: 'none',
            minHeight: 44, maxHeight: 140, lineHeight: 1.5,
            transition: 'border-color .2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--np)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--bd)'; }}
        />
        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 0 18px rgba(180,74,255,.4)' }}
          whileTap={{ scale: 0.94 }}
          onClick={handleSend}
          disabled={busy || !text.trim()}
          style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
            border: 'none', color: '#fff', fontSize: '1.1rem',
            cursor: busy ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            opacity: busy || !text.trim() ? 0.35 : 1,
          }}
        >
          &#x27A4;
        </motion.button>
      </div>
    </div>
  );
}
