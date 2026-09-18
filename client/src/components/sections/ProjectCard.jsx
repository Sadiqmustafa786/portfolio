import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const MAX_TECH_PILLS = 4;

export default function ProjectCard({ project, showLink = false }) {
  const [imgError, setImgError] = useState(false);

  if (!project) return null;

  const id = project._id || project.id;
  const techList = project.technologies?.length
    ? project.technologies
    : project.tech
      ? [project.tech]
      : [];
  const techDisplay = techList.slice(0, MAX_TECH_PILLS);
  const techMore =
    techList.length > MAX_TECH_PILLS ? techList.length - MAX_TECH_PILLS : 0;
  const hasImage = project.image && !imgError;

  const imageBlock = (
    <div className="relative w-full aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
      {hasImage ? (
        <>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          {showLink && id && (
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-medium text-sm px-4 py-2 rounded-lg border border-white/30">
                View project →
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
          <svg
            className="w-12 h-12"
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
    </div>
  );

  const bodyContent = (
    <div className="p-5">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {project.category && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {project.category}
          </span>
        )}
        {project.featured && (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
            Featured
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
        {project.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
        {project.description}
      </p>
      {techDisplay.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {techDisplay.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-medium"
            >
              {t}
            </span>
          ))}
          {techMore > 0 && (
            <span className="text-xs px-2 py-1 text-slate-500 dark:text-slate-400">
              +{techMore}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (showLink && id) {
    return (
      <Link
        to={ROUTES.PROJECT_DETAIL.replace(":id", id)}
        className="group block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:shadow-lg hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5"
      >
        {imageBlock}
        {bodyContent}
      </Link>
    );
  }

  return (
    <article className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow duration-300">
      {imageBlock}
      {bodyContent}
    </article>
  );
}
