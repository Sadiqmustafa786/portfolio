import { useEffect, useState } from "react";

/** Selector for elements that should trigger "pointer" / hover state on custom cursor */
const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input[type="submit"], input[type="button"], [class*="cursor-pointer"]';

function getReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getHasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHover, setIsHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(getReducedMotion);
  const [hasFinePointer, setHasFinePointer] = useState(getHasFinePointer);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReduce = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleReduce);
    return () => mediaQuery.removeEventListener("change", handleReduce);
  }, []);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const handlePointer = (e) => setHasFinePointer(e.matches);
    pointerQuery.addEventListener("change", handlePointer);
    return () => pointerQuery.removeEventListener("change", handlePointer);
  }, []);

  useEffect(() => {
    if (reducedMotion || !hasFinePointer) return;
    document.documentElement.classList.add("custom-cursor-active");
    return () =>
      document.documentElement.classList.remove("custom-cursor-active");
  }, [reducedMotion, hasFinePointer]);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = target?.closest(CLICKABLE_SELECTOR);
      setIsHover(!!clickable);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
    };
  }, [reducedMotion, isVisible]);

  if (reducedMotion || !hasFinePointer) return null;

  return (
    <div
      className="animated-cursor"
      aria-hidden
      style={{
        "--cursor-x": `${position.x}px`,
        "--cursor-y": `${position.y}px`,
        opacity: isVisible ? 1 : 0,
      }}
      data-hover={isHover}
    >
      <span className="animated-cursor__dot" />
      <span className="animated-cursor__ring" />
    </div>
  );
}
