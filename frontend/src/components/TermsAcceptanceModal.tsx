import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRecordTermsAcceptance } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

interface TermsAcceptanceModalProps {
  open: boolean;
  onAccepted: () => void;
}

export function TermsAcceptanceModal({ open, onAccepted }: TermsAcceptanceModalProps) {
  const [accepted, setAccepted] = useState(false);
  const recordAcceptance = useRecordTermsAcceptance();

  const handleContinue = async () => {
    if (!accepted) return;
    try {
      await recordAcceptance.mutateAsync();
      toast.success('Welcome to TRANQUIL! 🧘');
      onAccepted();
    } catch {
      toast.error('Failed to record acceptance. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md mx-4 rounded-3xl" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield size={22} className="text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold font-display text-foreground">
              Privacy & Terms
            </DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="text-left">
              <p className="text-sm text-muted-foreground">
                Before using TRANQUIL, please review how we handle your data.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-56 rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-3">
          <div className="space-y-4 pr-2">
            <div>
              <h3 className="font-semibold text-foreground mb-1">📊 Data We Collect</h3>
              <p className="leading-relaxed">
                TRANQUIL collects stress readings (heart rate, skin temperature, motion), mood journal entries,
                sleep data, breathing session records, and device pairing information to provide personalized
                wellness insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">🔒 How We Protect It</h3>
              <p className="leading-relaxed">
                All data is stored on the Internet Computer blockchain — a decentralized, tamper-resistant
                platform. You own your data. No third parties have access to your personal health information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">🗑️ Your Rights</h3>
              <p className="leading-relaxed">
                You have the right to access, download, and permanently delete all your data at any time
                through the Privacy Dashboard. Account deletion is processed within 30 days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">🌍 Compliance</h3>
              <p className="leading-relaxed">
                TRANQUIL is designed in alignment with GDPR principles and Indian IT Data Protection
                standards. We do not sell your data or use it for advertising.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">📅 Data Retention</h3>
              <p className="leading-relaxed">
                Your data is retained indefinitely until you choose to delete it. Upon account deletion,
                all data is permanently removed within 30 days.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-start gap-3 py-2">
          <Checkbox
            id="terms-accept"
            checked={accepted}
            onCheckedChange={v => setAccepted(v === true)}
            className="mt-0.5"
          />
          <Label htmlFor="terms-accept" className="text-sm text-foreground leading-relaxed cursor-pointer">
            I accept the{' '}
            <span className="text-primary font-semibold">Terms & Conditions</span>
            {' '}and{' '}
            <span className="text-primary font-semibold">Privacy Policy</span>
            {' '}and understand how my data is used.
          </Label>
        </div>

        <DialogFooter>
          <Button
            onClick={handleContinue}
            disabled={!accepted || recordAcceptance.isPending}
            className="w-full rounded-xl"
          >
            {recordAcceptance.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Continue to TRANQUIL →'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
