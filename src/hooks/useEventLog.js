import { useCallback } from 'react';

const LOG_KEY = 'bd_logs';
const MAX_ENTRIES = 500;

/**
 * useEventLog — Reads/writes the bd_logs array in localStorage.
 * Mirrors the legacy logEvent / getLogs / exportStats functions.
 */
export function useEventLog() {
  /** Retrieve all stored log entries. */
  const getLogs = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    } catch {
      return [];
    }
  }, []);

  /**
   * Append a log entry.
   * @param {string} type  e.g. 'chat', 'login'
   * @param {object} data  Extra fields merged into the entry
   */
  const logEvent = useCallback((type, data = {}) => {
    try {
      const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      logs.push({
        ts: new Date().toISOString(),
        type,
        ...data,
      });
      if (logs.length > MAX_ENTRIES) logs.splice(0, logs.length - MAX_ENTRIES);
      localStorage.setItem(LOG_KEY, JSON.stringify(logs));
    } catch {
      /* swallow — logging is best-effort */
    }
  }, []);

  /** Export all logs as a downloadable CSV file. */
  const exportCSV = useCallback(() => {
    const logs = getLogs();
    const header = 'Timestamp,User,Email,Type,Subject,Mode,AI,Grade\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.ts}","${l.user || ''}","${l.email || ''}","${l.type}","${l.subject || ''}","${l.mode || ''}","${l.ai || ''}","${l.grade || ''}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `braindrop_stats_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }, [getLogs]);

  return { logEvent, getLogs, exportCSV };
}
