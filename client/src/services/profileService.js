import api from "./api.js";

const API_BASE = "https://portfolio-inky-xi-60.vercel.app/api";

/** Public portfolio profile - for Hero name/display when not logged in */
export const profileService = {
  getPublic: () => api.get("/profile"),

  /** Admin: get current CV info */
  getCvInfo: () => api.get("/profile/cv"),

  /** Admin: upload PDF directly to Cloudinary, then save its URL. */
  uploadCv: async (file) => {
    const { data } = await api.post("/uploads/signature", { resourceType: "raw" });
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
    if (!response.ok) throw new Error(result.error?.message || "Cloudinary CV upload failed.");

    return api.post("/profile/cv", {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.name,
    });
  },

  /** Admin: remove CV */
  deleteCv: () => api.delete("/profile/cv"),

  /** Public CV download URL (opens/saves PDF) */
  getCvDownloadUrl: () => `${API_BASE}/profile/cv/download`,
};
