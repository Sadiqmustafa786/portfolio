import { useState, useEffect, useRef } from "react";

const DEFAULT_OPTIONS = {
rootMargin: "0px 0px -40px 0px",
threshold: 0.1,
};

export default function AnimateIn({
children,
className = "",
delay = 0,
direction = "up",
duration = 700,
animateOnMount = false,
options = DEFAULT_OPTIONS,
}) {
const [inView, setInView] = useState(animateOnMount);
const ref = useRef(null);

const hiddenTransform = {
up: "translate-y-8",
down: "-translate-y-8",
left: "-translate-x-8",
right: "translate-x-8",
}[direction] ?? "translate-y-8";

useEffect(() => {
const el = ref.current;
if (!el) return;

```
if (animateOnMount) {
  setInView(true);
  return;
}

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setInView(true);
      observer.unobserve(el);
    }
  },
  options
);

observer.observe(el);

return () => observer.disconnect();
```

}, [animateOnMount, options]);

return ( <div ref={ref} className={className}>
<div
className={`transition-all ease-out ${
          inView
            ? "translate-x-0 translate-y-0 opacity-100"
            : `opacity-0 ${hiddenTransform}`
        } motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
style={{
transitionDuration: `${duration}ms`,
transitionDelay: inView ? `${delay}ms` : "0ms",
}}
>
{children} </div> </div>
);
}
