import React from 'react';
import type { TipCard as TipCardType } from '../backend';

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string }> = {
  wellness: { emoji: '💧', color: '#7dd3fc' },
  break: { emoji: '☕', color: '#a78bfa' },
  breathing: { emoji: '🌬️', color: '#60d4b0' },
  movement: { emoji: '🚶', color: '#4ade80' },
  nutrition: { emoji: '🥗', color: '#86efac' },
  mindfulness: { emoji: '🧘', color: '#c4b5fd' },
};

interface TipCardProps {
  tip: TipCardType;
  index: number;
}

export function TipCard({ tip, index }: TipCardProps) {
  const config = CATEGORY_CONFIG[tip.category] ?? { emoji: '✨', color: '#a78bfa' };

  return (
    <div
      className="animate-fade-in-up p-4 rounded-2xl border bg-card flex gap-3 items-start"
      style={{ animationDelay: `${index * 0.1}s`, borderColor: `${config.color}30` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${config.color}20` }}
      >
        {config.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground">{tip.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tip.description}</p>
        <span
          className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
          style={{ color: config.color, backgroundColor: `${config.color}15` }}
        >
          {tip.category}
        </span>
      </div>
    </div>
  );
}
