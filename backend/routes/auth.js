const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// POST /register
router.post('/register', authController.register);

// POST /login
router.post('/login', authController.login);

// GET /user
router.get('/user', auth, authController.getUser);

// PUT /user
router.put('/user', auth, authController.updateUser);

module.exports = router;
