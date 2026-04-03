import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useXP } from '../../hooks/useXP.js';
import { useMemory } from '../../hooks/useMemory.js';
import { useRAG } from '../../hooks/useRAG.js';
import { useAI } from '../../hooks/useAI.js';
import { useCourseProgress } from '../../hooks/useCourseProgress.js';
import { useEventLog } from '../../hooks/useEventLog.js';
import { useCharacter } from '../../hooks/useCharacter.js';

import Header from './Header.jsx';
import XPBar from './XPBar.jsx';
import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';
import Footer from './Footer.jsx';
import ModeTabs from '../modes/ModeTabs.jsx';
import HeroView from '../chat/HeroView.jsx';
import ChatView from '../chat/ChatView.jsx';
import InputBar from '../chat/InputBar.jsx';
import ModalWrapper from '../modals/ModalWrapper.jsx';
import SettingsModal from '../modals/SettingsModal.jsx';
import KnowledgeBaseModal from '../modals/KnowledgeBaseModal.jsx';
import StatsModal from '../modals/StatsModal.jsx';
import ScoresModal from '../modals/ScoresModal.jsx';
import AnalyticsModal from '../modals/AnalyticsModal.jsx';
import CertificateOverlay from '../course/CertificateOverlay.jsx';

export default function AppShell() {
  const app = useApp();
  const { user } = useAuth();
  const xp = useXP();
  const memory = useMemory();
  const rag = useRAG();
  const ai = useAI();
  const course = useCourseProgress();
  const eventLog = useEventLog();
  const char = useCharacter();

  const {
    grade, subject, mode, messages, busy,
    activeModal, showCertificate,
    addMessage, setBusy, closeModal, hideCertificate,
    setMode, openModal, clearMessages,
  } = app;

  const [lastAIName, setLastAIName] = useState('');
  const chatRef = useRef(null);

  // Load PDFs on mount
  useEffect(() => {
    rag.loadAllPDFs(grade);
  }, [grade]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Handle sending a message (regular or classroom). */
  const handleSend = useCallback(async (text) => {
    if (!text.trim() || busy) return;

    // Handle /sim command
    if (text.trim().startsWith('/sim ')) {
      const simPrompt = text.trim().slice(5);
      addMessage({ role: 'user', text: simPrompt, ts: Date.now() });
      setBusy(true);
      const simText = `Generate an interactive HTML simulation for: ${simPrompt}. Wrap it in <magic-block title="${simPrompt}">...</magic-block> tags.`;
      const result = await ai.callAI(simText);
      if (result.reply) {
        addMessage({ role: 'assistant', text: result.reply, ai: result.usedAI, ts: Date.now() });
        setLastAIName(result.usedAI || '');
      } else {
        addMessage({ role: 'assistant', text: 'Sorry, I could not generate a simulation right now. Please try again.', ai: '', ts: Date.now() });
      }
      setBusy(false);
      return;
    }

    addMessage({ role: 'user', text, ts: Date.now() });
    setBusy(true);

    if (mode === 'classroom') {
      const result = await ai.callClassroom(text);
      if (result.teacherReply) {
        addMessage({ role: 'assistant', text: result.teacherReply, ai: result.teacherAI, agent: 'teacher', ts: Date.now() });
        setLastAIName(result.teacherAI || '');
      }
      // Add all classmate replies (up to 4)
      if (result.classmates) {
        for (const cm of result.classmates) {
          if (cm.reply) {
            addMessage({ role: 'assistant', text: cm.reply, ai: cm.ai, agent: cm.role, ts: Date.now() });
          }
        }
      }
      if (!result.teacherReply) {
        addMessage({ role: 'assistant', text: 'AI is temporarily unavailable. Please try again in a moment.', ai: '', ts: Date.now() });
      }
    } else {
      const result = await ai.callAI(text);
      if (result.reply) {
        addMessage({ role: 'assistant', text: result.reply, ai: result.usedAI, ts: Date.now() });
        setLastAIName(result.usedAI || '');
      } else {
        addMessage({ role: 'assistant', text: 'AI engines are busy right now. Please try again in a moment.', ai: '', ts: Date.now() });
      }
    }
    setBusy(false);
  }, [busy, mode, ai, addMessage, setBusy]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Generate simulation from an existing AI reply. */
  const handleGenerateSim = useCallback(async (aiText) => {
    if (busy) return;
    setBusy(true);
    const simPrompt = `Based on your previous explanation, create an interactive HTML simulation. The explanation was: "${aiText.substring(0, 600)}". Wrap the simulation in <magic-block title="Interactive Simulation">...</magic-block> tags.`;
    const result = await ai.callAI(simPrompt);
    if (result.reply) {
      addMessage({ role: 'assistant', text: result.reply, ai: result.usedAI, ts: Date.now() });
      setLastAIName(result.usedAI || '');
    }
    setBusy(false);
  }, [busy, ai, addMessage, setBusy]);

  const modalMap = {
    settings: <SettingsModal onClose={closeModal} />,
    kb: <KnowledgeBaseModal onClose={closeModal} />,
    stats: <StatsModal onClose={closeModal} />,
    scores: <ScoresModal onClose={closeModal} />,
    analytics: <AnalyticsModal onClose={closeModal} />,
  };

  return (
    <div style={{
      position: 'relative', zIndex: 1,
      display: 'flex', flexDirection: 'column', height: '100vh',
    }}>
      <div className="bgfx" />
      <div className="pgrid" />

      <Header />
      <XPBar lastAI={lastAIName} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Desktop sidebar — hidden on mobile via CSS */}
        <div className="sidebar-desktop">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ModeTabs />

          <div ref={chatRef} style={{
            flex: 1, overflowY: 'auto', padding: 20,
            display: 'flex', flexDirection: 'column', gap: 16,
            scrollBehavior: 'smooth', paddingBottom: 20,
          }} className="chat-scroll">
            {messages.length === 0 ? (
              <HeroView
                onTopicClick={(topic) => handleSend(topic)}
                course={course}
                ragStatus={rag.ragStatus}
                kbStatus={rag.kbStatus}
                chunkCount={rag.chunkCount}
              />
            ) : (
              <ChatView
                messages={messages}
                busy={busy}
                mode={mode}
                grade={grade}
                onGenerateSim={handleGenerateSim}
              />
            )}
          </div>

          <InputBar onSend={handleSend} busy={busy} />
        </main>
      </div>

      <Footer />
      <BottomNav />

      {/* Modals */}
      <AnimatePresence>
        {activeModal && modalMap[activeModal] && (
          <ModalWrapper onClose={closeModal} key="modal">
            {modalMap[activeModal]}
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* Certificate Overlay */}
      <AnimatePresence>
        {showCertificate && (
          <CertificateOverlay
            subject={showCertificate}
            userName={user?.name || 'Student'}
            onClose={hideCertificate}
          />
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        .sidebar-desktop { display: flex; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(180,74,255,.2); border-radius: 3px; }
        @media(max-width:768px) {
          .sidebar-desktop { display: none !important; }
          .btag-desktop { display: none; }
          main { padding-bottom: 58px; }
        }
      `}</style>
    </div>
  );
}
