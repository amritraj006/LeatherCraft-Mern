const mongoose = require('mongoose');
const schemaOptions = require('./schemaOptions');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  }
}, schemaOptions);

// Add virtuals for compatibility
notificationSchema.virtual('user_id').get(function() {
  return this.user ? this.user.toString() : null;
});

module.exports = mongoose.model('Notification', notificationSchema);
