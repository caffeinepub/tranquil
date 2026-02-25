import React from 'react';
import { Slider } from '@/components/ui/slider';

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const INTENSITY_LABELS = ['', 'Gentle', 'Soft', 'Medium', 'Strong', 'Intense'];
const INTENSITY_COLORS = ['', '#60d4b0', '#7dd3fc', '#a78bfa', '#f59e0b', '#f87171'];

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Intensity</span>
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            color: INTENSITY_COLORS[value],
            backgroundColor: `${INTENSITY_COLORS[value]}20`,
          }}
        >
          {INTENSITY_LABELS[value]}
        </span>
      </div>

      <Slider
        min={1}
        max={5}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />

      <div className="flex justify-between">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor: i <= value ? INTENSITY_COLORS[i] : 'oklch(var(--muted))',
                transform: i === value ? 'scale(1.4)' : 'scale(1)',
              }}
            />
            <span className="text-[10px] text-muted-foreground">{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
