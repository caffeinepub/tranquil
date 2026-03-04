import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useReminderPrefs, useUpdateReminderPrefs, useGetUserData } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { ReminderToggle } from '../components/ReminderToggle';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { downloadUserData } from '../utils/dataExport';
import { toast } from 'sonner';
import { Moon, Sun, Download, Info } from 'lucide-react';

export function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { data: reminderPrefs, isLoading: prefsLoading } = useReminderPrefs();
  const updateReminderPrefs = useUpdateReminderPrefs();
  const { data: profile } = useGetCallerUserProfile();
  const { refetch: fetchUserData } = useGetUserData();

  const [hydration, setHydration] = useState(true);
  const [breaks, setBreaks] = useState(true);
  const [stretch, setStretch] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (reminderPrefs) {
      setHydration(reminderPrefs.hydration);
      setBreaks(reminderPrefs.breaks);
      setStretch(reminderPrefs.stretch);
    }
  }, [reminderPrefs]);

  const handleReminderChange = async (type: 'hydration' | 'breaks' | 'stretch', value: boolean) => {
    const newHydration = type === 'hydration' ? value : hydration;
    const newBreaks = type === 'breaks' ? value : breaks;
    const newStretch = type === 'stretch' ? value : stretch;

    if (type === 'hydration') setHydration(value);
    if (type === 'breaks') setBreaks(value);
    if (type === 'stretch') setStretch(value);

    try {
      await updateReminderPrefs.mutateAsync({
        hydration: newHydration,
        breaks: newBreaks,
        stretch: newStretch,
        intervals: reminderPrefs?.intervals ?? BigInt(60),
      });
    } catch {
      toast.error('Failed to save preferences');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await fetchUserData();
      if (result.data) {
        downloadUserData(result.data, profile?.name ?? 'user');
        toast.success('Data exported successfully! 📥');
      } else {
        toast.error('No data to export');
      }
    } catch {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Settings ⚙️</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your TRANQUIL experience</p>
      </div>

      {/* Appearance */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Appearance</h2>
        <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-amber-500" />}
            <Label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">
              Dark Mode
            </Label>
          </div>
          <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleTheme} />
        </div>
      </div>

      {/* Reminders */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Smart Reminders</h2>
        {prefsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-2">
            <ReminderToggle
              id="hydration"
              label="Hydration Reminder"
              emoji="💧"
              enabled={hydration}
              onToggle={v => handleReminderChange('hydration', v)}
            />
            <ReminderToggle
              id="breaks"
              label="Take a Break"
              emoji="☕"
              enabled={breaks}
              onToggle={v => handleReminderChange('breaks', v)}
            />
            <ReminderToggle
              id="stretch"
              label="Stretch Reminder"
              emoji="🧘"
              enabled={stretch}
              onToggle={v => handleReminderChange('stretch', v)}
            />
          </div>
        )}
      </div>

      {/* Data */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Data & Privacy</h2>
        <div className="p-4 bg-card rounded-2xl border border-border space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is stored securely on the Internet Computer blockchain. Export a copy at any time.
          </p>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="w-full rounded-xl gap-2"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Exporting...
              </span>
            ) : (
              <>
                <Download size={16} />
                Export My Data (JSON)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* About */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">About</h2>
        <div className="p-5 bg-card rounded-2xl border border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">🧘</div>
            <div>
              <h3 className="font-bold text-foreground font-display">TRANQUIL</h3>
              <p className="text-xs text-muted-foreground">Version 1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            TRANQUIL is your personal stress relief companion designed for students, working professionals,
            and anyone dealing with daily stress. Monitor your wellness, practice breathing exercises,
            track your mood, and find your calm — all in one place.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Stress Monitoring', 'Breathing', 'Sleep Tracking', 'Mood Journal'].map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TRANQUIL. Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'tranquil-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
