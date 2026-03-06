import { Button } from "@/components/ui/button";
import { Vibrate } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { IntensitySlider } from "../components/IntensitySlider";
import { useAddVibrationCommand } from "../hooks/useQueries";

const PATTERNS = [
  {
    id: "gentle-pulse",
    label: "Gentle Pulse",
    emoji: "💓",
    description: "Soft rhythmic pulses for relaxation",
  },
  {
    id: "rhythmic-tap",
    label: "Rhythmic Tap",
    emoji: "🥁",
    description: "Steady tapping to ground your focus",
  },
  {
    id: "deep-wave",
    label: "Deep Wave",
    emoji: "🌊",
    description: "Long deep waves for stress release",
  },
];

export function VibrationControl() {
  const [selectedPattern, setSelectedPattern] =
    useState<string>("gentle-pulse");
  const [intensity, setIntensity] = useState(2);
  const addVibrationCommand = useAddVibrationCommand();

  const handleSend = async () => {
    try {
      await addVibrationCommand.mutateAsync({
        pattern: selectedPattern,
        intensity: BigInt(intensity),
      });
      toast.success("Command sent to band! 📳");
    } catch {
      toast.error("Failed to send command");
    }
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Vibration Therapy 📳
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control your wristband's vibration patterns
        </p>
      </div>

      {/* Band Status */}
      <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
        <div className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center">
          <Vibrate size={20} className="text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">TRANQUIL Band</p>
          <p className="text-xs text-amber-500">
            Simulated — BLE not available in browser
          </p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      </div>

      {/* Pattern Selection */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Vibration Pattern
        </h2>
        {PATTERNS.map((pattern) => (
          <button
            type="button"
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedPattern === pattern.id
                ? "border-primary/50 bg-primary/8 shadow-soft"
                : "border-border bg-card hover:border-primary/20"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors ${
                selectedPattern === pattern.id ? "bg-primary/15" : "bg-muted"
              }`}
            >
              {pattern.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">
                {pattern.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pattern.description}
              </p>
            </div>
            {selectedPattern === pattern.id && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Intensity */}
      <div className="p-5 bg-card rounded-2xl border border-border">
        <IntensitySlider value={intensity} onChange={setIntensity} />
      </div>

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={addVibrationCommand.isPending}
        className="w-full rounded-2xl py-5 font-bold text-base shadow-glow"
      >
        {addVibrationCommand.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Vibrate size={18} />
            Send to Band
          </span>
        )}
      </Button>

      {/* Info */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 <strong>How it works:</strong> Vibration therapy uses gentle haptic
          feedback to help regulate your nervous system and reduce stress.
          Commands are logged for your wellness history.
        </p>
      </div>
    </div>
  );
}
