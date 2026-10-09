import api, { API_BASE_URL } from "./api.js";

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

  /** Absolute API URL for CV download */
  getCvDownloadUrl: () => `${API_BASE_URL.replace(/\/$/, "")}/profile/cv/download`,

  /**
   * Fetch CV as a PDF blob and trigger a real file download.
   * Avoids saving the SPA HTML when a relative URL is used by mistake.
   */
  downloadCvFile: async (fileName = "CV.pdf") => {
    const url = `${API_BASE_URL.replace(/\/$/, "")}/profile/cv/download`;
    const response = await fetch(url, { method: "GET", credentials: "omit" });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to download CV");
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    const blob = await response.blob();

    if (
      contentType.includes("text/html") ||
      contentType.includes("application/json")
    ) {
      throw new Error("Server did not return a PDF file");
    }

    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });

    const objectUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  },
};
