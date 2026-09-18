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
  options = DEFAULT_OPTIONS,
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
