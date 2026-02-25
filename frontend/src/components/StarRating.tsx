import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 28 }: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-150 hover:scale-110"
        >
          <Star
            size={size}
            className="transition-colors duration-150"
            fill={(hovered || value) >= star ? '#f59e0b' : 'transparent'}
            stroke={(hovered || value) >= star ? '#f59e0b' : 'oklch(var(--muted-foreground))'}
          />
        </button>
      ))}
    </div>
  );
}
