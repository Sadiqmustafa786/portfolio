import { useMemo } from "react";

export default function SectionStars({ count = 8, className = "" }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: `${(index * 17 + 6) % 100}%`,
        top: `${(index * 23 + 10) % 100}%`,
        size: `${2 + (index % 4) * 1.7}px`,
        delay: `${(index * 0.75).toFixed(2)}s`,
        duration: `${7 + (index % 5)}s`,
        dx: `${(index % 2 === 0 ? 1 : -1) * (14 + (index % 5) * 4)}px`,
      })),
    [count]
  );

  return (
    <div className={`section-starfield ${className}`} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="section-star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            "--dx": star.dx,
          }}
        />
      ))}
    </div>
  );
}
