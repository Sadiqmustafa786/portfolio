const Project = require("../models/Project");
const { deleteAsset } = require("../utils/cloudinary");

const parseProjectBody = (body) => ({
  ...body,
  technologies:
    typeof body.technologies === "string"
      ? body.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean)
      : body.technologies,
  featured: body.featured === true || body.featured === "true",
  order: body.order === undefined || body.order === "" ? 0 : Number(body.order),
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured projects",
      error: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
  try {
    const projectData = parseProjectBody(req.body);

    projectData.image = req.body.image;
    projectData.imagePublicId = req.body.imagePublicId;

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const projectData = parseProjectBody(req.body);

    if (req.body.image) projectData.image = req.body.image;
    else delete projectData.image;
    if (req.body.imagePublicId) projectData.imagePublicId = req.body.imagePublicId;
    else delete projectData.imagePublicId;

    const project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
      runValidators: true,
    });

    if (
      project.imagePublicId &&
      existingProject.imagePublicId &&
      project.imagePublicId !== existingProject.imagePublicId
    ) {
      await deleteAsset(existingProject.imagePublicId, "image");
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.imagePublicId) {
      await deleteAsset(project.imagePublicId, "image");
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
exports.getProjectsByCategory = async (req, res) => {
  try {
    const projects = await Project.find({ category: req.params.category }).sort(
      { order: 1, createdAt: -1 },
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};
