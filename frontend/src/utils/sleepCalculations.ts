export function computeSleepDuration(bedtimeStr: string, wakeTimeStr: string): number {
  const [bh, bm] = bedtimeStr.split(':').map(Number);
  const [wh, wm] = wakeTimeStr.split(':').map(Number);

  let bedMinutes = bh * 60 + bm;
  let wakeMinutes = wh * 60 + wm;

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return wakeMinutes - bedMinutes;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function timeStringToTimestamp(timeStr: string): bigint {
  const today = new Date();
  const [h, m] = timeStr.split(':').map(Number);
  today.setHours(h, m, 0, 0);
  return BigInt(today.getTime()) * BigInt(1_000_000);
}
