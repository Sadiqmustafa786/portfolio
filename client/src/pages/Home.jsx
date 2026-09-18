import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Stats from "../components/sections/Stats";
import Contact from "../components/sections/Contact";
import Hero from "../components/sections/Hero";
import AnimateIn from "../components/common/AnimateIn";

export default function Home() {
  return (
    <>
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
    </>
  );
}
