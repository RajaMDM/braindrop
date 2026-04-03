import { useState } from 'react';

/**
 * MagicBlock — Interactive HTML simulation in a sandboxed iframe.
 *
 * Shows a compact preview in chat. Click "Open Full Screen" to launch
 * a modal overlay that uses all available screen space — works great
 * on both desktop and mobile.
 */
export default function MagicBlock({ title, html }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      {/* Inline preview in chat */}
      <div style={{
        margin: '12px 0', border: '1px solid rgba(180,74,255,.25)',
        borderRadius: 14, overflow: 'hidden', background: 'var(--bg)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px', background: 'rgba(180,74,255,.08)',
          borderBottom: '1px solid rgba(180,74,255,.15)',
        }}>
          <span style={{
            fontSize: '.65rem', fontFamily: "'Space Mono',monospace",
            fontWeight: 700, color: 'var(--np)', display: 'flex',
            alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: 1.5,
          }}>
            ⚡ Interactive{title ? ` — ${title}` : ''}
          </span>
          <button
            onClick={() => setFullscreen(true)}
            style={{
              background: 'linear-gradient(135deg,#ff6b9d,#b44aff)', border: 'none',
              borderRadius: 6, color: '#fff', fontSize: '.65rem', padding: '5px 12px',
              cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontWeight: 600,
            }}
          >
            ⛶ Open Full Screen
          </button>
        </div>

        {/* Compact inline preview */}
        <div style={{ height: 280, overflow: 'hidden' }}>
          <iframe
            sandbox="allow-scripts"
            srcDoc={html}
            style={{ width: '100%', height: '100%', border: 'none', background: 'var(--bg)', display: 'block' }}
            title={title || 'Interactive Simulation'}
          />
        </div>
      </div>

      {/* Full-screen modal overlay */}
      {fullscreen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Modal header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px', background: 'rgba(18,18,31,.95)',
            borderBottom: '1px solid rgba(180,74,255,.2)',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: '.8rem', fontFamily: "'Space Mono',monospace",
              fontWeight: 700, color: 'var(--np)', display: 'flex',
              alignItems: 'center', gap: 8,
            }}>
              ⚡ {title || 'Interactive Simulation'}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              style={{
                background: 'var(--bg3)', border: '1px solid var(--bd)',
                borderRadius: 8, color: 'var(--t2)', fontSize: '.82rem',
                padding: '8px 18px', cursor: 'pointer', fontFamily: 'Fredoka,sans-serif',
                fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Full-screen iframe — takes ALL remaining space */}
          <iframe
            sandbox="allow-scripts"
            srcDoc={html}
            style={{
              flex: 1, width: '100%', border: 'none',
              background: '#0b0b14', display: 'block',
            }}
            title={title || 'Interactive Simulation'}
          />
        </div>
      )}
    </>
  );
}
