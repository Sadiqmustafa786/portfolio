import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { ROUTES } from "../../utils/constants";
import { projectService } from "../../services/projectService";

const CATEGORIES = [
  "web",
  "mobile",
  "fullstack",
  "frontend",
  "backend",
  "other",
];

const initialForm = {
  title: "",
  description: "",
  longDescription: "",
  technologies: "",
  imageFile: null,
  image: "",
  liveUrl: "",
  githubUrl: "",
  category: "web",
  featured: false,
  order: 0,
};

export default function ProjectsManage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const fetchProjects = () => {
    setListError("");
    setLoading(true);
    projectService
      .getAll()
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        setProjects(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        setListError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to load projects.",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const buildPayload = () => {
    const techArray = formData.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    payload.append("longDescription", formData.longDescription?.trim() || "");
    payload.append("technologies", techArray.join(","));
    payload.append("liveUrl", formData.liveUrl?.trim() || "");
    payload.append("githubUrl", formData.githubUrl?.trim() || "");
    payload.append("category", formData.category);
    payload.append("featured", String(formData.featured));
    payload.append("order", String(formData.order));
    if (formData.imageFile) payload.append("image", formData.imageFile);
    return payload;
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (project) => {
    const id = project._id || project.id;
    setEditingId(id);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      imageFile: null,
      image: project.image || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      category: project.category || "web",
      featured: project.featured || false,
      order: project.order ?? 0,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(initialForm);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitLoading(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        const { data } = await projectService.update(editingId, payload);
        const updatedProject = data?.data ?? data;
        if (updatedProject) {
          setProjects((prev) =>
            prev.map((p) =>
              (p._id || p.id) === editingId ? updatedProject : p,
            ),
          );
        }
      } else {
        const { data } = await projectService.create(payload);
        const newProject = data?.data ?? data;
        if (newProject) setProjects((prev) => [...prev, newProject]);
        else fetchProjects();
      }
      handleCloseModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Request failed.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this project?")) return;
    projectService
      .delete(id)
      .then(() => {
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Delete failed.",
        );
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm mb-1 inline-block"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Manage Projects
            </h1>
          </div>
          <Button
            type="button"
            onClick={openAdd}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            Add Project
          </Button>
        </header>

        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-600 dark:text-slate-400">
            Loading...
          </div>
        ) : listError ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center text-red-600 dark:text-red-400">
            {listError}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No projects yet. Add your first project.
            </p>
            <Button
              type="button"
              onClick={openAdd}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Add Project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((p) => (
              <div
                key={p._id || p.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-4"
              >
                <img
                  src={p.image || "https://via.placeholder.com/120x80"}
                  alt={p.title}
                  className="w-28 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                      {p.title}
                    </h2>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDelete(p._id || p.id)}
                    className="px-3 py-1.5 text-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseModal}
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    {editingId ? "Edit Project" : "Add Project"}
                  </h2>
                  {formError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                      {formError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Description *
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="longDescription"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Long description
                      </label>
                      <textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="technologies"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Technologies (comma-separated)
                      </label>
                      <input
                        id="technologies"
                        type="text"
                        value={formData.technologies}
                        onChange={handleChange}
                        placeholder="React, Node, MongoDB"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Project image *
                      </label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            imageFile: e.target.files?.[0] || null,
                          }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required={!editingId}
                      />
                      {editingId && formData.image && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Select a new image only if you want to replace the current one.
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="liveUrl"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Live URL
                      </label>
                      <input
                        id="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="githubUrl"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        GitHub URL
                      </label>
                      <input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="rounded border-slate-300"
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Featured
                      </label>
                    </div>
                    <div>
                      <label
                        htmlFor="order"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Order
                      </label>
                      <input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={handleChange}
                        min={0}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        disabled={submitLoading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitLoading
                          ? "Saving..."
                          : editingId
                            ? "Update"
                            : "Create"}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
