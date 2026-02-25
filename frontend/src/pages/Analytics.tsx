import React from 'react';
import { StressChart } from '../components/StressChart';
import { useWeeklyStressAnalytics } from '../hooks/useQueries';
import { computeDailyAverages, computeImprovementMessage } from '../utils/stressAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export function Analytics() {
  const { data: readings, isLoading } = useWeeklyStressAnalytics();

  const dailyData = readings ? computeDailyAverages(readings) : [];
  const improvementMessage = computeImprovementMessage(dailyData);

  const totalReadings = dailyData.reduce((s, d) => s + d.count, 0);
  const avgScore = dailyData.filter(d => d.count > 0).reduce((s, d) => s + d.avgScore, 0) /
    (dailyData.filter(d => d.count > 0).length || 1);

  const isImproving = improvementMessage.includes('less stressed');
  const isWorsening = improvementMessage.includes('increased');

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

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center pb-2">
        Data updates every time the dashboard is open
      </p>
    </div>
  );
}
