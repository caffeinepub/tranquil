import React from 'react';

interface Mood {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

const MOODS: Mood[] = [
  { emoji: '😁', label: 'Great', value: 'great', color: '#4ade80' },
  { emoji: '🙂', label: 'Good', value: 'good', color: '#60d4b0' },
  { emoji: '😐', label: 'Okay', value: 'okay', color: '#a78bfa' },
  { emoji: '😔', label: 'Low', value: 'low', color: '#7dd3fc' },
  { emoji: '😰', label: 'Stressed', value: 'stressed', color: '#f87171' },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelect: (mood: string) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex justify-between gap-2">
      {MOODS.map(mood => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value)}
          className={`
            flex flex-col items-center gap-1.5 p-3 rounded-2xl flex-1
            border-2 transition-all duration-200
            ${selectedMood === mood.value
              ? 'scale-110 shadow-soft'
              : 'border-transparent bg-muted/50 hover:bg-muted'
            }
          `}
          style={
            selectedMood === mood.value
              ? { borderColor: mood.color, backgroundColor: `${mood.color}18` }
              : {}
          }
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-[10px] font-semibold text-muted-foreground">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}

export { MOODS };
