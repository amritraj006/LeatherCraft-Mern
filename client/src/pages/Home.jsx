import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingCart, Sparkles, Filter, ShieldCheck, Heart } from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useCart } from '../store/useCart'
import { useToast } from '../store/useToast'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const addItem = useCart(state => state.addItem)
  const addToast = useToast(state => state.addToast)

  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('leathercraft_favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('leathercraft_favorites', JSON.stringify(likedIds))
  }, [likedIds])

  const toggleLike = (productId) => {
    if (likedIds.includes(productId)) {
      setLikedIds(likedIds.filter(id => id !== productId))
    } else {
      setLikedIds([...likedIds, productId])
    }
  }

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const response = await api.get('/public/products')
        setProducts(response.data.products || [])
      } catch (err) {
        setError(getApiError(err))
      } finally {
        setLoading(false)
      }
    }
    fetchCatalog()
  }, [])

  const categories = ['All', ...new Set(products.map(p => p.design?.product?.category || 'Leather'))]

  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => (p.design?.product?.category || 'Leather') === filterCategory)

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-500">
      {/* Premium Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-sand bg-white p-8 md:p-16 shadow-sm flex flex-col items-center text-center max-w-6xl mx-auto mt-6">
        <div className="absolute top-0 right-0 h-40 w-40 bg-terracotta/5 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-olive/5 rounded-full filter blur-2xl"></div>

        <div className="relative max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta border border-terracotta/20">
            <Sparkles size={12} />
            Modern Printed Designs
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-walnut leading-[1.15]">
            Beautiful Printed Leather Goods <br/>
            <span className="bg-gradient-to-r from-terracotta to-walnut bg-clip-text text-transparent">Custom Designed for You</span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed text-walnut/60 font-semibold max-w-xl mx-auto">
            Explore premium leather wallets, bags, and jackets printed with beautiful, unique designs created by top sellers.
          </p>

          <div className="pt-2">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-xl bg-walnut px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-walnut/90 shadow-sm"
            >
              Start Shopping
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Grid of Store Commitments */}
      <section className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-3 px-4">
        <div className="rounded-2xl border border-sand bg-white/70 p-6 flex flex-col gap-3 shadow-sm">
          <div className="h-10 w-10 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta border border-terracotta/20">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-walnut text-sm">Verified Local Sellers</h3>
          <p className="text-xs text-walnut/60 font-semibold leading-relaxed">All products are prepared and shipped directly by trusted sellers.</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white/70 p-6 flex flex-col gap-3 shadow-sm">
          <div className="h-10 w-10 bg-olive/10 rounded-xl flex items-center justify-center text-olive border border-olive/20">
            <Sparkles size={20} />
          </div>
          <h3 className="font-bold text-walnut text-sm">High Quality Prints</h3>
          <p className="text-xs text-walnut/60 font-semibold leading-relaxed">Unique designs printed onto high-quality leather using the best technology.</p>
        </div>
        <div className="rounded-2xl border border-sand bg-white/70 p-6 flex flex-col gap-3 shadow-sm">
          <div className="h-10 w-10 bg-sand/30 rounded-xl flex items-center justify-center text-walnut border border-sand/40">
            <ShoppingCart size={20} />
          </div>
          <h3 className="font-bold text-walnut text-sm">Safe & Secure Payment</h3>
          <p className="text-xs text-walnut/60 font-semibold leading-relaxed">Pay safely with Stripe using any credit card or local test options.</p>
        </div>
      </section>

      {/* Filterable Catalog Section */}
      <section id="products" className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand/30 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-walnut">Explore Our Products</h2>
            <p className="text-xs text-walnut/50 mt-1 font-semibold">Browse beautiful leather items printed with custom patterns.</p>
          </div>

          {/* Filtering tabs */}
          {products.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase font-bold text-walnut/40 tracking-wider flex items-center gap-1 mr-1">
                <Filter size={10} /> Filter Category:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition border ${
                    filterCategory === cat
                      ? 'bg-walnut text-white border-walnut'
                      : 'bg-white text-walnut/70 border-sand hover:bg-sand/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="rounded-2xl border border-sand bg-white p-4 space-y-4 animate-pulse">
                <div className="aspect-square bg-sand/10 rounded-xl"></div>
                <div className="h-4 bg-sand/20 rounded w-2/3"></div>
                <div className="h-6 bg-sand/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative rounded-2xl border border-sand bg-white p-3 overflow-hidden shadow-sm hover:border-terracotta transition-all duration-300 flex flex-col justify-between"
                >
                  <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1 rounded-full bg-walnut/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-ivory border border-white/10">
                    {product.design?.product?.category || 'Leather'}
                  </span>

                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-5 right-5 z-10 h-7 w-7 rounded-full bg-white/95 backdrop-blur-md border border-sand/40 flex items-center justify-center transition-all shadow-sm"
                  >
                    <Heart
                      size={14}
                      className={likedIds.includes(product.id) ? 'text-rose-500 fill-rose-500' : 'text-walnut/40 hover:text-rose-500'}
                    />
                  </button>

                  <Link to={`/product/${product.id}`} className="aspect-square bg-ivory/50 rounded-xl flex items-center justify-center overflow-hidden p-4 border border-sand/10">
                    <img
                      src={product.design?.ai_image}
                      alt={product.title}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="mt-3 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`} className="font-bold text-walnut text-sm block hover:text-terracotta transition-colors truncate">
                        {product.title}
                      </Link>
                      <p className="text-[10px] font-semibold text-walnut/40 mt-0.5 truncate">
                        Seller: {product.user?.name || 'Local Seller Partner'}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-sand/20 flex items-end justify-between">
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5">Price</span>
                        <span className="text-sm font-extrabold text-terracotta">₹{product.price}</span>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="block text-[8px] uppercase tracking-widest text-walnut/40 leading-none">
                          {product.quantity} in stock
                        </span>
                        
                        <button
                          onClick={() => {
                            addItem(product, 1)
                            addToast(`"${product.title}" added to your cart!`, 'success')
                          }}
                          className="rounded-lg bg-walnut hover:bg-walnut/90 text-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                        >
                          <ShoppingCart size={11} />
                          Add Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-sand bg-white/50 max-w-xl mx-auto">
                <Sparkles size={36} className="text-sand/80 mb-3" />
                <p className="text-sm font-bold text-walnut">Store is empty right now.</p>
                <p className="text-xs text-walnut/50 mt-1 font-semibold leading-relaxed">Check back later or log in as a seller to list your own products!</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
