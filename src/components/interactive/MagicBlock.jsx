import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * MagicBlock — Interactive HTML simulation in a sandboxed iframe.
 * Props: title (string), html (string - the srcdoc content)
 */
export default function MagicBlock({ title, html }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      style={{
        margin: '12px 0',
        border: '1px solid rgba(180,74,255,.25)',
        borderRadius: 14, overflow: 'hidden',
        background: 'var(--bg)', position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: 'rgba(180,74,255,.08)',
        borderBottom: '1px solid rgba(180,74,255,.15)',
      }}>
        <span style={{
          fontSize: '.65rem', fontFamily: "'Space Mono',monospace",
          fontWeight: 700, color: 'var(--np)',
          display: 'flex', alignItems: 'center', gap: 6,
          textTransform: 'uppercase', letterSpacing: 1.5,
        }}>
          &#x26A1; Interactive{title ? ` \u2014 ${title}` : ''}
        </span>
        <motion.button
          whileHover={{ borderColor: 'var(--np)', color: 'var(--np)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: 'none', border: '1px solid var(--bd)',
            borderRadius: 6, color: 'var(--t3)', fontSize: '.65rem',
            padding: '3px 8px', cursor: 'pointer',
            fontFamily: "'Space Mono',monospace",
          }}
        >
          {expanded ? 'Shrink' : 'Expand'}
        </motion.button>
      </div>

      {/* Iframe */}
      <motion.div
        layout
        style={{ overflow: 'hidden' }}
        animate={{ height: expanded ? 650 : 420 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <iframe
          sandbox="allow-scripts"
          srcDoc={html}
          style={{
            width: '100%', height: '100%', border: 'none',
            background: 'var(--bg)', display: 'block',
          }}
          title={title || 'Interactive Simulation'}
        />
      </motion.div>
    </motion.div>
  );
}
