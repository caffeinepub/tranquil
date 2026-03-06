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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart2,
  Brain,
  ChevronRight,
  Cloud,
  Download,
  FileDown,
  FileText,
  Fingerprint,
  Info,
  Lock,
  Scissors,
  ScrollText,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  Wifi,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Reusable Toggle Row ─────────────────────────────────────────────────────

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  switchId: string;
  switchOcid?: string;
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  switchId,
  switchOcid,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-primary flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="flex-shrink-0 ml-3"
        data-ocid={switchOcid}
      />
    </div>
  );
}

// ─── Reusable Arrow Row Button ───────────────────────────────────────────────

interface ArrowRowButtonProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  badge?: string;
  ocid?: string;
  onClick?: () => void;
}

function ArrowRowButton({
  icon,
  title,
  description,
  badge,
  ocid,
  onClick,
}: ArrowRowButtonProps) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border hover:bg-accent/50 active:scale-[0.98] transition-all text-left"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-primary flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{title}</p>
            {badge && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0 h-5 rounded-full"
              >
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-muted-foreground flex-shrink-0 ml-2"
      />
    </button>
  );
}

// ─── Download Data Dialog ────────────────────────────────────────────────────

interface DownloadDataDialogProps {
  ocid: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function DownloadDataDialog({
  ocid,
  icon,
  title,
  description,
}: DownloadDataDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDownload = (format: string) => {
    toast.success(`Downloading as ${format}...`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowRowButton
          icon={icon}
          title={title}
          description={description}
          ocid={ocid}
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Download My Data
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a format to export your personal data securely.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {(["JSON", "CSV", "PDF"] as const).map((format) => (
            <Button
              key={format}
              variant="outline"
              className="w-full rounded-xl justify-start gap-3 h-12"
              onClick={() => handleDownload(format)}
            >
              <FileDown size={16} className="text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Export as {format}</p>
                <p className="text-xs text-muted-foreground">
                  {format === "JSON" && "Raw data, machine-readable"}
                  {format === "CSV" && "Spreadsheet-compatible format"}
                  {format === "PDF" && "Human-readable summary report"}
                </p>
              </div>
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="w-full rounded-xl"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Selective Deletion Dialog ───────────────────────────────────────────────

interface SelectiveDeletionDialogProps {
  ocid: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function SelectiveDeletionDialog({
  ocid,
  icon,
  title,
  description,
}: SelectiveDeletionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const categories = [
    { id: "stress_logs", label: "Stress Logs" },
    { id: "mood_entries", label: "Mood Entries" },
    { id: "sleep_data", label: "Sleep Data" },
    { id: "analytics", label: "Analytics History" },
    { id: "device_history", label: "Device History" },
  ];

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDelete = () => {
    if (selected.length === 0) {
      toast.error("Select at least one category to delete.");
      return;
    }
    const labels = selected
      .map((s) => categories.find((c) => c.id === s)?.label)
      .filter(Boolean)
      .join(", ");
    toast.success(`Deleted: ${labels}`);
    setSelected([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowRowButton
          icon={icon}
          title={title}
          description={description}
          ocid={ocid}
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Selective Data Deletion
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select the categories you want to permanently delete.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border"
            >
              <Checkbox
                id={`del-${cat.id}`}
                checked={selected.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <Label
                htmlFor={`del-${cat.id}`}
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant="destructive"
            className="w-full rounded-xl"
            onClick={handleDelete}
            disabled={selected.length === 0}
          >
            <Trash2 size={14} className="mr-2" />
            Delete Selected ({selected.length})
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-xl"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Manage Devices Dialog ───────────────────────────────────────────────────

interface ManageDevicesDialogProps {
  ocid: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  badge?: string;
}

function ManageDevicesDialog({
  ocid,
  icon,
  title,
  description,
  badge,
}: ManageDevicesDialogProps) {
  const [open, setOpen] = useState(false);
  const [devices, setDevices] = useState([
    { id: "1", name: "TRANQUIL Band Pro", last: "Now" },
    { id: "2", name: "TRANQUIL Band Mini", last: "2h ago" },
  ]);

  const removeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast.success("Device removed successfully.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowRowButton
          icon={icon}
          title={title}
          description={description}
          badge={badge}
          ocid={ocid}
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Manage Devices
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {devices.length} active device{devices.length !== 1 ? "s" : ""}{" "}
            paired to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {devices.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No devices paired.
            </div>
          ) : (
            devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {device.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last seen: {device.last}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeDevice(device.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="w-full rounded-xl"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Change Password AlertDialog ─────────────────────────────────────────────

function ChangePasswordRow() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ArrowRowButton
          icon={<Lock size={18} />}
          title="Change Password"
          description="Update your account password"
          ocid="privacy.change_password.button"
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl max-w-sm mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Password</AlertDialogTitle>
          <AlertDialogDescription>
            Change password functionality is available in your account settings.
            Visit the authentication portal to update your credentials securely.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Got it</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Privacy Policy Dialog ───────────────────────────────────────────────────

function PrivacyPolicyRow() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ArrowRowButton
          icon={<FileText size={18} />}
          title="Privacy Policy"
          description="GDPR & Indian IT Act compliant"
          ocid="privacy.privacy_policy.button"
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            GDPR & Indian IT Act Compliant · Last updated: March 2026
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Data Collection:</strong>{" "}
            TRANQUIL collects stress metrics, mood logs, sleep patterns, and
            device usage data to provide personalized wellness insights.
          </p>
          <p>
            <strong className="text-foreground">Data Storage:</strong> Your data
            is encrypted with AES-256 and stored on the Internet Computer
            blockchain — decentralized and censorship-resistant.
          </p>
          <p>
            <strong className="text-foreground">Your Rights:</strong> Under GDPR
            and the Indian Digital Personal Data Protection Act, you have the
            right to access, correct, port, and erase your personal data at any
            time.
          </p>
          <p>
            <strong className="text-foreground">No Third-Party Sharing:</strong>{" "}
            We never sell or share your data with advertisers or third parties
            without your explicit consent.
          </p>
          <p>
            <strong className="text-foreground">Data Retention:</strong> Active
            account data is retained while your account exists. Upon deletion,
            all data is purged within 30 days.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Terms Dialog ────────────────────────────────────────────────────────────

function TermsRow() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ArrowRowButton
          icon={<ScrollText size={18} />}
          title="Terms & Conditions"
          description="Last accepted: Today"
          ocid="privacy.terms.button"
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Terms & Conditions
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Last accepted: Today
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">1. Acceptance:</strong> By using
            TRANQUIL, you agree to these terms. If you disagree, please
            discontinue use immediately.
          </p>
          <p>
            <strong className="text-foreground">2. Use of Service:</strong>{" "}
            TRANQUIL is for personal wellness monitoring. It is not a medical
            device and does not provide medical advice or diagnosis.
          </p>
          <p>
            <strong className="text-foreground">
              3. Account Responsibility:
            </strong>{" "}
            You are responsible for maintaining the security of your account
            credentials. Report any unauthorized access immediately.
          </p>
          <p>
            <strong className="text-foreground">
              4. Intellectual Property:
            </strong>{" "}
            All content, design, and functionality of TRANQUIL are owned by the
            creators and protected by applicable laws.
          </p>
          <p>
            <strong className="text-foreground">5. Termination:</strong> We
            reserve the right to terminate accounts that violate these terms.
            You may delete your account at any time via Settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Data Usage Dialog ───────────────────────────────────────────────────────

function DataUsageRow() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ArrowRowButton
          icon={<Info size={18} />}
          title="Data Usage Explanation"
          description="How and why we use your data"
          ocid="privacy.data_usage.button"
        />
      </DialogTrigger>
      <DialogContent className="rounded-2xl max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Data Usage Explanation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            How and why we use your data
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Stress Analytics:</strong> Your
            heart rate and motion data are processed locally to calculate
            real-time stress scores. Raw biometric data never leaves your
            device.
          </p>
          <p>
            <strong className="text-foreground">Mood & Sleep Logs:</strong>{" "}
            Stored encrypted on-chain to generate personalized weekly insights
            and trend visualizations.
          </p>
          <p>
            <strong className="text-foreground">AI Predictions:</strong> When
            enabled, anonymized patterns are used to predict high-stress periods
            and suggest preemptive relaxation sessions.
          </p>
          <p>
            <strong className="text-foreground">Analytics (Optional):</strong>{" "}
            Aggregate, anonymized usage statistics help us improve app
            performance and feature prioritization. No personal data is
            included.
          </p>
          <p>
            <strong className="text-foreground">Cloud Backup:</strong> Encrypted
            sync across your devices so you never lose your wellness history.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PrivacySettings() {
  const navigate = useNavigate();

  // Security toggles
  const [biometric, setBiometric] = useState(false);
  const [mfa, setMfa] = useState(false);

  // Data usage toggles
  const [analytics, setAnalytics] = useState(true);
  const [aiPrediction, setAiPrediction] = useState(false);
  const [cloudBackup, setCloudBackup] = useState(true);

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="privacy.back_button"
          onClick={() => navigate({ to: "/settings" })}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-border hover:bg-accent/50 active:scale-95 transition-all"
          aria-label="Back to Settings"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-display text-foreground">
            Privacy & Data 🔐
          </h1>
          <p className="text-xs text-muted-foreground">
            Control your data and security preferences
          </p>
        </div>
      </div>

      {/* ── Section 1: Security ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Security
        </h2>
        <div className="space-y-2">
          <ToggleRow
            icon={<Fingerprint size={18} />}
            title="Biometric Authentication"
            description="Use fingerprint or face to unlock"
            checked={biometric}
            onCheckedChange={setBiometric}
            switchId="biometric-toggle"
            switchOcid="privacy.biometric.switch"
          />
          <ToggleRow
            icon={<Shield size={18} />}
            title="Multi-Factor Authentication"
            description="Extra layer of security"
            checked={mfa}
            onCheckedChange={setMfa}
            switchId="mfa-toggle"
            switchOcid="privacy.mfa.switch"
          />
          <ChangePasswordRow />
        </div>
      </div>

      {/* ── Section 2: Data Management ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Data Management
        </h2>
        <div className="space-y-2">
          <DownloadDataDialog
            ocid="privacy.download_data.button"
            icon={<Download size={18} />}
            title="Download My Data"
            description="Export your data in multiple formats"
          />
          <SelectiveDeletionDialog
            ocid="privacy.selective_delete.button"
            icon={<Trash2 size={18} />}
            title="Selective Data Deletion"
            description="Delete specific data categories"
          />
          <ManageDevicesDialog
            ocid="privacy.manage_devices.button"
            icon={<Smartphone size={18} />}
            title="Manage Devices"
            description="View and remove paired devices"
          />
        </div>
      </div>

      {/* ── Section 3: Data Usage Controls ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Data Usage Controls
        </h2>
        <div className="space-y-2">
          <ToggleRow
            icon={<BarChart2 size={18} />}
            title="Analytics Tracking"
            description="Help improve the app with usage data"
            checked={analytics}
            onCheckedChange={setAnalytics}
            switchId="analytics-toggle"
            switchOcid="privacy.analytics.switch"
          />
          <ToggleRow
            icon={<Brain size={18} />}
            title="AI Prediction Usage"
            description="Allow AI to analyze your patterns"
            checked={aiPrediction}
            onCheckedChange={setAiPrediction}
            switchId="ai-toggle"
            switchOcid="privacy.ai_prediction.switch"
          />
          <ToggleRow
            icon={<Cloud size={18} />}
            title="Cloud Backup"
            description="Sync data across devices"
            checked={cloudBackup}
            onCheckedChange={setCloudBackup}
            switchId="backup-toggle"
            switchOcid="privacy.cloud_backup.switch"
          />
        </div>
      </div>

      {/* ── Section 4: Data Actions ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Data Actions
        </h2>
        <div className="space-y-2">
          <DownloadDataDialog
            ocid="privacy.data_actions_download.button"
            icon={<FileDown size={18} />}
            title="Download My Data"
            description="Export as JSON, CSV, or PDF"
          />
          <SelectiveDeletionDialog
            ocid="privacy.data_actions_delete.button"
            icon={<Scissors size={18} />}
            title="Selective Data Deletion"
            description="Delete specific logs or entries"
          />
          <ManageDevicesDialog
            ocid="privacy.data_actions_devices.button"
            icon={<Wifi size={18} />}
            title="Manage Connected Devices"
            badge="2 active"
          />
        </div>
      </div>

      {/* ── Section 5: Compliance & Legal ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Compliance & Legal
        </h2>
        <div className="space-y-2">
          <PrivacyPolicyRow />
          <TermsRow />
          <DataUsageRow />
        </div>
      </div>

      {/* ── Section 6: Account Control ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Account Control
        </h2>
        <div className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                data-ocid="privacy.delete_account.button"
                className="w-full rounded-2xl h-12 text-sm font-semibold"
              >
                <Trash2 size={16} className="mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl max-w-sm mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold text-destructive">
                  Delete Account
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  This action is permanent and cannot be undone. All your data
                  including stress logs, mood entries, sleep data, and device
                  history will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <AlertDialogCancel
                  data-ocid="privacy.delete_cancel.button"
                  className="rounded-xl w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="privacy.delete_confirm.button"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl w-full sm:w-auto"
                  onClick={() =>
                    toast.success(
                      "Account deletion initiated. You have 7 days to cancel.",
                    )
                  }
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Security assurance card */}
          <div className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border">
            <ShieldCheck
              size={18}
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your data is protected with{" "}
              <strong className="text-foreground">AES-256 encryption</strong>.
              BLE communications use{" "}
              <strong className="text-foreground">end-to-end encryption</strong>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
