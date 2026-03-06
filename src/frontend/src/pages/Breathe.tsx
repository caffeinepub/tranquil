import { CheckCircle, Pause, Play, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { BreathingCircle } from "../components/BreathingCircle";
import {
  BREATHING_TECHNIQUES,
  type BreathingTechnique,
  useBreathingTimer,
} from "../hooks/useBreathingTimer";
import { useAddBreathingSession } from "../hooks/useQueries";

export function Breathe() {
  const [selectedTechnique, setSelectedTechnique] =
    useState<BreathingTechnique | null>(null);
  const { state, start, pause, resume, reset } =
    useBreathingTimer(selectedTechnique);
  const addBreathingSession = useAddBreathingSession();

  const handleComplete = async () => {
    if (!selectedTechnique) return;
    try {
      await addBreathingSession.mutateAsync({
        technique: selectedTechnique.name,
        durationSeconds: BigInt(state.elapsedSeconds),
      });
      toast.success("Session saved! Great work 🌿");
    } catch {
      toast.error("Could not save session");
    }
    reset();
    setSelectedTechnique(null);
  };

  const handleSelectTechnique = (t: BreathingTechnique) => {
    reset();
    setSelectedTechnique(t);
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Breathe 🌬️
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a technique and find your calm
        </p>
      </div>

      {/* Technique Selection */}
      {!selectedTechnique && (
        <div className="space-y-3">
          {BREATHING_TECHNIQUES.map((technique) => (
            <button
              type="button"
              key={technique.id}
              onClick={() => handleSelectTechnique(technique)}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border
                hover:border-primary/30 hover:shadow-soft transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                {technique.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm">
                  {technique.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {technique.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {technique.inhale > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-600 dark:text-teal-400 font-medium">
                      In: {technique.inhale}s
                    </span>
                  )}
                  {technique.holdIn > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400/15 text-violet-600 dark:text-violet-400 font-medium">
                      Hold: {technique.holdIn}s
                    </span>
                  )}
                  {technique.exhale > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-400/15 text-blue-600 dark:text-blue-400 font-medium">
                      Out: {technique.exhale}s
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active Exercise */}
      {selectedTechnique && (
        <div className="flex flex-col items-center gap-6">
          {/* Technique name */}
          <div className="text-center">
            <span className="text-2xl">{selectedTechnique.emoji}</span>
            <h2 className="text-lg font-bold font-display text-foreground mt-1">
              {selectedTechnique.name}
            </h2>
            {!state.isComplete && (
              <p className="text-xs text-muted-foreground mt-1">
                Cycle {state.currentCycle} of {state.totalCycles}
              </p>
            )}
          </div>

          {/* Breathing circle */}
          <div
            className="relative flex items-center justify-center"
            style={{ height: 260 }}
          >
            <BreathingCircle
              phase={state.phase}
              phaseProgress={state.phaseProgress}
              size={220}
            />
          </div>

          {/* Controls */}
          {!state.isComplete ? (
            <div className="flex gap-3">
              {!state.isRunning && state.phase === "idle" && (
                <button
                  type="button"
                  onClick={start}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-glow hover:opacity-90 transition-opacity"
                >
                  <Play size={18} fill="currentColor" />
                  Start
                </button>
              )}
              {state.isRunning && (
                <button
                  type="button"
                  onClick={pause}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  <Pause size={18} />
                  Pause
                </button>
              )}
              {!state.isRunning && state.phase !== "idle" && (
                <button
                  type="button"
                  onClick={resume}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                >
                  <Play size={18} fill="currentColor" />
                  Resume
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedTechnique(null);
                }}
                className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle size={24} />
                <span className="font-bold text-lg">Session Complete!</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Duration: {Math.floor(state.elapsedSeconds / 60)}m{" "}
                {state.elapsedSeconds % 60}s
              </p>
              <button
                type="button"
                onClick={handleComplete}
                disabled={addBreathingSession.isPending}
                className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {addBreathingSession.isPending ? "Saving..." : "Save & Finish"}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedTechnique(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Try another technique
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
