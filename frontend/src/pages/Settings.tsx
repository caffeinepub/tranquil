import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useReminderPrefs, useUpdateReminderPrefs, useGetUserData } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { ReminderToggle } from '../components/ReminderToggle';
import { PolicyModal } from '../components/PolicyModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { downloadUserData, exportAsCSV, exportAsPDF } from '../utils/dataExport';
import { toast } from 'sonner';
import { Moon, Sun, Download, Info, Shield, FileJson, FileText, FileBarChart } from 'lucide-react';

type ExportFormat = 'json' | 'csv' | 'pdf';

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
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);

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
        if (exportFormat === 'json') {
          downloadUserData(result.data, profile?.name ?? 'user');
        } else if (exportFormat === 'csv') {
          exportAsCSV(result.data);
        } else if (exportFormat === 'pdf') {
          exportAsPDF(result.data, profile ?? { name: 'User', avatarId: BigInt(1), totalBreathingSessions: BigInt(0), avgWeeklyStressScore: 0, totalMoodEntries: BigInt(0) });
        }
        toast.success(`Data exported as ${exportFormat.toUpperCase()} 📥`);
      } else {
        toast.error('No data to export');
      }
    } catch {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const formatIcons: Record<ExportFormat, React.ReactNode> = {
    json: <FileJson size={14} />,
    csv: <FileText size={14} />,
    pdf: <FileBarChart size={14} />,
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

      {/* Data Export */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Data & Privacy</h2>
        <div className="p-4 bg-card rounded-2xl border border-border space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your data is stored securely on the Internet Computer blockchain. Export a copy at any time.
          </p>

          {/* Format Selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Export Format</p>
            <RadioGroup
              value={exportFormat}
              onValueChange={v => setExportFormat(v as ExportFormat)}
              className="grid grid-cols-3 gap-2"
            >
              {(['json', 'csv', 'pdf'] as ExportFormat[]).map(fmt => (
                <div key={fmt}>
                  <RadioGroupItem value={fmt} id={`fmt-${fmt}`} className="sr-only" />
                  <Label
                    htmlFor={`fmt-${fmt}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      exportFormat === fmt
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {formatIcons[fmt]}
                    <span className="text-xs font-bold uppercase">{fmt}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              {exportFormat === 'json' && 'Full data export in machine-readable JSON format'}
              {exportFormat === 'csv' && 'Stress readings as spreadsheet-compatible CSV'}
              {exportFormat === 'pdf' && 'Formatted HTML wellness summary report'}
            </p>
          </div>

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
                Download My Data ({exportFormat.toUpperCase()})
              </>
            )}
          </Button>
        </div>

        {/* Privacy Dashboard Link */}
        <a
          href="/privacy"
          className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border
            hover:border-primary/30 hover:shadow-soft transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Privacy & Data Control</p>
            <p className="text-xs text-muted-foreground">Manage, delete, or export your data</p>
          </div>
          <span className="text-muted-foreground group-hover:text-primary transition-colors">›</span>
        </a>
      </div>

      {/* About */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">About</h2>
        <div className="p-4 bg-card rounded-2xl border border-border space-y-2">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">TRANQUIL v1.0</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A stress-relief companion powered by the Internet Computer blockchain. Your mental health data stays private, secure, and fully under your control.
          </p>
        </div>
      </div>

      {/* Footer with Policy Links */}
      <div className="pt-2 pb-4 border-t border-border">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button
            onClick={() => setPolicyModal('privacy')}
            className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </button>
          <span className="text-muted-foreground text-xs">·</span>
          <button
            onClick={() => setPolicyModal('terms')}
            className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            Terms & Conditions
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} TRANQUIL · Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      {/* Policy Modals */}
      {policyModal && (
        <PolicyModal
          open={true}
          onClose={() => setPolicyModal(null)}
          type={policyModal}
        />
      )}
    </div>
  );
}
