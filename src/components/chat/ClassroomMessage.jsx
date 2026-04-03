import { motion } from 'framer-motion';
import { getClassroomAgents } from '../../data/classroomAgents.js';
import MarkdownRenderer from '../shared/MarkdownRenderer.jsx';

const ROLE_STYLES = {
  teacher: {
    bg: 'rgba(180,74,255,.06)',
    border: '1px solid rgba(180,74,255,.15)',
    avatarBg: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
    avatarShadow: '0 0 12px rgba(180,74,255,.3)',
    labelColor: '#b44aff',
  },
  classmate1: {
    bg: 'rgba(0,245,212,.04)',
    border: '1px solid rgba(0,245,212,.12)',
    avatarBg: 'linear-gradient(135deg,#4cc9f0,#00f5d4)',
    avatarShadow: '0 0 12px rgba(0,245,212,.25)',
    labelColor: '#00f5d4',
  },
  classmate2: {
    bg: 'rgba(255,109,0,.04)',
    border: '1px solid rgba(255,109,0,.12)',
    avatarBg: 'linear-gradient(135deg,#fee440,#ff6d00)',
    avatarShadow: '0 0 12px rgba(255,109,0,.25)',
    labelColor: '#ff6d00',
  },
};

export default function ClassroomMessage({ message, grade }) {
  const agents = getClassroomAgents(grade);
  const role = message.agent || 'teacher';
  const agent = agents[role];
  const styles = ROLE_STYLES[role] || ROLE_STYLES.teacher;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        display: 'flex', gap: 12, maxWidth: '82%',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', flexShrink: 0, fontWeight: 700,
        background: styles.avatarBg,
        boxShadow: styles.avatarShadow,
      }}>
        {agent?.emoji || '\u26A1'}
      </div>

      {/* Bubble */}
      <div style={{
        padding: '14px 18px', borderRadius: 14,
        fontSize: '.88rem', lineHeight: 1.7, wordBreak: 'break-word',
        background: styles.bg, border: styles.border,
      }}>
        <MarkdownRenderer text={message.text} />
        <div style={{
          fontSize: '.62rem', marginTop: 6,
          fontFamily: "'Space Mono',monospace", fontWeight: 600,
          color: styles.labelColor,
        }}>
          {agent?.name || role}
          <span style={{ color: 'var(--t3)', fontWeight: 400, marginLeft: 6 }}>
            {role === 'teacher' ? 'Teacher' : 'Classmate'}
          </span>
          {message.ai && (
            <span style={{ color: 'var(--t3)', fontWeight: 400, marginLeft: 6 }}>
              via {message.ai}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
