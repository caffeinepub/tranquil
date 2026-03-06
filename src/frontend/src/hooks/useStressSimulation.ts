import { useEffect, useRef, useState } from "react";
import { StressLevel } from "../backend";
import { useInternetIdentity } from "./useInternetIdentity";
import { useAddStressReading } from "./useQueries";

interface SensorData {
  heartRate: number;
  skinTemp: number;
  motion: number;
  stressLevel: StressLevel;
  stressScore: number;
}

function computeStressLevel(
  heartRate: number,
  skinTemp: number,
  motion: number,
): { level: StressLevel; score: number } {
  const hrScore = Math.max(0, Math.min(100, ((heartRate - 60) / 40) * 100));
  const tempScore = Math.max(0, Math.min(100, ((skinTemp - 35.5) / 2) * 100));
  const motionScore = motion;
  const score = hrScore * 0.5 + tempScore * 0.3 + motionScore * 0.2;

  let level: StressLevel;
  if (score < 35) level = StressLevel.low;
  else if (score < 65) level = StressLevel.medium;
  else level = StressLevel.high;

  return { level, score: Math.round(score) };
}

function randomFluctuate(
  value: number,
  range: number,
  min: number,
  max: number,
): number {
  const delta = (Math.random() - 0.5) * 2 * range;
  return Math.max(min, Math.min(max, value + delta));
}

export function useStressSimulation(enabled: boolean) {
  const { identity } = useInternetIdentity();
  const addStressReading = useAddStressReading();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [data, setData] = useState<SensorData>(() => {
    const hr = 72;
    const temp = 36.2;
    const motion = 30;
    const { level, score } = computeStressLevel(hr, temp, motion);
    return {
      heartRate: hr,
      skinTemp: temp,
      motion,
      stressLevel: level,
      stressScore: score,
    };
  });

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setData((prev) => {
        const hr = Math.round(randomFluctuate(prev.heartRate, 3, 55, 105));
        const temp = Number.parseFloat(
          randomFluctuate(prev.skinTemp, 0.15, 35.0, 38.0).toFixed(1),
        );
        const motion = Math.round(randomFluctuate(prev.motion, 8, 0, 100));
        const { level, score } = computeStressLevel(hr, temp, motion);
        return {
          heartRate: hr,
          skinTemp: temp,
          motion,
          stressLevel: level,
          stressScore: score,
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [enabled]);

  // Persist to backend every 30 seconds
  // biome-ignore lint/correctness/useExhaustiveDependencies: addStressReading.mutate is stable, intentionally omitted
  useEffect(() => {
    if (!enabled || !identity) return;

    saveTimerRef.current = setTimeout(() => {
      addStressReading.mutate({
        heartRate: BigInt(data.heartRate),
        skinTemp: data.skinTemp,
        motion: BigInt(data.motion),
        stressLevel: data.stressLevel,
      });
    }, 500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data.stressScore, enabled, identity]);

  return data;
}
