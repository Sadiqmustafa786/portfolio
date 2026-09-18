import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { profileService } from "../../services/profileService";
import { ROUTES } from "../../utils/constants";

export default function CvManage() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cvInfo, setCvInfo] = useState({ hasCv: false, fileName: null, uploadedAt: null });

  const loadCvInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await profileService.getCvInfo();
      const info = data?.data ?? data;
      setCvInfo({
        hasCv: !!info?.hasCv,
        fileName: info?.fileName ?? null,
        uploadedAt: info?.uploadedAt ?? null,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load CV info.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCvInfo();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    try {
      await profileService.uploadCv(file);
      setSuccess("CV uploaded successfully.");
      await loadCvInfo();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to upload CV.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!cvInfo.hasCv) return;
    if (!window.confirm("Remove the current CV from your portfolio?")) return;

    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await profileService.deleteCv();
      setSuccess("CV removed.");
      await loadCvInfo();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to remove CV.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const uploadedLabel = cvInfo.uploadedAt
    ? new Date(cvInfo.uploadedAt).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          to={ROUTES.ADMIN_DASHBOARD}
          className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm mb-4 inline-block"
        >
          ← Back to dashboard
        </Link>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Manage CV
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Upload a PDF resume. Visitors can download it from your home page.
          </p>
        </header>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
          ) : (
            <>
              <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current CV
                </p>
                {cvInfo.hasCv ? (
                  <>
                    <p className="text-slate-800 dark:text-slate-100 font-medium break-all">
                      {cvInfo.fileName}
                    </p>
                    {uploadedLabel && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Uploaded {uploadedLabel}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No CV uploaded yet.
                  </p>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {uploading
                    ? "Uploading..."
                    : cvInfo.hasCv
                      ? "Replace CV"
                      : "Upload CV (PDF)"}
                </button>

                {cvInfo.hasCv && (
                  <>
                    <a
                      href={profileService.getCvDownloadUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium inline-flex items-center"
                    >
                      Preview download
                    </a>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-5 py-2.5 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60 text-sm font-medium transition-colors"
                    >
                      {deleting ? "Removing..." : "Remove CV"}
                    </button>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                PDF only, max 5MB. Replaces any existing file.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
