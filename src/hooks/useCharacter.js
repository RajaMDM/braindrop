import { useMemo, useCallback } from 'react';
import { CHARACTERS } from '../data/characters.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * useCharacter — Reads the current character from AuthContext and exposes
 * a helper to change it.
 */
export function useCharacter() {
  const { user, setCharacter } = useAuth();

  /** The full character object (or null). */
  const character = useMemo(() => {
    if (!user?.character) return null;
    // user.character can be an id string or the full object
    if (typeof user.character === 'string') {
      return CHARACTERS.find((c) => c.id === user.character) || null;
    }
    return user.character;
  }, [user?.character]);

  /** Switch to a different character by id or object. */
  const selectCharacter = useCallback(
    (char) => {
      setCharacter(char);
    },
    [setCharacter]
  );

  return { character, selectCharacter, characters: CHARACTERS };
}
