const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    longDescription: {
      type: String,
      maxlength: [2000, "Long description cannot be more than 2000 characters"],
    },
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
      type: String,
      required: [true, "Please upload a project image"],
    },
    liveUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    githubUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    category: {
      type: String,
      enum: ["web", "mobile", "fullstack", "frontend", "backend", "other"],
      default: "web",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema);
