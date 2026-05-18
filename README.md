# 👜 LeatherCraft — Premium Custom Leather Marketplace

> A state-of-the-art, end-to-end custom leather goods platform. Artisans and sellers upload high-quality leather product templates, design bespoke overlays in a canvas-based **Design Studio**, and list products for sale. Customers can shop from a curated catalog, customize and purchase items via a secure **Stripe** checkout (supporting ₹ INR), and track their orders. A powerful **Admin Dashboard** governs listing approvals, inventory management, and platform analytics with a built-in commission split.

---

## 🏗️ Monorepo Workspace Structure

The workspace is organized as an elegant multi-workspace JS/TS repository:

```text
LeatherCraft/
├── backend/    → Express.js API Server (Node.js + MongoDB + Mongoose + JWT + Stripe)
├── client/     → Customer Storefront (React 19 + Vite + Tailwind CSS v3)
├── seller/     → Seller Console & Canvas Design Studio (React 19 + Vite + Tailwind CSS v4)
└── admin/      → Administrative Dashboard & Ledger Console (React 19 + Vite + Tailwind CSS v4)
```

---

## ✨ Outstanding Features

### 🛍️ Customer Storefront (`client`)
* **Curated Marketplace**: Browse luxury, admin-approved custom leather listings.
* **Rich Product Presentation**: Full product detail views highlighting artisan profiles, custom design layouts, and secure Indian Rupee (₹ INR) pricing.
* **Modern Cart & Multi-Item Checkout**: Unified cart flow and seamless Stripe PaymentIntents processing.
* **Artisan Connect**: Direct viewing of seller profiles and their complete bespoke collection.
* **Order History**: Personal purchase log detailing order status and real-time alerts.

### 🎨 Seller Console & Design Studio (`seller`)
* **Artisan Hub**: Track unit sales, gross revenue, net payouts, and low-stock alerts.
* **Premium Design Studio**: Interactive canvas builder (powered by `fabric.js`) to place artwork, adjust scale/rotation, and create beautiful custom overlays on raw leather templates (wallets, bags, notebooks, jackets).
* **Inventory Control**: Directly publish designs for admin evaluation, monitor approved listings, and restock items.

### 🛡️ Administrative Console (`admin`)
* **Moderation Pipeline**: Review, approve, or reject seller submissions with automatic email/notification alerts.
* **Global Sales Ledger**: Full ledger showing buyer details, seller payouts, and platform commission.
* **Platform Health & Metrics**: Real-time sales charts and administrative income tracking (10% standard platform cut).
* **Order Fulfillment Center**: Update shipment milestones (Confirmed ➔ Processing ➔ Shipped ➔ Delivered).

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following system utilities installed:
* **Node.js** (v18.0.0 or higher) & **npm**
* **MongoDB** (Local Community Edition or Atlas cloud database)
* **Stripe** developer account (for processing payments)
* **Cloudinary** account (for secure, high-performance image uploads and CDN storage)

---

### 1. Backend API Server (`backend`)

The server is powered by Express.js and MongoDB. It uses direct memory-stream uploads to Cloudinary (no local temporary uploads required) and provides atomic inventory control to prevent race conditions.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```

Create and configure the `.env` file in `backend/`:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/leathercraft_seller

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_TTL=1440

# Stripe Payments API
STRIPE_SECRET=sk_test_...

# Cloudinary Storage
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Platform Administrator Credentials (automatically seeded on first startup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
```

Start the backend application:

```bash
# Start in development mode with nodemon auto-reload
npm run dev

# Or start standard production server
npm start
```

> **Note:** On startup, the server automatically connects to MongoDB, sets up index mappings, and seeds the platform administrator account if it is not already present in the database.

---

### 2. Customer Storefront (`client`)

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Run the customer storefront:

```bash
npm run dev
```
The application will launch on **http://localhost:5175**.

---

### 3. Seller Console (`seller`)

```bash
cd seller
npm install
```

Create a `.env` file in the `seller/` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Run the seller console:

```bash
npm run dev
```
The application will launch on **http://localhost:5173**.

---

### 4. Admin Dashboard (`admin`)

```bash
cd admin
npm install
```

Create a `.env` file in the `admin/` folder:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Run the administration suite:

```bash
npm run dev
```
The dashboard will launch on **http://localhost:5174**.

**Default Admin Credentials:**
* **Email:** `admin@example.com` (or your configured `ADMIN_EMAIL`)
* **Password:** `password123` (or your configured `ADMIN_PASSWORD`)

---

## 🔌 API Route Reference

All API routes are prefixed with `/api` and require a `Bearer <token>` authentication header for protected endpoints:

### 🔐 Authentication
* `POST /api/register` - Create a new user account (defaults to `seller` role)
* `POST /api/login` - Authenticate and retrieve a JWT access token
* `GET /api/user` - Retrieve authenticated user profile details
* `PUT /api/user` - Update profile settings (name, address, password)

### 🎨 Products & Designs (Artisan Tools)
* `POST /api/product/upload` - Upload raw leather template mockup (uses Cloudinary)
* `GET /api/products` - List all raw product mockups uploaded by current seller
* `DELETE /api/products/:id` - Delete product mockup, along with its dependent designs
* `POST /api/design/save` - Save Canvas-overlay custom design (uploaded to Cloudinary)
* `GET /api/designs` - List all custom designs crafted by the seller
* `DELETE /api/design/:id` - Delete a design and remove its media from Cloudinary

### 🛒 Marketplace & Cart
* `GET /api/public/products` - Public catalog for shoppers (only shows approved listings)
* `GET /api/public/products/:id` - Detailed catalog entry view
* `POST /api/marketplace/products` - Submit a design to admin for approval to list it
* `GET /api/marketplace/products` - List seller's own active and pending listings with sale counts
* `PUT /api/marketplace/products/:id` - Edit listing information (title, price, stock)

### 💳 Orders & Stripe Payments
* `POST /api/payments/create-intent` - Create Stripe PaymentIntent (expects billing details, returns client secret)
* `POST /api/payments/confirm` - Confirms successful transaction, decrements inventory atomically, splits commissions, and creates order records
* `GET /api/payments/orders` - Retrieve list of customer order history
* `GET /api/sales` - Retrieve total artisan earnings ledger

### 🛡️ Administration Management
* `GET /api/admin/pending-products` - Retrieve all seller listings pending admin review
* `PATCH /api/admin/products/:id/status` - Approve or reject listing (sends dynamic notifications)
* `GET /api/admin/sellers` - Overview list of registered sellers, their listing totals, and active designs
* `GET /api/admin/sales` - Global ledger showing platform transactions, buyers, sellers, and commission sums
* `PATCH /api/admin/sales/:id/status` - Update fulfillment milestone status and alert client/seller

### 🔔 Notifications Center
* `GET /api/notifications` - Retrieve list of unread alerts matching the user's role
* `PATCH /api/notifications/:id/read` - Mark single alert as read
* `PATCH /api/notifications/read-all` - Bulk mark all unread notifications as read

---

## 🎨 Luxury Brand Design System

To capture a premium leathercraft brand identity, the entire suite implements a cohesive, high-end visual palette and curated typography:

* **Typography**:
  * **Headers**: `Playfair Display` (Classic, elegant serif)
  * **Body & UI**: `Outfit` (Clean, contemporary geometric sans-serif)
* **Custom Scrollbars & Selections**: Tailored thin walnut-tinted bars and warm highlight selections for high-end finish.
* **Palette**:
  * 🟫 **Walnut** (`#4A3228`): Deep primary leather tone for headers, typography, and dark sections.
  * 🟧 **Terracotta** (`#C96A3D`): Warm, vibrant clay orange for key CTAs, interactive states, and active items.
  * 🌾 **Sand** (`#D8C3A5`): Soft, luxurious beige border trim and subtle divider lines.
  * 🟩 **Olive** (`#66734F`): Rich organic green for success alerts, stock confirmations, and earnings stats.
  * 🍦 **Ivory** (`#FAF7F2`): A luminous canvas background tone mimicking fresh cream/parchment.

---

## 🧪 Quality and Verification Commands

```bash
# Verify Backend Server is operating
cd backend && npm run dev

# Lint and verify production build configurations
cd client && npm run lint && npm run build
cd seller && npm run lint && npm run build
cd admin && npm run lint && npm run build
```

---

## 📜 License
Distributable under the **MIT License**. Created with excellence for luxury leather custom e-commerce demonstration.
# LeatherCraft-Mern
