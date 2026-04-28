import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '../../hooks/useXP.js';
import { useMemory } from '../../hooks/useMemory.js';
import { useApp } from '../../context/AppContext.jsx';
import QuizScore from './QuizScore.jsx';

/**
 * QuizCard — Renders a quiz data block with MCQ questions.
 * data shape: { questions: [{ q, options: [str], correct: number, explanation?, difficulty? }] }
 */
export default function QuizCard({ data }) {
  const { addXP } = useXP();
  const { memory, saveMemory, loadMemory } = useMemory();
  const { subject } = useApp();
  const [answered, setAnswered] = useState({});
  const [showScore, setShowScore] = useState(false);

  // Accept both array and {questions:[...]} shapes
  const questions = Array.isArray(data) ? data : (data?.questions || data?.items || []);
  if (!questions || questions.length === 0) return null;

  const totalAnswered = Object.keys(answered).length;
  const allDone = totalAnswered === questions.length;

  const handleAnswer = (qIdx, optIdx) => {
    if (answered[qIdx] !== undefined) return;
    const q = questions[qIdx];
    // Accept: answer, correct, correctAnswer — all normalized to a number
    const correctIdx = q.answer ?? q.correct ?? q.correctAnswer ?? 0;
    const isCorrect = optIdx === correctIdx;

    setAnswered((prev) => ({ ...prev, [qIdx]: { selected: optIdx, correct: isCorrect } }));

    if (isCorrect) addXP(15);

    // Check if all done
    const newCount = totalAnswered + 1;
    if (newCount === questions.length) {
      // Record quiz result in memory
      const correctCount = Object.values({ ...answered, [qIdx]: { correct: isCorrect } }).filter((a) => a.correct).length;
      const mem = loadMemory();
      if (!mem.profile.quizResults) mem.profile.quizResults = [];
      mem.profile.quizResults.push({
        date: new Date().toISOString().split('T')[0],
        subject,
        total: questions.length,
        correct: correctCount,
        accuracy: Math.round((correctCount / questions.length) * 100),
        topic: data.topic || '',
      });
      saveMemory(mem);

      setTimeout(() => setShowScore(true), 600);
    }
  };

  if (showScore) {
    const correctCount = Object.values(answered).filter((a) => a.correct).length;
    return (
      <QuizScore
        correct={correctCount}
        total={questions.length}
        xpEarned={correctCount * 15}
      />
    );
  }

  return (
    <div>
      {questions.map((q, qIdx) => {
        const answer = answered[qIdx];
        const diff = q.difficulty || 'medium';
        const diffColor = diff === 'easy' ? 'var(--ng)' : diff === 'hard' ? 'var(--nr)' : 'var(--ny)';
        const diffBg = diff === 'easy' ? 'rgba(57,255,20,.1)' : diff === 'hard' ? 'rgba(255,23,68,.1)' : 'rgba(254,228,64,.1)';

        return (
          <div key={qIdx} style={{
            background: 'var(--bg3)', border: '1px solid var(--bd)',
            borderRadius: 12, padding: 16, margin: '10px 0',
          }}>
            {/* Question header */}
            <div style={{
              fontSize: '.65rem', fontFamily: "'Geist Mono',monospace",
              color: 'var(--np)', textTransform: 'uppercase', letterSpacing: 1,
              marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Question {qIdx + 1} of {questions.length}
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: '.6rem',
                background: diffBg, color: diffColor,
              }}>{diff}</span>
            </div>

            {/* Question text */}
            <div style={{ fontSize: '.92rem', marginBottom: 12, lineHeight: 1.6 }}>
              {q.q}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(q.options || []).map((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isDone = answer !== undefined;
                const isSelected = answer?.selected === optIdx;
                const isCorrectOpt = optIdx === (q.answer ?? q.correct ?? q.correctAnswer ?? 0);

                let borderColor = 'var(--bd)';
                let bg = 'var(--bg)';
                let color = 'var(--t2)';
                let opacity = 1;

                if (isDone) {
                  if (isCorrectOpt) {
                    borderColor = 'var(--ng)';
                    bg = 'rgba(57,255,20,.08)';
                    color = 'var(--ng)';
                  } else if (isSelected && !answer.correct) {
                    borderColor = 'var(--nr)';
                    bg = 'rgba(255,23,68,.08)';
                    color = 'var(--nr)';
                  } else {
                    opacity = 0.7;
                  }
                }

                return (
                  <motion.button
                    key={optIdx}
                    whileHover={isDone ? {} : { borderColor: 'var(--np)', color: 'var(--t1)', background: 'rgba(180,74,255,.04)' }}
                    whileTap={isDone ? {} : { scale: 0.98 }}
                    onClick={() => handleAnswer(qIdx, optIdx)}
                    disabled={isDone}
                    style={{
                      padding: '10px 14px', border: `1px solid ${borderColor}`,
                      borderRadius: 8, background: bg, color,
                      fontFamily: "'Geist',sans-serif", fontSize: '.84rem',
                      cursor: isDone ? 'default' : 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 8,
                      opacity, transition: 'all .2s',
                    }}
                  >
                    <span style={{
                      fontFamily: "'Geist Mono',monospace", fontWeight: 700,
                      fontSize: '.75rem', opacity: 0.6,
                    }}>{letter}.</span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answer !== undefined && q.explanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    marginTop: 10, padding: '10px 12px', borderRadius: 8,
                    background: 'rgba(180,74,255,.04)',
                    borderLeft: '3px solid var(--np)',
                    fontSize: '.8rem', color: 'var(--t2)',
                  }}>
                    {q.explanation}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
