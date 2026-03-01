import type { UserDataView, UserProfile } from '../backend';

// ─── JSON Export ──────────────────────────────────────────────────────────────

export function downloadUserData(data: UserDataView, userName: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `tranquil-export-${timestamp}.json`;

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: userName,
    ...data,
  };

  const blob = new Blob([JSON.stringify(exportData, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2)], {
    type: 'application/json',
  });

  triggerDownload(blob, filename);
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportAsCSV(data: UserDataView, _filename?: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `tranquil-export-${timestamp}.csv`;

  const headers = ['date', 'stressScore', 'stressLevel', 'heartRate', 'skinTemp', 'motion'];

  const rows = data.stressReadings.map(r => {
    const date = new Date(Number(r.timestamp) / 1_000_000).toISOString();
    const stressScore = stressLevelToScore(r.stressLevel as string);
    return [
      date,
      stressScore,
      r.stressLevel,
      r.heartRate.toString(),
      r.skinTemp.toFixed(1),
      r.motion.toString(),
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

// ─── PDF / HTML Report Export ─────────────────────────────────────────────────

export function exportAsPDF(data: UserDataView, profile: UserProfile, _filename?: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `tranquil-export-${timestamp}.html`;

  const totalSessions = data.breathingSessions.length;
  const avgStress = data.stressReadings.length > 0
    ? (data.stressReadings.reduce((sum, r) => sum + stressLevelToScore(r.stressLevel as string), 0) / data.stressReadings.length).toFixed(1)
    : 'N/A';

  const last7 = [...data.stressReadings]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 7);

  const tableRows = last7.map(r => {
    const date = new Date(Number(r.timestamp) / 1_000_000).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    return `
      <tr>
        <td>${date}</td>
        <td>${stressLevelToScore(r.stressLevel as string)}</td>
        <td style="text-transform:capitalize">${r.stressLevel}</td>
        <td>${r.heartRate} bpm</td>
        <td>${r.skinTemp.toFixed(1)}°C</td>
        <td>${r.motion}</td>
      </tr>`;
  }).join('');

  const moodSummary = data.moodEntries.slice(-5).map(m => {
    const date = new Date(Number(m.timestamp) / 1_000_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `<li>${date}: <strong>${m.mood}</strong>${m.note ? ` — ${m.note}` : ''}</li>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>TRANQUIL Data Report — ${profile.name}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1a1a2e; background: #f8f9ff; }
    h1 { color: #6b4fa0; font-size: 2rem; margin-bottom: 4px; }
    .subtitle { color: #888; font-size: 0.9rem; margin-bottom: 32px; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); text-align: center; }
    .stat-value { font-size: 2rem; font-weight: 700; color: #6b4fa0; }
    .stat-label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 32px; }
    th { background: #6b4fa0; color: white; padding: 12px 16px; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 10px 16px; border-bottom: 1px solid #f0f0f8; font-size: 0.9rem; }
    tr:last-child td { border-bottom: none; }
    h2 { color: #6b4fa0; font-size: 1.2rem; margin-top: 32px; margin-bottom: 12px; }
    ul { background: white; border-radius: 12px; padding: 20px 20px 20px 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    li { margin-bottom: 8px; font-size: 0.9rem; }
    .footer { text-align: center; color: #aaa; font-size: 0.75rem; margin-top: 40px; }
  </style>
</head>
<body>
  <h1>🧘 TRANQUIL Wellness Report</h1>
  <p class="subtitle">Generated for <strong>${profile.name}</strong> on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${data.stressReadings.length}</div>
      <div class="stat-label">Stress Readings</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${avgStress}</div>
      <div class="stat-label">Avg Stress Score</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalSessions}</div>
      <div class="stat-label">Breathing Sessions</div>
    </div>
  </div>

  <h2>📊 Recent Stress Readings (Last 7)</h2>
  <table>
    <thead>
      <tr>
        <th>Date & Time</th>
        <th>Score</th>
        <th>Level</th>
        <th>Heart Rate</th>
        <th>Skin Temp</th>
        <th>Motion</th>
      </tr>
    </thead>
    <tbody>${tableRows || '<tr><td colspan="6" style="text-align:center;color:#aaa">No readings yet</td></tr>'}</tbody>
  </table>

  ${moodSummary ? `<h2>😊 Recent Mood Entries</h2><ul>${moodSummary}</ul>` : ''}

  <div class="footer">
    <p>TRANQUIL — Your Mental Wellness Companion | Data exported ${new Date().toISOString()}</p>
    <p>This report is for personal use only. Keep it private.</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  triggerDownload(blob, filename);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stressLevelToScore(level: string): number {
  if (level === 'low') return 25;
  if (level === 'medium') return 55;
  if (level === 'high') return 85;
  return 50;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
