import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import SectionStars from "../common/SectionStars";
import { projectService } from "../../services/projectService";
import { ROUTES } from "../../utils/constants";

function SectionShell({ children }) {
  return (
    <section id="projects" className="relative py-16 px-4 bg-transparent dark:bg-slate-900 overflow-hidden">
      <SectionStars count={10} />
      <div className="relative z-10 max-w-6xl mx-auto">
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

function ProjectsLoadingState() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="status"
      aria-label="Loading projects"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="aspect-video animate-pulse bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading projects…</span>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(() => {
    setLoading(true);
    setError("");
    projectService
      .getAll()
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        setProjects(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        setProjects([]);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load projects.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 0);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  if (loading) {
    return (
      <SectionShell>
        <ProjectsLoadingState />
      </SectionShell>
    );
  }

  if (error) {
    return (
      <SectionShell>
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            Unable to load projects: {error}
          </p>
          <button
            type="button"
            onClick={fetchProjects}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
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
