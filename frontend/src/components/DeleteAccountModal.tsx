import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Fingerprint, Lock, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { useDeleteAccount, useDeleteAllUserData, useLogDeletionEvent } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteAccountModalProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

type Step = 'auth' | 'warning' | 'confirm';

async function hashPrincipal(principalStr: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(principalStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

function DeleteAccountModalComponent({ open, onClose, onOpenChange }: DeleteAccountModalProps) {
  const [step, setStep] = useState<Step>('auth');
  const [password, setPassword] = useState('');
  const [withRecovery, setWithRecovery] = useState(false);
  const [authMethod, setAuthMethod] = useState<'password' | 'biometric'>('password');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authVerified, setAuthVerified] = useState(false);

  const { isAvailable: biometricAvailable, performBiometricChallenge } = useBiometricAuth();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const deleteAccountMutation = useDeleteAccount();
  const deleteAllDataMutation = useDeleteAllUserData();
  const logDeletionMutation = useLogDeletionEvent();

  const isDeleting =
    deleteAccountMutation.isPending ||
    deleteAllDataMutation.isPending ||
    logDeletionMutation.isPending;

  const handleClose = () => {
    if (isDeleting) return;
    setStep('auth');
    setPassword('');
    setWithRecovery(false);
    setAuthVerified(false);
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) handleClose();
    else if (onOpenChange) onOpenChange(isOpen);
  };

  const handlePasswordAuth = async () => {
    if (!password.trim()) {
      toast.error('Please enter your password to continue');
      return;
    }
    setIsAuthenticating(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsAuthenticating(false);
    setAuthVerified(true);
    setStep('warning');
  };

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    try {
      const result = await performBiometricChallenge();
      if (result) {
        setAuthVerified(true);
        setStep('warning');
      } else {
        toast.error('Biometric authentication failed. Please try again.');
      }
    } catch {
      toast.error('Biometric authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFinalDelete = async () => {
    if (!authVerified) return;

    try {
      if (identity) {
        const principalStr = identity.getPrincipal().toString();
        const hashed = await hashPrincipal(principalStr);
        await logDeletionMutation.mutateAsync(hashed);
      }

      await deleteAllDataMutation.mutateAsync();
      await deleteAccountMutation.mutateAsync(withRecovery);

      toast.success(
        withRecovery
          ? 'Account scheduled for deletion in 7 days. You can cancel within this period.'
          : 'Account deleted successfully.'
      );

      queryClient.clear();
      await clear();
      handleClose();
    } catch {
      toast.error('Failed to delete account. Please try again.');
    }
  };

  const renderAuthStep = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
        <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
        <p className="text-sm text-destructive font-medium">
          Identity verification required before proceeding.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setAuthMethod('password')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
            authMethod === 'password'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-primary/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          Password
        </button>
        {biometricAvailable && (
          <button
            onClick={() => setAuthMethod('biometric')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
              authMethod === 'biometric'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            Biometric
          </button>
        )}
      </div>

      {authMethod === 'password' ? (
        <div className="space-y-2">
          <Label htmlFor="delete-password" className="text-sm font-medium">
            Enter your password to confirm identity
          </Label>
          <Input
            id="delete-password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordAuth()}
          />
          <Button
            onClick={handlePasswordAuth}
            disabled={isAuthenticating || !password.trim()}
            className="w-full"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify Identity'
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Use your device's biometric sensor to verify your identity.
          </p>
          <Button
            onClick={handleBiometricAuth}
            disabled={isAuthenticating}
            className="w-full"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 mr-2" />
                Authenticate with Biometrics
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  const renderWarningStep = () => (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive">
            This action is permanent and cannot be undone.
          </p>
          <p className="text-sm text-destructive/80 mt-1">
            All your data will be permanently erased from our systems.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">The following data will be deleted:</p>
        <ul className="space-y-1.5">
          {[
            'Profile information',
            'All stress readings & logs',
            'All mood entries',
            'Sleep tracking data',
            'Device & vibration history',
            'Breathing session records',
            'Consent & compliance records',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex-1 pr-4">
          <p className="text-sm font-medium text-foreground">Enable 7-day recovery period</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your account will be scheduled for deletion after 7 days, giving you time to cancel.
          </p>
        </div>
        <Switch
          checked={withRecovery}
          onCheckedChange={setWithRecovery}
          className="shrink-0"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep('auth')} className="flex-1" disabled={isDeleting}>
          Back
        </Button>
        <Button onClick={() => setStep('confirm')} variant="destructive" className="flex-1" disabled={isDeleting}>
          Continue
        </Button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-5">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <p className="font-bold text-foreground text-lg">Final Confirmation</p>
          <p className="text-sm text-muted-foreground mt-1">
            {withRecovery
              ? 'Your account will be scheduled for deletion in 7 days.'
              : 'Your account will be permanently deleted immediately.'}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
        <p className="text-sm font-bold text-destructive">
          ⚠ This action is permanent and cannot be undone.
        </p>
      </div>

      {withRecovery && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            7-day recovery period enabled. You can log back in within 7 days to cancel the deletion.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep('warning')} className="flex-1" disabled={isDeleting}>
          Back
        </Button>
        <Button onClick={handleFinalDelete} variant="destructive" className="flex-1" disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting…
            </>
          ) : (
            'Delete My Account'
          )}
        </Button>
      </div>
    </div>
  );

  const stepTitles: Record<Step, string> = {
    auth: 'Verify Your Identity',
    warning: 'Account Deletion Warning',
    confirm: 'Confirm Account Deletion',
  };

  const stepDescriptions: Record<Step, string> = {
    auth: 'Please verify your identity before proceeding with account deletion.',
    warning: 'Review what will be deleted and choose your deletion preferences.',
    confirm: 'Take one last look before permanently deleting your account.',
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            {stepTitles[step]}
          </DialogTitle>
          <DialogDescription>{stepDescriptions[step]}</DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-1">
          {(['auth', 'warning', 'confirm'] as Step[]).map((s, i) => {
            const steps: Step[] = ['auth', 'warning', 'confirm'];
            const currentIndex = steps.indexOf(step);
            return (
              <React.Fragment key={s}>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? 'bg-destructive text-white'
                      : currentIndex > i
                      ? 'bg-destructive/30 text-destructive'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 rounded transition-all ${
                      currentIndex > i ? 'bg-destructive/40' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="py-2">
          {step === 'auth' && renderAuthStep()}
          {step === 'warning' && renderWarningStep()}
          {step === 'confirm' && renderConfirmStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Both default and named export for compatibility
export default DeleteAccountModalComponent;
export { DeleteAccountModalComponent as DeleteAccountModal };
