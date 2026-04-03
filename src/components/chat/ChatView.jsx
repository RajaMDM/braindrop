import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble.jsx';
import ClassroomMessage from './ClassroomMessage.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function ChatView({ messages, busy, mode, grade, onGenerateSim }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, busy]);

  return (
    <>
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => {
          if (msg.agent && mode === 'classroom') {
            return (
              <ClassroomMessage
                key={`${i}-${msg.ts}`}
                message={msg}
                grade={grade}
              />
            );
          }
          return (
            <MessageBubble
              key={`${i}-${msg.ts}`}
              message={msg}
              onGenerateSim={onGenerateSim}
            />
          );
        })}
      </AnimatePresence>
      {busy && <TypingIndicator mode={mode} grade={grade} />}
      <div ref={bottomRef} />
    </>
  );
}
