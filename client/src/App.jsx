import { Navigate, Outlet, Route, Routes, Link, useLocation } from 'react-router-dom'
import { ShoppingCart, LogOut, LogIn, UserPlus, Store, Info, Phone } from 'lucide-react'
import { useCart } from './store/useCart'
import { useAuth } from './store/useAuth'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ToastContainer from './components/ToastContainer'
import NotificationBell from './components/NotificationBell'
import Notifications from './pages/Notifications'
import LandingPage from './pages/LandingPage'

function AppShell() {
  const itemCount = useCart(state => state.getItemCount())
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-walnut font-sans relative">
      <ToastContainer />
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sand/40 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo Brand */}
          <Link to="/shop" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 bg-walnut text-ivory rounded-xl flex items-center justify-center border border-sand/50 shadow-sm">
              <Store size={18} />
            </div>
            <div>
              <span className="text-base font-serif font-extrabold tracking-tight text-walnut uppercase">LeatherCraft</span>
              <span className="block text-[8px] font-bold tracking-widest text-terracotta uppercase leading-none">Printed Leather Store</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-walnut/70">
            <Link to="/shop" className={`hover:text-terracotta transition-colors ${location.pathname === '/shop' ? 'text-terracotta' : ''}`}>
              Shop Products
            </Link>
            <Link to="/about" className={`hover:text-terracotta transition-colors ${location.pathname === '/about' ? 'text-terracotta' : ''}`}>
              About Us
            </Link>
            <Link to="/contact" className={`hover:text-terracotta transition-colors ${location.pathname === '/contact' ? 'text-terracotta' : ''}`}>
              Contact Support
            </Link>
          </nav>

          {/* Actions Pane */}
          <div className="flex items-center gap-3">
            {/* Cart Badge */}
            <Link to="/cart" className="relative group p-2 rounded-xl bg-walnut/5 hover:bg-walnut/10 border border-sand/20 text-walnut transition-all flex items-center gap-1.5">
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {itemCount}
                </span>
              )}
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Cart</span>
            </Link>

            {/* Auth States */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-sand/30 pl-3">
                <NotificationBell />
                <Link to="/profile" className="hidden md:inline text-xs font-bold text-walnut/80 hover:text-terracotta transition-colors">
                  Hello, {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-colors text-[10px] font-bold uppercase tracking-wider gap-1"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-sand/30 pl-3">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-walnut/70 hover:bg-sand/15 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-xl bg-walnut text-white text-[10px] font-bold uppercase tracking-wider hover:bg-walnut/90 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Layout Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Element */}
      <footer className="bg-walnut text-ivory border-t border-sand/35 py-12 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-3 text-xs font-semibold text-ivory/60 leading-relaxed">
          <div className="space-y-4">
            <Link to="/shop" className="flex items-center gap-2 hover:opacity-90 transition-opacity text-ivory">
              <div className="h-8 w-8 bg-ivory text-walnut rounded-lg flex items-center justify-center border border-white/10">
                <Store size={15} />
              </div>
              <span className="text-sm font-serif font-extrabold tracking-tight text-white uppercase">LeatherCraft</span>
            </Link>
            <p className="max-w-xs text-[11px]">
              Beautiful wallets, bags & jackets with custom prints. Created by verified partner sellers and delivered safely across India.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2 font-semibold">
              <Link to="/shop" className="hover:text-white transition-colors">Products Catalog</Link>
              <Link to="/about" className="hover:text-white transition-colors">About LeatherCraft</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Customer Support</Link>
              <a href="http://localhost:5173" className="hover:text-terracotta transition-colors text-white/70">Seller Portal</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">Stripe Escrow Security</h4>
            <p className="text-[11px] leading-relaxed">
              We process all card transactions safely using Stripe. Your money is secured until the product is successfully delivered to your address.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 text-center text-[10px] text-ivory/40 font-semibold">
          © {new Date().getFullYear()} LeatherCraft India. All rights reserved. Secure payment via Stripe.
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Distraction-free Landing Portal Gateway */}
      <Route path="/" element={<LandingPage />} />

      {/* Main E-commerce Layout Shell */}
      <Route element={<AppShell />}>
        <Route path="/shop" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notification" element={<Notifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
