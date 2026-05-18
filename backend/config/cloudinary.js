const cloudinary = require('cloudinary').v2;

// The Cloudinary SDK automatically picks up CLOUDINARY_URL from the environment,
// but we will verify it is set and explicitly initialize if needed.
if (!process.env.CLOUDINARY_URL) {
  console.warn('WARNING: CLOUDINARY_URL is not set in environment variables.');
}

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} folder - The destination folder in Cloudinary
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `leathercraft/${folder}` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary by parsing its URL
 * @param {string} url - The complete Cloudinary image URL
 * @returns {Promise<object|null>} - Cloudinary delete result
 */
const deleteFromCloudinary = async (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<filename>.<ext>
    const parts = url.split('/image/upload/');
    if (parts.length > 1) {
      const publicIdWithVersionAndFormat = parts[1];
      // Remove version if it exists (e.g. v12345678/)
      let publicId = publicIdWithVersionAndFormat.replace(/^v\d+\//, '');
      // Remove file extension (e.g. .jpg, .png)
      const lastDotIndex = publicId.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        publicId = publicId.substring(0, lastDotIndex);
      }
      
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
  return null;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
