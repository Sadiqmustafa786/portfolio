import SectionStars from "../common/SectionStars";
import {
  SiMongodb,
  SiExpress,
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiN8N,
} from "react-icons/si";
import { FaReact, FaNodeJs, FaRobot } from "react-icons/fa";

const SKILLS = [
  { name: "React", Icon: FaReact, color: "text-sky-400" },
  { name: "Node.js", Icon: FaNodeJs, color: "text-green-500" },
  { name: "MongoDB", Icon: SiMongodb, color: "text-green-600" },
  { name: "Express", Icon: SiExpress, color: "text-slate-600 dark:text-slate-300" },
  { name: "JavaScript", Icon: SiJavascript, color: "text-yellow-400" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "Bootstrap", Icon: SiBootstrap, color: "text-purple-600" },
  { name: "AI Automation", Icon: FaRobot, color: "text-violet-500" },
  { name: "n8n", Icon: SiN8N, color: "text-rose-500" },
];

function SkillItem({ name, Icon, color }) {
  return (
    <li className="shrink-0 pr-4 sm:pr-6">
      <div className="group flex flex-col items-center w-24 sm:w-28 py-4 px-3 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
        <div className="w-7 h-7 sm:w-8 sm:h-8 mb-2 flex items-center justify-center">
          <Icon
            className={`w-full h-full group-hover:scale-110 transition-transform duration-300 ${color}`}
            aria-hidden
          />
        </div>
        <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 text-center whitespace-nowrap group-hover:text-primary transition-colors">
          {name}
        </span>
      </div>
    </li>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-20 px-4 bg-transparent dark:bg-slate-900 overflow-hidden"
    >
      <SectionStars count={9} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
            Skills & Tools
          </h2>
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-12 max-w-xl mx-auto">
          Technologies I work with to build modern web applications
        </p>
      </div>

      {/* Marquee: right to left, edges fade out, pauses on hover */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          <ul className="flex" aria-label="Skills">
            {SKILLS.map((skill) => (
              <SkillItem key={skill.name} {...skill} />
            ))}
          </ul>
          {/* Duplicate list for a seamless loop */}
          <ul className="flex" aria-hidden>
            {SKILLS.map((skill) => (
              <SkillItem key={skill.name} {...skill} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}