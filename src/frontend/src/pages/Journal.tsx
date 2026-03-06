import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast } from "sonner";
import { MOODS, MoodSelector } from "../components/MoodSelector";
import { useAddMoodEntry, useMoodEntriesThisWeek } from "../hooks/useQueries";

export function Journal() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const addMoodEntry = useAddMoodEntry();
  const { data: entries, isLoading } = useMoodEntriesThisWeek();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood first");
      return;
    }
    try {
      await addMoodEntry.mutateAsync({
        mood: selectedMood,
        note: note.trim() || null,
      });
      toast.success("Mood logged! 📔");
      setSelectedMood(null);
      setNote("");
    } catch {
      toast.error("Failed to save mood entry");
    }
  };

  const getMoodEmoji = (mood: string) =>
    MOODS.find((m) => m.value === mood)?.emoji ?? "😐";
  const getMoodLabel = (mood: string) =>
    MOODS.find((m) => m.value === mood)?.label ?? mood;

  const formatTimestamp = (ts: bigint) => {
    const date = new Date(Number(ts) / 1_000_000);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Mood Journal 📔
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          How are you feeling right now?
        </p>
      </div>

      {/* Mood Check-in */}
      <div className="p-5 bg-card rounded-3xl border border-border space-y-4">
        <h2 className="text-sm font-bold text-foreground">Today's Check-in</h2>
        <MoodSelector selectedMood={selectedMood} onSelect={setSelectedMood} />

        {selectedMood && (
          <div className="space-y-3 animate-fade-in-up">
            <Textarea
              placeholder="Add a note (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              className="rounded-xl resize-none text-sm"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {note.length}/200
              </span>
              <Button
                onClick={handleSubmit}
                disabled={addMoodEntry.isPending}
                size="sm"
                className="rounded-xl px-6"
              >
                {addMoodEntry.isPending ? "Saving..." : "Log Mood"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Past Entries */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          This Week
        </h2>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && (!entries || entries.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">No entries this week yet</p>
          </div>
        )}

        {entries && entries.length > 0 && (
          <div className="space-y-2">
            {[...entries].reverse().map((entry) => (
              <div
                key={String(entry.timestamp)}
                className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border"
              >
                <span className="text-2xl flex-shrink-0">
                  {getMoodEmoji(entry.mood)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {getMoodLabel(entry.mood)}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
