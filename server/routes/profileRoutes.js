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

// Public routes
router.get("/", getPublicProfile);
router.get("/cv/download", downloadCv);

// Admin CV management
router.get("/cv", protect, getCvInfo);
router.post("/cv", protect, uploadCv);
router.delete("/cv", protect, deleteCv);

module.exports = router;
