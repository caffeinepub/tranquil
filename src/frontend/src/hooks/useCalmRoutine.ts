import { useCallback, useEffect, useRef, useState } from "react";

export type CalmPhase = "breathing" | "bodyScan" | "affirmation" | "complete";

interface CalmRoutineState {
  phase: CalmPhase;
  elapsed: number;
  progress: number;
  phaseProgress: number;
  isRunning: boolean;
  isComplete: boolean;
}

const PHASE_DURATION = 20;
const TOTAL_DURATION = 60;

export function useCalmRoutine() {
  const [state, setState] = useState<CalmRoutineState>({
    phase: "breathing",
    elapsed: 0,
    progress: 0,
    phaseProgress: 0,
    isRunning: false,
    isComplete: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  const getPhaseFromElapsed = (elapsed: number): CalmPhase => {
    if (elapsed < PHASE_DURATION) return "breathing";
    if (elapsed < PHASE_DURATION * 2) return "bodyScan";
    if (elapsed < TOTAL_DURATION) return "affirmation";
    return "complete";
  };

  const start = useCallback(() => {
    elapsedRef.current = 0;
    setState({
      phase: "breathing",
      elapsed: 0,
      progress: 0,
      phaseProgress: 0,
      isRunning: true,
      isComplete: false,
    });
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — only depends on running/complete flags
  useEffect(() => {
    if (!state.isRunning || state.isComplete) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      elapsedRef.current += 0.1;
      const elapsed = elapsedRef.current;

      if (elapsed >= TOTAL_DURATION) {
        setState((prev) => ({
          ...prev,
          elapsed: TOTAL_DURATION,
          progress: 1,
          phaseProgress: 1,
          phase: "complete",
          isRunning: false,
          isComplete: true,
        }));
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const phase = getPhaseFromElapsed(elapsed);
      const phaseStart =
        phase === "breathing"
          ? 0
          : phase === "bodyScan"
            ? PHASE_DURATION
            : PHASE_DURATION * 2;
      const phaseProgress = (elapsed - phaseStart) / PHASE_DURATION;

      setState((prev) => ({
        ...prev,
        elapsed: Math.round(elapsed),
        progress: elapsed / TOTAL_DURATION,
        phaseProgress: Math.min(phaseProgress, 1),
        phase,
      }));
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.isComplete]);

  return { state, start, stop };
}
