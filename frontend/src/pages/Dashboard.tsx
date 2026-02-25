import React, { useState } from 'react';
import { StressGauge } from '../components/StressGauge';
import { EmergencyCalmButton } from '../components/EmergencyCalmButton';
import { EmergencyCalmOverlay } from '../components/EmergencyCalmOverlay';
import { useStressSimulation } from '../hooks/useStressSimulation';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { AVATAR_EMOJIS_LIST } from '../components/AvatarSelector';
import { Activity, Thermometer, Zap } from 'lucide-react';

export function Dashboard() {
  const [showCalmOverlay, setShowCalmOverlay] = useState(false);
  const { data: profile } = useGetCallerUserProfile();
  const sensorData = useStressSimulation(true);

  const avatarEmoji = profile ? AVATAR_EMOJIS_LIST[Number(profile.avatarId) - 1] ?? '🧘' : '🧘';
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {profile?.name ?? 'Friend'} {avatarEmoji}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-sm font-semibold text-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stress Gauge */}
      <div className="flex flex-col items-center py-4 bg-card rounded-3xl border border-border shadow-soft">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">
          Current Stress Level
        </p>
        <StressGauge stressLevel={sensorData.stressLevel} stressScore={sensorData.stressScore} size={200} />
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Live monitoring active
        </p>
      </div>

      {/* Sensor Readings */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border">
          <div className="w-9 h-9 rounded-xl bg-red-400/15 flex items-center justify-center">
            <Activity size={18} className="text-red-400" />
          </div>
          <span className="text-xl font-bold font-display text-foreground">{sensorData.heartRate}</span>
          <span className="text-[10px] text-muted-foreground text-center">BPM</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border">
          <div className="w-9 h-9 rounded-xl bg-orange-400/15 flex items-center justify-center">
            <Thermometer size={18} className="text-orange-400" />
          </div>
          <span className="text-xl font-bold font-display text-foreground">{sensorData.skinTemp}°</span>
          <span className="text-[10px] text-muted-foreground text-center">Skin °C</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border">
          <div className="w-9 h-9 rounded-xl bg-blue-400/15 flex items-center justify-center">
            <Zap size={18} className="text-blue-400" />
          </div>
          <span className="text-xl font-bold font-display text-foreground">{sensorData.motion}</span>
          <span className="text-[10px] text-muted-foreground text-center">Motion</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '🌬️', label: 'Breathe', path: '/breathe', color: '#60d4b0' },
            { emoji: '🎵', label: 'Sounds', path: '/sounds', color: '#7dd3fc' },
            { emoji: '📔', label: 'Journal', path: '/journal', color: '#a78bfa' },
            { emoji: '😴', label: 'Sleep', path: '/sleep', color: '#c4b5fd' },
          ].map(action => (
            <a
              key={action.path}
              href={action.path}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border
                hover:shadow-soft transition-all duration-200 hover:scale-[1.02]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${action.color}20` }}
              >
                {action.emoji}
              </div>
              <span className="font-semibold text-sm text-foreground">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Calm */}
      <EmergencyCalmButton onActivate={() => setShowCalmOverlay(true)} />

      {/* Overlay */}
      {showCalmOverlay && <EmergencyCalmOverlay onClose={() => setShowCalmOverlay(false)} />}
    </div>
  );
}
