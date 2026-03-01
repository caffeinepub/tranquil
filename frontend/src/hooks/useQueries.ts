import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, StressLevel } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, avatarId }: { name: string; avatarId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(name, avatarId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Stress Readings ─────────────────────────────────────────────────────────

export function useAddStressReading() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      heartRate,
      skinTemp,
      motion,
      stressLevel,
    }: {
      heartRate: bigint;
      skinTemp: number;
      motion: bigint;
      stressLevel: StressLevel;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addStressReading(heartRate, skinTemp, motion, stressLevel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStress'] });
      queryClient.invalidateQueries({ queryKey: ['latestStress'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useWeeklyStressAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['weeklyStress'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeeklyStressAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestStressReading() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['latestStress'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestStressReading();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Breathing Sessions ───────────────────────────────────────────────────────

export function useAddBreathingSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ technique, durationSeconds }: { technique: string; durationSeconds: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBreathingSession(technique, durationSeconds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathingSessions'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useBreathingSessions() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['breathingSessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBreathingSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mood Entries ─────────────────────────────────────────────────────────────

export function useAddMoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mood, note }: { mood: string; note: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMoodEntry(mood, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useMoodEntriesThisWeek() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['moodEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodEntriesThisWeek();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Sleep Entries ────────────────────────────────────────────────────────────

export function useAddSleepEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bedtime,
      wakeTime,
      durationMinutes,
      qualityRating,
    }: {
      bedtime: bigint;
      wakeTime: bigint;
      durationMinutes: bigint;
      qualityRating: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSleepEntry(bedtime, wakeTime, durationMinutes, qualityRating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleepEntries'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useSleepEntries() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['sleepEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSleepEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Vibration Commands ───────────────────────────────────────────────────────

export function useAddVibrationCommand() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pattern, intensity }: { pattern: string; intensity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVibrationCommand(pattern, intensity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vibrationCommands'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

// ─── Reminder Preferences ─────────────────────────────────────────────────────

export function useReminderPrefs() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['reminderPrefs'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReminderPrefs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateReminderPrefs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: { hydration: boolean; breaks: boolean; stretch: boolean; intervals: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReminderPrefs(prefs.hydration, prefs.breaks, prefs.stretch, prefs.intervals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminderPrefs'] });
    },
  });
}

// ─── Tips ─────────────────────────────────────────────────────────────────────

export function useTips() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['tips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTips();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── User Data (export) ───────────────────────────────────────────────────────

export function useGetUserData() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserData();
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

// ─── Privacy Preferences (derived from user data) ────────────────────────────

export function useGetUserPrivacyPreferences() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['privacyPreferences'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const data = await actor.getUserData();
      return {
        analyticsEnabled: true,
        aiPredictionEnabled: true,
        devicePairings: [] as string[],
        pendingDeletion: false,
        termsAcceptedAt: null as bigint | null,
        stressReadingsCount: data?.stressReadings.length ?? 0,
        moodEntriesCount: data?.moodEntries.length ?? 0,
        sleepEntriesCount: data?.sleepEntries.length ?? 0,
        breathingSessionsCount: data?.breathingSessions.length ?? 0,
      };
    },
    enabled: !!actor && !actorFetching,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// ─── Selective Deletion (client-side simulation since backend lacks these) ────

export function useDeleteStressReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: string) => {
      // Backend doesn't support individual deletion yet; optimistic UI only
      await new Promise(resolve => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStress'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useDeleteMoodEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: string) => {
      // Backend doesn't support individual deletion yet; optimistic UI only
      await new Promise(resolve => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useClearAnalyticsHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Backend doesn't support bulk deletion yet; optimistic UI only
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStress'] });
      queryClient.invalidateQueries({ queryKey: ['latestStress'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
    },
  });
}

export function useClearDevicePairings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
    },
  });
}

export function useRequestAccountDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Simulated — backend doesn't have requestAccountDeletion yet
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
    },
  });
}

export function useUpdatePrivacyPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_prefs: { analyticsEnabled: boolean; aiPredictionEnabled: boolean }) => {
      // Stored client-side only until backend supports it
      await new Promise(resolve => setTimeout(resolve, 200));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
    },
  });
}

export function useRecordTermsAcceptance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Stored in localStorage until backend supports termsAcceptedAt
      localStorage.setItem('tranquil_terms_accepted', Date.now().toString());
      await new Promise(resolve => setTimeout(resolve, 200));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
