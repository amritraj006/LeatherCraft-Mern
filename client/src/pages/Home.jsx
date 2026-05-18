import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, ShoppingCart, Sparkles, ShieldCheck, Heart, Store, Briefcase, Wallet, Shirt, Tag, ArrowUpDown, Search, Star, Mail, Truck, Paintbrush, Award
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

  const rawCategories = Array.from(
    new Set(
      products.map((p) =>
        (p.design?.product?.category || 'Leather').toLowerCase().trim()
      )
    )
  );

  const activeCategories = [];
  
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

  const getCategoryItemCount = (cat) => {
    if (cat.id === 'All') return products.length;
    return products.filter((p) => {
      const pCat = (p.design?.product?.category || 'Leather').toLowerCase().trim();
      return cat.rawKeys.includes(pCat);
    }).length;
  };

  let processedProducts = products.filter((p) => {
    if (filterCategory !== 'All') {
      const activeCat = activeCategories.find(c => c.id === filterCategory);
      if (activeCat) {
        const pCat = (p.design?.product?.category || 'Leather').toLowerCase().trim();
        if (!activeCat.rawKeys.includes(pCat)) {
          return false;
        }
      }
    }

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

  processedProducts = [...processedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
  });

  const displayedProducts = processedProducts.slice(0, 8);
  const trendingProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

  const ProductCard = ({ product }) => (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sand/40 bg-white shadow-sm transition-all duration-300 hover:border-terracotta/50 hover:shadow-lg hover:-translate-y-1">
      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full border border-white/20 bg-walnut/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ivory backdrop-blur-md">
        {product.design?.product?.category || 'Leather'}
      </span>

      <button
        onClick={() => toggleLike(product.id)}
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-sand/30 bg-white/90 shadow-sm backdrop-blur-md transition-all hover:scale-110"
      >
        <Heart size={14} className={likedIds.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-walnut/40 hover:text-rose-500'} />
      </button>

      <Link to={`/product/${product.id}`} className="relative flex aspect-square items-center justify-center overflow-hidden bg-ivory/30 p-6">
        <img
          src={product.design?.ai_image}
          alt={product.title}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-amber-400">
              <Star size={10} className="fill-current" />
              <Star size={10} className="fill-current" />
              <Star size={10} className="fill-current" />
              <Star size={10} className="fill-current" />
              <Star size={10} className="fill-current" />
            </div>
            <span className="text-[10px] text-walnut/40 font-bold">(4.9)</span>
          </div>
          <Link to={`/product/${product.id}`} className="block truncate font-serif text-base font-bold text-walnut transition-colors hover:text-terracotta">
            {product.title}
          </Link>
          <p className="mt-1 truncate text-[11px] font-semibold text-walnut/50">
            By <span className="text-walnut/80">{product.user?.name || 'Local Artisan'}</span>
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-sand/30 pt-4">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-walnut/40">Price</span>
            <span className="text-lg font-extrabold text-terracotta">₹{product.price}</span>
          </div>
          <button
            onClick={() => {
              addItem(product, 1)
              addToast(`"${product.title}" added to cart!`, 'success')
            }}
            className="flex items-center gap-1.5 rounded-xl bg-walnut px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-walnut/90 hover:shadow-md"
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 pb-0">
      {/* 1. Dynamic Hero Section */}
      <section className="relative overflow-hidden bg-walnut pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-terracotta via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay"></div>
        
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-terracotta mb-6">
            <Sparkles size={14} /> New Collection 2026
          </span>
          <h1 className="max-w-4xl font-serif text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.1]">
            Elevate Your Style with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sand to-terracotta">Artisan Crafted Leather</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg font-medium text-ivory/80 leading-relaxed">
            Discover bespoke wallets, premium bags, and signature jackets. Hand-selected materials meets custom printed artistry, delivered securely to your door.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#products" className="rounded-2xl bg-terracotta px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-terracotta/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600">
              Shop Collection
            </a>
            <a href="#how-it-works" className="rounded-2xl border border-sand/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-bold uppercase tracking-widest text-ivory transition-all hover:bg-white/10 hover:border-sand/50">
              Our Process
            </a>
          </div>
        </div>
      </section>

      {/* 2. Store Trust / Features */}
      <section className="relative -mt-12 z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, title: "Premium Quality", desc: "100% genuine top-grain leather." },
            { icon: Paintbrush, title: "Custom Prints", desc: "Unique designs by verified artists." },
            { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted payments via Stripe." },
            { icon: Truck, title: "Fast Delivery", desc: "Insured shipping nationwide." }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg shadow-walnut/5 border border-sand/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ivory text-terracotta border border-sand/40">
                <feature.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-walnut">{feature.title}</h3>
                <p className="text-[11px] font-semibold text-walnut/60 leading-tight mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Trending / Featured Arrivals */}
      {trendingProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
          <div className="flex items-end justify-between mb-8 border-b border-sand/30 pb-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-terracotta">Trending Now</h2>
              <h3 className="mt-1 font-serif text-3xl font-black text-walnut">Featured Arrivals</h3>
            </div>
            <a href="#products" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-walnut/60 hover:text-terracotta transition-colors">
              View All <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* 4. Category Grid */}
      {products.length > 0 && (
        <section className="bg-ivory/50 mt-24 py-20 border-y border-sand/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-xs font-black uppercase tracking-widest text-terracotta">Curated Categories</h2>
              <h3 className="mt-2 font-serif text-3xl font-black text-walnut">Shop by Department</h3>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-terracotta/20"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 min-h-[150px] ${
                      isActive
                        ? 'border-walnut bg-walnut text-white shadow-md'
                        : `border-sand/40 bg-white text-walnut ${cat.borderColor} hover:-translate-y-1 hover:shadow-lg shadow-sm`
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-50`}></div>
                    
                    <div className="relative z-10 flex w-full items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                        isActive ? 'border-white/20 bg-white/10 text-white' : 'border-walnut/10 bg-walnut/5 text-walnut'
                      } transition-colors`}>
                        {getIcon(cat.icon, 18)}
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        isActive ? 'border-white/30 bg-white/20 text-white' : 'border-sand/40 bg-sand/30 text-walnut/60'
                      }`}>
                        {count}
                      </span>
                    </div>

                    <div className="relative z-10 mt-6">
                      <h3 className="text-sm font-bold tracking-tight">{cat.name}</h3>
                      <p className={`mt-1 text-[10px] font-semibold line-clamp-1 ${isActive ? 'text-white/60' : 'text-walnut/50'}`}>
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black uppercase tracking-widest text-terracotta">The Process</h2>
          <h3 className="mt-2 font-serif text-3xl md:text-4xl font-black text-walnut">How LeatherCraft Works</h3>
        </div>
        
        <div className="grid gap-12 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-sand/40 -translate-y-1/2 border-dashed border-b border-sand/40"></div>
          {[
            { step: '01', title: 'Curated Materials', desc: 'Our artisans source the finest top-grain leather for unmatched durability.' },
            { step: '02', title: 'Custom Printed Design', desc: 'Sellers use our advanced Design Studio to overlay unique, high-resolution artwork.' },
            { step: '03', title: 'Delivered to You', desc: 'Your bespoke leather product is crafted, securely packaged, and shipped.' }
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center bg-ivory px-6 py-4 rounded-3xl border border-transparent hover:border-sand/40 transition-colors">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-walnut text-xl font-black text-ivory shadow-xl shadow-walnut/10 border-4 border-ivory ring-1 ring-sand/30 mb-6">
                {s.step}
              </div>
              <h4 className="text-lg font-bold text-walnut mb-2">{s.title}</h4>
              <p className="text-xs font-semibold text-walnut/60 leading-relaxed max-w-[250px]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Full Catalog */}
      <section id="products" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 border border-sand/40 shadow-sm md:flex-row md:items-center md:px-6">
          <div>
            <h2 className="text-xl font-bold text-walnut">
              {filterCategory === 'All' ? 'Complete Collection' : filterCategory}
            </h2>
            <p className="text-[11px] font-semibold text-walnut/50 mt-0.5">
              Showing {processedProducts.length} items
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-walnut/40" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-sand bg-ivory/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-walnut placeholder:text-walnut/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
            </div>
            <div className="relative flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3 py-2.5">
              <ArrowUpDown size={14} className="text-walnut/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer appearance-none bg-transparent pl-1 pr-4 text-xs font-bold text-walnut outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700">
            <div className="h-2 w-2 rounded-full bg-rose-500"></div>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className="h-80 animate-pulse rounded-2xl border border-sand bg-white/50 p-4">
                <div className="h-48 rounded-xl bg-sand/20 mb-4"></div>
                <div className="h-4 w-3/4 rounded bg-sand/20 mb-2"></div>
                <div className="h-3 w-1/2 rounded bg-sand/10"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            
            {processedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sand/60 bg-white py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand/20 text-walnut/40 mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-base font-bold text-walnut">No matches found</h3>
                <p className="mt-1 text-xs font-semibold text-walnut/50">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {setFilterCategory('All'); setSearchQuery('');}}
                  className="mt-6 rounded-xl border border-sand bg-white px-6 py-2 text-xs font-bold uppercase tracking-wider text-walnut transition-all hover:bg-sand/10"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {processedProducts.length > 8 && (
              <div className="mt-12 text-center">
                <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-walnut px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-walnut/90 shadow-md">
                  View Full Catalog <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* 7. Newsletter Section */}
      <section className="bg-walnut text-ivory py-20 border-t border-sand/20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Mail size={32} className="mx-auto text-terracotta mb-6 opacity-80" />
          <h2 className="font-serif text-3xl md:text-4xl font-black">Join the LeatherCraft Club</h2>
          <p className="mt-4 text-sm font-medium text-ivory/70 max-w-lg mx-auto leading-relaxed">
            Subscribe to receive updates on new artisan collections, exclusive drops, and insider discounts. Unsubscribe anytime.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); addToast('Thanks for subscribing!', 'success'); }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white placeholder:text-white/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta/30"
            />
            <button type="submit" className="rounded-xl bg-terracotta px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-orange-600 shadow-sm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
