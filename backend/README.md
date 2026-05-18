# LeatherCraft Express & MongoDB Server

A fully-featured Node.js, Express, and MongoDB backend for **LeatherCraft** matching 1:1 the API routes and response structures of the Laravel/PHP backend. It utilizes Cloudinary for image upload and storage.

---

## 🛠️ Tech Stack & Features

- **Core Framework**: Node.js & Express.js
- **Database**: MongoDB (configured via Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens) mirroring Laravel's auth payload structures
- **Password Security**: Hash-salted passwords via `bcryptjs`
- **File Uploads & Storage**: High-performance streaming image uploads to **Cloudinary** using `multer` (no local files are kept!)
- **Payments Integration**: Stripe Payment Intents and Confirmation API in Indian Rupee (₹)
- **Automatic Seeders**: Automatically seeds the default Admin account on startup

---

## 📁 Folder Structure

```text
server/
├── config/
│   ├── db.js          # MongoDB connection handler
│   └── cloudinary.js  # Cloudinary SDK config & streaming upload helper
├── middleware/
│   └── auth.js        # JWT protection middleware (mimicking Laravel jwt.auth)
├── models/
│   ├── schemaOptions.js # Mongoose shared model serialization hook
│   ├── User.js        # User model (name, email, role, etc.)
│   ├── Product.js     # Base Product model
│   ├── Design.js      # Custom manual designs
│   ├── ListedProduct.js # Approved marketplace listings
│   ├── Sale.js        # Sales records & commission splits
│   └── Notification.js # Notification center logs
├── routes/
│   ├── auth.js        # Auth controller routes
│   ├── products.js    # Uploading base products
│   ├── designs.js     # Designing manual customizations
│   ├── marketplace.js # Listings, inventory updates, & mock purchases
│   ├── notifications.js # Notifications read/write
│   ├── payments.js    # Stripe payments intents & confirmed orders
│   └── admin.js       # Admin panel approvals, sellers, & status updates
├── .env               # Environment configuration settings
├── package.json       # Dependencies list & run scripts
└── server.js          # Main Express server entry & admin seeder
```

---

## 🚀 Setup & Execution

### 1. Prerequisite
Ensure you have **Node.js** (v18+) and **MongoDB** installed and running locally.

### 2. Install Dependencies
Change into the `server` folder and install packages:
```bash
cd server
npm install
```

### 3. Environment Config
The server has been pre-configured with a `.env` file containing the necessary credentials. The MongoDB URI is pointed to `mongodb://127.0.0.1:27017/leathercraft_seller`. You can customize these details if your database port or credentials vary.

### 4. Running the Server

#### Start Development Mode (Auto-reloads on save):
```bash
npm run dev
```

#### Start Production Mode:
```bash
npm start
```

---

## 🔌 API Endpoints Mapping

All API endpoints are prefixed with `/api` and mirror Laravel's routes exactly:

| Route Path | Method | Auth | Description |
|---|---|---|---|
| `/api/register` | `POST` | Public | Register a seller account (default role: `seller`) |
| `/api/login` | `POST` | Public | Login to get a Bearer JWT Token |
| `/api/user` | `GET` | Bearer Token | Fetch authenticated user profile details |
| `/api/user` | `PUT` | Bearer Token | Update user profile (name, email, phone, addresses, password) |
| `/api/public/products` | `GET` | Public | Public catalog for Shoppers (only approved items) |
| `/api/public/products/:id` | `GET` | Public | Detail view of an approved catalog listing |
| `/api/product/upload` | `POST` | Bearer Token | Upload base product image to Cloudinary (Multer stream upload) |
| `/api/products` | `GET` | Bearer Token | Retrieve all base products uploaded by seller |
| `/api/products/:id` | `DELETE` | Bearer Token | Delete product, designs, listings & their Cloudinary assets |
| `/api/design/save` | `POST` | Bearer Token | Save a manual design upload, uploading it to Cloudinary |
| `/api/designs` | `GET` | Bearer Token | Get all custom designs created by seller |
| `/api/design/:id` | `DELETE` | Bearer Token | Delete design and its Cloudinary media assets |
| `/api/marketplace/products` | `POST` | Bearer Token | List a custom design in storefront catalog (creates Admin review) |
| `/api/marketplace/products` | `GET` | Bearer Token | List seller's own listings with stats (Units Sold & net earnings) |
| `/api/marketplace/products/:id` | `PUT` | Bearer Token | Update listing details (title, description, inventory) |
| `/api/marketplace/products/:id/purchase` | `POST` | Bearer Token | Mock purchase (for quick storefront testing without Stripe keys) |
| `/api/sales` | `GET` | Bearer Token | List all sales of seller's items with Total Earnings sum |
| `/api/notifications` | `GET` | Bearer Token | Fetch user notifications (Admin gets global/null notifications) |
| `/api/notifications/read-all`| `PATCH` | Bearer Token | Mark all role-specific notifications as read |
| `/api/notifications/:id/read`| `PATCH` | Bearer Token | Mark single notification as read |
| `/api/payments/create-intent`| `POST` | Bearer Token | Create Stripe PaymentIntent in INR (uses Stripe secret) |
| `/api/payments/confirm` | `POST` | Bearer Token | Confirm payment, atomically decrement stock, compute commissions |
| `/api/payments/orders` | `GET` | Bearer Token | Fetch buyer custom orders with seller & design details |
| `/api/admin/pending-products` | `GET` | Admin Only | Get all pending listed products waiting for review |
| `/api/admin/products/:id/status`| `PATCH`| Admin Only | Approve or reject a seller listing (sends notifications) |
| `/api/admin/sellers` | `GET` | Admin Only | List all sellers with product and design counts |
| `/api/admin/sellers/:id/designs`| `GET`| Admin Only | View designs belonging to a specific seller |
| `/api/admin/sales` | `GET` | Admin Only | View global sales history and sum of admin commission |
| `/api/admin/sales/:id/status`| `PATCH`| Admin Only | Update shipping fulfillment status (sends multi-user alerts) |

---

## ⚡ Key Architecture Advantages in Node.js version

1. **Memory-Stream Uploads**: No temporary files are stored on the server's local file system. Multiparts parsed by `multer` are directly uploaded as memory buffers to Cloudinary.
2. **Atomic Inventory Control**: Concurrency is handled robustly in `payments/confirm` using MongoDB's atomic `$inc` with safety checks (`quantity: { $gte: quantity }`). This completely eliminates race conditions where two customers buy the last item at the exact same millisecond.
3. **Mongoose Virtual Normalizer**: A custom global middleware converts Mongoose ObjectIds into simple `.id` string representations and strips away MongoDB-internal tags like `_id` and `__v` to ensure absolute compatibility with the React client's expected response structures.
