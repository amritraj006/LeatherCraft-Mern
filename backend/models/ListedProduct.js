const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');

const listedProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, schemaOptions);

// Add virtuals for compatibility
listedProductSchema.virtual('user_id').get(function() {
  return this.user ? this.user.toString() : null;
});

listedProductSchema.virtual('design_id').get(function() {
  return this.design ? this.design.toString() : null;
});

// Relate to sales to compute Net Earnings & Units Sold
listedProductSchema.virtual('sales', {
  ref: 'Sale',
  localField: '_id',
  foreignField: 'listed_product'
});

module.exports = mongoose.model('ListedProduct', listedProductSchema);
