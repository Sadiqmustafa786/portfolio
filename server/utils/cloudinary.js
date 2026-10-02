const cloudinary = require("cloudinary").v2;
const { randomUUID } = require("crypto");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function createUploadSignature(resourceType) {
  if (!["image", "raw"].includes(resourceType)) {
    throw new Error("Unsupported upload type");
  }
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = resourceType === "image" ? "portfolio/projects" : "portfolio/cv";
  const publicId = `${randomUUID()}${resourceType === "raw" ? ".pdf" : ""}`;
  const params = { folder, public_id: publicId, timestamp };

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    resourceType,
    folder,
    publicId,
    timestamp,
    signature: cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET),
  };
}

async function deleteAsset(publicId, resourceType = "image") {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

module.exports = { createUploadSignature, deleteAsset };
