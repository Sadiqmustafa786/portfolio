import api from "./api.js";

const API_BASE = "https://portfolio-backend-pi-roan.vercel.app/api";

/** Public portfolio profile - for Hero name/display when not logged in */
export const profileService = {
  getPublic: () => api.get("/profile"),

  /** Admin: get current CV info */
  getCvInfo: () => api.get("/profile/cv"),

  /** Admin: upload PDF CV (multipart field name: cv) */
  uploadCv: (file) => {
    const formData = new FormData();
    formData.append("cv", file);
    return api.post("/profile/cv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** Admin: remove CV */
  deleteCv: () => api.delete("/profile/cv"),

  /** Public CV download URL (opens/saves PDF) */
  getCvDownloadUrl: () => `${API_BASE}/profile/cv/download`,
};
