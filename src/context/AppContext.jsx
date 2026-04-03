import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';

const AppContext = createContext(null);

const STORAGE_KEY = 'bd2';

/* ── Action types ── */
const SET_GRADE = 'SET_GRADE';
const SET_SUBJECT = 'SET_SUBJECT';
const SET_MODE = 'SET_MODE';
const ADD_MESSAGE = 'ADD_MESSAGE';
const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
const SET_BUSY = 'SET_BUSY';
const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const SHOW_CERTIFICATE = 'SHOW_CERTIFICATE';
const HIDE_CERTIFICATE = 'HIDE_CERTIFICATE';
const SET_ACTIVE_CHAPTER = 'SET_ACTIVE_CHAPTER';
const SET_PREFERENCES = 'SET_PREFERENCES';

/**
 * Build the initial state by merging defaults with whatever is stored in
 * localStorage('bd2').  This mirrors the legacy Z object hydration.
 */
function buildInitialState() {
  const defaults = {
    grade: 10,
    subject: 'mathematics',
    mode: 'explain',
    messages: [],
    busy: false,
    activeChapter: null,
    activeModal: null,
    showCertificate: null,
    preferences: {
      name: '',
      pref: 'auto',
    },
  };

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...defaults,
      preferences: {
        name: stored.n || defaults.preferences.name,
        pref: stored.pref || defaults.preferences.pref,
      },
    };
  } catch {
    return defaults;
  }
}

/* ── Reducer ── */
function appReducer(state, action) {
  switch (action.type) {
    case SET_GRADE:
      return {
        ...state,
        grade: action.payload,
        messages: [],
        activeChapter: null,
      };

    case SET_SUBJECT:
      return {
        ...state,
        subject: action.payload,
        messages: [],
        activeChapter: null,
      };

    case SET_MODE:
      return { ...state, mode: action.payload, messages: [] };

    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case CLEAR_MESSAGES:
      return { ...state, messages: [] };

    case SET_BUSY:
      return { ...state, busy: action.payload };

    case OPEN_MODAL:
      return { ...state, activeModal: action.payload };

    case CLOSE_MODAL:
      return { ...state, activeModal: null };

    case SHOW_CERTIFICATE:
      return { ...state, showCertificate: action.payload };

    case HIDE_CERTIFICATE:
      return { ...state, showCertificate: null };

    case SET_ACTIVE_CHAPTER:
      return { ...state, activeChapter: action.payload };

    case SET_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    default:
      return state;
  }
}

/**
 * AppProvider — Central application state using useReducer.
 *
 * The state shape mirrors the legacy Z object, restructured into a clean
 * reducer pattern.  Preferences (name, pref) are persisted to
 * localStorage('bd2') whenever they change.
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, buildInitialState);

  /* ── Persist preferences to localStorage('bd2') on change ── */
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const merged = {
        ...existing,
        n: state.preferences.name,
        pref: state.preferences.pref,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      /* best-effort */
    }
  }, [state.preferences]);

  /* ── Convenience dispatchers ── */
  const setGrade = useCallback(
    (grade) => dispatch({ type: SET_GRADE, payload: grade }),
    []
  );
  const setSubject = useCallback(
    (subject) => dispatch({ type: SET_SUBJECT, payload: subject }),
    []
  );
  const setMode = useCallback(
    (mode) => dispatch({ type: SET_MODE, payload: mode }),
    []
  );
  const addMessage = useCallback(
    (msg) => dispatch({ type: ADD_MESSAGE, payload: msg }),
    []
  );
  const clearMessages = useCallback(
    () => dispatch({ type: CLEAR_MESSAGES }),
    []
  );
  const setBusy = useCallback(
    (busy) => dispatch({ type: SET_BUSY, payload: busy }),
    []
  );
  const openModal = useCallback(
    (id) => dispatch({ type: OPEN_MODAL, payload: id }),
    []
  );
  const closeModal = useCallback(
    () => dispatch({ type: CLOSE_MODAL }),
    []
  );
  const triggerCertificate = useCallback(
    (subject) => dispatch({ type: SHOW_CERTIFICATE, payload: subject }),
    []
  );
  const hideCertificate = useCallback(
    () => dispatch({ type: HIDE_CERTIFICATE }),
    []
  );
  const setActiveChapter = useCallback(
    (chId) => dispatch({ type: SET_ACTIVE_CHAPTER, payload: chId }),
    []
  );
  const setPreferences = useCallback(
    (prefs) => dispatch({ type: SET_PREFERENCES, payload: prefs }),
    []
  );

  const value = {
    ...state,
    dispatch,
    setGrade,
    setSubject,
    setMode,
    addMessage,
    clearMessages,
    setBusy,
    openModal,
    closeModal,
    triggerCertificate,
    hideCertificate,
    setActiveChapter,
    setPreferences,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useApp — Convenience hook to consume the AppContext.
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
