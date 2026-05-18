import { ArrowRight, Images, PackageCheck, Sparkles, Upload, Edit3, X, TrendingUp, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/useAuth'
import { useToast } from '../store/useToast'

const statCards = [
  { key: 'products', label: 'Base Materials', icon: PackageCheck, tone: 'from-sand/40 to-sand/10 text-walnut border-sand/40' },
  { key: 'designs', label: 'Saved Designs', icon: Images, tone: 'from-terracotta/20 to-terracotta/5 text-terracotta border-terracotta/20' },
  { key: 'listings', label: 'Catalog Listings', icon: Sparkles, tone: 'from-olive/20 to-olive/5 text-olive border-olive/20' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const addToast = useToast((state) => state.addToast)
  const [products, setProducts] = useState([])
  const [designs, setDesigns] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit details states
  const [editingListing, setEditingListing] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editQuantity, setEditQuantity] = useState(0)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [productsResponse, designsResponse, listingsResponse] = await Promise.all([
          api.get('/products'),
          api.get('/designs'),
          api.get('/marketplace/products'),
        ])

        if (active) {
          setProducts(productsResponse.data.products || [])
          setDesigns(designsResponse.data.designs || [])
          setListings(listingsResponse.data.listed_products || [])
        }
      } catch (apiError) {
        if (active) {
          setError(getApiError(apiError))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const stats = {
    products: products.length,
    designs: designs.length,
    listings: listings.length,
  }

  const approvedListings = listings.filter(l => l.status === 'approved')

  const handleStartEdit = (listing) => {
    setEditingListing(listing)
    setEditTitle(listing.title)
    setEditDescription(listing.description || '')
    setEditQuantity(listing.quantity)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/marketplace/products/${editingListing.id}`, {
        title: editTitle,
        description: editDescription,
        quantity: editQuantity
      })
      
      setListings(listings.map(l => l.id === editingListing.id ? {
        ...l,
        title: editTitle,
        description: editDescription,
        quantity: editQuantity
      } : l))
      
      setEditingListing(null)
      addToast('Product inventory details updated successfully!', 'success')
    } catch (err) {
      console.error(err)
      addToast('Failed to update product details. Please verify your inputs.', 'error')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Hero / Welcome Section */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-3xl bg-walnut p-8 md:p-10 shadow-lg shadow-walnut/10">
          <div className="absolute top-0 right-0 h-64 w-64 bg-terracotta/20 rounded-full filter blur-3xl -z-0"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory/10 border border-ivory/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ivory backdrop-blur-md">
              <Sparkles size={12} /> Seller Dashboard
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Welcome back, <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sand to-terracotta">{user?.name || 'Artisan'}</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80 font-semibold">
              Manage your raw leather materials, generate bespoke printed overlays, and monitor your active marketplace listings seamlessly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/studio"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-orange-600 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <Sparkles size={16} />
                Open Studio
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-xl border border-sand/30 bg-white/5 backdrop-blur-sm px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-ivory transition-all hover:bg-white/10"
              >
                <Upload size={16} />
                Upload Material
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.key} className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-sand/40 bg-white p-5 shadow-sm transition-all hover:border-terracotta/50 hover:shadow-md hover:-translate-y-0.5">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-10`}></div>
                <div className="relative z-10 flex items-center gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-sand/40 transition-transform group-hover:scale-110 ${card.tone.split(' ')[2]}`}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold text-walnut/50 uppercase tracking-widest">{card.label}</p>
                    <span className="text-2xl font-black text-walnut">{loading ? '-' : stats[card.key]}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {/* 2. Recent Activity Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Base Materials */}
        <div className="flex flex-col rounded-3xl border border-sand/60 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand/30">
            <div>
              <h2 className="text-lg font-serif font-bold text-walnut">Recent Base Materials</h2>
              <p className="text-[10px] font-semibold text-walnut/50 uppercase tracking-widest mt-1">Ready for design</p>
            </div>
            <Link to="/upload" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand/20 text-walnut hover:bg-terracotta hover:text-white transition-colors">
              <Upload size={14} />
            </Link>
          </div>

          <div className="flex-1 grid gap-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="group flex items-center gap-4 rounded-xl border border-transparent p-2 transition-all hover:bg-sand/10 hover:border-sand/40">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-sand/40 bg-ivory flex items-center justify-center p-2 shadow-sm">
                  <img src={product.image_url} alt={product.category} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <p className="font-bold text-sm capitalize text-walnut">{product.category}</p>
                  <p className="text-[11px] font-semibold text-walnut/50 mt-0.5">
                    Added {new Date(product.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
            {!loading && products.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                <PackageCheck size={32} className="text-sand/60 mb-3" />
                <p className="text-sm font-bold text-walnut">No templates yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Designs */}
        <div className="flex flex-col rounded-3xl border border-sand/60 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand/30">
            <div>
              <h2 className="text-lg font-serif font-bold text-walnut">Generated Designs</h2>
              <p className="text-[10px] font-semibold text-walnut/50 uppercase tracking-widest mt-1">From Studio</p>
            </div>
            <Link to="/designs" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand/20 text-walnut hover:bg-olive hover:text-white transition-colors">
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex-1 grid gap-3">
            {designs.slice(0, 4).map((design) => (
              <div key={design.id} className="group flex items-center gap-4 rounded-xl border border-transparent p-2 transition-all hover:bg-sand/10 hover:border-sand/40">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-sand/40 bg-ivory flex items-center justify-center p-1 shadow-sm">
                  <img src={design.ai_image} alt="Design" className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-sm text-walnut">{design.product?.category || 'Custom Print'}</p>
                  <p className="truncate text-[11px] font-semibold text-walnut/50 mt-0.5">{design.prompt || 'Manual canvas design'}</p>
                </div>
              </div>
            ))}
            {!loading && designs.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                <Images size={32} className="text-sand/60 mb-3" />
                <p className="text-sm font-bold text-walnut">No designs saved.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Live Marketplace Storefront */}
      {approvedListings.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div>
              <h2 className="text-2xl font-serif font-black text-walnut">Live Inventory</h2>
              <p className="text-xs text-walnut/60 mt-1 font-semibold">Active bespoke designs selling in the marketplace.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 border border-emerald-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              {approvedListings.length} Active Listings
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approvedListings.map((listing) => (
              <div key={listing.id} className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-sand/60 bg-white shadow-sm transition-all duration-300 hover:border-terracotta/50 hover:shadow-lg hover:-translate-y-1">
                
                <div className="relative aspect-square overflow-hidden bg-ivory/50 p-6 flex items-center justify-center border-b border-sand/30">
                  <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-walnut shadow-sm backdrop-blur-md">
                    {listing.design?.product?.category || 'Leather'}
                  </span>
                  <img src={listing.design?.ai_image} alt={listing.title} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-base font-bold text-walnut truncate">{listing.title}</h3>
                  
                  <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-2 text-[10px] font-semibold text-walnut/60 flex-1">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-1">List Price</span>
                      <span className="text-sm font-black text-terracotta">₹{listing.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-1">Remaining</span>
                      <span className="text-sm font-black text-walnut">{listing.quantity} left</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-1">Total Sold</span>
                      <span className="text-sm font-black text-olive">{listing.units_sold || 0} items</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-1">Earnings</span>
                      <span className="text-sm font-black text-terracotta">₹{listing.net_earnings ? listing.net_earnings.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEdit(listing)}
                    className="mt-6 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-sand/10 hover:bg-sand/20 py-3 text-[10px] font-bold uppercase tracking-widest text-walnut transition-colors border border-sand/50"
                  >
                    <Edit3 size={14} /> Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Complete Request History Table */}
      <section className="rounded-3xl border border-sand/60 bg-white shadow-sm overflow-hidden mt-8">
        <div className="border-b border-sand/30 bg-ivory/30 px-8 py-6">
          <h2 className="text-lg font-serif font-bold text-walnut">Listing Requests History</h2>
          <p className="text-[11px] font-semibold text-walnut/50 mt-1 uppercase tracking-widest">Track approvals and sales</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-sand/10 text-[10px] font-bold uppercase tracking-widest text-walnut/50 border-b border-sand/30">
              <tr>
                <th className="px-8 py-4">Item Details</th>
                <th className="px-6 py-4">Financials</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs text-walnut/80 font-semibold">
              {listings.map((listing) => (
                <tr key={listing.id} className="transition-colors hover:bg-sand/5">
                  <td className="px-8 py-4">
                    <p className="font-bold text-walnut text-sm">{listing.title}</p>
                    <p className="text-[10px] text-walnut/40 mt-0.5">{listing.design?.product?.category || 'Custom'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-walnut">Price: <span className="font-bold">₹{listing.price}</span></p>
                    <p className="text-[10px] text-terracotta mt-0.5">Net: ₹{listing.net_earnings ? listing.net_earnings.toFixed(2) : '0.00'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-walnut">{listing.quantity} remaining</p>
                    <p className="text-[10px] text-olive mt-0.5">{listing.units_sold || 0} sold</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                      listing.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      listing.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        listing.status === 'approved' ? 'bg-emerald-500' :
                        listing.status === 'rejected' ? 'bg-rose-500' :
                        'bg-amber-500 animate-pulse'
                      }`}></span>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right text-walnut/40">
                    {new Date(listing.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {!loading && listings.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center">
                    <Sparkles size={32} className="mx-auto text-sand/60 mb-4" />
                    <p className="text-sm font-bold text-walnut">No listings created yet.</p>
                    <Link to="/designs" className="mt-2 inline-block text-xs font-bold text-terracotta hover:text-orange-600 transition-colors uppercase tracking-widest">Create a listing →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-walnut/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-3xl border border-sand bg-white p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <button onClick={() => setEditingListing(null)} className="absolute top-6 right-6 h-8 w-8 rounded-full bg-sand/20 hover:bg-sand/40 text-walnut flex items-center justify-center transition-all">
              <X size={16} />
            </button>

            <div>
              <h3 className="text-xl font-serif font-black text-walnut">Edit Inventory</h3>
              <p className="text-xs font-semibold text-walnut/50 mt-1">Update quantities and description.</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-sand/40">
                <div className="h-16 w-16 rounded-xl bg-white p-2 border border-sand/30 shadow-sm flex-shrink-0">
                  <img src={editingListing.design?.ai_image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-walnut/50 font-bold mb-1">Preview</span>
                  <span className="text-sm font-bold text-walnut">{editingListing.design?.product?.category || 'Product'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows="3" className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut resize-none transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Price (₹)</label>
                  <input type="text" value={`₹${editingListing.price}`} disabled className="w-full rounded-xl border border-transparent bg-sand/10 px-4 py-3 text-sm font-bold text-walnut/50 cursor-not-allowed outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Stock</label>
                  <input type="number" value={editQuantity} onChange={(e) => setEditQuantity(Number(e.target.value))} min="0" required className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingListing(null)} className="w-1/3 rounded-xl border border-sand bg-ivory hover:bg-sand/20 py-3.5 text-xs font-bold uppercase tracking-widest text-walnut transition-all">
                  Cancel
                </button>
                <button type="submit" className="w-2/3 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
