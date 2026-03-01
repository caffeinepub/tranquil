import React, { useState } from 'react';
import { Trash2, BarChart2, Smartphone, Heart, Activity, Loader2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import {
  useDeleteStressReading,
  useDeleteMoodEntry,
  useClearAnalyticsHistory,
  useResetDevicePairing,
  useGetLatestStressReading,
  useGetMoodEntriesThisWeek,
} from '../hooks/useQueries';

export default function SelectiveDataDeletionCard() {
  const { data: latestStress } = useGetLatestStressReading();
  const { data: moodEntries } = useGetMoodEntriesThisWeek();

  const deleteStressMutation = useDeleteStressReading();
  const deleteMoodMutation = useDeleteMoodEntry();
  const clearAnalyticsMutation = useClearAnalyticsHistory();
  const resetDeviceMutation = useResetDevicePairing();

  const latestMood = moodEntries && moodEntries.length > 0 ? moodEntries[moodEntries.length - 1] : null;

  const actions = [
    {
      id: 'stress',
      icon: <Activity className="w-4 h-4 text-primary" />,
      label: 'Delete Latest Stress Reading',
      description: latestStress
        ? `Remove the most recent stress reading (${new Date(Number(latestStress.timestamp) / 1_000_000).toLocaleDateString()})`
        : 'No stress readings found',
      disabled: !latestStress,
      isPending: deleteStressMutation.isPending,
      confirmTitle: 'Delete Latest Stress Reading?',
      confirmDesc: 'This will permanently remove your most recent stress reading. This action cannot be undone.',
      onConfirm: () => {
        if (latestStress) {
          deleteStressMutation.mutate(latestStress.timestamp);
        }
      },
    },
    {
      id: 'mood',
      icon: <Heart className="w-4 h-4 text-primary" />,
      label: 'Delete Latest Mood Entry',
      description: latestMood
        ? `Remove the most recent mood entry (${latestMood.mood})`
        : 'No mood entries found this week',
      disabled: !latestMood,
      isPending: deleteMoodMutation.isPending,
      confirmTitle: 'Delete Latest Mood Entry?',
      confirmDesc: 'This will permanently remove your most recent mood entry. This action cannot be undone.',
      onConfirm: () => {
        if (latestMood) {
          deleteMoodMutation.mutate(latestMood.timestamp);
        }
      },
    },
    {
      id: 'analytics',
      icon: <BarChart2 className="w-4 h-4 text-primary" />,
      label: 'Clear All Analytics History',
      description: 'Remove all stress readings, mood entries, sleep data, and breathing sessions',
      disabled: false,
      isPending: clearAnalyticsMutation.isPending,
      confirmTitle: 'Clear All Analytics History?',
      confirmDesc:
        'This will permanently delete all your stress readings, mood entries, sleep data, and breathing sessions. This action cannot be undone.',
      onConfirm: () => clearAnalyticsMutation.mutate(),
    },
    {
      id: 'device',
      icon: <Smartphone className="w-4 h-4 text-primary" />,
      label: 'Reset Device Pairing Data',
      description: 'Remove all vibration commands and device history',
      disabled: false,
      isPending: resetDeviceMutation.isPending,
      confirmTitle: 'Reset Device Pairing Data?',
      confirmDesc:
        'This will permanently remove all vibration commands and device history. This action cannot be undone.',
      onConfirm: () => resetDeviceMutation.mutate(),
    },
  ];

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div
          key={action.id}
          className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              {action.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{action.description}</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={action.disabled || action.isPending}
                className="shrink-0 ml-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                {action.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{action.confirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>{action.confirmDesc}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={action.onConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
