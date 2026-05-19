# 👜 LeatherCraft — Premium Custom Leather Marketplace

> A full-stack, end-to-end custom leather goods platform built on the **MERN stack**. Artisans upload leather product templates, design bespoke overlays in a canvas-based **Design Studio** (powered by `fabric.js`), and list products for sale. Customers shop from a curated catalog, customize and purchase items via a secure **Stripe** checkout (₹ INR), and track their orders in real time. A powerful **Admin Dashboard** governs listing approvals, platform analytics, order fulfillment, and commission management.

---

## 🏗️ Monorepo Structure

```text
LeatherCraft/
├── backend/    → Express.js REST API  (Node.js + MongoDB + Mongoose + JWT + Stripe + Cloudinary)
├── client/     → Customer Storefront  (React 19 + Vite + Tailwind CSS v3)
├── seller/     → Seller Console & Design Studio  (React 19 + Vite + Tailwind CSS v4)
└── admin/      → Admin Dashboard & Ledger  (React 19 + Vite + Tailwind CSS v4)
```

Each workspace is an independent Node/React project with its own `package.json`, `.env`, and `vite.config.js`.

---

## ✨ Feature Overview

### 🛍️ Customer Storefront (`client/`)
| Feature | Description |
|---|---|
| Landing Page | Hero section, featured categories, and product highlights |
| Curated Marketplace | Browse admin-approved custom leather listings with filters & search |
| Product Detail | Artisan profile, design preview, INR pricing, stock indicator |
| Cart & Checkout | Multi-item cart with Stripe PaymentIntent integration |
| Order History | Purchase log with real-time status tracking |
| Notifications | Role-based alerts (order confirmed, shipped, delivered) |
| User Profile | Edit name, address, and password |
| Auth | JWT-based login & registration |

### 🎨 Seller Console & Design Studio (`seller/`)
| Feature | Description |
|---|---|
| Dashboard | Sales KPIs, gross revenue, net payouts, low-stock alerts, charts |
| Design Studio | Canvas builder (`fabric.js`) — place artwork, scale, rotate on leather templates |
| AI Design | AI-assisted design generation workflow |
| Designs Gallery | View, manage, and submit all canvas designs |
| Base Products | Upload raw leather mockup templates to Cloudinary |
| Marketplace Listings | Publish designs for admin review; monitor approval status |
| Sales Ledger | Detailed earnings history per transaction |
| Notifications | Approval/rejection alerts from the admin pipeline |
| Account Settings | Update seller profile details |

### 🛡️ Admin Dashboard (`admin/`)
| Feature | Description |
|---|---|
| Dashboard | Platform-wide metrics — total sales, revenue, commission, active sellers |
| Moderation Pipeline | Approve or reject seller submissions with instant notifications |
| Sellers Overview | List of all registered sellers, their listing counts, and designs |
| Seller Designs | Browse designs per seller |
| Sales Ledger | Full global ledger — buyer, seller, platform commission |
| Order Fulfillment | Update shipment milestones (Confirmed → Processing → Shipped → Delivered) |
| Notifications | Platform-wide alert management |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js ≥ 18 |
| **API Server** | Express.js 4 |
| **Database** | MongoDB + Mongoose 8 |
| **Authentication** | JWT (`jsonwebtoken`) + `bcryptjs` |
| **Payments** | Stripe (PaymentIntents API) |
| **File Storage** | Cloudinary v2 (direct memory-stream, no temp files) |
| **Canvas Engine** | `fabric.js` |
| **Frontend** | React 19 + Vite |
| **Styling** | Tailwind CSS v3 (client) / v4 (seller, admin) |
| **Security** | `helmet`, `express-rate-limit`, `cors` |
| **Logging** | `winston` + `morgan` |
| **Validation** | `express-validator` |
| **Deployment** | Render.com (via `render.yaml`) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ & npm
- **MongoDB** — Local Community Edition or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Stripe** developer account — [stripe.com](https://stripe.com)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com)

---

### 1. Backend API (`backend/`)

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/leathercraft

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_TTL=1440

# Stripe
STRIPE_SECRET=sk_test_...

# Cloudinary
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Admin seed credentials (auto-created on first boot)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
```

```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

> **On first startup**, the server connects to MongoDB, registers all Mongoose schemas, and automatically seeds the admin account if it does not yet exist.

**Health check:** `GET http://localhost:8000/` returns server status.

---

### 2. Customer Storefront (`client/`)

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev   # → http://localhost:5175
```

---

### 3. Seller Console (`seller/`)

```bash
cd seller
npm install
```

Create `seller/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

```bash
npm run dev   # → http://localhost:5173
```

---

### 4. Admin Dashboard (`admin/`)

```bash
cd admin
npm install
```

Create `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

```bash
npm run dev   # → http://localhost:5174
```

**Default admin credentials:**
- **Email:** `admin@example.com` (or your `ADMIN_EMAIL`)
- **Password:** `password123` (or your `ADMIN_PASSWORD`)

---

## 🔌 API Reference

All routes are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### 🔐 Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Create new account (default role: `seller`) |
| `POST` | `/login` | ❌ | Authenticate and return JWT |
| `GET` | `/user` | ✅ | Get authenticated user profile |
| `PUT` | `/user` | ✅ | Update profile (name, address, password) |

### 🎨 Products & Designs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/product/upload` | ✅ | Upload raw leather template to Cloudinary |
| `GET` | `/products` | ✅ | List seller's own raw product mockups |
| `DELETE` | `/products/:id` | ✅ | Delete mockup and cascade-delete its designs |
| `POST` | `/design/save` | ✅ | Save canvas design overlay (uploaded to Cloudinary) |
| `GET` | `/designs` | ✅ | List all designs by the authenticated seller |
| `DELETE` | `/design/:id` | ✅ | Delete design and remove Cloudinary media |

### 🛒 Marketplace & Catalog
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/public/products` | ❌ | Public catalog (approved listings only) |
| `GET` | `/public/products/:id` | ❌ | Single product detail |
| `POST` | `/marketplace/products` | ✅ | Submit design for admin approval |
| `GET` | `/marketplace/products` | ✅ | Seller's own listings with sale counts |
| `PUT` | `/marketplace/products/:id` | ✅ | Edit listing (title, price, stock) |

### 💳 Payments & Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/payments/create-intent` | ✅ | Create Stripe PaymentIntent; returns `client_secret` |
| `POST` | `/payments/confirm` | ✅ | Confirm payment — decrements stock atomically, splits commissions, creates order records |
| `GET` | `/payments/orders` | ✅ | Customer order history |
| `GET` | `/sales` | ✅ | Seller earnings ledger |

### 🛡️ Admin
| Method | Endpoint | Auth (admin) | Description |
|---|---|---|---|
| `GET` | `/admin/pending-products` | ✅ | All listings pending review |
| `PATCH` | `/admin/products/:id/status` | ✅ | Approve or reject; sends notification |
| `GET` | `/admin/sellers` | ✅ | All sellers with listing & design counts |
| `GET` | `/admin/sales` | ✅ | Global sales ledger with commission breakdown |
| `PATCH` | `/admin/sales/:id/status` | ✅ | Update fulfillment status; notifies buyer & seller |

### 🔔 Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/notifications` | ✅ | Fetch unread alerts for current user's role |
| `PATCH` | `/notifications/:id/read` | ✅ | Mark single notification as read |
| `PATCH` | `/notifications/read-all` | ✅ | Bulk mark all as read |

---

## 🗄️ Data Models

| Model | Key Fields |
|---|---|
| `User` | `name`, `email`, `password` (bcrypt), `role` (`seller`/`admin`/`customer`) |
| `Product` | `seller`, `imageUrl`, `cloudinaryId`, `category` |
| `Design` | `seller`, `product`, `canvasJSON`, `previewUrl`, `cloudinaryId` |
| `ListedProduct` | `design`, `seller`, `title`, `price`, `stock`, `status` (`pending`/`approved`/`rejected`) |
| `Sale` | `buyer`, `seller`, `listedProduct`, `amount`, `commission`, `status`, `stripePaymentId` |
| `Notification` | `recipient`, `role`, `type`, `message`, `is_read` |

---

## ☁️ Deployment (Render)

The project ships with a `render.yaml` for one-click multi-service deployment on [Render.com](https://render.com).

```yaml
# Services defined in render.yaml:
- leathercraft-backend   → Node.js Web Service
- leathercraft-client    → Static Site (Vite build)
- leathercraft-seller    → Static Site (Vite build)
- leathercraft-admin     → Static Site (Vite build)
```

**Environment variables to set manually in the Render dashboard:**
- `MONGO_URI` — your MongoDB Atlas connection string
- `CLOUDINARY_URL` — your Cloudinary credentials
- `STRIPE_SECRET` — your Stripe secret key
- `JWT_SECRET` — auto-generated by Render
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin seed credentials

Frontend services automatically inherit the backend's `RENDER_EXTERNAL_URL` as `VITE_API_BASE_URL`.

---

## 🎨 Design System

A cohesive luxury leather brand identity is applied across all four apps:

### Typography
| Role | Font |
|---|---|
| Display / Headers | [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — classic serif |
| Body / UI | [Outfit](https://fonts.google.com/specimen/Outfit) — geometric sans-serif |

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| 🟫 **Walnut** | `#4A3228` | Primary text, dark sections, headers |
| 🟧 **Terracotta** | `#C96A3D` | CTAs, active states, interactive accents |
| 🌾 **Sand** | `#D8C3A5` | Borders, dividers, subtle backgrounds |
| 🟩 **Olive** | `#66734F` | Success, stock indicators, earnings stats |
| 🍦 **Ivory** | `#FAF7F2` | Page backgrounds — parchment tone |

---

## 🧪 Verification Commands

```bash
# Backend health check
cd backend && npm run dev

# Lint & production build validation
cd client && npm run lint && npm run build
cd seller && npm run lint && npm run build
cd admin  && npm run lint && npm run build
```

---

## 📁 Project Layout (Detailed)

```text
LeatherCraft/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Auth, products, designs, marketplace, payments, admin, notifications
│   ├── middleware/     → JWT auth guard, role check, multer upload
│   ├── models/         → User, Product, Design, ListedProduct, Sale, Notification
│   ├── routes/         → auth, products, designs, marketplace, payments, admin, notifications
│   ├── utils/          → Cloudinary helpers, response utilities
│   └── server.js       → Express app entry point + admin seeding
│
├── client/src/
│   ├── api/            → Axios client
│   ├── components/     → Navbar, Footer, CartDrawer, shared UI
│   ├── pages/          → LandingPage, Products, Product, Cart, Login, Register,
│   │                     Profile, Notifications, PaymentSuccess
│   ├── store/          → Zustand state (cart, auth, notifications)
│   └── utils/
│
├── seller/src/
│   ├── api/            → Axios client
│   ├── components/     → Layout, Sidebar, shared UI
│   ├── context/        → Auth context
│   ├── pages/          → Dashboard, DesignStudio, AIDesign, DesignsGallery,
│   │                     BaseProducts, Sales, Notifications, Account, Login, Register
│   └── store/
│
├── admin/src/
│   ├── api/            → Axios client
│   ├── components/     → Layout, Sidebar, shared UI
│   ├── pages/          → Dashboard, Products, Sellers, SellerDesigns,
│   │                     Notifications, Login
│   └── store/
│
├── render.yaml         → Render.com multi-service deployment config
└── .gitignore
```

---

## 📜 License

Distributed under the **MIT License**.  
Built with ❤️ for luxury leather custom e-commerce.
