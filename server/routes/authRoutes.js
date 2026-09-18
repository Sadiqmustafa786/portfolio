const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Private routes (require authentication)
router.get("/me", protect, getAdminProfile);
router.put("/update", protect, updateAdminProfile);

module.exports = router;
