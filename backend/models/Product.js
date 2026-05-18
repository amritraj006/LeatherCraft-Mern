const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    maxlength: 80
  }
}, schemaOptions);

// For convenience and backwards compatibility with PHP-like response structures
productSchema.virtual('user_id').get(function() {
  return this.user ? this.user.toString() : null;
});

module.exports = mongoose.model('Product', productSchema);
