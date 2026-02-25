import type { StressReading } from '../backend';
import { StressLevel } from '../backend';

export interface DailyStressData {
  day: string;
  date: string;
  avgScore: number;
  level: StressLevel;
  count: number;
}

function stressLevelToScore(level: StressLevel): number {
  if (level === StressLevel.low) return 25;
  if (level === StressLevel.medium) return 55;
  return 85;
}

export function computeDailyAverages(readings: StressReading[]): DailyStressData[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const result: DailyStressData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];

    const dayReadings = readings.filter(r => {
      const d = new Date(Number(r.timestamp) / 1_000_000);
      return d.toISOString().split('T')[0] === dateStr;
    });

    if (dayReadings.length === 0) {
      result.push({ day: dayName, date: dateStr, avgScore: 0, level: StressLevel.low, count: 0 });
      continue;
    }

    const avgScore = dayReadings.reduce((sum, r) => sum + stressLevelToScore(r.stressLevel), 0) / dayReadings.length;
    let level: StressLevel;
    if (avgScore < 40) level = StressLevel.low;
    else if (avgScore < 65) level = StressLevel.medium;
    else level = StressLevel.high;

    result.push({ day: dayName, date: dateStr, avgScore: Math.round(avgScore), level, count: dayReadings.length });
  }

  return result;
}

export function computeImprovementMessage(data: DailyStressData[]): string {
  const recent = data.slice(3);
  const older = data.slice(0, 3);

  const recentAvg = recent.filter(d => d.count > 0).reduce((s, d) => s + d.avgScore, 0) / (recent.filter(d => d.count > 0).length || 1);
  const olderAvg = older.filter(d => d.count > 0).reduce((s, d) => s + d.avgScore, 0) / (older.filter(d => d.count > 0).length || 1);

  if (olderAvg === 0 && recentAvg === 0) return 'Start tracking to see your progress!';
  if (olderAvg === 0) return 'Great start! Keep tracking your stress levels.';

  const diff = Math.round(((olderAvg - recentAvg) / olderAvg) * 100);
  if (diff > 5) return `You were ${diff}% less stressed recently. Keep it up! 🌟`;
  if (diff < -5) return `Stress increased by ${Math.abs(diff)}% recently. Try some breathing exercises. 💙`;
  return 'Your stress levels are stable. Consistency is key! ✨';
}
