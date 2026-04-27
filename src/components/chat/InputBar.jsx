import { useState, useRef, useCallback } from 'react';

export default function InputBar({ onSend, busy }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    if (!text.trim() || busy) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, busy, onSend]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback((e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, []);

  const disabled = busy || !text.trim();

  return (
    <div className="w-full bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-6 pb-4 md:pb-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-slate-800/70 border border-slate-700 focus-within:border-indigo-400/60 rounded-2xl p-2 shadow-lg shadow-black/30 transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask a question, request a quiz, or paste a problem…"
            rows={1}
            className="flex-1 bg-transparent text-slate-100 text-[15px] leading-6 px-3 py-2.5 outline-none resize-none min-h-[44px] max-h-[200px] placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={disabled}
            aria-label="Send"
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all
              ${disabled
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-500/30 active:scale-95'}`}
          >
            {busy ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            )}
          </button>
        </div>
        <div className="text-[11px] text-slate-500 mt-2 text-center hidden sm:block">
          Press <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">Shift + Enter</kbd> for newline
        </div>
      </div>
    </div>
  );
}
