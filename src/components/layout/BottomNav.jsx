import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

const SUBJECTS = [
  { key: 'mathematics', icon: '\u2211', label: 'Maths' },
  { key: 'science', icon: '\u2697', label: 'Science' },
  { key: 'english', icon: '\u270E', label: 'English' },
  { key: 'social-science', icon: '\uD83C\uDF0F', label: 'SST' },
  { key: 'hindi', icon: '\u0905', label: 'Hindi' },
];

export default function BottomNav() {
  const { subject, setSubject } = useApp();

  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(18,18,31,.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--bd)',
      padding: '6px 2px', zIndex: 100,
      justifyContent: 'space-around',
    }} className="bottom-nav-mobile">
      {SUBJECTS.map((s) => {
        const active = subject === s.key;
        return (
          <motion.button
            key={s.key}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSubject(s.key)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, background: 'none', border: 'none',
              color: active ? 'var(--np)' : 'var(--t3)',
              fontSize: '.58rem', padding: '4px 6px', borderRadius: 8,
              cursor: 'pointer', fontFamily: "'Geist',sans-serif", fontWeight: 500,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
            {s.label}
          </motion.button>
        );
      })}
      {/* CSS to show only on mobile */}
      <style>{`
        @media(max-width:768px){
          .bottom-nav-mobile{display:flex!important}
        }
      `}</style>
    </nav>
  );
}
