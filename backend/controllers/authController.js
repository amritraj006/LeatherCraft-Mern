const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to issue JWT token mimicking Laravel JwtService
const issueToken = (user) => {
  const ttl = parseInt(process.env.JWT_TTL || '1440', 10);
  return jwt.sign(
    {
      iss: process.env.APP_URL || 'http://localhost:8000',
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: `${ttl}m`
    }
  );
};

// Helper to serialize user matching Laravel's serializeUser
const serializeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    addresses: user.addresses || [],
    role: user.role
  };
};

// POST /register
const register = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    // Validate request
    if (!name || !email || !password) {
      return res.status(422).json({ message: 'Validation failed', errors: { name: ['All fields are required.'] } });
    }
    
    if (password.length < 8) {
      return res.status(422).json({ message: 'Validation failed', errors: { password: ['The password must be at least 8 characters.'] } });
    }

    if (password !== password_confirmation) {
      return res.status(422).json({ message: 'Validation failed', errors: { password: ['The password confirmation does not match.'] } });
    }

    // Check unique email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'Validation failed', errors: { email: ['The email has already been taken.'] } });
    }

    // Create user (role defaults to seller)
    const user = new User({
      name,
      email,
      password,
      role: 'seller'
    });

    await user.save();

    const token = issueToken(user);

    return res.status(201).json({
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: 'Validation failed', errors: { email: ['The email and password are required.'] } });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: { email: ['The provided credentials are invalid.'] }
      });
    }

    const token = issueToken(user);

    return res.json({
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /user
const getUser = async (req, res) => {
  return res.json({
    user: serializeUser(req.user)
  });
};

// PUT /user
const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, phone, addresses, password, password_confirmation } = req.body;

    // Validate fields
    if (!name || !email) {
      return res.status(422).json({ message: 'Validation failed', errors: { name: ['Name and email are required.'] } });
    }

    // Check unique email (excluding self)
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({ message: 'Validation failed', errors: { email: ['The email has already been taken.'] } });
      }
    }

    // Validate password if updating
    if (password) {
      if (password.length < 8) {
        return res.status(422).json({ message: 'Validation failed', errors: { password: ['The password must be at least 8 characters.'] } });
      }
      if (password !== password_confirmation) {
        return res.status(422).json({ message: 'Validation failed', errors: { password: ['The password confirmation does not match.'] } });
      }
      user.password = password; // pre-save hook will hash it
    }

    user.name = name;
    user.email = email;
    user.phone = phone || null;
    user.addresses = addresses || [];

    await user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getUser,
  updateUser
};
