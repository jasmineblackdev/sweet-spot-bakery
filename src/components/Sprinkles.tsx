import { useMemo } from "react";

interface SprinklesProps {
  count?: number;
  className?: string;
}

const COLORS = [
  "var(--color-sprinkle-1)",
  "var(--color-sprinkle-2)",
  "var(--color-sprinkle-3)",
  "var(--color-sprinkle-4)",
];

export function Sprinkles({ count = 60, className = "" }: SprinklesProps) {
  const sprinkles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const duration = 4 + Math.random() * 6;
      const delay = -Math.random() * duration;
      const color = COLORS[i % COLORS.length];
      const rotate = Math.random() * 360;
      const scale = 0.6 + Math.random() * 0.9;
      return { left, duration, delay, color, rotate, scale, key: i };
    });
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-10 overflow-hidden ${className}`}
    >
      {sprinkles.map((s) => (
        <span
          key={s.key}
          className="sprinkle"
          style={{
            left: `${s.left}%`,
            backgroundColor: s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            transform: `rotate(${s.rotate}deg) scale(${s.scale})`,
          }}
        />
      ))}
    </div>
  );
}
