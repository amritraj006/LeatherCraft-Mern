const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');

const saleSchema = new mongoose.Schema({
  listed_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListedProduct',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  admin_commission: {
    type: Number,
    required: true,
    min: 0
  },
  seller_earnings: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered'],
    default: 'processing'
  }
}, schemaOptions);

// Add virtuals for compatibility
saleSchema.virtual('listed_product_id').get(function() {
  return this.listed_product ? this.listed_product.toString() : null;
});

saleSchema.virtual('seller_id').get(function() {
  return this.seller ? this.seller.toString() : null;
});

saleSchema.virtual('buyer_id').get(function() {
  return this.buyer ? this.buyer.toString() : null;
});

module.exports = mongoose.model('Sale', saleSchema);
