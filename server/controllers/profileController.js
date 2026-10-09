const Admin = require("../models/Admin");
const { deleteAsset } = require("../utils/cloudinary");

function normalizePdfName(name) {
  let fileName = name || "CV.pdf";
  if (!/\.pdf$/i.test(fileName)) fileName = `${fileName}.pdf`;
  return fileName.replace(/[^\w.\-() ]+/g, "_");
}

/** Force Cloudinary to send the file as a downloadable attachment. */
function toCloudinaryAttachmentUrl(url, fileName) {
  if (!url || !url.includes("/upload/")) return url;
  const safe = encodeURIComponent(normalizePdfName(fileName).replace(/\.pdf$/i, ""));
  return url.replace("/upload/", `/upload/fl_attachment:${safe}.pdf/`);
}

function getPublicApiBase(req) {
  if (process.env.SERVER_URL) return process.env.SERVER_URL.replace(/\/$/, "");
  const host = req.get("host");
  if (!host) return "";
  const proto = req.get("x-forwarded-proto") || req.protocol || "https";
  return `${proto}://${host}`;
}

/**
 * Public portfolio profile - returns first admin's name/email for Hero display.
 * @route   GET /api/profile
 * @access  Public
 */
exports.getPublicProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("name email cv").lean();

    if (!admin) {
      return res.status(200).json({
        success: true,
        data: { name: null, email: null, hasCv: false, cvDownloadUrl: null },
      });
    }

    const hasCv = !!admin.cv?.filename;
    const apiBase = getPublicApiBase(req);

    res.status(200).json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        hasCv,
        cvDownloadUrl: hasCv ? `${apiBase}/api/profile/cv/download` : null,
        cvFileName: hasCv ? admin.cv.originalName : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

/**
 * Download CV as PDF attachment.
 * Streams PDF bytes (never HTML). Falls back to Cloudinary fl_attachment.
 * @route   GET /api/profile/cv/download
 * @access  Public
 */
exports.downloadCv = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("cv").lean();

    if (!admin?.cv?.filename || !admin.cv.url) {
      return res.status(404).json({
        success: false,
        message: "CV not available",
      });
    }

    const safeName = normalizePdfName(admin.cv.originalName);
    const attachmentUrl = toCloudinaryAttachmentUrl(admin.cv.url, safeName);

    try {
      const fileResponse = await fetch(admin.cv.url);
      if (fileResponse.ok) {
        const buffer = Buffer.from(await fileResponse.arrayBuffer());
        const looksLikePdf = buffer.length > 4 && buffer.subarray(0, 4).toString() === "%PDF";
        const contentType = fileResponse.headers.get("content-type") || "";

        if (looksLikePdf && !contentType.includes("text/html")) {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
          );
          res.setHeader("Content-Length", buffer.length);
          res.setHeader("Cache-Control", "no-store");
          return res.send(buffer);
        }
      }
    } catch {
      /* fall through to Cloudinary attachment redirect */
    }

    return res.redirect(302, attachmentUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to download CV",
      error: error.message,
    });
  }
};

/**
 * Get current admin's CV info.
 * @route   GET /api/profile/cv
 * @access  Private (Admin)
 */
exports.getCvInfo = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("cv");

    const hasCv = !!admin?.cv?.filename;

    res.status(200).json({
      success: true,
      data: {
        hasCv,
        fileName: hasCv ? admin.cv.originalName : null,
        uploadedAt: hasCv ? admin.cv.uploadedAt : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch CV info",
      error: error.message,
    });
  }
};

/**
 * Upload or replace CV (PDF only).
 * @route   POST /api/profile/cv
 * @access  Private (Admin)
 */
exports.uploadCv = async (req, res) => {
  try {
    const { url, publicId, originalName } = req.body;
    if (!url || !publicId || !originalName) {
      return res.status(400).json({
        success: false,
        message: "Missing uploaded CV details",
      });
    }

    const admin = await Admin.findById(req.admin.id);
    const previousCvPublicId = admin.cv?.filename;

    admin.cv = {
      filename: publicId,
      url,
      originalName,
      uploadedAt: new Date(),
    };

    await admin.save();

    if (
      previousCvPublicId?.startsWith("portfolio/cv/") &&
      previousCvPublicId !== publicId
    ) {
      await deleteAsset(previousCvPublicId, "raw");
    }

    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      data: {
        fileName: admin.cv.originalName,
        uploadedAt: admin.cv.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload CV",
      error: error.message,
    });
  }
};

/**
 * Remove uploaded CV.
 * @route   DELETE /api/profile/cv
 * @access  Private (Admin)
 */
exports.deleteCv = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin?.cv?.filename) {
      return res.status(404).json({
        success: false,
        message: "No CV to delete",
      });
    }

    if (admin.cv.filename.startsWith("portfolio/cv/")) {
      await deleteAsset(admin.cv.filename, "raw");
    }

    admin.cv = {
      filename: null,
      url: null,
      originalName: null,
      uploadedAt: null,
    };

    await admin.save();

    res.status(200).json({
      success: true,
      message: "CV removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete CV",
      error: error.message,
    });
  }
};
