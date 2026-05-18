const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const Design = require('../models/Design');
const ListedProduct = require('../models/ListedProduct');
const auth = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Multer memory storage setup (maximum file size 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /products - List seller's products
router.get('/products', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id })
      .sort({ created_at: -1 });

    return res.json({ products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /product/upload - Upload a product image to Cloudinary
router.post('/product/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { image: ['The image field is required.'] }
      });
    }

    if (!category) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { category: ['The category field is required.'] }
      });
    }

    // Upload to Cloudinary under folder "products"
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(file.buffer, 'products');
    } catch (uploadError) {
      console.error('Cloudinary product upload failed:', uploadError);
      return res.status(502).json({
        message: 'Image storage failed. Check Cloudinary settings.',
        error: uploadError.message
      });
    }

    // Save product to database
    const product = new Product({
      user: req.user.id,
      image_url: uploadResult.secure_url,
      category: category
    });

    await product.save();

    return res.status(201).json({
      product,
      storage_provider: 'cloudinary'
    });
  } catch (error) {
    console.error('Product upload error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /products/:productId - Delete product and associated designs & listed products
router.delete('/products/:productId', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure the seller owns the product
    if (product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // 1. Find all designs related to this product
    const designs = await Design.find({ product: product.id });

    // 2. Delete all design images from Cloudinary and designs from DB
    for (const design of designs) {
      // Delete design image from Cloudinary
      if (design.ai_image) {
        await deleteFromCloudinary(design.ai_image);
      }
      
      // Delete listed products referencing this design
      await ListedProduct.deleteMany({ design: design.id });
      
      // Delete the design
      await design.deleteOne();
    }

    // 3. Delete base product image from Cloudinary
    if (product.image_url) {
      await deleteFromCloudinary(product.image_url);
    }

    // 4. Delete the product itself
    await product.deleteOne();

    return res.json({
      message: 'Product and associated files deleted successfully.'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
