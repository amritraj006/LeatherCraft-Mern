const User = require('../models/User');
const Product = require('../models/Product');
const Design = require('../models/Design');
const ListedProduct = require('../models/ListedProduct');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');

// GET /admin/pending-products
const getPendingProducts = async (req, res) => {
  try {
    const products = await ListedProduct.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate({
        path: 'design',
        populate: {
          path: 'product',
          select: 'category image_url'
        }
      })
      .sort({ created_at: -1 });

    return res.json({ products });
  } catch (error) {
    console.error('Fetch pending products error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /admin/products/:productId/status
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { status: ['The status must be approved or rejected.'] }
      });
    }

    const listedProduct = await ListedProduct.findById(req.params.productId);
    if (!listedProduct) {
      return res.status(404).json({ message: 'Listed product not found.' });
    }

    listedProduct.status = status;
    await listedProduct.save();

    // Trigger Notification to the Seller
    if (status === 'approved') {
      await Notification.create({
        user: listedProduct.user,
        title: 'Listing Confirmed',
        content: `Your product listing "${listedProduct.title}" has been successfully approved by the store admin and is now live in the storefront catalog!`,
        type: 'approval'
      });
    } else {
      await Notification.create({
        user: listedProduct.user,
        title: 'Listing Rejected',
        content: `Your product listing "${listedProduct.title}" was reviewed and rejected by the admin. Please verify prompt guideline specifications.`,
        type: 'approval'
      });
    }

    return res.json({ message: `Product status updated to ${status}` });
  } catch (error) {
    console.error('Update listing status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /admin/sellers
const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).lean();

    // Replicate Laravel's withCount
    const sellersWithCounts = await Promise.all(sellers.map(async (seller) => {
      const products_count = await Product.countDocuments({ user: seller._id });
      const designs_count = await Design.countDocuments({ user: seller._id });
      
      // Convert MongoDB _id to string for convenience
      seller.id = seller._id.toString();
      delete seller._id;
      delete seller.__v;
      delete seller.password;

      return {
        ...seller,
        products_count,
        designs_count
      };
    }));

    return res.json({ sellers: sellersWithCounts });
  } catch (error) {
    console.error('Fetch sellers error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /admin/sellers/:sellerId/designs
const getSellerDesigns = async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const designs = await Design.find({ user: seller.id })
      .populate('product', 'category image_url')
      .sort({ created_at: -1 });

    return res.json({ designs });
  } catch (error) {
    console.error('Fetch seller designs error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /admin/sales
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('seller', 'name email')
      .populate('buyer', 'name email')
      .populate({
        path: 'listed_product',
        populate: {
          path: 'design'
        }
      })
      .sort({ created_at: -1 });

    const totalCommissions = sales.reduce((acc, sale) => acc + (parseFloat(sale.admin_commission) || 0), 0);

    return res.json({
      sales,
      total_admin_commission: totalCommissions
    });
  } catch (error) {
    console.error('Fetch admin sales error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /admin/sales/:saleId/status
const updateSaleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['confirmed', 'processing', 'shipped', 'delivered'].includes(status)) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { status: ['The status must be one of: confirmed, processing, shipped, delivered.'] }
      });
    }

    const sale = await Sale.findById(req.params.saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    sale.status = status;
    await sale.save();

    // Populate listed product details
    await sale.populate({
      path: 'listed_product',
      populate: {
        path: 'design'
      }
    });

    const productTitle = sale.listed_product ? sale.listed_product.title : 'Printed Leather Item';

    // 1. Notify the Buyer (Shopper)
    let buyerTitle = 'Order Update';
    let buyerContent = `Your order #${sale.id} has been updated to "${status}".`;

    if (status === 'confirmed') {
      buyerTitle = 'Order Confirmed';
      buyerContent = `Your order #${sale.id} for "${productTitle}" has been confirmed by the store admin!`;
    } else if (status === 'processing') {
      buyerTitle = 'Order Processing';
      buyerContent = `Your order #${sale.id} is now being custom printed and processed.`;
    } else if (status === 'shipped') {
      buyerTitle = 'Order Shipped';
      buyerContent = `Hurrah! Your custom printed leather item for order #${sale.id} has been shipped and is on the way!`;
    } else if (status === 'delivered') {
      buyerTitle = 'Order Delivered';
      buyerContent = `Order Delivered: Enjoy your custom printed leather goods! Your order #${sale.id} is now complete.`;
    }

    if (sale.buyer) {
      await Notification.create({
        user: sale.buyer,
        title: buyerTitle,
        content: buyerContent,
        type: 'shipping'
      });
    }

    // 2. Notify the Seller
    await Notification.create({
      user: sale.seller,
      title: 'Fulfillment Update',
      content: `Fulfillment progress: The order for your custom design "${productTitle}" (Order #${sale.id}) is now "${status}".`,
      type: 'shipping'
    });

    // Populate relations for final response matching Laravel
    const populatedSale = await Sale.findById(sale.id)
      .populate('seller', 'name email')
      .populate('buyer', 'name email')
      .populate({
        path: 'listed_product',
        populate: {
          path: 'design'
        }
      });

    return res.json({
      message: `Order status updated to ${status}`,
      sale: populatedSale
    });
  } catch (error) {
    console.error('Update sale status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPendingProducts,
  updateProductStatus,
  getSellers,
  getSellerDesigns,
  getSales,
  updateSaleStatus
};
