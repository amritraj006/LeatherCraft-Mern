import { useEffect, useState } from 'react'
import api from '../api/client'
import { CheckCircle, XCircle, ShoppingBag, User, Search } from 'lucide-react'
import { useToast } from '../store/useToast'

export default function Products() {
  const addToast = useToast((state) => state.addToast)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const { data } = await api.get('/admin/pending-products')
      setProducts(data.products)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      await api.patch(`/admin/products/${id}/status`, { status })
      setProducts((prev) => prev.filter((p) => p.id !== id))
      addToast(`Product was successfully ${status === 'approved' ? 'approved and published' : 'rejected'}!`, 'success')
    } catch (err) {
      console.error(err)
      addToast('Failed to update product status. Please try again.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredProducts = products.filter((product) => {
    const titleMatch = (product.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    const sellerMatch = (product.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const searchMatch = titleMatch || sellerMatch

    const category = product.design?.product?.category || 'Leather'
    const categoryMatch = categoryFilter === 'all' || category.toLowerCase() === categoryFilter.toLowerCase()

    return searchMatch && categoryMatch
  })

  // Dynamically extract unique categories from current items list
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.design?.product?.category || 'Leather'))
  )

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-sand border-t-terracotta"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="p-8 rounded-3xl border border-sand/40 bg-white shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-widest">Quality Assurance queue</span>
          <h1 className="text-3xl font-serif font-black text-walnut tracking-tight">Pending Products Review</h1>
          <p className="text-xs text-walnut/50 font-semibold mt-1">Approve or reject newly custom-crafted leather designs submitted by registered sellers.</p>
        </div>
      </div>

      {/* Search & Filter controls */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-sand/50 bg-white shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/40" />
            <input
              type="text"
              placeholder="Search products or sellers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-sand bg-ivory/30 rounded-xl text-xs font-bold text-walnut focus:bg-white focus:border-terracotta outline-none transition-all"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-sand bg-ivory/30 rounded-xl text-xs font-bold uppercase tracking-wider text-walnut/70 focus:bg-white focus:border-terracotta outline-none transition-all cursor-pointer w-full sm:w-auto capitalize"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="premium-card rounded-3xl overflow-hidden flex flex-col relative group bg-white border border-sand/30">
            {/* Visual top design tag */}
            <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-walnut/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-ivory border border-white/10 shadow-sm">
              {product.design?.product?.category || 'Leather'}
            </span>

            {/* Design Image container */}
            <div className="aspect-square bg-ivory/40 p-5 border-b border-sand/20 flex items-center justify-center overflow-hidden">
              <img
                src={product.design?.ai_image}
                alt={product.title}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Product details */}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex-1 text-xs">
                <h3 className="text-base font-serif font-black text-walnut leading-snug group-hover:text-terracotta transition-colors">
                  {product.title}
                </h3>
                
                {/* Seller Detail Block */}
                <div className="mt-3 flex items-center gap-2 font-bold text-walnut/40 text-[11px]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sand/20 text-walnut">
                    <User size={10} />
                  </span>
                  <span>
                    By <strong className="text-walnut/70 font-bold">{product.user?.name}</strong>
                  </span>
                </div>

                <p className="mt-4 leading-relaxed text-walnut/60 font-semibold">
                  {product.description || 'Custom crafted and hand-stitched leather product featuring a modern premium design canvas composition.'}
                </p>
              </div>

              {/* Price & Action button footer */}
              <div className="mt-6 pt-4 border-t border-sand/20 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-walnut/40 uppercase tracking-widest block">Marketplace Price</span>
                  <span className="text-lg font-serif font-black text-walnut">₹{product.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-walnut/40 uppercase tracking-widest block">Stocks Available</span>
                  <span className="text-xs font-bold text-walnut/70">{product.quantity} units</span>
                </div>
              </div>
              
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleStatusChange(product.id, 'approved')}
                  disabled={updatingId === product.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-walnut hover:bg-walnut/90 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-md shadow-walnut/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle size={13} className="text-sand" /> Approve
                </button>
                <button
                  onClick={() => handleStatusChange(product.id, 'rejected')}
                  disabled={updatingId === product.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/30 text-rose-800 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                >
                  <XCircle size={13} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full rounded-3xl border border-sand/40 p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/15 text-terracotta">
              <ShoppingBag size={20} />
            </div>
            <h3 className="text-sm font-bold text-walnut uppercase tracking-wider">No matching products found</h3>
            <p className="text-xs font-semibold text-walnut/40 max-w-sm">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}
