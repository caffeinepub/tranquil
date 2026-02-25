import { useState, useEffect, useRef, useCallback } from 'react';

export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'holdOut' | 'complete';

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  cycles: number;
  emoji: string;
}

export const BREATHING_TECHNIQUES: BreathingTechnique[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Inhale 4s, hold 7s, exhale 8s. Reduces anxiety fast.',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    cycles: 4,
    emoji: '🌙',
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal 4s phases. Used by Navy SEALs for calm focus.',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    cycles: 4,
    emoji: '⬜',
  },
  {
    id: 'deep-calm',
    name: 'Deep Calm',
    description: 'Slow 5s inhale, 5s exhale. Perfect for relaxation.',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
    cycles: 6,
    emoji: '🌊',
  },
];

interface BreathingTimerState {
  phase: BreathPhase;
  phaseProgress: number;
  currentCycle: number;
  totalCycles: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isComplete: boolean;
}

export function useBreathingTimer(technique: BreathingTechnique | null) {
  const [state, setState] = useState<BreathingTimerState>({
    phase: 'idle',
    phaseProgress: 0,
    currentCycle: 1,
    totalCycles: technique?.cycles ?? 4,
    elapsedSeconds: 0,
    isRunning: false,
    isComplete: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimeRef = useRef(0);
  const phaseRef = useRef<BreathPhase>('idle');
  const cycleRef = useRef(1);
  const elapsedRef = useRef(0);

  const getNextPhase = useCallback(
    (current: BreathPhase, tech: BreathingTechnique, cycle: number): { phase: BreathPhase; newCycle: number } => {
      if (current === 'inhale') {
        if (tech.holdIn > 0) return { phase: 'hold', newCycle: cycle };
        return { phase: 'exhale', newCycle: cycle };
      }
      if (current === 'hold') {
        return { phase: 'exhale', newCycle: cycle };
      }
      if (current === 'exhale') {
        if (tech.holdOut > 0) return { phase: 'holdOut', newCycle: cycle };
        if (cycle >= tech.cycles) return { phase: 'complete', newCycle: cycle };
        return { phase: 'inhale', newCycle: cycle + 1 };
      }
      if (current === 'holdOut') {
        if (cycle >= tech.cycles) return { phase: 'complete', newCycle: cycle };
        return { phase: 'inhale', newCycle: cycle + 1 };
      }
      return { phase: 'complete', newCycle: cycle };
    },
    []
  );

  const getPhaseDuration = useCallback((phase: BreathPhase, tech: BreathingTechnique): number => {
    if (phase === 'inhale') return tech.inhale;
    if (phase === 'hold') return tech.holdIn;
    if (phase === 'exhale') return tech.exhale;
    if (phase === 'holdOut') return tech.holdOut;
    return 0;
  }, []);

  const start = useCallback(() => {
    if (!technique) return;
    phaseRef.current = 'inhale';
    phaseTimeRef.current = 0;
    cycleRef.current = 1;
    elapsedRef.current = 0;
    setState({
      phase: 'inhale',
      phaseProgress: 0,
      currentCycle: 1,
      totalCycles: technique.cycles,
      elapsedSeconds: 0,
      isRunning: true,
      isComplete: false,
    });
  }, [technique]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    phaseRef.current = 'idle';
    phaseTimeRef.current = 0;
    cycleRef.current = 1;
    elapsedRef.current = 0;
    setState({
      phase: 'idle',
      phaseProgress: 0,
      currentCycle: 1,
      totalCycles: technique?.cycles ?? 4,
      elapsedSeconds: 0,
      isRunning: false,
      isComplete: false,
    });
  }, [technique]);

  useEffect(() => {
    if (!state.isRunning || !technique || state.isComplete) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      phaseTimeRef.current += 0.1;
      elapsedRef.current += 0.1;
      const duration = getPhaseDuration(phaseRef.current, technique);
      const progress = duration > 0 ? Math.min(phaseTimeRef.current / duration, 1) : 1;

      if (phaseTimeRef.current >= duration) {
        const { phase: nextPhase, newCycle } = getNextPhase(phaseRef.current, technique, cycleRef.current);
        phaseRef.current = nextPhase;
        cycleRef.current = newCycle;
        phaseTimeRef.current = 0;

        if (nextPhase === 'complete') {
          setState(prev => ({
            ...prev,
            phase: 'complete',
            phaseProgress: 1,
            isRunning: false,
            isComplete: true,
            elapsedSeconds: Math.round(elapsedRef.current),
          }));
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
      }

      setState(prev => ({
        ...prev,
        phase: phaseRef.current,
        phaseProgress: progress,
        currentCycle: cycleRef.current,
        elapsedSeconds: Math.round(elapsedRef.current),
      }));
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.isComplete, technique, getPhaseDuration, getNextPhase]);

  return { state, start, pause, resume, reset };
}
