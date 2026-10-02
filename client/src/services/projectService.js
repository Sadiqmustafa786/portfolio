import api from "./api.js";

export const projectService = {
  getAll: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadImage: async (file) => {
    const { data } = await api.post("/uploads/signature", { resourceType: "image" });
    const upload = data.data;
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", upload.apiKey);
    form.append("timestamp", String(upload.timestamp));
    form.append("folder", upload.folder);
    form.append("public_id", upload.publicId);
    form.append("signature", upload.signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${upload.cloudName}/${upload.resourceType}/upload`,
      { method: "POST", body: form },
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Cloudinary image upload failed.");
    return { image: result.secure_url, imagePublicId: result.public_id };
  },
};
