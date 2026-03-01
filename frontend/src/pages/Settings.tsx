import React, { useState } from 'react';
import { Bell, Moon, Sun, Monitor, Shield, Download, Trash2, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGetReminderPrefs, useUpdateReminderPrefs } from '../hooks/useQueries';
import { useTheme } from 'next-themes';
import DeleteAccountModal from '../components/DeleteAccountModal';
import SelectiveDataDeletionCard from '../components/SelectiveDataDeletionCard';
import DataExportCard from '../components/DataExportCard';
import SecurityInfoCard from '../components/SecurityInfoCard';
import ComplianceCard from '../components/ComplianceCard';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { data: reminderPrefs, isLoading: prefsLoading } = useGetReminderPrefs();
  const updatePrefsMutation = useUpdateReminderPrefs();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('selective');

  const handleToggleReminder = (key: 'hydration' | 'breaks' | 'stretch', value: boolean) => {
    if (!reminderPrefs) return;
    updatePrefsMutation.mutate({
      hydration: key === 'hydration' ? value : reminderPrefs.hydration,
      breaks: key === 'breaks' ? value : reminderPrefs.breaks,
      stretch: key === 'stretch' ? value : reminderPrefs.stretch,
      intervals: reminderPrefs.intervals,
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  const reminderItems = [
    { key: 'hydration' as const, label: 'Hydration Reminders', description: 'Remind me to drink water' },
    { key: 'breaks' as const, label: 'Break Reminders', description: 'Remind me to take breaks' },
    { key: 'stretch' as const, label: 'Stretch Reminders', description: 'Remind me to stretch' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your preferences and data</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Appearance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred theme</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    theme === opt.value
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Smart Reminders ─────────────────────────────────────────────── */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Smart Reminders</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalized wellness nudges throughout your day
            </p>
          </div>
          <div className="divide-y divide-border">
            {reminderItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={reminderPrefs?.[item.key] ?? false}
                  onCheckedChange={(v) => handleToggleReminder(item.key, v)}
                  disabled={prefsLoading || updatePrefsMutation.isPending}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Privacy & Data Control ──────────────────────────────────────── */}
        <section className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Section Header */}
          <div className="px-5 py-4 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Privacy & Data Control</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You have full ownership and control over your mental health data.
            </p>
          </div>

          <div className="divide-y divide-border">
            {/* ── Download My Data ─────────────────────────────────────── */}
            <div className="overflow-hidden">
              <button
                onClick={() => toggleSection('export')}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Download My Data</p>
                    <p className="text-xs text-muted-foreground">Export in JSON, CSV, or PDF format</p>
                  </div>
                </div>
                {expandedSection === 'export' ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'export' && (
                <div className="px-5 pb-5">
                  <DataExportCard />
                </div>
              )}
            </div>

            {/* ── Selective Data Deletion ───────────────────────────────── */}
            <div className="overflow-hidden">
              <button
                onClick={() => toggleSection('selective')}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Selective Data Deletion</p>
                    <p className="text-xs text-muted-foreground">
                      Remove specific entries or reset categories
                    </p>
                  </div>
                </div>
                {expandedSection === 'selective' ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'selective' && (
                <div className="px-5 pb-5">
                  <SelectiveDataDeletionCard />
                </div>
              )}
            </div>

            {/* ── Security Information ──────────────────────────────────── */}
            <div className="overflow-hidden">
              <button
                onClick={() => toggleSection('security')}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Security Information</p>
                    <p className="text-xs text-muted-foreground">
                      How we protect your data
                    </p>
                  </div>
                </div>
                {expandedSection === 'security' ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'security' && (
                <div className="px-5 pb-5">
                  <SecurityInfoCard />
                </div>
              )}
            </div>

            {/* ── Compliance ────────────────────────────────────────────── */}
            <div className="overflow-hidden">
              <button
                onClick={() => toggleSection('compliance')}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Compliance & Consent</p>
                    <p className="text-xs text-muted-foreground">
                      GDPR, Indian IT Act, and your consent records
                    </p>
                  </div>
                </div>
                {expandedSection === 'compliance' ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSection === 'compliance' && (
                <div className="px-5 pb-5">
                  <ComplianceCard />
                </div>
              )}
            </div>

            {/* ── Privacy-First Statement ───────────────────────────────── */}
            <div className="px-5 py-4 bg-primary/5">
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                <span className="font-semibold text-foreground">
                  You have full ownership and control over your mental health data.
                </span>{' '}
                We will never share or sell your data without your explicit consent.
              </p>
            </div>

            {/* ── Full Account Deletion ─────────────────────────────────── */}
            <div className="px-5 py-5">
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-destructive">Danger Zone</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Permanently delete your account and all associated data. This action requires
                    identity verification and cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-4 space-y-1">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TRANQUIL. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with{' '}
            <span className="text-destructive">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </main>

      <DeleteAccountModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </div>
  );
}
