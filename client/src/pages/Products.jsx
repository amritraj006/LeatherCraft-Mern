import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft,
  ShoppingCart, 
  Sparkles, 
  Heart,
  Store,
  ArrowUpDown,
  Search,
  Briefcase,
  Wallet,
  Shirt,
  Tag
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useCart } from '../store/useCart'
import { useToast } from '../store/useToast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const addItem = useCart(state => state.addItem)
  const addToast = useToast(state => state.addToast)

  // Favoriting favorites state
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

  const toggleLike = (id) => {
    setLikedIds(current => 
      current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }

  // Fetch all product approvals
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await api.get('/public/products')
        setProducts(response.data.products || [])
      } catch (err) {
        setError(getApiError(err))
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Extract raw categories from DB products dynamically
  const rawCategories = Array.from(
    new Set(
      products.map((p) =>
        (p.design?.product?.category || 'Leather').toLowerCase().trim()
      )
    )
  );

  const activeCategories = [];
  
  // Always include 'All'
  activeCategories.push({
    id: 'All',
    name: 'All Collection',
    rawKeys: []
  });

  const predefinedMap = {
    'bag': { name: 'Luxury Bags' },
    'bags': { name: 'Luxury Bags' },
    'wallet': { name: 'Fine Wallets' },
    'wallets': { name: 'Fine Wallets' },
    'accessory': { name: 'Accessories' },
    'accessories': { name: 'Accessories' },
    'jacket': { name: 'Signature Jackets' },
    'jackets': { name: 'Signature Jackets' },
  };

  const addedKeys = new Set();

  rawCategories.forEach((rawCat) => {
    const matched = predefinedMap[rawCat];
    if (matched) {
      const key = matched.name;
      if (!addedKeys.has(key)) {
        activeCategories.push({
          id: key,
          name: key,
          rawKeys: [rawCat]
        });
        addedKeys.add(key);
      } else {
        const existing = activeCategories.find(c => c.name === key);
        if (existing) {
          existing.rawKeys.push(rawCat);
        }
      }
    } else {
      // Fallback for custom categories
      const capitalized = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
      if (!addedKeys.has(capitalized)) {
        activeCategories.push({
          id: capitalized,
          name: capitalized,
          rawKeys: [rawCat]
        });
        addedKeys.add(capitalized);
      } else {
        const existing = activeCategories.find(c => c.name === capitalized);
        if (existing) {
          existing.rawKeys.push(rawCat);
        }
      }
    }
  });

  // Filter products locally
  let processedProducts = products.filter(p => {
    // 1. Category Filter
    if (filterCategory !== 'All') {
      const activeCat = activeCategories.find(c => c.id === filterCategory);
      if (activeCat) {
        const pCat = (p.design?.product?.category || 'Leather').toLowerCase().trim();
        if (!activeCat.rawKeys.includes(pCat)) {
          return false;
        }
      }
    }

    // 2. Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const titleMatch = p.title?.toLowerCase().includes(query);
      const descMatch = p.description?.toLowerCase().includes(query);
      const sellerMatch = p.user?.name?.toLowerCase().includes(query);
      const categoryMatch = (p.design?.product?.category || 'Leather').toLowerCase().includes(query);
      return titleMatch || descMatch || sellerMatch || categoryMatch;
    }

    return true;
  });

  // Sort products locally
  processedProducts = [...processedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in duration-500 mt-6 px-4 font-sans">
      
      {/* Breadcrumbs / Header back button */}
      <div>
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold text-walnut/60 hover:text-walnut transition-colors uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Showcase
        </Link>
      </div>

      {/* Catalog Title Block */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-walnut/5 border border-sand/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-walnut">
          <Store size={12} /> Full Discovery Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-walnut leading-tight">
          Bespoke Leather Designs
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-walnut/50 font-semibold max-w-xl">
          Browse our entire catalog of top-grain luxury leathers co-created with beautiful, custom-printed designs from across India.
        </p>
      </div>

      {/* Categories Filter Pills Row */}
      <div className="flex flex-wrap gap-2 border-b border-sand/20 pb-6 pt-2">
        {activeCategories.map(cat => {
          const isActive = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                isActive 
                  ? 'bg-walnut border-walnut text-white shadow-sm'
                  : 'bg-white border-sand/40 text-walnut/70 hover:border-walnut hover:text-walnut'
              }`}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Search and Sort controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-sand/55 p-4 rounded-2xl shadow-sm">
        
        {/* Count Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase bg-terracotta/10 text-terracotta border border-terracotta/25 px-2.5 py-1 rounded-full">
            {processedProducts.length} {processedProducts.length === 1 ? 'Item' : 'Items'} Found
          </span>
          <span className="text-xs text-walnut/40 font-bold uppercase tracking-wider">
            matching filters
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-walnut/40" />
            <input
              type="text"
              placeholder="Search by title, description or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-sand bg-ivory/50 text-walnut placeholder-walnut/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center gap-1.5 bg-white border border-sand px-3 py-2 rounded-xl shadow-sm text-xs font-bold text-walnut">
            <ArrowUpDown size={13} className="text-walnut/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none pr-6 pl-1 outline-none text-walnut text-xs font-semibold cursor-pointer appearance-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* Products list grid (Centered layout) */}
      {loading ? (
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="w-full sm:w-[260px] rounded-2xl border border-sand bg-white p-4 space-y-4 animate-pulse">
              <div className="aspect-square bg-sand/10 rounded-xl"></div>
              <div className="h-4 bg-sand/20 rounded w-2/3"></div>
              <div className="h-6 bg-sand/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {processedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-sand bg-white p-3 overflow-hidden shadow-sm hover:border-terracotta transition-all duration-300 flex flex-col justify-between w-full sm:w-[260px]"
              >
                {/* Category tag */}
                <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1 rounded-full bg-walnut/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-ivory border border-white/10">
                  {product.design?.product?.category || 'Leather'}
                </span>

                {/* Favorite button */}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-5 right-5 z-10 h-7 w-7 rounded-full bg-white/95 backdrop-blur-md border border-sand/40 flex items-center justify-center transition-all shadow-sm"
                >
                  <Heart
                    size={14}
                    className={likedIds.includes(product.id) ? 'text-rose-500 fill-rose-500' : 'text-walnut/40 hover:text-rose-500'}
                  />
                </button>

                {/* Image */}
                <Link to={`/product/${product.id}`} className="aspect-square bg-ivory/50 rounded-xl flex items-center justify-center overflow-hidden p-4 border border-sand/10">
                  <img
                    src={product.design?.ai_image}
                    alt={product.title}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Details */}
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

          {processedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-sand bg-white/50 max-w-xl mx-auto w-full">
              <Sparkles size={36} className="text-sand/80 mb-3" />
              <p className="text-sm font-bold text-walnut">No products match your search.</p>
              <p className="text-xs text-walnut/50 mt-1 font-semibold leading-relaxed">Try adjusting your search keywords or select a different category pill above.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
