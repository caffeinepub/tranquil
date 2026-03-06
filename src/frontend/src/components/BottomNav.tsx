import { useLocation, useNavigate } from "@tanstack/react-router";
import { BarChart2, BookOpen, Home, Music, Wind } from "lucide-react";
import React from "react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/breathe", label: "Breathe", icon: Wind },
  { path: "/sounds", label: "Sounds", icon: Music },
  { path: "/journal", label: "Journal", icon: BookOpen },
  { path: "/analytics", label: "Analytics", icon: BarChart2 },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 max-w-[430px] mx-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              type="button"
              key={path}
              onClick={() => navigate({ to: path })}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/15" : ""}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-primary" : ""}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
