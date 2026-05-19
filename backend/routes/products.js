const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

// Multer memory storage setup (maximum file size 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /products - List seller's products
router.get('/products', auth, productController.getProducts);

// POST /product/upload - Upload a product image to Cloudinary
router.post('/product/upload', auth, upload.single('image'), productController.uploadProduct);

// DELETE /products/:productId - Delete product and associated designs & listed products
router.delete('/products/:productId', auth, productController.deleteProduct);

module.exports = router;
