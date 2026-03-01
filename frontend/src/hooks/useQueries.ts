import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ConsentType, StressLevel, UserProfile, StressReading, MoodEntry, SleepEntry, BreathingSession, VibrationCommand, ReminderPreferences, UserDataView, ConsentRecord, TipCard, DeletionSchedule } from '../backend';
import { toast } from 'sonner';

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

export function useGetWeeklyStressAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<StressReading[]>({
    queryKey: ['weeklyStress'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeeklyStressAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useWeeklyStressAnalytics = useGetWeeklyStressAnalytics;

export function useGetLatestStressReading() {
  const { actor, isFetching } = useActor();

  return useQuery<StressReading | null>({
    queryKey: ['latestStress'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestStressReading();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useLatestStressReading = useGetLatestStressReading;

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

// ─── Breathing Sessions ──────────────────────────────────────────────────────

export function useGetBreathingSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<BreathingSession[]>({
    queryKey: ['breathingSessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBreathingSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useBreathingSessions = useGetBreathingSessions;

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

// ─── Mood Entries ────────────────────────────────────────────────────────────

export function useGetMoodEntriesThisWeek() {
  const { actor, isFetching } = useActor();

  return useQuery<MoodEntry[]>({
    queryKey: ['moodEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodEntriesThisWeek();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useMoodEntriesThisWeek = useGetMoodEntriesThisWeek;

export function useAddMoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mood, note }: { mood: string; note?: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMoodEntry(mood, note ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

// ─── Sleep Entries ───────────────────────────────────────────────────────────

export function useGetSleepEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<SleepEntry[]>({
    queryKey: ['sleepEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSleepEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useSleepEntries = useGetSleepEntries;

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

// ─── Vibration Commands ──────────────────────────────────────────────────────

export function useGetVibrationCommands() {
  const { actor, isFetching } = useActor();

  return useQuery<VibrationCommand[]>({
    queryKey: ['vibrationCommands'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVibrationCommands();
    },
    enabled: !!actor && !isFetching,
  });
}

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

// ─── Reminder Preferences ────────────────────────────────────────────────────

export function useGetReminderPrefs() {
  const { actor, isFetching } = useActor();

  return useQuery<ReminderPreferences>({
    queryKey: ['reminderPrefs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getReminderPrefs();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useReminderPrefs = useGetReminderPrefs;

export function useUpdateReminderPrefs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hydration,
      breaks,
      stretch,
      intervals,
    }: {
      hydration: boolean;
      breaks: boolean;
      stretch: boolean;
      intervals: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReminderPrefs(hydration, breaks, stretch, intervals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminderPrefs'] });
    },
  });
}

// ─── Tips ────────────────────────────────────────────────────────────────────

export function useGetTips() {
  const { actor, isFetching } = useActor();

  return useQuery<TipCard[]>({
    queryKey: ['tips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTips();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backwards compatibility
export const useTips = useGetTips;

// ─── User Data (Export) ──────────────────────────────────────────────────────

export function useGetUserData() {
  const { actor, isFetching } = useActor();

  return useQuery<UserDataView | null>({
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

// ─── Selective Data Deletion ─────────────────────────────────────────────────

export function useDeleteStressReading() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStressReading(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStress'] });
      queryClient.invalidateQueries({ queryKey: ['latestStress'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useDeleteMoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMoodEntry(timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useClearAnalyticsHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearAnalyticsHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyStress'] });
      queryClient.invalidateQueries({ queryKey: ['latestStress'] });
      queryClient.invalidateQueries({ queryKey: ['moodEntries'] });
      queryClient.invalidateQueries({ queryKey: ['sleepEntries'] });
      queryClient.invalidateQueries({ queryKey: ['breathingSessions'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
    },
  });
}

export function useResetDevicePairing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.resetDevicePairing();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vibrationCommands'] });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
    },
  });
}

// ─── Full Account Deletion ───────────────────────────────────────────────────

export function useDeleteAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withRecoveryPeriod: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAccount(withRecoveryPeriod);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useDeleteAllUserData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAllUserData();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useLogDeletionEvent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (hashedIdentifier: Uint8Array) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logDeletionEvent(hashedIdentifier);
    },
  });
}

export function useGetDeletionStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<DeletionSchedule | null>({
    queryKey: ['deletionStatus'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDeletionStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Consent Management ──────────────────────────────────────────────────────

export function useGetConsents() {
  const { actor, isFetching } = useActor();

  return useQuery<ConsentRecord[]>({
    queryKey: ['consents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConsents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasConsented(consentType: ConsentType) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasConsented', consentType],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasConsented(consentType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordConsent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consentType: ConsentType) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordConsent(consentType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consents'] });
      queryClient.invalidateQueries({ queryKey: ['hasConsented'] });
    },
  });
}

// ─── Legacy / Compatibility ───────────────────────────────────────────────────

export function useClearDevicePairings() {
  return useResetDevicePairing();
}

export function useRequestAccountDeletion() {
  return useDeleteAccount();
}

export function useUpdatePrivacyPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_prefs: { analyticsEnabled: boolean; aiPredictionEnabled: boolean }) => {
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
      localStorage.setItem('tranquil_terms_accepted', Date.now().toString());
      await new Promise(resolve => setTimeout(resolve, 200));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacyPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
