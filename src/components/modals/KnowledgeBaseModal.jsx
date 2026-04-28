import { useState } from 'react';
import { motion } from 'framer-motion';

const SUBJECT_OPTIONS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
  { value: 'social-science', label: 'Social Science' },
  { value: 'hindi', label: 'Hindi' },
];

export default function KnowledgeBaseModal({ onClose }) {
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    if (!content.trim()) return;
    try {
      const key = `bd_kb_extra_${selectedSubject}`;
      const existing = localStorage.getItem(key) || '';
      localStorage.setItem(key, existing + '\n\n' + content.trim());
      setLoaded(true);
      setContent('');
      setTimeout(() => setLoaded(false), 2000);
    } catch {
      // Storage full or other error
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 18 }}>{'\uD83D\uDCDA'} Load Extra Content</h2>
      <p style={{ color: 'var(--t2)', fontSize: '.82rem', marginBottom: 12 }}>
        NCERT PDFs auto-load from <code style={{
          background: 'rgba(180,74,255,.1)', padding: '2px 6px', borderRadius: 4,
          fontFamily: "'Geist Mono',monospace", fontSize: '.82em', color: 'var(--nc)',
        }}>/books/</code>. Use this for extra notes or sample papers.
      </p>

      {/* Subject */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: '.75rem', color: 'var(--t2)', marginBottom: 5, fontWeight: 500 }}>
          Subject
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', background: 'var(--bg)',
            border: '1px solid var(--bd)', borderRadius: 8,
            color: 'var(--t1)', fontFamily: "'Geist',sans-serif",
            fontSize: '.88rem', outline: 'none',
          }}
        >
          {SUBJECT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: '.75rem', color: 'var(--t2)', marginBottom: 5, fontWeight: 500 }}>
          Extra Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste sample papers, extra notes, reference material..."
          style={{
            width: '100%', height: 150, padding: 12, background: 'var(--bg)',
            border: '1px solid var(--bd)', borderRadius: 8,
            color: 'var(--t1)', fontFamily: "'Geist Mono',monospace",
            fontSize: '.78rem', resize: 'vertical', outline: 'none',
          }}
        />
      </div>

      {loaded && (
        <div style={{
          padding: 8, background: 'rgba(57,255,20,.06)',
          border: '1px solid rgba(57,255,20,.15)', borderRadius: 8,
          fontSize: '.75rem', color: 'var(--ng)', marginBottom: 12, textAlign: 'center',
        }}>
          Content loaded successfully!
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            padding: '9px 18px', borderRadius: 8, border: '1px solid var(--bd)',
            background: 'var(--bg)', color: 'var(--t2)',
            fontFamily: "'Geist',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLoad}
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#ff6b9d,#b44aff)', color: '#fff',
            fontFamily: "'Geist',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Load &#x26A1;
        </motion.button>
      </div>
    </div>
  );
}
