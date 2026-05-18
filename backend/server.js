const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load all models globally to register schemas with Mongoose
const User = require('./models/User');
require('./models/Product');
require('./models/Design');
require('./models/ListedProduct');
require('./models/Sale');
require('./models/Notification');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB (connection established before starting the server)

// Global Middlewares
app.use(cors({
  origin: '*', // Allow all origins for flexible React development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routers
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/designs'));
app.use('/api', require('./routes/marketplace'));
app.use('/api', require('./routes/notifications'));
app.use('/api', require('./routes/payments'));
app.use('/api', require('./routes/admin'));

// Base Health-Check Route
app.get('/', (req, res) => {
  res.json({
    name: 'LeatherCraft Node/Express API Server',
    status: 'healthy',
    database: 'MongoDB',
    storage: 'Cloudinary'
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Seed admin user on start
const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save User hook
        role: 'admin'
      });
      await admin.save();
      console.log(`[SEED] Admin account seeded successfully: ${adminEmail}`);
    } else {
      console.log('[SEED] Admin account already present, skipping seeding.');
    }
  } catch (err) {
    console.error('[SEED] Failed to seed admin user:', err);
  }
};

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Seed the admin user
    await seedAdminUser();
  });
});
