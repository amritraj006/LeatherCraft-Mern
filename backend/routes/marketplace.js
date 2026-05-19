const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const marketplaceController = require('../controllers/marketplaceController');

// GET /marketplace/products - Fetch seller's listed products with sales stats
router.get('/marketplace/products', auth, marketplaceController.getMarketplaceProducts);

// POST /marketplace/products - List a custom design for sale
router.post('/marketplace/products', auth, marketplaceController.listMarketplaceProduct);

// POST /marketplace/products/:productId/purchase - Mock purchase endpoint
router.post('/marketplace/products/:productId/purchase', auth, marketplaceController.purchaseProduct);

// GET /sales - Fetch seller's sales and total earnings
router.get('/sales', auth, marketplaceController.getSales);

// GET /public/products - Public catalog for shoppers
router.get('/public/products', marketplaceController.getPublicProducts);

// GET /public/products/:productId - View detailed approved listed product
router.get('/public/products/:productId', marketplaceController.getPublicProduct);

// PUT /marketplace/products/:productId - Update listing details
router.put('/marketplace/products/:productId', auth, marketplaceController.updateMarketplaceProduct);

module.exports = router;
