import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Edit2, LogOut, Sparkles, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AVATAR_EMOJIS_LIST,
  AvatarSelector,
} from "../components/AvatarSelector";
import { ProfileSetupModal } from "../components/ProfileSetupModal";
import { ProfileStats } from "../components/ProfileStats";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useUpdateUserProfile,
} from "../hooks/useQueries";

export function Profile() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const updateProfile = useUpdateUserProfile();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarId, setEditAvatarId] = useState(1);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditAvatarId(Number(profile.avatarId));
    }
  }, [profile]);

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: editName.trim(),
        avatarId: BigInt(editAvatarId),
      });
      toast.success("Profile updated! ✨");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const avatarEmoji = profile
    ? (AVATAR_EMOJIS_LIST[Number(profile.avatarId) - 1] ?? "🧘")
    : "🧘";
  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 10)}...`
    : "";

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-foreground">
          Profile 👤
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground
            hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : profile ? (
        <>
          {/* Avatar & Name Card */}
          <div className="p-6 bg-card rounded-3xl border border-border space-y-4">
            {!isEditing ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-4xl border-2 border-primary/20 shadow-soft">
                  {avatarEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    {profile.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {principalShort}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 mt-2 text-xs text-primary hover:opacity-80 transition-opacity font-semibold"
                  >
                    <Edit2 size={12} />
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Choose Avatar
                  </p>
                  <AvatarSelector
                    selectedAvatarId={editAvatarId}
                    onSelect={setEditAvatarId}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Display Name
                  </p>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-xl"
                    placeholder="Your name..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    size="sm"
                    className="flex-1 rounded-xl"
                  >
                    {updateProfile.isPending ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Check size={14} /> Save
                      </span>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name);
                      setEditAvatarId(Number(profile.avatarId));
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Your Stats
            </h2>
            <ProfileStats profile={profile} />
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              More
            </h2>
            {[
              { emoji: "😴", label: "Sleep Tracking", path: "/sleep" },
              { emoji: "📳", label: "Vibration Control", path: "/vibration" },
              { emoji: "💡", label: "AI Tips & Reminders", path: "/tips" },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border
                  hover:border-primary/30 hover:shadow-soft transition-all duration-200"
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="ml-auto text-muted-foreground">›</span>
              </a>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Welcoming profile setup card */}
          <div className="flex flex-col items-center gap-6 py-6">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-5xl border-2 border-primary/20 shadow-soft animate-pulse-slow">
              🌸
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Welcome to TRANQUIL 🌸
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Complete your profile to unlock personalized stress tracking,
                wellness tips, and your calm companion experience.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="w-full space-y-2">
              {[
                { emoji: "📊", text: "Personalized stress analytics" },
                { emoji: "💡", text: "AI-powered wellness tips" },
                { emoji: "🧘", text: "Guided breathing sessions" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-sm text-foreground font-medium">
                    {item.text}
                  </span>
                  <Sparkles size={12} className="ml-auto text-primary/60" />
                </div>
              ))}
            </div>

            <Button
              data-ocid="profile.primary_button"
              onClick={() => setShowSetupModal(true)}
              className="w-full rounded-xl py-5 font-bold text-base"
              size="lg"
            >
              Set Up My Profile 🌿
            </Button>
          </div>

          {/* Inline ProfileSetupModal triggered from this page */}
          {showSetupModal && <ProfileSetupModal open={showSetupModal} />}
        </>
      )}
    </div>
  );
}
