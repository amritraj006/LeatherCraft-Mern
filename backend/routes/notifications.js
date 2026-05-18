const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// GET /notifications - Get list of notifications based on role
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    if (user.role === 'admin') {
      // Admins fetch global admin notifications (user is null)
      query = { user: null };
    } else {
      // Shoppers and Sellers fetch their owned notifications
      query = { user: user.id };
    }

    const notifications = await Notification.find(query)
      .sort({ created_at: -1 });

    return res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /notifications/read-all - Mark all as read
router.patch('/notifications/read-all', auth, async (req, res) => {
  try {
    const user = req.user;
    let query = { is_read: false };

    if (user.role === 'admin') {
      query.user = null;
    } else {
      query.user = user.id;
    }

    await Notification.updateMany(query, { is_read: true });

    return res.json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /notifications/:notificationId/read - Mark single notification as read
router.patch('/notifications/:notificationId/read', auth, async (req, res) => {
  try {
    const user = req.user;
    const notification = await Notification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    // Security check
    if (user.role !== 'admin' && (!notification.user || notification.user.toString() !== user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized action.'
      });
    }

    notification.is_read = true;
    await notification.save();

    return res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark single notification read error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
