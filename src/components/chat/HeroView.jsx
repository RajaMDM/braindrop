import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCharacter } from '../../hooks/useCharacter.js';
import { useMemory } from '../../hooks/useMemory.js';
import { T } from '../../data/topics.js';
import { COURSES } from '../../data/courses.js';
import { getClassroomAgents } from '../../data/classroomAgents.js';
import TopicChip from '../shared/TopicChip.jsx';
import CourseView from '../course/CourseView.jsx';

const MODE_INFO = {
  explain: { icon: '\uD83D\uDCD6', title: 'Explain Mode', sub: 'Ask anything — I\'ll break it down step by step with examples and visuals.' },
  socratic: { icon: '\uD83E\uDDE0', title: 'Socratic Mode', sub: 'I\'ll guide you with questions instead of answers. Think deeper!' },
  quiz: { icon: '\uD83C\uDFAE', title: 'Quiz Mode', sub: 'Test your knowledge with MCQs, get instant feedback and explanations.' },
  flashcard: { icon: '\uD83C\uDCCF', title: 'Flashcards', sub: 'Study with flip cards. Front = question, back = answer.' },
  examprep: { icon: '\uD83C\uDFAF', title: 'Exam Prep', sub: 'Focused preparation with exam-pattern questions and mark breakdowns.' },
  tutor: { icon: '\uD83E\uDD16', title: 'AI Tutor', sub: 'Your personal tutor — adaptive learning that remembers your progress.' },
  classroom: { icon: '\uD83C\uDFEB', title: 'Classroom', sub: 'Learn with a virtual teacher and two classmates — just like school!' },
};

export default function HeroView({ onTopicClick, course, ragStatus, kbStatus, chunkCount }) {
  const { grade, subject, mode } = useApp();
  const { user } = useAuth();
  const { character } = useCharacter();
  const { memory } = useMemory();

  const info = MODE_INFO[mode] || MODE_INFO.explain;
  const topics = (T[grade] && T[grade][subject]) || [];
  const courseData = COURSES[grade]?.[subject] || null;
  const showCourse = false; // TODO: re-enable after fixing render loop in useCourseProgress
  // Classroom: load custom names from localStorage
  const [customNames, setCustomNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bd_classroom_names') || '{}'); } catch { return {}; }
  });
  const agents = mode === 'classroom' ? getClassroomAgents(grade, customNames) : null;

  // Save custom names when changed
  function updateStudentName(role, name) {
    const updated = { ...customNames, [role]: name };
    setCustomNames(updated);
    localStorage.setItem('bd_classroom_names', JSON.stringify(updated));
  }

  const memCount = memory?.history?.length || 0;

  return (
    <div style={{
      maxWidth: 640, margin: 'auto', textAlign: 'center',
      padding: '32px 20px',
    }}>
      <motion.div
        animate={{ y: [0, -8, 0, -4, 0] }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
        style={{
          fontSize: '4rem', marginBottom: 16,
          filter: 'drop-shadow(0 0 20px rgba(180,74,255,.4))',
        }}
      >
        {info.icon}
      </motion.div>

      <div style={{
        fontSize: '1.6rem', fontWeight: 700, marginBottom: 8,
        background: 'linear-gradient(135deg,#ff6b9d,#b44aff)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        {info.title}
      </div>

      <div style={{
        color: 'var(--t2)', fontSize: '.92rem', lineHeight: 1.6,
        marginBottom: 28, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
      }}>
        {info.sub}
      </div>

      {/* Classroom: Teacher + 4 students with editable names */}
      {agents && (
        <div style={{ marginBottom: 24 }}>
          {/* Teacher card */}
          <div style={{
            background: 'rgba(180,74,255,.06)', border: '1px solid rgba(180,74,255,.2)',
            borderRadius: 14, padding: '14px 20px', textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 4 }}>{agents.teacher.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: agents.teacher.color }}>{agents.teacher.name}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--t3)', marginTop: 2 }}>Your Teacher</div>
          </div>

          {/* Student cards — names editable */}
          <div style={{ fontSize: '.72rem', color: 'var(--t3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Your Classmates — click names to customize
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {['classmate1', 'classmate2', 'classmate3', 'classmate4'].map((role) => {
              const a = agents[role];
              if (!a) return null;
              const archetypeLabels = { shy: '🤫 The Quiet One', outgoing: '🎉 The Outgoing One', studious: '📖 The Topper', wildcard: '🎭 The Wildcard' };
              return (
                <div
                  key={role}
                  style={{
                    background: 'var(--bg3)', border: `1px solid ${a.color}22`,
                    borderRadius: 12, padding: '12px', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{a.emoji}</div>
                  <input
                    value={customNames[role] || a.name}
                    onChange={(e) => updateStudentName(role, e.target.value)}
                    placeholder={a.name}
                    style={{
                      background: 'var(--bg)', border: '1px solid var(--bd)', borderRadius: 6,
                      color: a.color, fontFamily: 'Fredoka,sans-serif', fontSize: '.82rem',
                      fontWeight: 600, textAlign: 'center', padding: '4px 8px', width: '100%',
                      outline: 'none', marginBottom: 4,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = a.color; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--bd)'; }}
                  />
                  <div style={{ fontSize: '.6rem', color: 'var(--t3)' }}>{archetypeLabels[a.archetype] || 'Classmate'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Course view or topic chips */}
      {showCourse ? (
        <CourseView />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {topics.map((t, i) => (
            <TopicChip key={t} label={t} onClick={onTopicClick} delay={i * 0.04} />
          ))}
        </div>
      )}

      {/* Status notes */}
      {kbStatus === 'ready' && (
        <div style={{
          marginTop: 18, fontSize: '.75rem', color: 'var(--t3)',
          padding: '8px 16px', background: 'var(--bg3)', borderRadius: 10,
          display: 'inline-block', border: '1px solid var(--bd)',
        }}>
          {ragStatus === 'ready'
            ? `\uD83D\uDCDA RAG Active — ${chunkCount} chunks indexed for smart retrieval`
            : '\uD83D\uDCDA NCERT PDFs loaded — knowledge base ready'}
        </div>
      )}

      {memCount > 0 && (
        <div style={{
          marginTop: 8, fontSize: '.7rem', color: 'var(--nb)',
          padding: '5px 12px', background: 'rgba(76,201,240,.06)',
          borderRadius: 8, display: 'inline-block',
          border: '1px solid rgba(76,201,240,.15)',
        }}>
          {'\uD83E\uDDE0'} Memory active — {memCount} entries from past sessions
        </div>
      )}
    </div>
  );
}
