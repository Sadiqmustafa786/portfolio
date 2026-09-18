import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { projectService } from "../services/projectService";
import { ROUTES } from "../utils/constants";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) {
      const timer = setTimeout(() => {
        setLoading(false);
        setError("Invalid project.");
      }, 0);
      return () => clearTimeout(timer);
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setError("");
      setImgError(false);
      setLoading(true);
    }, 0);
    projectService
      .getById(id)
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        setProject(data ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        setProject(null);
        setError(
          err.response?.status === 404
            ? "Project not found."
            : err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                "Failed to load project.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 max-w-4xl mx-auto px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-8">
          Loading project...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-16 max-w-lg mx-auto px-4">
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
            Unable to load project
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            {error || "Project not found."}
          </p>
          <Link
            to={ROUTES.PROJECTS}
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const techList = project.technologies?.length ? project.technologies : [];
  const hasImage = project.image && !imgError;

  return (
    <article className="pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to={ROUTES.PROJECTS}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium mb-8 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to projects
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.category && (
              <span className="text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {project.category}
              </span>
            )}
            {project.featured && (
              <span className="text-xs font-medium px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {project.title}
          </h1>
        </header>

        {hasImage ? (
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full aspect-video object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="rounded-2xl aspect-video bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-8">
            <svg
              className="w-16 h-16 text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {project.description}
        </p>

        {project.longDescription && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              About this project
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {project.longDescription}
              </p>
            </div>
          </div>
        )}

        {techList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {techList.map((t) => (
                <span
                  key={t}
                  className="text-sm px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl || "https://github.com/Sadiqmustafa786/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
