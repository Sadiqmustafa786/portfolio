import { useState, useEffect, useRef } from "react";

const DEFAULT_OPTIONS = {
  rootMargin: "0px 0px -40px 0px",
  threshold: 0.1,
};

/**
 * Wraps content and animates it when it enters the viewport (on scroll or on initial load).
 * Uses Intersection Observer; no extra dependencies.
 */
export default function AnimateIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  animateOnMount = false,
  options = DEFAULT_OPTIONS,
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const hiddenTransform = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "-translate-x-[100vw]",
    right: "translate-x-[100vw]",
  }[direction] ?? "translate-y-8";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (animateOnMount) {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateOnMount, options]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "translate-x-0 translate-y-0 opacity-100" : `opacity-0 ${hiddenTransform}`
      } motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
