import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Stats from "../components/sections/Stats";
import Contact from "../components/sections/Contact";
import Hero from "../components/sections/Hero";
import AnimateIn from "../components/common/AnimateIn";
import Stars from "../components/common/Stars";

const sectionGlowStars = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 7 + 5) % 100}%`,
  bottom: `${(index * 11 + 8) % 36}%`,
  size: `${2 + (index % 4) * 1.5}px`,
  delay: `${(index * 0.8).toFixed(2)}s`,
  duration: `${8 + (index % 6)}s`,
  dx: `${(index % 2 === 0 ? 1 : -1) * (12 + (index % 5) * 5)}px`,
}));

export default function Home() {
  return (
    <div className="relative isolate bg-white dark:bg-slate-900">
      {/* Stars sit behind all sections */}
      <Stars />

      <div className="section-glow-layer pointer-events-none absolute inset-x-0 bottom-0 z-0 block" aria-hidden="true">
        {sectionGlowStars.map((star) => (
          <span
            key={star.id}
            className="section-star"
            style={{
              left: star.left,
              bottom: star.bottom,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              "--dx": star.dx,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <AnimateIn>
          <Hero />
        </AnimateIn>
        <AnimateIn delay={100}>
          <About />
        </AnimateIn>
        <AnimateIn delay={100}>
          <Skills />
        </AnimateIn>
        <AnimateIn delay={100}>
          <Projects />
        </AnimateIn>
        <AnimateIn delay={100}>
          <Stats />
        </AnimateIn>
        <AnimateIn delay={100}>
          <Contact />
        </AnimateIn>
      </div>
    </div>
  );
}