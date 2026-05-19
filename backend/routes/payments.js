const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// POST /payments/create-intent - Create a Stripe PaymentIntent in INR
router.post('/payments/create-intent', auth, paymentController.createIntent);

// POST /payments/confirm - Confirm payment and finalize order details
router.post('/payments/confirm', auth, paymentController.confirmPayment);

// GET /payments/orders - Fetch customer orders
router.get('/payments/orders', auth, paymentController.getOrders);

module.exports = router;
