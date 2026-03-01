import React, { useState } from 'react';
import {
  useGetUserPrivacyPreferences,
  useUpdatePrivacyPreferences,
  useClearAnalyticsHistory,
  useClearDevicePairings,
  useGetUserData,
} from '../hooks/useQueries';
import DeleteAccountModal, { DeleteAccountModal as DeleteAccountModalNamed } from '../components/DeleteAccountModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { toast } from 'sonner';
import {
  Shield,
  Trash2,
  BarChart3,
  Brain,
  Smartphone,
  Database,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';

export function Privacy() {
  const { data: privacyPrefs, isLoading: prefsLoading } = useGetUserPrivacyPreferences();
  const { data: userData, isLoading: dataLoading } = useGetUserData();
  const updatePrivacy = useUpdatePrivacyPreferences();
  const clearAnalytics = useClearAnalyticsHistory();
  const clearDevices = useClearDevicePairings();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);

  const isLoading = prefsLoading || dataLoading;

  const handleAnalyticsToggle = async (value: boolean) => {
    setAnalyticsEnabled(value);
    try {
      await updatePrivacy.mutateAsync({ analyticsEnabled: value, aiPredictionEnabled: aiEnabled });
      toast.success(value ? 'Analytics tracking enabled' : 'Analytics tracking disabled');
    } catch {
      setAnalyticsEnabled(!value);
      toast.error('Failed to update preference');
    }
  };

  const handleAiToggle = async (value: boolean) => {
    setAiEnabled(value);
    try {
      await updatePrivacy.mutateAsync({ analyticsEnabled, aiPredictionEnabled: value });
      toast.success(value ? 'AI predictions enabled' : 'AI predictions disabled');
    } catch {
      setAiEnabled(!value);
      toast.error('Failed to update preference');
    }
  };

  const handleClearAnalytics = async () => {
    try {
      await clearAnalytics.mutateAsync();
      toast.success('Analytics history cleared successfully');
    } catch {
      toast.error('Failed to clear analytics history');
    }
  };

  const handleClearDevices = async () => {
    try {
      await clearDevices.mutateAsync();
      toast.success('Device data reset successfully');
    } catch {
      toast.error('Failed to reset device data');
    }
  };

  const dataCounts = {
    stressReadings: userData?.stressReadings.length ?? 0,
    moodEntries: userData?.moodEntries.length ?? 0,
    sleepEntries: userData?.sleepEntries.length ?? 0,
    breathingSessions: userData?.breathingSessions.length ?? 0,
    devicePairings: privacyPrefs?.devicePairings.length ?? 0,
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-3xl p-6"
        style={{
          background: 'linear-gradient(135deg, oklch(0.68 0.14 185), oklch(0.52 0.18 265))',
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">Privacy & Data</h1>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            You own your mental health data. Full transparency, full control.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 -top-6 w-20 h-20 rounded-full bg-white/5" />
      </div>

      {/* Data Summary */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Stored Data Summary</h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Stress Readings', count: dataCounts.stressReadings, icon: '📊', color: 'bg-red-400/10' },
              { label: 'Mood Entries', count: dataCounts.moodEntries, icon: '😊', color: 'bg-purple-400/10' },
              { label: 'Sleep Records', count: dataCounts.sleepEntries, icon: '😴', color: 'bg-blue-400/10' },
              { label: 'Breathing Sessions', count: dataCounts.breathingSessions, icon: '🌬️', color: 'bg-teal-400/10' },
              { label: 'Paired Devices', count: dataCounts.devicePairings, icon: '📱', color: 'bg-amber-400/10' },
            ].map(item => (
              <div key={item.label} className="p-4 bg-card rounded-2xl border border-border">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base mb-2 ${item.color}`}>
                  {item.icon}
                </div>
                <p className="text-2xl font-bold font-display text-foreground">{item.count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
            <div className="p-4 bg-card rounded-2xl border border-border flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">ICP Secured</p>
                <p className="text-[10px] text-muted-foreground">Blockchain storage</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Privacy Controls</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 size={16} className="text-primary" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground cursor-pointer">Analytics Tracking</Label>
                <p className="text-xs text-muted-foreground">Collect usage data for insights</p>
              </div>
            </div>
            <Switch
              checked={analyticsEnabled}
              onCheckedChange={handleAnalyticsToggle}
              disabled={updatePrivacy.isPending}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain size={16} className="text-primary" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground cursor-pointer">AI Predictions</Label>
                <p className="text-xs text-muted-foreground">Use data for wellness predictions</p>
              </div>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={handleAiToggle}
              disabled={updatePrivacy.isPending}
            />
          </div>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Connected Devices</h2>
        </div>
        <div className="p-4 bg-card rounded-2xl border border-border">
          {dataCounts.devicePairings === 0 ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">📱</p>
              <p className="text-sm text-muted-foreground">No devices paired</p>
              <p className="text-xs text-muted-foreground mt-1">Connect your TRANQUIL band via BLE</p>
            </div>
          ) : (
            <div className="space-y-2">
              {privacyPrefs?.devicePairings.map((device, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-muted-foreground" />
                    <span className="text-sm text-foreground font-mono">{device}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg h-7 px-2 text-xs"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manage My Data */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Manage My Data</h2>
        </div>
        <div className="space-y-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl justify-start gap-3 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
              >
                <BarChart3 size={16} />
                Clear Analytics History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Analytics History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your stress readings and analytics data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAnalytics}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {clearAnalytics.isPending ? 'Clearing...' : 'Clear History'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-xl justify-start gap-3 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
              >
                <Smartphone size={16} />
                Reset Device Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl mx-4">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Device Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all paired device records. You'll need to re-pair your TRANQUIL band.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearDevices}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {clearDevices.isPending ? 'Resetting...' : 'Reset Devices'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Data Usage Explanation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Data Usage Explained</h2>
        </div>
        <div className="p-4 bg-card rounded-2xl border border-border space-y-4">
          {[
            {
              icon: '📊',
              title: 'What we collect',
              desc: 'Stress readings (heart rate, skin temp, motion), mood entries, sleep data, breathing sessions, and device pairing info.',
            },
            {
              icon: '🎯',
              title: 'Why we use it',
              desc: 'To provide personalized wellness insights, trend analysis, and AI-powered stress predictions tailored to you.',
            },
            {
              icon: '⏳',
              title: 'How long we keep it',
              desc: 'Your data is retained indefinitely until you delete it. Account deletion removes all data within 30 days.',
            },
            {
              icon: '🔒',
              title: 'Who can see it',
              desc: 'Only you. Data is stored on the Internet Computer blockchain and is cryptographically secured to your identity.',
            },
          ].map(item => (
            <div key={item.title} className="flex gap-3">
              <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Badges */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lock size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Security</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'ICP Blockchain', color: 'bg-blue-400/10 text-blue-600 dark:text-blue-400' },
            { label: 'GDPR Aligned', color: 'bg-green-400/10 text-green-600 dark:text-green-400' },
            { label: 'IT Act Compliant', color: 'bg-purple-400/10 text-purple-600 dark:text-purple-400' },
            { label: 'No Third Parties', color: 'bg-teal-400/10 text-teal-600 dark:text-teal-400' },
            { label: 'End-to-End Auth', color: 'bg-amber-400/10 text-amber-600 dark:text-amber-400' },
          ].map(badge => (
            <span
              key={badge.label}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${badge.color}`}
            >
              ✓ {badge.label}
            </span>
          ))}
        </div>
      </div>

      {/* Delete Account */}
      <div className="space-y-3 pb-4">
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-destructive">Danger Zone</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Permanently delete your account and all associated data. This action cannot be undone after the 30-day grace period.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full rounded-xl gap-2 font-semibold"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} />
            Delete My Account
          </Button>
        </div>
      </div>

      <DeleteAccountModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
}
