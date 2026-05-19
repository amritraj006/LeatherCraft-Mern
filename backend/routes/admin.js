const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Middleware to ensure user is an admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized. Admin privileges required.' });
  }
  next();
};

// GET /admin/pending-products - Fetch pending catalog submissions
router.get('/admin/pending-products', auth, adminOnly, adminController.getPendingProducts);

// PATCH /admin/products/:productId/status - Approve or reject a listing
router.patch('/admin/products/:productId/status', auth, adminOnly, adminController.updateProductStatus);

// GET /admin/sellers - Fetch all sellers with design & product counts
router.get('/admin/sellers', auth, adminOnly, adminController.getSellers);

// GET /admin/sellers/:sellerId/designs - Fetch designs created by a seller
router.get('/admin/sellers/:sellerId/designs', auth, adminOnly, adminController.getSellerDesigns);

// GET /admin/sales - View all marketplace sales and total commissions
router.get('/admin/sales', auth, adminOnly, adminController.getSales);

// PATCH /admin/sales/:saleId/status - Update order fulfillment/shipping status
router.patch('/admin/sales/:saleId/status', auth, adminOnly, adminController.updateSaleStatus);

module.exports = router;
