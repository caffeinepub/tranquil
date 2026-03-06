import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { type CalmPhase, useCalmRoutine } from "../hooks/useCalmRoutine";
import { useAddBreathingSession } from "../hooks/useQueries";

interface EmergencyCalmOverlayProps {
  onClose: () => void;
}

const PHASE_CONFIG: Record<
  CalmPhase,
  { title: string; subtitle: string; emoji: string; bg: string }
> = {
  breathing: {
    title: "Breathe",
    subtitle:
      "Inhale slowly for 4 counts, exhale for 6 counts. Let your body relax.",
    emoji: "🌬️",
    bg: "from-teal-400/20 to-cyan-400/20",
  },
  bodyScan: {
    title: "Body Scan",
    subtitle:
      "Close your eyes. Relax your shoulders, unclench your jaw, soften your hands.",
    emoji: "🧘",
    bg: "from-violet-400/20 to-purple-400/20",
  },
  affirmation: {
    title: "You Are Safe",
    subtitle:
      "This moment will pass. You are stronger than you think. You are doing great.",
    emoji: "💙",
    bg: "from-blue-400/20 to-indigo-400/20",
  },
  complete: {
    title: "Well Done",
    subtitle:
      "You completed your calm routine. Take a moment to appreciate yourself.",
    emoji: "✨",
    bg: "from-green-400/20 to-emerald-400/20",
  },
};

export function EmergencyCalmOverlay({ onClose }: EmergencyCalmOverlayProps) {
  const { state, start, stop } = useCalmRoutine();
  const addBreathingSession = useAddBreathingSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: start/stop are stable refs, intentionally run once
  useEffect(() => {
    start();
    return () => stop();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: addBreathingSession.mutate is stable, intentionally omitted
  useEffect(() => {
    if (state.isComplete) {
      addBreathingSession.mutate({
        technique: "Emergency Calm",
        durationSeconds: BigInt(60),
      });
    }
  }, [state.isComplete]);

  const config = PHASE_CONFIG[state.phase];
  const timeLeft = 60 - state.elapsed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.bg} transition-all duration-1000`}
      />

      <div className="relative w-full max-w-sm mx-4 flex flex-col items-center gap-6 text-center">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-0 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
        >
          <X size={20} />
        </button>

        {/* Timer */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-bold font-display text-foreground">
            {state.isComplete ? "✓" : timeLeft}
          </span>
          {!state.isComplete && (
            <span className="text-xs text-muted-foreground">
              seconds remaining
            </span>
          )}
        </div>

        {/* Progress bar */}
        <Progress value={state.progress * 100} className="w-full h-2" />

        {/* Phase indicator */}
        <div className="flex gap-2">
          {(["breathing", "bodyScan", "affirmation"] as CalmPhase[]).map(
            (p, i) => (
              <div
                key={p}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  state.phase === p || (state.isComplete && i < 3)
                    ? "bg-primary w-8"
                    : "bg-muted w-4"
                }`}
              />
            ),
          )}
        </div>

        {/* Main content */}
        <div className="animate-fade-in-up">
          <div className="text-6xl mb-4 animate-float">{config.emoji}</div>
          <h2 className="text-3xl font-bold font-display text-foreground mb-3">
            {config.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {config.subtitle}
          </p>
        </div>

        {/* Breathing animation for breathing phase */}
        {state.phase === "breathing" && (
          <div className="relative flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-full bg-primary/30 transition-all duration-2000"
              style={{
                transform: `scale(${0.8 + state.phaseProgress * 0.4})`,
                boxShadow: "0 0 30px oklch(0.72 0.12 290 / 0.4)",
              }}
            />
            <div className="absolute w-16 h-16 rounded-full bg-primary/50" />
          </div>
        )}

        {state.isComplete && (
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold
              hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
