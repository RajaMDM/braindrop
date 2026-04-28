import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useAI } from '../../hooks/useAI.js';

const AI_OPTIONS = [
  { value: 'auto', label: '\uD83D\uDD04 Auto (smart fallback)' },
  { value: 'nvidia', label: '\uD83D\uDFE2 NVIDIA Llama 3.3 70B' },
  { value: 'groq', label: '\uD83D\uDFE0 Groq Llama 3.3 (ultra-fast)' },
  { value: 'gemini', label: '\uD83D\uDFE2 Gemini 2.5 Flash' },
  { value: 'claude', label: '\uD83D\uDFE3 Claude Haiku (best teaching)' },
];

export default function SettingsModal({ onClose }) {
  const { preferences, setPreferences } = useApp();
  const { getAvailableProviders } = useAI();
  const [name, setName] = useState(preferences.name || '');
  const [pref, setPref] = useState(preferences.pref || 'auto');

  const availCount = getAvailableProviders().length;

  const handleSave = () => {
    setPreferences({ name: name.trim(), pref });
    onClose();
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 18 }}>{'\u2699'} Settings</h2>
      <p style={{ color: 'var(--t2)', fontSize: '.8rem', marginBottom: 14 }}>
        Customize your BrainDrop experience. All AI engines are ready to go — no setup needed!
      </p>

      {/* Active engines banner */}
      <div style={{
        padding: 12, background: 'rgba(57,255,20,.06)',
        border: '1px solid rgba(57,255,20,.15)', borderRadius: 10,
        marginBottom: 16, fontSize: '.78rem', color: 'var(--ng)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: '1.2rem' }}>{'\u2713'}</span>
        <span>{availCount} AI engine{availCount !== 1 ? 's' : ''} active — NVIDIA, Groq, Gemini, Claude</span>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: '.75rem', color: 'var(--t2)', marginBottom: 5, fontWeight: 500 }}>
          Your Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What should I call you?"
          style={{
            width: '100%', padding: '10px 14px', background: 'var(--bg)',
            border: '1px solid var(--bd)', borderRadius: 8,
            color: 'var(--t1)', fontFamily: "'Geist',sans-serif",
            fontSize: '.88rem', outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--np)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--bd)'; }}
        />
      </div>

      {/* Preferred AI */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: '.75rem', color: 'var(--t2)', marginBottom: 5, fontWeight: 500 }}>
          Preferred AI Engine
        </label>
        <select
          value={pref}
          onChange={(e) => setPref(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', background: 'var(--bg)',
            border: '1px solid var(--bd)', borderRadius: 8,
            color: 'var(--t1)', fontFamily: "'Geist',sans-serif",
            fontSize: '.88rem', outline: 'none',
          }}
        >
          {AI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div style={{ fontSize: '.7rem', color: 'var(--t3)', marginTop: 4 }}>
          Auto mode picks the best available engine. Switch manually if you prefer a specific AI.
        </div>
      </div>

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
          onClick={handleSave}
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#ff6b9d,#b44aff)', color: '#fff',
            fontFamily: "'Geist',sans-serif", fontSize: '.82rem',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Save &#x2728;
        </motion.button>
      </div>
    </div>
  );
}
