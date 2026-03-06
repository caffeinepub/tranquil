import { useLocation, useNavigate } from "@tanstack/react-router";
import { Settings, User } from "lucide-react";
import React from "react";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { AVATAR_EMOJIS_LIST } from "./AvatarSelector";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profile } = useGetCallerUserProfile();

  const avatarEmoji = profile
    ? (AVATAR_EMOJIS_LIST[Number(profile.avatarId) - 1] ?? "🧘")
    : "🧘";

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-[430px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-sm shadow-soft">
            🧘
          </div>
          <span className="text-lg font-bold font-display tracking-tight text-foreground">
            TRANQUIL
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/tips" })}
            className={`p-2 rounded-xl transition-colors ${
              location.pathname === "/tips"
                ? "bg-primary/15 text-primary"
                : "hover:bg-muted text-muted-foreground"
            }`}
            title="AI Tips"
          >
            <span className="text-base">💡</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/profile" })}
            className={`p-2 rounded-xl transition-colors ${
              location.pathname === "/profile"
                ? "bg-primary/15 text-primary"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <span className="text-base">{avatarEmoji}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/settings" })}
            className={`p-2 rounded-xl transition-colors ${
              location.pathname === "/settings"
                ? "bg-primary/15 text-primary"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
