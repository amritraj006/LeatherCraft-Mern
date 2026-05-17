import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Trash2, CreditCard, Minus, Plus } from 'lucide-react'
import { useCart } from '../store/useCart'

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCart()
  const totalAmount = getTotal()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-12 text-center rounded-3xl border border-sand bg-white shadow-sm space-y-6">
        <div className="h-16 w-16 bg-sand/20 rounded-full flex items-center justify-center text-walnut/60 mx-auto">
          <ShoppingBag size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-walnut">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-walnut/50 font-semibold max-w-sm mx-auto leading-relaxed">
            Browse our catalog of custom generative AI designs overlayed onto top-grain premium leathers to get started!
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-walnut px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-walnut/90 transition-colors shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500 mt-6 px-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-walnut">Shopping Cart</h1>
        <p className="text-xs text-walnut/50 mt-1 font-semibold">Review your selected bespoke leather items before checkout.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="group flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-sand bg-white p-4 shadow-sm"
            >
              {/* Product Thumbnail */}
              <div className="h-20 w-20 bg-ivory rounded-xl border border-sand/30 flex items-center justify-center p-2 flex-shrink-0">
                <img
                  src={item.product.design?.ai_image}
                  alt={item.product.title}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Title & Creator */}
              <div className="flex-1 min-w-0 text-center sm:text-left text-xs">
                <Link to={`/product/${item.product.id}`} className="font-bold text-walnut text-sm block hover:text-terracotta transition-colors truncate">
                  {item.product.title}
                </Link>
                <p className="text-[10px] font-semibold text-walnut/40 mt-0.5 truncate">
                  by {item.product.user?.name || 'Artisan Partner'}
                </p>
                <span className="inline-block mt-2 rounded bg-sand/15 border border-sand/30 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 text-walnut/60">
                  {item.product.design?.product?.category || 'Leather'}
                </span>
              </div>

              {/* Pricing, Quantity adjust and Remove */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-sand/20">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-sand rounded-xl bg-ivory overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 text-walnut hover:bg-sand/25 disabled:opacity-40 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 text-xs font-bold text-walnut select-none">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.quantity}
                    className="p-2 text-walnut hover:bg-sand/25 disabled:opacity-40 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-center sm:text-right min-w-[70px]">
                  <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5 font-bold">Subtotal</span>
                  <span className="text-sm font-bold text-terracotta">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Trash */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center border border-rose-100 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut/60 hover:text-walnut transition-colors">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart()
                }
              }}
              className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-150 transition-all"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right Side: Totals Summary & Secure Stripe CTA */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3">Order Summary</h3>

            <div className="space-y-3.5 text-xs font-semibold text-walnut/60">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="text-walnut font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-emerald-700 font-bold uppercase tracking-widest text-[9px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Duties</span>
                <span className="text-walnut font-bold">₹0.00</span>
              </div>

              <div className="flex justify-between border-t border-sand/30 pt-4 text-sm font-bold text-walnut">
                <span>Total Amount</span>
                <span className="text-base font-black text-terracotta">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm"
              >
                <CreditCard size={15} />
                Secure Checkout
              </Link>
            </div>

            <div className="text-center">
              <p className="text-[10px] leading-relaxed text-walnut/40 font-semibold">
                By clicking proceed, your cart specifications will be securely converted into a Stripe payment session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
