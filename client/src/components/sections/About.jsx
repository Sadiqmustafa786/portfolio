const HIGHLIGHTS = [
  {
    title: "Full-Stack",
    description: "End-to-end development with MERN — from database to UI.",
    icon: "⚡",
  },
  {
    title: "Clean & Scalable",
    description: "Maintainable code, RESTful APIs, and modern architecture.",
    icon: "🔧",
  },
  {
    title: "User-First",
    description: "Fast, accessible interfaces that users love to use.",
    icon: "✨",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 bg-white dark:bg-slate-900 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
            About Me
          </h2>
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-12 max-w-xl mx-auto">
          Passionate about building products that matter
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-14">
          <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              I'm a{" "}
              <span className="font-semibold text-primary">
                MERN Stack Developer
              </span>{" "}
              focused on building fast, scalable web applications. From database
              design to responsive UIs, I enjoy turning ideas into products that
              perform.
            </p>
            <p>
              I work with <strong>MongoDB</strong>, <strong>Express</strong>,{" "}
              <strong>React</strong>, and <strong>Node.js</strong>, plus modern
              tools like Tailwind CSS and REST APIs, to ship clean code that
              users and teams love.
            </p>
          </div>
          <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-primary" />
              What I Do
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Full-stack web apps with
                MERN
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> RESTful API design &
                integration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Responsive, accessible
                UIs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Clean code & best
                practices
              </li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {HIGHLIGHTS.map(({ title, description, icon }) => (
            <div
              key={title}
              className="group p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
