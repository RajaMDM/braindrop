import { useState, useCallback } from 'react';

/**
 * useLocalStorage — Generic hook for reading/writing localStorage.
 * Returns [value, setValue] just like useState, but syncs every change to
 * the specified localStorage key.
 *
 * @param {string} key       localStorage key
 * @param {*}      initial   Default value when nothing is stored yet
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn(`[useLocalStorage] Failed to set "${key}":`, err);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
