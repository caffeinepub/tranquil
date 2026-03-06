import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReminderToggle } from "../components/ReminderToggle";
import { TipCard } from "../components/TipCard";
import {
  useReminderPrefs,
  useTips,
  useUpdateReminderPrefs,
} from "../hooks/useQueries";

export function TipsAndReminders() {
  const { data: tips, isLoading: tipsLoading } = useTips();
  const { data: reminderPrefs, isLoading: prefsLoading } = useReminderPrefs();
  const updateReminderPrefs = useUpdateReminderPrefs();

  const [hydration, setHydration] = useState(true);
  const [breaks, setBreaks] = useState(true);
  const [stretch, setStretch] = useState(true);

  useEffect(() => {
    if (reminderPrefs) {
      setHydration(reminderPrefs.hydration);
      setBreaks(reminderPrefs.breaks);
      setStretch(reminderPrefs.stretch);
    }
  }, [reminderPrefs]);

  const handleReminderChange = async (
    type: "hydration" | "breaks" | "stretch",
    value: boolean,
  ) => {
    const newHydration = type === "hydration" ? value : hydration;
    const newBreaks = type === "breaks" ? value : breaks;
    const newStretch = type === "stretch" ? value : stretch;

    if (type === "hydration") setHydration(value);
    if (type === "breaks") setBreaks(value);
    if (type === "stretch") setStretch(value);

    try {
      await updateReminderPrefs.mutateAsync({
        hydration: newHydration,
        breaks: newBreaks,
        stretch: newStretch,
        intervals: reminderPrefs?.intervals ?? BigInt(60),
      });
    } catch {
      toast.error("Failed to save reminder preferences");
    }
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          AI Tips 💡
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalized wellness guidance for you
        </p>
      </div>

      {/* Tips Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Today's Wellness Tips
        </h2>

        {tipsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : tips && tips.length > 0 ? (
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <TipCard key={tip.title} tip={tip} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">💡</p>
            <p className="text-sm">No tips available right now</p>
          </div>
        )}
      </div>

      {/* Smart Reminders */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Smart Reminders
        </h2>
        <p className="text-xs text-muted-foreground">
          Enable reminders to stay on top of your wellness routine
        </p>

        {prefsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <ReminderToggle
              id="tips-hydration"
              label="Hydration Reminder"
              emoji="💧"
              enabled={hydration}
              onToggle={(v) => handleReminderChange("hydration", v)}
            />
            <ReminderToggle
              id="tips-breaks"
              label="Take a Break"
              emoji="☕"
              enabled={breaks}
              onToggle={(v) => handleReminderChange("breaks", v)}
            />
            <ReminderToggle
              id="tips-stretch"
              label="Stretch Reminder"
              emoji="🧘"
              enabled={stretch}
              onToggle={(v) => handleReminderChange("stretch", v)}
            />
          </div>
        )}
      </div>

      {/* Wellness Insight */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
        <h3 className="text-sm font-bold text-foreground mb-2">
          🌟 Daily Insight
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Consistent small habits — like drinking water, taking short breaks,
          and practicing breathing — can reduce stress levels by up to 40% over
          time. Keep going!
        </p>
      </div>
    </div>
  );
}
