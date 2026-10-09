import { useMemo } from "react";

const STAR_COUNT = 90;

const rand = (min, max) => Math.random() * (max - min) + min;

/**
 * Full-page stars: each star glows AND keeps floating upward non-stop.
 * Outer span = vertical travel (loops forever), inner span = glow + sideways sway.
 * Negative delays spread the stars across the whole screen from the first frame.
 */
export default function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        const float = rand(25, 60);
        return {
          id: i,
          left: `${rand(0, 100)}%`,
          size: `${rand(1.5, 3.5)}px`,
          float: `${float}s`,
          floatDelay: `-${rand(0, float)}s`,
          glow: `${rand(2.5, 5)}s`,
          sway: `${rand(6, 12)}s`,
          dx: `${rand(-30, 30)}px`,
        };
      }),
    []
  );

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {stars.map((s) => (
        <span
          key={s.id}
          className="star-float absolute top-full"
          style={{
            left: s.left,
            "--float": s.float,
            animationDelay: s.floatDelay,
          }}
        >
          <span
            className="star block rounded-full bg-current text-primary dark:text-white"
            style={{
              width: s.size,
              height: s.size,
              "--glow": s.glow,
              "--sway": s.sway,
              "--dx": s.dx,
            }}
          />
        </span>
      ))}
    </div>
  );
}