import React from 'react';
import { Zap } from 'lucide-react';

interface EmergencyCalmButtonProps {
  onActivate: () => void;
}

export function EmergencyCalmButton({ onActivate }: EmergencyCalmButtonProps) {
  return (
    <button
      onClick={onActivate}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl
        bg-gradient-to-r from-red-400/80 to-orange-400/80
        text-white font-bold text-base shadow-glow-coral
        hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
        border border-red-300/30"
    >
      <Zap size={20} className="fill-white" />
      Emergency Calm Mode
    </button>
  );
}
