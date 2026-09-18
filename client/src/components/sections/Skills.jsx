const SKILLS = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Bootstrap",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-20 px-4 bg-slate-50 dark:bg-slate-800/50"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
            Skills & Tools
          </h2>
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-12 max-w-xl mx-auto">
          Technologies I work with to build modern web applications
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
          {SKILLS.map(({ name, icon }) => (
            <li
              key={name}
              className="group flex flex-col items-center p-5 sm:p-6 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src={icon}
                  alt={name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center group-hover:text-primary transition-colors">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
