import React from "react";
import type { BreathPhase } from "../hooks/useBreathingTimer";

interface BreathingCircleProps {
  phase: BreathPhase;
  phaseProgress: number;
  size?: number;
}

const PHASE_LABELS: Record<BreathPhase, string> = {
  idle: "Ready",
  inhale: "Inhale",
  hold: "Hold",
  exhale: "Exhale",
  holdOut: "Hold",
  complete: "Done ✨",
};

const PHASE_COLORS: Record<BreathPhase, string> = {
  idle: "#a78bfa",
  inhale: "#60d4b0",
  hold: "#a78bfa",
  exhale: "#7dd3fc",
  holdOut: "#c4b5fd",
  complete: "#4ade80",
};

export function BreathingCircle({
  phase,
  phaseProgress,
  size = 220,
}: BreathingCircleProps) {
  const color = PHASE_COLORS[phase];
  const minScale = 0.65;
  const maxScale = 1.15;

  let scale = minScale;
  if (phase === "inhale")
    scale = minScale + (maxScale - minScale) * phaseProgress;
  else if (phase === "hold") scale = maxScale;
  else if (phase === "exhale")
    scale = maxScale - (maxScale - minScale) * phaseProgress;
  else if (phase === "holdOut") scale = minScale;
  else if (phase === "complete") scale = 1.0;

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer pulse ring */}
      <div
        className="absolute rounded-full opacity-20"
        style={{
          width: size * 1.3,
          height: size * 1.3,
          backgroundColor: color,
          transform: `scale(${scale * 0.9})`,
          transition: "transform 0.3s ease, background-color 0.5s ease",
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute rounded-full opacity-30"
        style={{
          width: size * 1.1,
          height: size * 1.1,
          backgroundColor: color,
          transform: `scale(${scale * 0.95})`,
          transition: "transform 0.3s ease, background-color 0.5s ease",
        }}
      />
      {/* Main circle */}
      <div
        className="relative flex items-center justify-center rounded-full shadow-glow"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease, background-color 0.5s ease",
          boxShadow: `0 0 40px ${color}60`,
        }}
      >
        <div className="text-center">
          <p className="text-white text-2xl font-bold font-display drop-shadow">
            {PHASE_LABELS[phase]}
          </p>
        </div>
      </div>
    </div>
  );
}
