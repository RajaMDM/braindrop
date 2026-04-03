import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CONFIG } from '../data/config.js';

const AuthContext = createContext(null);

const USER_KEY = 'bd_user';
const EMAIL_KEY = 'userEmail';

/**
 * AuthProvider — Manages user authentication state.
 *
 * State shape:
 *   user: null | { email, name, picture, method, character }
 *
 * On mount, checks localStorage('bd_user') for a persisted session.
 * Google OAuth decodes the JWT credential to extract email/name/picture.
 * Guest login stores name + email entered by the student.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /* ── Hydrate from localStorage on mount ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        if (parsed.email) localStorage.setItem(EMAIL_KEY, parsed.email);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  /* ── Persist helper ── */
  const persist = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      if (userData.email) localStorage.setItem(EMAIL_KEY, userData.email);
    }
  }, []);

  /* ── Google Sign-In ── */
  const loginWithGoogle = useCallback(
    (credential) => {
      try {
        // Decode JWT payload (base64url)
        const payload = JSON.parse(atob(credential.split('.')[1]));
        const email = payload.email;
        const name =
          payload.name || payload.given_name || email.split('@')[0];
        const picture = payload.picture || '';

        if (
          CONFIG.ALLOWED_EMAILS.length > 0 &&
          !CONFIG.ALLOWED_EMAILS.includes(email)
        ) {
          throw new Error(`Access denied for ${email}.`);
        }

        const userData = { email, name, picture, method: 'google', character: null };
        persist(userData);
        return userData;
      } catch (err) {
        console.error('[Auth] Google login failed:', err.message);
        throw err;
      }
    },
    [persist]
  );

  /* ── Guest / Bypass Login ── */
  const loginAsGuest = useCallback(
    (name, email) => {
      if (!name || !email || !email.includes('@')) {
        throw new Error('Name and valid email are required.');
      }
      const userData = {
        email: email.toLowerCase(),
        name,
        picture: '',
        method: 'bypass',
        character: null,
      };
      persist(userData);
      return userData;
    },
    [persist]
  );

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    // Disable Google auto-select if the library is loaded
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
  }, []);

  /* ── Set Character ── */
  const setCharacter = useCallback(
    (character) => {
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, character };
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const value = {
    user,
    loginWithGoogle,
    loginAsGuest,
    logout,
    setCharacter,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — Convenience hook to consume the AuthContext.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
