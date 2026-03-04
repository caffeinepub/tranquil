import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BreathingSession {
    technique: string;
    durationSeconds: bigint;
    timestamp: bigint;
}
export interface SleepEntry {
    bedtime: bigint;
    wakeTime: bigint;
    durationMinutes: bigint;
    timestamp: bigint;
    qualityRating: bigint;
}
export interface VibrationCommand {
    pattern: string;
    timestamp: bigint;
    intensity: bigint;
}
export interface TipCard {
    title: string;
    description: string;
    category: string;
}
export interface MoodEntry {
    mood: string;
    note?: string;
    timestamp: bigint;
}
export interface StressReading {
    stressLevel: StressLevel;
    heartRate: bigint;
    skinTemp: number;
    timestamp: bigint;
    motion: bigint;
}
export interface UserDataView {
    reminderPrefs: ReminderPreferences;
    sleepEntries: Array<SleepEntry>;
    moodEntries: Array<MoodEntry>;
    breathingSessions: Array<BreathingSession>;
    vibrationCommands: Array<VibrationCommand>;
    stressReadings: Array<StressReading>;
    profile: UserProfile;
}
export interface UserProfile {
    name: string;
    avgWeeklyStressScore: number;
    totalMoodEntries: bigint;
    totalBreathingSessions: bigint;
    avatarId: bigint;
}
export interface ReminderPreferences {
    breaks: boolean;
    intervals: bigint;
    hydration: boolean;
    stretch: boolean;
}
export enum StressLevel {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBreathingSession(technique: string, durationSeconds: bigint): Promise<void>;
    addMoodEntry(mood: string, note: string | null): Promise<void>;
    addSleepEntry(bedtime: bigint, wakeTime: bigint, durationMinutes: bigint, qualityRating: bigint): Promise<void>;
    addStressReading(heartRate: bigint, skinTemp: number, motion: bigint, stressLevel: StressLevel): Promise<void>;
    addVibrationCommand(pattern: string, intensity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBreathingSessions(): Promise<Array<BreathingSession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLatestStressReading(): Promise<StressReading | null>;
    getMoodEntriesThisWeek(): Promise<Array<MoodEntry>>;
    getReadingsWithTip(_tip: string): Promise<Array<StressReading>>;
    getReminderPrefs(): Promise<ReminderPreferences>;
    getSleepEntries(): Promise<Array<SleepEntry>>;
    getTips(): Promise<Array<TipCard>>;
    getUserData(): Promise<UserDataView | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVibrationCommands(): Promise<Array<VibrationCommand>>;
    getWeeklyStressAnalytics(): Promise<Array<StressReading>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateReminderPrefs(hydration: boolean, breaks: boolean, stretch: boolean, intervals: bigint): Promise<void>;
    updateUserProfile(name: string, avatarId: bigint): Promise<void>;
}
