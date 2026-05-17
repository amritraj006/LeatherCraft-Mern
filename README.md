# LeatherCraft — Full-Stack Leather Marketplace

> A premium custom leather goods marketplace built with React, Laravel, and Stripe. Sellers upload leather product templates, generate custom printed designs via a canvas-based Design Studio, and list them for sale. Customers browse the catalog, place orders, and pay securely via Stripe. Admins moderate listings and track revenue.

---

## 🏗️ Project Structure

```
LeatherCraft/
├── client/     → Customer-facing storefront  (React + Vite + Tailwind v3)
├── seller/     → Seller console & Design Studio  (React + Vite + Tailwind v4)
├── admin/      → Admin dashboard  (React + Vite + Tailwind v4)
└── backend/    → REST API  (Laravel 11 + MySQL + JWT + Stripe)
```

---

## ✨ Features

### 🛍️ Client (Storefront)
- Browse all approved marketplace listings
- View product detail pages with seller info and pricing (₹ INR)
- Add to cart & multi-item checkout via Stripe
- User authentication (register / login / logout)
- Real-time order notifications
- Purchase history in profile page

### 🎨 Seller Console
- Upload raw leather product templates (Wallets, Bags, Jackets)
- Canvas-based **Design Studio** to overlay and customize designs
- Save, download, and manage design gallery
- Submit designs for admin approval to be listed on marketplace
- Live storefront inventory view with stock & earnings tracker
- Sales ledger with per-order breakdown in ₹ INR

### 🛡️ Admin Dashboard
- Approve or reject seller-submitted product listings
- Full sales ledger with buyer & seller details
- Revenue dashboard: total admin commission (10% split) in ₹ INR
- Update order status (Confirmed → Processing → Shipped → Delivered)
- Seller account management

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+, Composer
- Node.js 18+, npm
- MySQL
- Stripe account (for payment processing)

---

### 1. Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` file:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=leathercraft_seller
DB_USERNAME=root
DB_PASSWORD=

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Cloudinary (optional — falls back to local disk)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Admin credentials (for seeder)
ADMIN_EMAIL=admin@leathercraft.com
ADMIN_PASSWORD=admin123
```

Run migrations and seed admin user:

```bash
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

> **Note:** If `CLOUDINARY_URL` is not set, uploaded images are stored on Laravel's local public disk. This works fine for local development.

---

### 2. Client (Customer Storefront)

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

Runs at → **http://localhost:5175**

---

### 3. Seller Console

```bash
cd seller
npm install
cp .env.example .env
```

Configure `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Runs at → **http://localhost:5173**

---

### 4. Admin Dashboard

```bash
cd admin
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

```bash
npm run dev
```

Runs at → **http://localhost:5174**

**Default admin login:**
```
Email:    admin@leathercraft.com
Password: admin123
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new seller/customer |
| POST | `/api/login` | Login (returns JWT) |
| GET | `/api/user` | Get authenticated user |
| POST | `/api/logout` | Logout |

### Products (Seller)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/product/upload` | Upload leather product template |
| GET | `/api/products` | List all uploaded products |

### Designs (Seller)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/design/save` | Save a custom design |
| GET | `/api/designs` | List saved designs |
| DELETE | `/api/design/{id}` | Delete a design |

### Marketplace
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/marketplace/products` | Submit design for listing |
| GET | `/api/marketplace/products` | Get seller's listings |
| PUT | `/api/marketplace/products/{id}` | Update listing details |
| GET | `/api/marketplace/all` | Public product catalog |

### Orders & Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/intent` | Create Stripe PaymentIntent |
| POST | `/api/payment/confirm` | Confirm payment & create sale |
| GET | `/api/sales` | Get seller's sales history |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/pending-products` | Products awaiting approval |
| PATCH | `/api/admin/products/{id}/status` | Approve or reject listing |
| GET | `/api/admin/sales` | Full platform sales ledger |
| PATCH | `/api/admin/sales/{id}/status` | Update order status |
| GET | `/api/admin/sellers` | All registered sellers |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications/{id}/read` | Mark notification as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Client Frontend** | React 19, Vite, Tailwind CSS v3, Zustand, Stripe.js |
| **Seller Frontend** | React 19, Vite, Tailwind CSS v4, Fabric.js (canvas), Zustand |
| **Admin Frontend** | React 19, Vite, Tailwind CSS v4, Zustand |
| **Backend API** | Laravel 11, PHP 8.2, JWT Auth (custom), MySQL |
| **Payments** | Stripe (INR currency, PaymentIntents) |
| **File Storage** | Cloudinary CDN (with local disk fallback) |
| **Typography** | Outfit (sans-serif) + Playfair Display (serif) |

---

## 🎨 Design System

The platform uses a warm, premium leather-inspired color palette:

| Token | Color | Usage |
|-------|-------|-------|
| `walnut` | `#4A3228` | Primary text, backgrounds |
| `terracotta` | `#C96A3D` | Accent, CTA buttons |
| `sand` | `#D8C3A5` | Borders, subtle fills |
| `olive` | `#66734F` | Success states |
| `ivory` | `#FAF7F2` | Page background |

---

## 🧪 Quality Checks

```bash
# Backend
cd backend && php artisan test && ./vendor/bin/pint --test

# Seller
cd seller && npm run lint && npm run build

# Client
cd client && npm run lint && npm run build

# Admin
cd admin && npm run lint && npm run build
```

---

## 📜 License

MIT License — built for educational and demonstration purposes.
