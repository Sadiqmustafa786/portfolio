import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectService } from "../services/projectService";
import { ROUTES } from "../utils/constants";

function ArrowIcon({ diagonal = false }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0">
      <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div className="w-full animate-pulse" aria-label="Loading project">
      <div className="mb-5 h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700 sm:mb-6 sm:w-28" />
      <div className="mb-2 h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-6 h-7 w-3/4 max-w-md rounded bg-slate-200 dark:bg-slate-700 sm:mb-8 sm:h-8" />
      <div className="mb-6 aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-700 sm:mb-8 sm:aspect-video sm:rounded-2xl" />
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="h-10 w-full rounded-full bg-slate-200 dark:bg-slate-700 sm:w-32" />
        <div className="h-10 w-full rounded-full bg-slate-200 dark:bg-slate-700 sm:w-28" />
      </div>
      <div className="mb-3 h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-4/5 max-w-xl rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="grid min-h-[50vh] place-items-center py-10 sm:min-h-[55vh] sm:py-16">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary sm:mb-5 sm:h-14 sm:w-14">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6 sm:h-7 sm:w-7">
            <path d="M12 8v4m0 4h.01M4.9 19h14.2a1.5 1.5 0 0 0 1.3-2.25L13.3 4.5a1.5 1.5 0 0 0-2.6 0L3.6 16.75A1.5 1.5 0 0 0 4.9 19Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:text-sm">Project unavailable</p>
        <h1 className="mb-3 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">We couldn&apos;t find this project</h1>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400 sm:mb-7 sm:text-base">
          {message || "It may have been removed, or the link may be outdated."}
        </p>
        <Link
          to={ROUTES.PROJECTS}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <ArrowIcon /> Back to projects
        </Link>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    projectService
      .getById(id)
      .then(({ data }) => {
        if (!active) return;
        const result = data?.data ?? data;
        setProject(result?.project ?? result ?? null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || err.response?.data?.error || "Please check the link and try again.");
        setProject(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !project) return <EmptyState message={error} />;

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : project.tech
      ? [project.tech]
      : [];
  const description = project.longDescription || project.description || "More details about this project will be added soon.";

  return (
    <div className="relative w-full overflow-x-hidden pb-8 sm:pb-12 lg:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-16 hidden h-56 w-56 rounded-full bg-primary/10 blur-3xl sm:block md:-right-16 md:h-72 md:w-72"
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <Link
          to={ROUTES.PROJECTS}
          className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400 dark:hover:text-secondary sm:mb-7"
        >
          <ArrowIcon /> All projects
        </Link>

        <header className="mb-5 sm:mb-7">
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 sm:mb-3 sm:gap-2">
            {project.category && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary dark:bg-primary/20 dark:text-secondary sm:text-[11px]">
                {project.category}
              </span>
            )}
            {project.featured && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 sm:text-[11px]">
                Featured
              </span>
            )}
          </div>
          <h1 className="break-words text-xl font-bold leading-snug tracking-tight text-slate-950 dark:text-white sm:text-2xl md:text-3xl">
            {project.title}
          </h1>
        </header>

        <figure className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-800 sm:rounded-2xl sm:shadow-xl sm:shadow-slate-900/8">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="h-auto max-h-[240px] w-full object-cover object-top sm:max-h-[380px] md:max-h-[460px] lg:max-h-[520px]"
            />
          ) : (
            <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-primary/15 via-slate-100 to-secondary/20 dark:from-primary/25 dark:via-slate-800 dark:to-secondary/10 sm:aspect-video">
              <span className="max-w-[90%] truncate px-4 text-center text-lg font-bold tracking-tight text-primary/60 dark:text-secondary/70 sm:text-2xl">
                {project.title}
              </span>
            </div>
          )}
        </figure>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
          <section className="min-w-0">
            {(project.liveUrl || project.githubUrl) && (
              <div className="mb-5 flex flex-col gap-2.5 sm:mb-6 sm:flex-row sm:flex-wrap sm:gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
                  >
                    Visit live site <ArrowIcon diagonal />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:w-auto"
                  >
                    View source <ArrowIcon diagonal />
                  </a>
                )}
              </div>
            )}

            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:mb-2 sm:text-[11px]">Overview</p>
            <h2 className="mb-2.5 text-base font-bold text-slate-900 dark:text-white sm:mb-3 sm:text-lg">About this project</h2>
            <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
              {description}
            </p>
          </section>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-800/70 sm:rounded-2xl sm:p-5">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-800 dark:text-slate-100 sm:text-xs">
              Built with
            </h2>
            {technologies.length ? (
              <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                {technologies.map((technology) => (
                  <li
                    key={technology}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary dark:bg-primary/20 dark:text-secondary sm:text-xs"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Technology details coming soon.</p>
            )}
          </aside>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-700 sm:mt-12 sm:pt-6">
          <Link
            to={ROUTES.PROJECTS}
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3 dark:text-secondary"
          >
            <ArrowIcon /> Explore more projects
          </Link>
        </div>
      </div>
    </div>
  );
}
