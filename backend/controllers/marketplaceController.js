const ListedProduct = require('../models/ListedProduct');
const Design = require('../models/Design');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');

// GET /marketplace/products
const getMarketplaceProducts = async (req, res) => {
  try {
    const listedProducts = await ListedProduct.find({ user: req.user.id })
      .populate({
        path: 'design',
        populate: {
          path: 'product',
          select: 'category image_url'
        }
      })
      .populate('sales')
      .sort({ created_at: -1 });

    const formattedProducts = listedProducts.map(prod => {
      const prodObj = prod.toObject();
      const sales = prod.sales || [];
      prodObj.units_sold = sales.length;
      prodObj.net_earnings = sales.reduce((acc, sale) => acc + (parseFloat(sale.seller_earnings) || 0), 0);
      return prodObj;
    });

    return res.json({ listed_products: formattedProducts });
  } catch (error) {
    console.error('Fetch marketplace products error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /marketplace/products
const listMarketplaceProduct = async (req, res) => {
  try {
    const { design_id, title, description, price, quantity } = req.body;

    if (!design_id || !title || price === undefined || quantity === undefined) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { title: ['Title, design ID, price, and quantity are required.'] }
      });
    }

    if (parseFloat(price) < 0) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { price: ['Price must be a positive number.'] }
      });
    }

    if (parseInt(quantity, 10) < 1) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { quantity: ['Quantity must be at least 1.'] }
      });
    }

    // Verify user owns the design
    const design = await Design.findOne({ _id: design_id, user: req.user.id });
    if (!design) {
      return res.status(404).json({ message: 'Design not found.' });
    }

    const listedProduct = new ListedProduct({
      user: req.user.id,
      design: design.id,
      title,
      description: description || '',
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      status: 'pending'
    });

    await listedProduct.save();

    // Eager load relationships for response
    const populatedProduct = await ListedProduct.findById(listedProduct.id)
      .populate({
        path: 'design',
        populate: {
          path: 'product',
          select: 'category image_url'
        }
      });

    // Create a global notification for Admins (user is null)
    await Notification.create({
      user: null,
      title: 'New Product Listed',
      content: `Seller "${req.user.name}" listed a new custom print "${listedProduct.title}" waiting for your review.`,
      type: 'listing'
    });

    // Attach mock properties matching Laravel Controller response
    const resProductObj = populatedProduct.toObject();
    resProductObj.units_sold = 0;
    resProductObj.net_earnings = 0.0;

    return res.status(201).json({
      message: 'Product listed successfully. Waiting for admin approval.',
      listed_product: resProductObj
    });
  } catch (error) {
    console.error('List product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /marketplace/products/:productId/purchase
const purchaseProduct = async (req, res) => {
  try {
    const listedProduct = await ListedProduct.findById(req.params.productId);
    if (!listedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (listedProduct.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot purchase an unapproved product.' });
    }

    if (listedProduct.quantity <= 0) {
      return res.status(400).json({ message: 'This product is out of stock.' });
    }

    const amount = listedProduct.price;
    const adminCommission = amount * 0.10;
    const sellerEarnings = amount * 0.90;

    // Create mock purchase sale
    const sale = new Sale({
      listed_product: listedProduct.id,
      seller: listedProduct.user,
      buyer: req.user.id, // Authenticated buyer
      amount,
      admin_commission: adminCommission,
      seller_earnings: sellerEarnings,
      status: 'processing'
    });

    await sale.save();

    // Decrement inventory
    listedProduct.quantity -= 1;
    await listedProduct.save();

    return res.json({
      message: 'Purchase successful.',
      sale
    });
  } catch (error) {
    console.error('Mock purchase error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ seller: req.user.id })
      .populate({
        path: 'listed_product',
        populate: {
          path: 'design',
          populate: {
            path: 'product',
            select: 'category image_url'
          }
        }
      })
      .sort({ created_at: -1 });

    const totalEarnings = sales.reduce((acc, s) => acc + (parseFloat(s.seller_earnings) || 0), 0);

    return res.json({
      sales,
      total_earnings: totalEarnings
    });
  } catch (error) {
    console.error('Fetch sales error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /public/products
const getPublicProducts = async (req, res) => {
  try {
    const products = await ListedProduct.find({
      status: 'approved',
      quantity: { $gt: 0 }
    })
      .populate({
        path: 'design',
        populate: {
          path: 'product',
          select: 'category image_url'
        }
      })
      .populate('user', 'name')
      .sort({ created_at: -1 });

    return res.json({ products });
  } catch (error) {
    console.error('Fetch public catalog error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /public/products/:productId
const getPublicProduct = async (req, res) => {
  try {
    const listedProduct = await ListedProduct.findOne({
      _id: req.params.productId,
      status: 'approved'
    })
      .populate({
        path: 'design',
        populate: {
          path: 'product',
          select: 'category image_url'
        }
      })
      .populate('user', 'name');

    if (!listedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product: listedProduct });
  } catch (error) {
    console.error('Fetch public product error:', error);
    return res.status(404).json({ message: 'Product not found.' });
  }
};

// PUT /marketplace/products/:productId
const updateMarketplaceProduct = async (req, res) => {
  try {
    const { title, description, quantity } = req.body;

    const listedProduct = await ListedProduct.findById(req.params.productId);
    if (!listedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Ensure authorization
    if (listedProduct.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action.' });
    }

    if (!title || quantity === undefined) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { title: ['Title and quantity are required.'] }
      });
    }

    if (parseInt(quantity, 10) < 0) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { quantity: ['Quantity cannot be negative.'] }
      });
    }

    listedProduct.title = title;
    listedProduct.description = description || '';
    listedProduct.quantity = parseInt(quantity, 10);

    await listedProduct.save();

    const populatedProduct = await ListedProduct.findById(listedProduct.id)
      .populate({
        path: 'design',
        populate: {
          path: 'product',
          select: 'category image_url'
        }
      });

    return res.json({
      message: 'Product inventory details updated successfully.',
      listed_product: populatedProduct
    });
  } catch (error) {
    console.error('Update listing error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMarketplaceProducts,
  listMarketplaceProduct,
  purchaseProduct,
  getSales,
  getPublicProducts,
  getPublicProduct,
  updateMarketplaceProduct
};
