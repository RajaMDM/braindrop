import { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { chunkText, tokenize, buildChunkIndex, ragSearch } from '../utils/tfidf.js';
import { loadPDF } from '../utils/pdfLoader.js';
import { BOOKS } from '../data/books.js';

/**
 * useRAG — Manages PDF loading, TF-IDF chunk indexing, and retrieval.
 *
 * Uses useRef for the ragIndex map so index-building doesn't trigger
 * re-renders.  The component only re-renders when status indicators change.
 */
export function useRAG() {
  const { grade, subject } = useApp();

  /** Status indicators (trigger re-renders so UI can reflect them). */
  const [kbStatus, setKbStatus] = useState('idle'); // idle | loading | ready | error
  const [ragStatus, setRagStatus] = useState('idle'); // idle | indexing | ready
  const [chunkCount, setChunkCount] = useState(0);

  /** Mutable refs that persist across renders without triggering them. */
  const ragIndexRef = useRef({}); // { 'grade_subject': { chunks, idf, total } }
  const pdfKBRef = useRef({}); // { 'grade_subject': rawText }

  /**
   * Load all PDFs for a grade, build chunk indices.
   * Called once on sign-in and whenever the grade changes.
   */
  const loadAllPDFs = useCallback(
    async (targetGrade) => {
      const g = targetGrade || grade;
      const books = BOOKS[g] || {};
      const entries = Object.entries(books);
      if (entries.length === 0) {
        setKbStatus('idle');
        return;
      }

      setKbStatus('loading');
      let loaded = 0;

      for (const [sub, path] of entries) {
        try {
          const text = await loadPDF(path);
          if (text && text.trim().length > 100) {
            const key = `${g}_${sub}`;
            pdfKBRef.current[key] = text;
            loaded++;

            // Build chunk index immediately for this subject
            if (!ragIndexRef.current[key]) {
              const idx = buildChunkIndex(text, 500, 100);
              if (idx) {
                ragIndexRef.current[key] = idx;
              }
            }
          }
        } catch (err) {
          console.warn(`[RAG] Failed to load PDF for ${sub}:`, err.message);
        }
      }

      setKbStatus(loaded > 0 ? 'ready' : 'error');

      // Update chunk count for current subject
      const currentKey = `${g}_${subject}`;
      if (ragIndexRef.current[currentKey]) {
        setRagStatus('ready');
        setChunkCount(ragIndexRef.current[currentKey].total);
      }
    },
    [grade, subject]
  );

  /**
   * Ensure the chunk index exists for the current subject.
   * Called lazily before a search.
   */
  const ensureIndex = useCallback(() => {
    const key = `${grade}_${subject}`;
    if (ragIndexRef.current[key]) {
      setRagStatus('ready');
      setChunkCount(ragIndexRef.current[key].total);
      return true;
    }

    const text = pdfKBRef.current[key];
    if (!text) return false;

    setRagStatus('indexing');
    const idx = buildChunkIndex(text, 500, 100);
    if (idx) {
      ragIndexRef.current[key] = idx;
      setRagStatus('ready');
      setChunkCount(idx.total);
      return true;
    }
    return false;
  }, [grade, subject]);

  /**
   * Search the current subject's index using TF-IDF ranking.
   * Returns an array of { idx, score, text } or null.
   */
  const ragSearchCurrent = useCallback(
    (query, topK = 5) => {
      const key = `${grade}_${subject}`;
      const idx = ragIndexRef.current[key];
      if (!idx || idx.total === 0) return null;
      return ragSearch(idx, query, topK);
    },
    [grade, subject]
  );

  /**
   * getKBForCurrentSubject — Returns RAG results or fallback text.
   * Mirrors legacy getKBForCurrentSubject() exactly.
   */
  const getKBForCurrentSubject = useCallback(
    (query) => {
      const key = `${grade}_${subject}`;

      // Build index if not ready
      ensureIndex();

      // RAG: retrieve relevant chunks
      if (query && ragIndexRef.current[key]) {
        const results = ragSearchCurrent(query, 5);
        if (results) {
          const ragText = results
            .map(
              (r, i) =>
                `[Chunk ${i + 1}, relevance: ${r.score.toFixed(1)}]\n${r.text}`
            )
            .join('\n\n');
          let c =
            '[RAG-RETRIEVED \u2014 Top ' +
            results.length +
            ' relevant sections from NCERT]\n\n' +
            ragText;
          return c;
        }
      }

      // Fallback: return truncated full text
      const p = pdfKBRef.current[key] || '';
      if (p) return p.substring(0, 30000);
      return '';
    },
    [grade, subject, ensureIndex, ragSearchCurrent]
  );

  return {
    loadAllPDFs,
    ragSearch: ragSearchCurrent,
    getKBForCurrentSubject,
    kbStatus,
    ragStatus,
    chunkCount,
  };
}
