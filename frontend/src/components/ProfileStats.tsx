import React from 'react';
import type { UserProfile } from '../backend';

interface ProfileStatsProps {
  profile: UserProfile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    {
      label: 'Breathing Sessions',
      value: profile.totalBreathingSessions.toString(),
      emoji: '🌬️',
      color: '#60d4b0',
    },
    {
      label: 'Avg Stress Score',
      value: profile.avgWeeklyStressScore > 0 ? profile.avgWeeklyStressScore.toFixed(0) : '—',
      emoji: '📊',
      color: '#a78bfa',
    },
    {
      label: 'Mood Entries',
      value: profile.totalMoodEntries.toString(),
      emoji: '📔',
      color: '#7dd3fc',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border"
        >
          <span className="text-xl">{stat.emoji}</span>
          <span className="text-xl font-bold font-display" style={{ color: stat.color }}>
            {stat.value}
          </span>
          <span className="text-[10px] text-muted-foreground text-center leading-tight">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
