import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { projectService } from "../../services/projectService";
import { ROUTES } from "../../utils/constants";

function SectionShell({ children }) {
  return (
    <section id="projects" className="py-16 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
            Projects
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Some of the work I&apos;ve done recently.
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService
      .getAll()
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        setProjects(Array.isArray(list) ? list : []);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SectionShell>
        <p className="text-center text-slate-500 dark:text-slate-400">
          Loading...
        </p>
      </SectionShell>
    );
  }

  if (projects.length === 0) {
    return (
      <SectionShell>
        <p className="text-center text-slate-500 dark:text-slate-400">
          No projects yet.
        </p>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.slice(0, 8).map((project) => (
          <ProjectCard
            key={project._id || project.id}
            project={project}
            showLink
          />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          to={ROUTES.PROJECTS}
          className="text-primary font-medium underline hover:no-underline hover:text-primary/90"
        >
          View all projects
        </Link>
      </div>
    </SectionShell>
  );
}
