import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../services/projectService";
import ProjectCard from "../components/sections/ProjectCard";
import { ROUTES } from "../utils/constants";

const SKELETON_CARD_COUNT = 8;

function PageHeader() {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-primary pb-2 inline-block">
        Projects
      </h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400">
        Some of the work I&apos;ve done recently.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 animate-pulse"
            >
              <div className="aspect-video bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
          Loading projects...
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Unable to load projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            {message}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <PageHeader />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-500 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            No projects yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Projects will show up here once they&apos;re added.
          </p>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = () => {
    setError("");
    setLoading(true);
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
  };

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={fetchProjects} />;
  }
  if (projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p._id || p.id} project={p} showLink />
          ))}
        </div>
      </div>
    </div>
  );
}
