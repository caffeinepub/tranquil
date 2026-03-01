import React, { useState } from 'react';
import { StressChart } from '../components/StressChart';
import { useWeeklyStressAnalytics } from '../hooks/useQueries';
import { computeDailyAverages, computeImprovementMessage } from '../utils/stressAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TrendingDown, TrendingUp, Minus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { StressReading } from '../backend';

// ─── Inline delete confirmation for individual readings ───────────────────────

interface DeleteReadingButtonProps {
  reading: StressReading;
  onDelete: (reading: StressReading) => void;
  isDeleting: boolean;
}

function DeleteReadingButton({ reading, onDelete, isDeleting }: DeleteReadingButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
          disabled={isDeleting}
        >
          <Trash2 size={13} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this reading?</AlertDialogTitle>
          <AlertDialogDescription>
            This stress reading will be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(reading)}
            className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────

export function Analytics() {
  const { data: readings, isLoading } = useWeeklyStressAnalytics();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localReadings, setLocalReadings] = useState<StressReading[] | null>(null);

  const activeReadings = localReadings ?? readings ?? [];
  const dailyData = computeDailyAverages(activeReadings);
  const improvementMessage = computeImprovementMessage(dailyData);

  const totalReadings = dailyData.reduce((s, d) => s + d.count, 0);
  const avgScore = dailyData.filter(d => d.count > 0).reduce((s, d) => s + d.avgScore, 0) /
    (dailyData.filter(d => d.count > 0).length || 1);

  const isImproving = improvementMessage.includes('less stressed');
  const isWorsening = improvementMessage.includes('increased');

  // Sync local state when server data arrives
  React.useEffect(() => {
    if (readings && localReadings === null) {
      setLocalReadings(readings);
    }
  }, [readings]);

  const handleDeleteReading = async (reading: StressReading) => {
    const id = reading.timestamp.toString();
    setDeletingId(id);
    try {
      // Optimistic removal
      setLocalReadings(prev => (prev ?? readings ?? []).filter(r => r.timestamp !== reading.timestamp));
      toast.success('Stress reading removed');
    } catch {
      toast.error('Failed to delete reading');
      setLocalReadings(readings ?? null);
    } finally {
      setDeletingId(null);
    }
  };

  // Get individual readings for the breakdown list (last 20)
  const recentReadings = [...activeReadings]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 20);

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Analytics 📊</h1>
        <p className="text-sm text-muted-foreground mt-1">Your 7-day stress overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-card rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Score</p>
          <p className="text-2xl font-bold font-display text-foreground">
            {totalReadings > 0 ? Math.round(avgScore) : '—'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">This week</p>
        </div>
        <div className="p-4 bg-card rounded-2xl border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Readings</p>
          <p className="text-2xl font-bold font-display text-foreground">{totalReadings}</p>
          <p className="text-xs text-muted-foreground mt-1">Total logged</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 bg-card rounded-2xl border border-border space-y-3">
        <h2 className="text-sm font-bold text-foreground">Daily Stress Scores</h2>
        {isLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : (
          <StressChart data={dailyData} />
        )}
      </div>

      {/* Improvement Message */}
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border ${
          isImproving
            ? 'bg-green-400/10 border-green-400/30'
            : isWorsening
            ? 'bg-red-400/10 border-red-400/30'
            : 'bg-primary/10 border-primary/20'
        }`}
      >
        <div className="mt-0.5">
          {isImproving ? (
            <TrendingDown size={18} className="text-green-500" />
          ) : isWorsening ? (
            <TrendingUp size={18} className="text-red-400" />
          ) : (
            <Minus size={18} className="text-primary" />
          )}
        </div>
        <p className="text-sm text-foreground leading-relaxed">{improvementMessage}</p>
      </div>

      {/* Day breakdown */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Day Breakdown</h2>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {dailyData.map((day, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <span className="text-sm font-semibold text-muted-foreground w-8">{day.day}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${day.avgScore}%`,
                      backgroundColor:
                        day.count === 0
                          ? 'oklch(0.88 0.02 220)'
                          : day.avgScore < 40
                          ? '#4ade80'
                          : day.avgScore < 65
                          ? '#a78bfa'
                          : '#f87171',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-8 text-right">
                  {day.count > 0 ? day.avgScore : '—'}
                </span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {day.count > 0 ? `${day.count} pts` : 'No data'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Individual Readings with Delete */}
      {recentReadings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Readings</h2>
            <span className="text-xs text-muted-foreground">{recentReadings.length} entries</span>
          </div>
          <div className="space-y-2">
            {recentReadings.map((reading, i) => {
              const date = new Date(Number(reading.timestamp) / 1_000_000);
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              const levelColor = reading.stressLevel === 'low' ? 'text-green-500' : reading.stressLevel === 'medium' ? 'text-purple-500' : 'text-red-500';
              const isBeingDeleted = deletingId === reading.timestamp.toString();

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 bg-card rounded-xl border border-border transition-opacity ${isBeingDeleted ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold capitalize ${levelColor}`}>{reading.stressLevel as string}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{Number(reading.heartRate)} bpm</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{reading.skinTemp.toFixed(1)}°C</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{dateStr}</p>
                  </div>
                  <DeleteReadingButton
                    reading={reading}
                    onDelete={handleDeleteReading}
                    isDeleting={isBeingDeleted}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center pb-2">
        Data updates every time the dashboard is open
      </p>
    </div>
  );
}
