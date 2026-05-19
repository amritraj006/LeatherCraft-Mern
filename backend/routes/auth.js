const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Multer memory storage setup (maximum file size 5MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /register
router.post('/register', authController.register);

// POST /login
router.post('/login', authController.login);

// GET /user
router.get('/user', auth, authController.getUser);

// PUT /user
router.put('/user', auth, authController.updateUser);

// POST /user/avatar - Upload profile picture
router.post('/user/avatar', auth, upload.single('avatar'), authController.updateAvatar);

// DELETE /user/avatar - Remove profile picture
router.delete('/user/avatar', auth, authController.deleteAvatar);

module.exports = router;
