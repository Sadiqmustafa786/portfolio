const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByCategory,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/auth");
const uploadProject = require("../middlewares/uploadProject");

// Public routes - anyone can view projects
router.get("/", getAllProjects);
router.get("/featured", getFeaturedProjects);
router.get("/category/:category", getProjectsByCategory);
router.get("/:id", getProjectById);

// Private routes - admin only (create, update, delete)
router.post("/", protect, uploadProject.single("image"), createProject);
router.put("/:id", protect, uploadProject.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
