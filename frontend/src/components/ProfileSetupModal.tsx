import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AvatarSelector, AVATAR_EMOJIS_LIST } from './AvatarSelector';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open: boolean;
}

export function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [avatarId, setAvatarId] = useState(1);
  const saveProfile = useSaveCallerUserProfile();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        avatarId: BigInt(avatarId),
        totalBreathingSessions: BigInt(0),
        avgWeeklyStressScore: 0,
        totalMoodEntries: BigInt(0),
      });
      toast.success('Welcome to TRANQUIL! 🌿');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl border-border" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-display text-center">Welcome! 🌸</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Let's set up your TRANQUIL profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Avatar selection */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Choose your avatar</p>
            <AvatarSelector selectedAvatarId={avatarId} onSelect={setAvatarId} />
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-primary/10 border-2 border-primary/30">
                {AVATAR_EMOJIS_LIST[avatarId - 1]}
              </div>
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Your name</p>
            <Input
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded-xl"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full rounded-xl py-5 font-bold"
          >
            {saveProfile.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Start My Journey 🌿'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
