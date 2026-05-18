const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');

const designSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  original_image: {
    type: String,
    default: null
  },
  ai_image: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    default: 'Manual Design Upload'
  }
}, schemaOptions);

// Add virtuals for backwards compatibility
designSchema.virtual('user_id').get(function() {
  return this.user ? this.user.toString() : null;
});

designSchema.virtual('product_id').get(function() {
  return this.product ? this.product.toString() : null;
});

// Since the front-end may load listed product information, let's allow populating it
designSchema.virtual('listedProduct', {
  ref: 'ListedProduct',
  localField: '_id',
  foreignField: 'design',
  justOne: true
});

module.exports = mongoose.model('Design', designSchema);
