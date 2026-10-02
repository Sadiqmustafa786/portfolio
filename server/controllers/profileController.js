const Admin = require("../models/Admin");
const { deleteAsset } = require("../utils/cloudinary");

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

    res.status(200).json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        hasCv,
        cvDownloadUrl: hasCv ? "/api/profile/cv/download" : null,
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
 * @route   GET /api/profile/cv/download
 * @access  Public
 */
exports.downloadCv = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("cv").lean();

    if (!admin?.cv?.filename) {
      return res.status(404).json({
        success: false,
        message: "CV not available",
      });
    }

    if (!admin.cv.url) {
      return res.status(404).json({
        success: false,
        message: "CV file not found",
      });
    }

    res.redirect(admin.cv.url);
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
