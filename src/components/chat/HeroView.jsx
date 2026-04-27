import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMemory } from '../../hooks/useMemory.js';
import { T } from '../../data/topics.js';
import { getClassroomAgents } from '../../data/classroomAgents.js';

const MODE_META = {
  explain:   { label: 'Explain',    hint: 'Break down any topic step by step.' },
  socratic:  { label: 'Socratic',   hint: 'I ask, you answer. Think deeper.' },
  quiz:      { label: 'Quiz',       hint: '5 MCQs with instant feedback.' },
  flashcard: { label: 'Flashcards', hint: 'Flip cards for rapid review.' },
  examprep:  { label: 'Exam Prep',  hint: 'Board-pattern questions and traps.' },
  tutor:     { label: 'AI Tutor',   hint: 'Adaptive tutoring that remembers you.' },
  classroom: { label: 'Classroom',  hint: 'Teacher + classmates, live.' },
};

const SUBJECT_LABEL = {
  mathematics: 'Mathematics',
  science: 'Science',
  english: 'English',
  'social-science': 'Social Science',
  hindi: 'Hindi',
};

const STARTERS = {
  explain:   (t) => `Explain "${t}" with a worked example`,
  socratic:  (t) => `Challenge my understanding of "${t}"`,
  quiz:      (t) => `Quiz me on "${t}"`,
  flashcard: (t) => `Make flashcards for "${t}"`,
  examprep:  (t) => `Give me board exam questions on "${t}"`,
  tutor:     (t) => `I want to master "${t}" — where do I start?`,
  classroom: (t) => `Let's discuss "${t}" in class`,
};

export default function HeroView({ onTopicClick }) {
  const { grade, subject, mode } = useApp();
  const { user } = useAuth();
  const { memory } = useMemory();

  const [showAllTopics, setShowAllTopics] = useState(false);

  const topics = (T[grade] && T[grade][subject]) || [];
  const meta = MODE_META[mode] || MODE_META.explain;
  const starterFn = STARTERS[mode] || STARTERS.explain;

  // Compact greeting
  const firstName = (user?.name || '').split(' ')[0] || 'there';

  // Last user message for "resume" card
  const lastUserMsg = memory?.history?.length > 0
    ? [...memory.history].reverse().find((m) => m.role === 'user')
    : null;

  // Starter prompts from first 3 topics
  const starters = topics.slice(0, 3).map((t) => ({ topic: t, prompt: starterFn(t) }));

  // Classroom setup state
  const [customNames, setCustomNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bd_classroom_names') || '{}'); }
    catch { return {}; }
  });
  const agents = mode === 'classroom' ? getClassroomAgents(grade, customNames) : null;

  function updateStudentName(role, name) {
    const updated = { ...customNames, [role]: name };
    setCustomNames(updated);
    localStorage.setItem('bd_classroom_names', JSON.stringify(updated));
  }

  const INITIAL_TOPIC_COUNT = 8;
  const visibleTopics = showAllTopics ? topics : topics.slice(0, INITIAL_TOPIC_COUNT);

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10 md:py-14">

      {/* Context strip — replaces the giant animated emoji */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-5">
        <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
          Grade {grade}
        </span>
        <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
          {SUBJECT_LABEL[subject] || subject}
        </span>
        <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
          {meta.label}
        </span>
      </div>

      {/* Welcome */}
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 mb-2 tracking-tight">
        Hi {firstName}. What are we learning today?
      </h1>
      <p className="text-sm md:text-base text-slate-400 mb-8 max-w-lg">
        {meta.hint}
      </p>

      {/* Resume card */}
      {lastUserMsg && (
        <button
          onClick={() => onTopicClick(lastUserMsg.text)}
          className="w-full text-left mb-6 group bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-indigo-400/40 rounded-xl px-4 py-3.5 transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                Resume
              </div>
              <div className="text-sm text-slate-200 truncate">
                {lastUserMsg.text}
              </div>
            </div>
            <span className="shrink-0 text-slate-500 group-hover:text-indigo-300 text-lg transition-colors">
              →
            </span>
          </div>
        </button>
      )}

      {/* Classroom agent setup */}
      {agents && (
        <div className="mb-8 space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Your classroom
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/40 mb-3">
              <div className="text-2xl">{agents.teacher.emoji}</div>
              <div>
                <div className="text-sm font-semibold" style={{ color: agents.teacher.color }}>
                  {agents.teacher.name}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Teacher</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['classmate1', 'classmate2', 'classmate3', 'classmate4'].map((role) => {
                const a = agents[role];
                if (!a) return null;
                const isEditable = Number(grade) !== 10 || role === 'classmate4';
                return (
                  <div key={role} className="flex items-center gap-2 px-2 py-2 bg-slate-900/40 rounded-lg border border-slate-700/30">
                    <span className="text-lg shrink-0">{a.emoji}</span>
                    {isEditable ? (
                      <input
                        value={customNames[role] || a.name}
                        onChange={(e) => updateStudentName(role, e.target.value)}
                        placeholder={a.name}
                        className="bg-transparent text-xs font-medium outline-none flex-1 min-w-0"
                        style={{ color: a.color }}
                      />
                    ) : (
                      <div className="text-xs font-medium truncate" style={{ color: a.color }}>
                        {a.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Starter prompts */}
      {starters.length > 0 && !agents && (
        <div className="mb-8 space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Try one of these
          </div>
          {starters.map(({ prompt }) => (
            <button
              key={prompt}
              onClick={() => onTopicClick(prompt)}
              className="w-full text-left bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 hover:border-slate-600 rounded-lg px-4 py-3 text-sm text-slate-300 hover:text-slate-100 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Topic chips */}
      {topics.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            All topics · {SUBJECT_LABEL[subject] || subject}
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleTopics.map((t) => (
              <button
                key={t}
                onClick={() => onTopicClick(t)}
                className="text-xs px-3 py-1.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 hover:text-slate-100 border border-slate-700/40 hover:border-slate-600 rounded-full transition-all"
              >
                {t}
              </button>
            ))}
          </div>
          {topics.length > INITIAL_TOPIC_COUNT && (
            <button
              onClick={() => setShowAllTopics((v) => !v)}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showAllTopics ? '— show fewer' : `+ show ${topics.length - INITIAL_TOPIC_COUNT} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
