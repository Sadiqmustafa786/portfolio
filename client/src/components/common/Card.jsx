import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

export default function ProjectCard({ project, showLink = false }) {
  const id = project._id || project.id;
  const tech = project.technologies?.length
    ? project.technologies.join(", ")
    : (project.tech ?? "");

  const content = (
    <>
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-40 object-cover rounded-t-xl"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {project.title}
        </h3>
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {project.description}
        </p>
        {tech && <span className="text-xs text-slate-500">{tech}</span>}
      </div>
    </>
  );

  if (showLink && id) {
    return (
      <Link
        to={ROUTES.PROJECT_DETAIL.replace(":id", id)}
        className="block border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-40 object-cover rounded-t-xl -mx-6 -mt-6 mb-4"
        />
      )}
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {project.title}
      </h3>
      <p className="text-slate-600 text-sm mb-3">{project.description}</p>
      {tech && <span className="text-xs text-slate-500">{tech}</span>}
    </article>
  );
}
