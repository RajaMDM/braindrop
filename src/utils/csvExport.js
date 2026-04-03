/**
 * csvExport.js
 * Exports usage/activity logs as a downloadable CSV file.
 * Extracted from index.legacy.html exportStats().
 */

/**
 * Trigger a CSV download from an array of log objects.
 *
 * Each log entry is expected to have:
 *   { ts, user, email, type, subject?, mode?, ai?, grade? }
 *
 * @param {Array<Object>} logs - Array of log entries (from localStorage bd_logs)
 */
export function exportLogsAsCSV(logs) {
  const header = 'Timestamp,User,Email,Type,Subject,Mode,AI,Grade\n';
  const rows = logs
    .map(
      (l) =>
        `"${l.ts}","${l.user}","${l.email}","${l.type}","${l.subject || ''}","${l.mode || ''}","${l.ai || ''}","${l.grade || ''}"`
    )
    .join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `braindrop_stats_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}
