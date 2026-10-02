const express = require("express");
const { protect } = require("../middlewares/auth");
const { createUploadSignature } = require("../utils/cloudinary");

const router = express.Router();

router.post("/signature", protect, (req, res) => {
  try {
    const upload = createUploadSignature(req.body?.resourceType);
    res.status(200).json({ success: true, data: upload });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
