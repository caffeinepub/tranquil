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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRequestAccountDeletion } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const requestDeletion = useRequestAccountDeletion();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isConfirmed = confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;
    try {
      await requestDeletion.mutateAsync();
      toast.success('Your account deletion has been scheduled. You have 30 days to cancel.', {
        duration: 5000,
      });
      queryClient.clear();
      await clear();
      onClose();
    } catch {
      toast.error('Failed to schedule account deletion. Please try again.');
    }
  };

  const handleClose = () => {
    if (!requestDeletion.isPending) {
      setConfirmText('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 rounded-3xl border-destructive/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={22} className="text-destructive" />
            </div>
            <DialogTitle className="text-xl font-bold font-display text-foreground">
              Delete My Account
            </DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="space-y-3 text-left">
              <p className="text-sm font-semibold text-destructive">
                ⚠️ This action is permanent and cannot be undone.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deleting your account will permanently remove all of your data, including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Personal profile & settings</li>
                <li>All stress logs & readings</li>
                <li>Mood journal entries</li>
                <li>Sleep tracking data</li>
                <li>Device pairing history</li>
                <li>Breathing session records</li>
              </ul>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  🕐 A 30-day grace period applies. You can cancel deletion by logging back in within 30 days.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="confirm-delete" className="text-sm font-semibold text-foreground">
            Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="Type DELETE here..."
            className="rounded-xl font-mono border-destructive/30 focus:border-destructive"
            disabled={requestDeletion.isPending}
          />
        </div>

        <DialogFooter className="flex gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={requestDeletion.isPending}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed || requestDeletion.isPending}
            className="flex-1 rounded-xl gap-2"
          >
            {requestDeletion.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete My Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
