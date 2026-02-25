import React, { useState } from 'react';
import { StarRating } from '../components/StarRating';
import { useAddSleepEntry, useSleepEntries } from '../hooks/useQueries';
import { computeSleepDuration, formatDuration, timeStringToTimestamp } from '../utils/sleepCalculations';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Moon, Sun, Clock } from 'lucide-react';

export function SleepTracking() {
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [quality, setQuality] = useState(3);
  const addSleepEntry = useAddSleepEntry();
  const { data: entries, isLoading } = useSleepEntries();

  const duration = computeSleepDuration(bedtime, wakeTime);
  const durationStr = formatDuration(duration);

  const handleSubmit = async () => {
    try {
      await addSleepEntry.mutateAsync({
        bedtime: timeStringToTimestamp(bedtime),
        wakeTime: timeStringToTimestamp(wakeTime),
        durationMinutes: BigInt(duration),
        qualityRating: BigInt(quality),
      });
      toast.success('Sleep logged! 😴');
    } catch {
      toast.error('Failed to save sleep entry');
    }
  };

  const formatEntryDate = (ts: bigint) => {
    const date = new Date(Number(ts) / 1_000_000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getQualityLabel = (rating: bigint) => {
    const r = Number(rating);
    if (r >= 5) return { label: 'Excellent', color: '#4ade80' };
    if (r >= 4) return { label: 'Good', color: '#60d4b0' };
    if (r >= 3) return { label: 'Fair', color: '#a78bfa' };
    if (r >= 2) return { label: 'Poor', color: '#f59e0b' };
    return { label: 'Bad', color: '#f87171' };
  };

  const recentEntries = entries ? [...entries].reverse().slice(0, 7) : [];

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Sleep Tracking 😴</h1>
        <p className="text-sm text-muted-foreground mt-1">Log your sleep for better wellness insights</p>
      </div>

      {/* Log Sleep Form */}
      <div className="p-5 bg-card rounded-3xl border border-border space-y-5">
        <h2 className="text-sm font-bold text-foreground">Log Last Night's Sleep</h2>

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Moon size={13} />
              Bedtime
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={e => setBedtime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Sun size={13} />
              Wake Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Duration display */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/8 border border-primary/15">
          <Clock size={16} className="text-primary" />
          <span className="text-sm text-foreground">
            Sleep duration: <strong className="text-primary">{durationStr}</strong>
          </span>
          {duration < 360 && (
            <span className="ml-auto text-xs text-amber-500">⚠️ Under 6h</span>
          )}
          {duration >= 420 && duration <= 540 && (
            <span className="ml-auto text-xs text-green-500">✓ Optimal</span>
          )}
        </div>

        {/* Quality rating */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Sleep Quality</label>
          <StarRating value={quality} onChange={setQuality} />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={addSleepEntry.isPending}
          className="w-full rounded-xl py-5 font-bold"
        >
          {addSleepEntry.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            'Log Sleep 😴'
          )}
        </Button>
      </div>

      {/* Sleep History */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Sleep History</h2>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
        ) : recentEntries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">🌙</p>
            <p className="text-sm">No sleep entries yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentEntries.map((entry, i) => {
              const { label, color } = getQualityLabel(entry.qualityRating);
              return (
                <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                    😴
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatDuration(Number(entry.durationMinutes))}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ color, backgroundColor: `${color}20` }}
                      >
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{formatEntryDate(entry.timestamp)}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {'⭐'.repeat(Number(entry.qualityRating))}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sleep Tips */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <h3 className="text-sm font-bold text-foreground mb-2">💤 Sleep Tips</h3>
        <ul className="space-y-1.5">
          {[
            'Aim for 7–9 hours of sleep per night',
            'Keep a consistent sleep schedule',
            'Avoid screens 1 hour before bed',
          ].map(tip => (
            <li key={tip} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
