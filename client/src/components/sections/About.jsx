import AnimateIn from "../common/AnimateIn";
import SectionStars from "../common/SectionStars";

const HIGHLIGHTS = [
  {
    title: "MERN Development",
    description: "Full-stack web apps built with MongoDB, Express, React, and Node.js.",
    icon: "⚡",
  },
  {
    title: "AI & n8n Automation",
    description: "Practical workflows that connect tools and automate repetitive tasks.",
    icon: "🔧",
  },
  {
    title: "Reliable Solutions",
    description: "Thoughtful, user-friendly experiences designed to work smoothly.",
    icon: "✨",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-20 px-4 bg-transparent dark:bg-slate-900 overflow-hidden"
    >
      <SectionStars count={8} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <AnimateIn className="text-center mb-4" direction="down">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
            About Me
          </h2>
        </AnimateIn>
        <AnimateIn delay={100} direction="up">
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-12 max-w-xl mx-auto">
            Building web applications and smart automations that solve real problems
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-14">
          <AnimateIn duration={1000} direction="left">
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                I'm a <span className="font-semibold text-primary">MERN Stack Developer</span>{" "}
                with 1+ year of experience building full-stack web applications.
                I work across the stack—from designing data models and APIs to
                creating responsive React interfaces.
              </p>
              <p>
                I also build AI-powered automation workflows with <strong>n8n</strong>,
                connecting services and streamlining repetitive processes. I enjoy
                combining software development and automation to turn ideas into
                useful, maintainable solutions.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn duration={1000} delay={150} direction="right">
            <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-primary" />
                What I Do
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Full-stack web apps with
                  MongoDB, Express, React & Node.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> REST API development
                  and integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> AI and workflow
                  automation with n8n
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span> Responsive interfaces
                  and maintainable code
                </li>
              </ul>
            </div>
          </AnimateIn>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {HIGHLIGHTS.map(({ title, description, icon }, index) => (
            <AnimateIn
              key={title}
              delay={index * 120}
              direction="up"
            >
              <div className="group p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <span className="text-2xl mb-3 block" aria-hidden>
                  {icon}
                </span>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
