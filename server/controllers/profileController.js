const fs = require("fs");
const path = require("path");
const Admin = require("../models/Admin");

const CV_DIR = path.join(__dirname, "../uploads/cv");

function getCvFilePath(filename) {
  return path.join(CV_DIR, filename);
}

function removeCvFile(filename) {
  if (!filename) return;
  const filePath = getCvFilePath(filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
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

    const filePath = getCvFilePath(admin.cv.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "CV file not found",
      });
    }

    const downloadName = admin.cv.originalName || "CV.pdf";
    res.download(filePath, downloadName);
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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (admin.cv?.filename) {
      removeCvFile(admin.cv.filename);
    }

    admin.cv = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt: new Date(),
    };

    await admin.save();

    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      data: {
        fileName: admin.cv.originalName,
        uploadedAt: admin.cv.uploadedAt,
      },
    });
  } catch (error) {
    if (req.file?.filename) {
      removeCvFile(req.file.filename);
    }
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

    removeCvFile(admin.cv.filename);

    admin.cv = {
      filename: null,
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
