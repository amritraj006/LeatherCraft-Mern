import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Sparkles, Shield, RefreshCw } from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useCart } from '../store/useCart'
import { useToast } from '../store/useToast'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  
  const addItem = useCart(state => state.addItem)
  const addToast = useToast(state => state.addToast)

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await api.get(`/public/products/${id}`)
        setProduct(response.data.product)
      } catch (err) {
        setError(getApiError(err))
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-walnut/60">
        Loading product details...
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 text-center rounded-2xl border border-sand bg-white shadow-sm space-y-4">
        <p className="text-sm font-bold text-rose-700">{error || 'Product not found.'}</p>
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut hover:underline">
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500 mt-6 px-4">
      {/* Breadcrumbs */}
      <div>
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut/60 hover:text-walnut transition-colors">
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left pane: Product Image */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white rounded-3xl border border-sand p-6 shadow-sm overflow-hidden min-h-[400px]">
          <div className="relative aspect-square w-full max-w-[480px] bg-ivory/60 rounded-2xl p-6 flex items-center justify-center border border-sand/20">
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-walnut/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-ivory border border-white/10">
              {product.design?.product?.category || 'Leather'}
            </span>
            <img 
              src={product.design?.ai_image} 
              alt={product.title} 
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Right pane: Checkout specifications */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">Custom Printed Design</p>
              <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-walnut mt-1 leading-tight">{product.title}</h1>
              <p className="text-[10px] font-semibold text-walnut/50 mt-1">
                Sold by: <span className="font-bold text-walnut">{product.user?.name || 'Local Seller Partner'}</span>
              </p>
            </div>

            <div className="flex items-baseline gap-4 py-3 border-y border-sand/20">
              <span className="text-3xl font-black text-terracotta">₹{product.price}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {product.quantity} In Stock
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-walnut uppercase tracking-wider">Product Information</h3>
              <p className="text-xs text-walnut/70 leading-relaxed font-semibold">
                {product.description || 'A high-quality leather item printed with a custom layout, perfect for everyday use.'}
              </p>
            </div>

            {/* AI Generator prompt specification */}
            {product.design?.prompt && (
              <div className="rounded-xl border border-sand/40 bg-ivory/50 p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-walnut uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={11} className="text-terracotta" />
                  Design Description
                </h4>
                <p className="text-xs font-semibold text-walnut/60 leading-relaxed italic">
                  "{product.design.prompt}"
                </p>
              </div>
            )}

            {/* Quantity select & Add */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-bold text-walnut uppercase tracking-wider">Quantity</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="rounded-xl border border-sand bg-ivory text-walnut text-xs font-bold px-3 py-2 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20"
                >
                  {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} unit{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  addItem(product, qty)
                  addToast(`"${qty} unit(s) of ${product.title}" added to your cart!`, 'success')
                  navigate('/shop')
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm"
              >
                <ShoppingCart size={15} />
                Add to Shopping Cart
              </button>
            </div>
          </div>

          {/* Secure Purchase Info Panel */}
          <div className="rounded-2xl border border-sand bg-white/70 p-5 shadow-sm space-y-3.5 text-xs font-semibold text-walnut/60">
            <div className="flex gap-3">
              <Shield size={16} className="text-terracotta flex-shrink-0" />
              <div>
                <h5 className="font-bold text-walnut text-[11px] mb-0.5">Secure Transaction Guarantee</h5>
                <p className="text-[10px] leading-relaxed">Your money is processed securely through Stripe and is held safe until delivery is confirmed.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <RefreshCw size={16} className="text-olive flex-shrink-0" />
              <div>
                <h5 className="font-bold text-walnut text-[11px] mb-0.5">7-Day Easy Replacements</h5>
                <p className="text-[10px] leading-relaxed">If there is any structural print issue or damage, we offer a free replacement with no questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
