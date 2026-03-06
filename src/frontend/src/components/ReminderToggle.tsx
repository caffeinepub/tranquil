import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface ReminderToggleProps {
  id: string;
  label: string;
  emoji: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ReminderToggle({
  id,
  label,
  emoji,
  enabled,
  onToggle,
}: ReminderToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
      </div>
      <Switch id={id} checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}
