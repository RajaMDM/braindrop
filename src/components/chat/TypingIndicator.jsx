import { motion } from 'framer-motion';
import { getClassroomAgents } from '../../data/classroomAgents.js';

export default function TypingIndicator({ mode, grade }) {
  const isClassroom = mode === 'classroom';
  const agents = isClassroom ? getClassroomAgents(grade) : null;

  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center',
      ...(isClassroom ? { padding: '6px 0', fontSize: '.75rem', color: 'var(--t3)' } : {}),
    }}>
      {isClassroom && agents && (
        <span style={{ fontWeight: 600 }}>
          {agents.teacher.emoji} {agents.teacher.name} is typing...
        </span>
      )}
      <div style={{ display: 'flex', gap: 5, padding: '14px 18px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.4,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: i * 0.16,
            }}
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--np)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
