import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  ShoppingCart, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Heart,
  Store,
  Briefcase,
  Wallet,
  Shirt,
  Tag,
  ArrowUpDown,
  Search,
  Grid
} from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useCart } from '../store/useCart'
import { useToast } from '../store/useToast'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
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

  // Helper for predefined categories
  const getIcon = (name, size = 18, className = "") => {
    switch (name) {
      case 'Store': return <Store size={size} className={className} />;
      case 'Briefcase': return <Briefcase size={size} className={className} />;
      case 'Wallet': return <Wallet size={size} className={className} />;
      case 'Shirt': return <Shirt size={size} className={className} />;
      case 'Sparkles': return <Sparkles size={size} className={className} />;
      default: return <Tag size={size} className={className} />;
    }
  };

  // Extract raw categories from DB products
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
    name: 'All Curated',
    desc: 'Browse our complete catalog of leather crafts',
    icon: 'Store',
    gradient: 'from-amber-600/10 via-amber-700/5 to-transparent',
    borderColor: 'hover:border-amber-500/30',
    rawKeys: []
  });

  const predefinedMap = {
    'bag': { name: 'Luxury Bags', desc: 'Premium custom printed bags', icon: 'Briefcase', gradient: 'from-blue-600/10 via-blue-700/5 to-transparent', borderColor: 'hover:border-blue-500/30' },
    'bags': { name: 'Luxury Bags', desc: 'Premium custom printed bags', icon: 'Briefcase', gradient: 'from-blue-600/10 via-blue-700/5 to-transparent', borderColor: 'hover:border-blue-500/30' },
    'wallet': { name: 'Fine Wallets', desc: 'Minimalist cardholders & bi-folds', icon: 'Wallet', gradient: 'from-emerald-600/10 via-emerald-700/5 to-transparent', borderColor: 'hover:border-emerald-500/30' },
    'wallets': { name: 'Fine Wallets', desc: 'Minimalist cardholders & bi-folds', icon: 'Wallet', gradient: 'from-emerald-600/10 via-emerald-700/5 to-transparent', borderColor: 'hover:border-emerald-500/30' },
    'accessory': { name: 'Accessories', desc: 'Premium custom leather details', icon: 'Sparkles', gradient: 'from-purple-600/10 via-purple-700/5 to-transparent', borderColor: 'hover:border-purple-500/30' },
    'accessories': { name: 'Accessories', desc: 'Premium custom leather details', icon: 'Sparkles', gradient: 'from-purple-600/10 via-purple-700/5 to-transparent', borderColor: 'hover:border-purple-500/30' },
    'jacket': { name: 'Signature Jackets', desc: 'Curated premium leather jackets', icon: 'Shirt', gradient: 'from-rose-600/10 via-rose-700/5 to-transparent', borderColor: 'hover:border-rose-500/30' },
    'jackets': { name: 'Signature Jackets', desc: 'Curated premium leather jackets', icon: 'Shirt', gradient: 'from-rose-600/10 via-rose-700/5 to-transparent', borderColor: 'hover:border-rose-500/30' },
  };

  const addedKeys = new Set();

  rawCategories.forEach((rawCat) => {
    const matched = predefinedMap[rawCat];
    if (matched) {
      const key = matched.name;
      if (!addedKeys.has(key)) {
        activeCategories.push({
          id: key,
          name: matched.name,
          desc: matched.desc,
          icon: matched.icon,
          gradient: matched.gradient,
          borderColor: matched.borderColor,
          rawKeys: [rawCat, rawCat === 'bag' ? 'bags' : rawCat === 'wallet' ? 'wallets' : rawCat === 'accessory' ? 'accessories' : rawCat === 'jacket' ? 'jackets' : '']
        });
        addedKeys.add(key);
      }
    } else {
      // Dynamic category from DB not in predefined list
      const capitalized = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
      if (!addedKeys.has(capitalized)) {
        activeCategories.push({
          id: capitalized,
          name: capitalized,
          desc: `Custom printed leather ${rawCat}`,
          icon: 'Tag',
          gradient: 'from-slate-600/10 via-slate-700/5 to-transparent',
          borderColor: 'hover:border-slate-500/30',
          rawKeys: [rawCat]
        });
        addedKeys.add(capitalized);
      }
    }
  });

  // Calculate items count helper
  const getCategoryItemCount = (cat) => {
    if (cat.id === 'All') return products.length;
    return products.filter((p) => {
      const pCat = (p.design?.product?.category || 'Leather').toLowerCase().trim();
      return cat.rawKeys.includes(pCat);
    }).length;
  };

  // Filter products by category & search query
  let processedProducts = products.filter((p) => {
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

  // Sort products
  processedProducts = [...processedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    // Default or 'newest'
    return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
  });

  // Calculate displayed products (max 5 on shop page curated display)
  const displayedProducts = processedProducts.slice(0, 5);

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

      {/* Interactive Category Grid Section */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-terracotta">Browse Collections</h2>
            <p className="text-2xl md:text-3xl font-serif font-black text-walnut">Select Leather Craft Category</p>
            <div className="h-1 w-12 bg-terracotta mx-auto rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
            {activeCategories.map((cat) => {
              const count = getCategoryItemCount(cat);
              const isActive = filterCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFilterCategory(cat.id);
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-sm ${
                    isActive
                      ? 'bg-walnut text-white border-walnut ring-2 ring-walnut/20'
                      : `bg-white text-walnut border-sand/40 ${cat.borderColor} hover:shadow-md hover:-translate-y-1`
                  }`}
                >
                  {/* Subtle Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-70`}></div>

                  {/* Icon & Count Row */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className={`p-2.5 rounded-xl border ${
                      isActive 
                        ? 'bg-white/10 border-white/20 text-white' 
                        : 'bg-walnut/5 border-walnut/10 text-walnut'
                    } transition-colors`}>
                      {getIcon(cat.icon, 20)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? 'bg-white/20 border-white/30 text-white' 
                        : 'bg-sand/30 border-sand/40 text-walnut/70'
                    }`}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Name and Description */}
                  <div className="relative z-10 mt-6 space-y-1">
                    <h3 className="font-bold text-sm tracking-tight">{cat.name}</h3>
                    <p className={`text-[10px] line-clamp-1 ${
                      isActive ? 'text-white/60' : 'text-walnut/50'
                    }`}>
                      {cat.desc}
                    </p>
                  </div>
                  
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-terracotta"></div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Filterable Catalog Section */}
      <section id="products" className="max-w-6xl mx-auto space-y-8 px-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-sand/30 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-walnut">
                {filterCategory === 'All' ? 'Curated Catalog' : filterCategory}
              </h2>
              <span className="text-[10px] font-extrabold uppercase bg-terracotta/10 text-terracotta border border-terracotta/25 px-2 py-0.5 rounded-full">
                {processedProducts.length} {processedProducts.length === 1 ? 'Item' : 'Items'} Found
              </span>
            </div>
            <p className="text-xs text-walnut/50 font-semibold">
              {filterCategory === 'All' 
                ? 'Showing all custom printed premium leather goods' 
                : `Showing handcrafted ${filterCategory.toLowerCase()} designs from verified sellers`}
            </p>
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-walnut/40" />
              <input
                type="text"
                placeholder="Search products, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-sand bg-white text-walnut placeholder-walnut/30 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 transition-all shadow-sm"
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
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative rounded-2xl border border-sand bg-white p-3 overflow-hidden shadow-sm hover:border-terracotta transition-all duration-300 flex flex-col justify-between w-full sm:w-[260px]"
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

            {processedProducts.length > 0 && (
              <div className="flex justify-center pt-8">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-xl border border-walnut bg-white text-walnut hover:bg-walnut hover:text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm"
                >
                  View All Product Designs
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {processedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-sand bg-white/50 max-w-xl mx-auto w-full">
                <Sparkles size={36} className="text-sand/80 mb-3" />
                <p className="text-sm font-bold text-walnut">No products match your filters.</p>
                <p className="text-xs text-walnut/50 mt-1 font-semibold leading-relaxed">Try adjusting your search keywords or clear filters to view more items.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
