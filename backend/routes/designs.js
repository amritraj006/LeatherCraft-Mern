const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const designController = require('../controllers/designController');

// Multer memory storage setup (maximum file size 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /designs - Fetch seller's designs
router.get('/designs', auth, designController.getDesigns);

// POST /design/save - Upload and save a new design
router.post('/design/save', auth, upload.single('design_image'), designController.saveDesign);

// DELETE /design/:designId - Delete design and its Cloudinary image
router.delete('/design/:designId', auth, designController.deleteDesign);

module.exports = router;
