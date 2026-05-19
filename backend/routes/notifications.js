const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// GET /notifications - Get list of notifications based on role
router.get('/notifications', auth, notificationController.getNotifications);

// PATCH /notifications/read-all - Mark all as read
router.patch('/notifications/read-all', auth, notificationController.readAllNotifications);

// PATCH /notifications/:notificationId/read - Mark single notification as read
router.patch('/notifications/:notificationId/read', auth, notificationController.readNotification);

module.exports = router;
