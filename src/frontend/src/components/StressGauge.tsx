import React from "react";
import { StressLevel } from "../backend";

interface StressGaugeProps {
  stressLevel: StressLevel;
  stressScore: number;
  size?: number;
}

const LEVEL_CONFIG = {
  [StressLevel.low]: {
    label: "Low",
    color: "#4ade80",
    glow: "rgba(74, 222, 128, 0.4)",
    bg: "rgba(74, 222, 128, 0.1)",
    strokeColor: "#22c55e",
  },
  [StressLevel.medium]: {
    label: "Medium",
    color: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.4)",
    bg: "rgba(167, 139, 250, 0.1)",
    strokeColor: "#8b5cf6",
  },
  [StressLevel.high]: {
    label: "High",
    color: "#f87171",
    glow: "rgba(248, 113, 113, 0.4)",
    bg: "rgba(248, 113, 113, 0.1)",
    strokeColor: "#ef4444",
  },
};

export function StressGauge({
  stressLevel,
  stressScore,
  size = 200,
}: StressGaugeProps) {
  const config = LEVEL_CONFIG[stressLevel];
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (stressScore / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${config.bg} 0%, transparent 70%)`,
            boxShadow: `0 0 40px ${config.glow}`,
          }}
        />

        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
          role="img"
          aria-label={`Stress gauge: ${stressScore} out of 100`}
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted opacity-30"
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={config.strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition:
                "stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold font-display transition-all duration-500"
            style={{ color: config.color }}
          >
            {stressScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
            Stress Score
          </span>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-500"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          border: `1.5px solid ${config.color}40`,
        }}
      >
        {config.label} Stress
      </div>
    </div>
  );
}
