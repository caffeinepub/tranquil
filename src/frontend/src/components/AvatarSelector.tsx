import React from "react";

interface AvatarSelectorProps {
  selectedAvatarId: number;
  onSelect: (id: number) => void;
}

const AVATAR_EMOJIS = ["🧘", "🌸", "🦋", "🌊", "🌿", "⭐"];
const AVATAR_COLORS = [
  "#a78bfa",
  "#f9a8d4",
  "#60d4b0",
  "#7dd3fc",
  "#86efac",
  "#fde68a",
];

export function AvatarSelector({
  selectedAvatarId,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATAR_EMOJIS.map((emoji, i) => {
        const id = i + 1;
        const isSelected = selectedAvatarId === id;
        return (
          <button
            type="button"
            key={id}
            onClick={() => onSelect(id)}
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
              border-2 transition-all duration-200
              ${isSelected ? "scale-110 shadow-soft" : "border-transparent hover:scale-105"}
            `}
            style={{
              backgroundColor: `${AVATAR_COLORS[i]}25`,
              borderColor: isSelected ? AVATAR_COLORS[i] : "transparent",
              boxShadow: isSelected ? `0 0 12px ${AVATAR_COLORS[i]}50` : "none",
            }}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

export const AVATAR_EMOJIS_LIST = AVATAR_EMOJIS;
