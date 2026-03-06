import React from "react";

interface SoundTileProps {
  id: string;
  title: string;
  emoji: string;
  isPlaying: boolean;
  onToggle: (id: string) => void;
}

export function SoundTile({
  id,
  title,
  emoji,
  isPlaying,
  onToggle,
}: SoundTileProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`
        relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
        border transition-all duration-300 cursor-pointer select-none
        ${
          isPlaying
            ? "bg-primary/10 border-primary/40 shadow-glow"
            : "bg-card border-border hover:bg-accent/50 hover:border-primary/20"
        }
      `}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-xs font-semibold text-foreground text-center leading-tight">
        {title}
      </span>

      {/* Sound wave indicator */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="sound-bar w-1 rounded-full bg-primary"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {!isPlaying && (
        <div className="flex items-end gap-0.5 h-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-muted-foreground opacity-40"
            />
          ))}
        </div>
      )}
    </button>
  );
}
