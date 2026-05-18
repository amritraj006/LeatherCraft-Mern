const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const ListedProduct = require('../models/ListedProduct');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// POST /payments/create-intent - Create a Stripe PaymentIntent in INR
router.post('/payments/create-intent', auth, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty.' });
    }

    let totalAmount = 0;
    const itemsToPurchase = [];

    // Verify all items are approved and have sufficient stock
    for (const item of items) {
      const product = await ListedProduct.findById(item.id);
      if (!product) {
        return res.status(400).json({ message: `Product ID ${item.id} not found.` });
      }

      if (product.status !== 'approved') {
        return res.status(400).json({ message: `Product '${product.title}' is not available.` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for '${product.title}'. Remaining: ${product.quantity} units.` });
      }

      totalAmount += product.price * item.quantity;
      itemsToPurchase.push({
        product,
        quantity: item.quantity
      });
    }

    // Convert totalAmount to cents for Stripe (INR)
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: {
        items: JSON.stringify(itemsToPurchase.map(item => ({
          id: item.product.id,
          quantity: item.quantity
        })))
      }
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return res.status(500).json({ message: 'Stripe Error: ' + error.message });
  }
});

// POST /payments/confirm - Confirm payment and finalize order details
router.post('/payments/confirm', auth, async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
      return res.status(422).json({ message: 'Payment intent ID is required.' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not succeeded yet.' });
    }

    const items = JSON.parse(paymentIntent.metadata.items);
    const salesCreated = [];

    // Process each item purchase atomically
    for (const itemData of items) {
      // Perform atomic decrement of product quantity to prevent double-spending/overselling
      const product = await ListedProduct.findOneAndUpdate(
        { _id: itemData.id, quantity: { $gte: itemData.quantity } },
        { $inc: { quantity: -itemData.quantity } },
        { new: true }
      );

      if (!product) {
        return res.status(400).json({
          message: `Insufficient stock during processing. Please contact support regarding payment intent: ${payment_intent_id}`
        });
      }

      const amount = product.price * itemData.quantity;
      const adminCommission = amount * 0.10;
      const sellerEarnings = amount * 0.90;

      // Create Sale record
      const sale = new Sale({
        listed_product: product.id,
        seller: product.user,
        buyer: req.user.id,
        amount,
        admin_commission: adminCommission,
        seller_earnings: sellerEarnings,
        status: 'processing'
      });

      await sale.save();
      salesCreated.push(sale);

      // Trigger Notifications
      
      // 1. Notification to the Buyer (Shopper)
      await Notification.create({
        user: req.user.id,
        title: 'Order Confirmed',
        content: `Thank you! Your purchase of "${product.title}" (x${itemData.quantity}) has been successfully processed.`,
        type: 'purchase'
      });

      // 2. Notification to the Seller
      await Notification.create({
        user: product.user,
        title: 'Product Purchased',
        content: `Great news! Customer "${req.user.name || 'A buyer'}" purchased your product "${product.title}" (x${itemData.quantity}). Net Earnings: ₹${sellerEarnings.toFixed(2)}.`,
        type: 'purchase'
      });

      // 3. Notification to the Admin (user is null)
      await Notification.create({
        user: null,
        title: 'New Order Placed',
        content: `Customer "${req.user.name || 'A buyer'}" purchased "${product.title}" from Seller ID ${product.user}. Amount: ₹${amount.toFixed(2)}, Admin Commission: ₹${adminCommission.toFixed(2)}.`,
        type: 'purchase'
      });
    }

    return res.json({
      message: 'Order completed and payment verified successfully.',
      sales: salesCreated
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return res.status(500).json({ message: 'Order confirmation failed: ' + error.message });
  }
});

// GET /payments/orders - Fetch customer orders
router.get('/payments/orders', auth, async (req, res) => {
  try {
    const orders = await Sale.find({ buyer: req.user.id })
      .populate({
        path: 'listed_product',
        populate: {
          path: 'design'
        }
      })
      .populate('seller', 'name')
      .sort({ created_at: -1 });

    const formattedOrders = orders.map(sale => {
      return {
        id: sale.id,
        amount: sale.amount,
        status: sale.status,
        created_at: sale.created_at ? sale.created_at.toISOString() : new Date().toISOString(),
        product: {
          id: sale.listed_product ? sale.listed_product.id : null,
          title: sale.listed_product ? sale.listed_product.title : 'Deleted Product',
          price: sale.listed_product ? sale.listed_product.price : 0,
          description: sale.listed_product ? sale.listed_product.description : '',
          image: sale.listed_product && sale.listed_product.design ? sale.listed_product.design.ai_image : null
        },
        seller: {
          name: sale.seller ? sale.seller.name : 'Unknown Seller'
        }
      };
    });

    return res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Fetch customer orders error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
