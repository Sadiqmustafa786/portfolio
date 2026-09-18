const express = require("express");
const router = express.Router();
const {
  getPublicProfile,
  downloadCv,
  getCvInfo,
  uploadCv,
  deleteCv,
} = require("../controllers/profileController");
const { protect } = require("../middlewares/auth");
const uploadCvMiddleware = require("../middlewares/uploadCv");

// Public routes
router.get("/", getPublicProfile);
router.get("/cv/download", downloadCv);

// Admin CV management
router.get("/cv", protect, getCvInfo);
router.post(
  "/cv",
  protect,
  (req, res, next) => {
    uploadCvMiddleware.single("cv")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Invalid file upload",
        });
      }
      next();
    });
  },
  uploadCv,
);
router.delete("/cv", protect, deleteCv);

module.exports = router;
