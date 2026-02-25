import Map "mo:core/Map";
import List "mo:core/List";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type StressLevel = {
    #low;
    #medium;
    #high;
  };

  type StressReading = {
    timestamp : Int;
    heartRate : Nat;
    skinTemp : Float;
    motion : Nat;
    stressLevel : StressLevel;
  };

  type BreathingSession = {
    timestamp : Int;
    technique : Text;
    durationSeconds : Nat;
  };

  type MoodEntry = {
    timestamp : Int;
    mood : Text;
    note : ?Text;
  };

  type SleepEntry = {
    timestamp : Int;
    bedtime : Int;
    wakeTime : Int;
    durationMinutes : Nat;
    qualityRating : Nat;
  };

  type VibrationCommand = {
    timestamp : Int;
    pattern : Text;
    intensity : Nat;
  };

  type ReminderPreferences = {
    hydration : Bool;
    breaks : Bool;
    stretch : Bool;
    intervals : Nat;
  };

  type UserProfile = {
    name : Text;
    avatarId : Nat;
    totalBreathingSessions : Nat;
    avgWeeklyStressScore : Float;
    totalMoodEntries : Nat;
  };

  type UserData = {
    stressReadings : List.List<StressReading>;
    breathingSessions : List.List<BreathingSession>;
    moodEntries : List.List<MoodEntry>;
    sleepEntries : List.List<SleepEntry>;
    vibrationCommands : List.List<VibrationCommand>;
    reminderPrefs : ReminderPreferences;
    profile : UserProfile;
  };

  type UserDataView = {
    stressReadings : [StressReading];
    breathingSessions : [BreathingSession];
    moodEntries : [MoodEntry];
    sleepEntries : [SleepEntry];
    vibrationCommands : [VibrationCommand];
    reminderPrefs : ReminderPreferences;
    profile : UserProfile;
  };

  type TipCard = {
    title : Text;
    description : Text;
    category : Text;
  };

  let usersData = Map.empty<Principal, UserData>();

  module MoodEntry {
    public func compareByTimestamp(a : MoodEntry, b : MoodEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module StressReading {
    public func compareByTimestamp(a : StressReading, b : StressReading) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module SleepEntry {
    public func compareByTimestamp(a : SleepEntry, b : SleepEntry) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module BreathingSession {
    public func compareByTimestamp(a : BreathingSession, b : BreathingSession) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module VibrationCommand {
    public func compareByTimestamp(a : VibrationCommand, b : VibrationCommand) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  func getOrCreateUserData(caller : Principal) : UserData {
    switch (usersData.get(caller)) {
      case (null) {
        {
          stressReadings = List.empty<StressReading>();
          breathingSessions = List.empty<BreathingSession>();
          moodEntries = List.empty<MoodEntry>();
          sleepEntries = List.empty<SleepEntry>();
          vibrationCommands = List.empty<VibrationCommand>();
          reminderPrefs = {
            hydration = true;
            breaks = true;
            stretch = true;
            intervals = 60;
          };
          profile = {
            name = "User";
            avatarId = 1;
            totalBreathingSessions = 0;
            avgWeeklyStressScore = 0.0;
            totalMoodEntries = 0;
          };
        };
      };
      case (?data) { data };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    switch (usersData.get(caller)) {
      case (null) { null };
      case (?data) { ?data.profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only to view your own profile");
    };
    switch (usersData.get(user)) {
      case (null) { null };
      case (?data) { ?data.profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let userData = getOrCreateUserData(caller);
    usersData.add(caller, { userData with profile = profile });
  };

  public shared ({ caller }) func addStressReading(heartRate : Nat, skinTemp : Float, motion : Nat, stressLevel : StressLevel) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add stress readings");
    };
    let newReading : StressReading = {
      timestamp = Time.now();
      heartRate;
      skinTemp;
      motion;
      stressLevel;
    };
    let userData = getOrCreateUserData(caller);
    userData.stressReadings.add(newReading);
    usersData.add(caller, userData);
  };

  public shared ({ caller }) func addBreathingSession(technique : Text, durationSeconds : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add breathing sessions");
    };
    let newSession : BreathingSession = {
      timestamp = Time.now();
      technique;
      durationSeconds;
    };
    let userData = getOrCreateUserData(caller);
    userData.breathingSessions.add(newSession);
    usersData.add(caller, userData);
  };

  public shared ({ caller }) func addMoodEntry(mood : Text, note : ?Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add mood entries");
    };
    let newMood : MoodEntry = {
      timestamp = Time.now();
      mood;
      note;
    };
    let userData = getOrCreateUserData(caller);
    userData.moodEntries.add(newMood);
    usersData.add(caller, userData);
  };

  public shared ({ caller }) func addSleepEntry(bedtime : Int, wakeTime : Int, durationMinutes : Nat, qualityRating : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add sleep entries");
    };
    let newSleep : SleepEntry = {
      timestamp = Time.now();
      bedtime;
      wakeTime;
      durationMinutes;
      qualityRating;
    };
    let userData = getOrCreateUserData(caller);
    userData.sleepEntries.add(newSleep);
    usersData.add(caller, userData);
  };

  public shared ({ caller }) func addVibrationCommand(pattern : Text, intensity : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add vibration commands");
    };
    let newCommand : VibrationCommand = {
      timestamp = Time.now();
      pattern;
      intensity;
    };
    let userData = getOrCreateUserData(caller);
    userData.vibrationCommands.add(newCommand);
    usersData.add(caller, userData);
  };

  public shared ({ caller }) func updateReminderPrefs(hydration : Bool, breaks : Bool, stretch : Bool, intervals : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update reminder preferences");
    };
    let newPrefs : ReminderPreferences = {
      hydration;
      breaks;
      stretch;
      intervals;
    };
    let userData = getOrCreateUserData(caller);
    usersData.add(caller, { userData with reminderPrefs = newPrefs });
  };

  public query ({ caller }) func getReminderPrefs() : async ReminderPreferences {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get reminder preferences");
    };
    let userData = getOrCreateUserData(caller);
    userData.reminderPrefs;
  };

  public shared ({ caller }) func updateUserProfile(name : Text, avatarId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update their profile");
    };
    let userData = getOrCreateUserData(caller);
    let updatedProfile : UserProfile = {
      userData.profile with
      name = name;
      avatarId = avatarId;
    };
    usersData.add(caller, { userData with profile = updatedProfile });
  };

  func getUserDataSorted<T>(list : List.List<T>, compare : (T, T) -> Order.Order) : [T] {
    let values = list.values();
    values.toArray().sort();
  };

  public query ({ caller }) func getMoodEntriesThisWeek() : async [MoodEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get mood entries");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return [] };
      case (?data) { data };
    };

    let now = Time.now();
    let weekAgo = now - 7 * 24 * 60 * 60 * 1_000_000_000;

    let entries = List.empty<MoodEntry>();
    for (entry in userData.moodEntries.values()) {
      if (entry.timestamp >= weekAgo) {
        entries.add(entry);
      };
    };

    getUserDataSorted(entries, MoodEntry.compareByTimestamp);
  };

  public query ({ caller }) func getWeeklyStressAnalytics() : async [StressReading] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get stress analytics");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return [] };
      case (?data) { data };
    };

    let now = Time.now();
    let weekAgo = now - 7 * 24 * 60 * 60 * 1_000_000_000;

    let entries = List.empty<StressReading>();
    for (entry in userData.stressReadings.values()) {
      if (entry.timestamp >= weekAgo) {
        entries.add(entry);
      };
    };

    getUserDataSorted(entries, StressReading.compareByTimestamp);
  };

  public query ({ caller }) func getSleepEntries() : async [SleepEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get sleep entries");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return [] };
      case (?data) { data };
    };
    getUserDataSorted(userData.sleepEntries, SleepEntry.compareByTimestamp);
  };

  public query ({ caller }) func getBreathingSessions() : async [BreathingSession] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get breathing sessions");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return [] };
      case (?data) { data };
    };
    getUserDataSorted(userData.breathingSessions, BreathingSession.compareByTimestamp);
  };

  public query ({ caller }) func getVibrationCommands() : async [VibrationCommand] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get vibration commands");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return [] };
      case (?data) { data };
    };
    getUserDataSorted(userData.vibrationCommands, VibrationCommand.compareByTimestamp);
  };

  public query ({ caller }) func getLatestStressReading() : async ?StressReading {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get stress readings");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return null };
      case (?data) { data };
    };
    let arr = userData.stressReadings.toArray();
    if (arr.size() == 0) { return null };
    ?arr[arr.size() - 1];
  };

  func userDataToView(userData : UserData) : UserDataView {
    {
      stressReadings = userData.stressReadings.toArray();
      breathingSessions = userData.breathingSessions.toArray();
      moodEntries = userData.moodEntries.toArray();
      sleepEntries = userData.sleepEntries.toArray();
      vibrationCommands = userData.vibrationCommands.toArray();
      reminderPrefs = userData.reminderPrefs;
      profile = userData.profile;
    };
  };

  public query ({ caller }) func getUserData() : async ?UserDataView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access data");
    };
    switch (usersData.get(caller)) {
      case (null) { null };
      case (?userData) { ?userDataToView(userData) };
    };
  };

  public query ({ caller }) func getTips() : async [TipCard] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get tips");
    };

    let tips = [
      {
        title = "Stay Hydrated";
        description = "Drink at least 8 glasses of water daily to reduce stress and improve focus.";
        category = "wellness";
      },
      {
        title = "Take a Break";
        description = "Step away from your work for 5 minutes to clear your mind and reset.";
        category = "break";
      },
      {
        title = "Deep Breathing";
        description = "Practice deep breathing exercises to lower your stress levels.";
        category = "breathing";
      },
      {
        title = "Move Your Body";
        description = "Stand up and stretch or take a short walk to release tension.";
        category = "movement";
      },
      {
        title = "Healthy Snacks";
        description = "Eat a healthy snack to maintain energy and reduce anxiety.";
        category = "nutrition";
      },
      {
        title = "Mindfulness";
        description = "Take a moment to be present and aware of your thoughts and feelings.";
        category = "mindfulness";
      },
    ];

    tips;
  };

  public query ({ caller }) func getReadingsWithTip(_tip : Text) : async [StressReading] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access readings");
    };
    let userData = switch (usersData.get(caller)) {
      case (null) { return [] };
      case (?data) { data };
    };
    userData.stressReadings.toArray().sliceToArray(0, userData.stressReadings.size());
  };
};
