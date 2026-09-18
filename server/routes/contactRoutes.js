const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  markAsRead,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middlewares/auth");

// Public route - anyone can submit contact form
router.post("/", submitContactForm);

// Private routes - admin only
router.get("/", protect, getAllContacts);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteContact);

module.exports = router;
