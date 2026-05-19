const Design = require('../models/Design');
const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// GET /designs
const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user.id })
      .populate('product', 'category image_url')
      .populate('listedProduct', 'status price')
      .sort({ created_at: -1 });

    return res.json({ designs });
  } catch (error) {
    console.error('Fetch designs error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /design/save
const saveDesign = async (req, res) => {
  try {
    const { product_id, original_image } = req.body;
    const file = req.file;

    if (!product_id) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { product_id: ['The product id field is required.'] }
      });
    }

    if (!file) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { design_image: ['The design image field is required.'] }
      });
    }

    // Verify the product exists and is owned by the user
    const product = await Product.findOne({ _id: product_id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Upload to Cloudinary under folder "designs"
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(file.buffer, 'designs');
    } catch (uploadError) {
      console.error('Cloudinary design upload failed:', uploadError);
      return res.status(502).json({
        message: 'Image storage failed. Check Cloudinary settings.',
        error: uploadError.message
      });
    }

    // Create the Design
    const design = new Design({
      user: req.user.id,
      product: product.id,
      original_image: original_image || product.image_url,
      ai_image: uploadResult.secure_url,
      prompt: 'Manual Design Upload'
    });

    await design.save();

    // Populate product relation for matching Laravel's loaded response
    const populatedDesign = await Design.findById(design.id)
      .populate('product', 'category image_url');

    return res.status(201).json({
      design: populatedDesign
    });
  } catch (error) {
    console.error('Save design error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /design/:designId
const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.designId);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Ensure design belongs to the user
    if (design.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Design not found' }); // Mirroring PHP abort(404)
    }

    // Delete image from Cloudinary
    if (design.ai_image) {
      await deleteFromCloudinary(design.ai_image);
    }

    // Delete design from DB
    await design.deleteOne();

    return res.json({ message: 'Design deleted.' });
  } catch (error) {
    console.error('Delete design error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDesigns,
  saveDesign,
  deleteDesign
};
