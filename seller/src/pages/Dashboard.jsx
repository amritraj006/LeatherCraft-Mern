import { ArrowRight, Images, PackageCheck, Sparkles, Upload, Edit3, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getApiError } from '../api/client'
import { useAuth } from '../context/useAuth'
import { useToast } from '../store/useToast'

const statCards = [
  { key: 'products', label: 'Base Materials', icon: PackageCheck, tone: 'bg-sand/20 text-walnut border border-sand/40' },
  { key: 'designs', label: 'Saved Designs', icon: Images, tone: 'bg-terracotta/10 text-terracotta border border-terracotta/20' },
  { key: 'listings', label: 'Catalog Listings', icon: Sparkles, tone: 'bg-olive/10 text-olive border border-olive/20' },
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
      
      // Update local state lists
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Welcome Pane */}
        <div className="relative overflow-hidden rounded-2xl border border-sand bg-white p-8 shadow-sm">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">Seller Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-walnut">
              Welcome back, {user?.name || 'Seller'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-walnut/60 font-semibold">
              Upload raw leather templates, generate customized overlay designs, and manage your online catalog from a unified printing console.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/upload"
                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-walnut px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-walnut/90 shadow-sm"
              >
                <Upload size={16} />
                Upload New Template
              </Link>
              <Link
                to="/studio"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sand px-5 py-3 text-xs font-semibold uppercase tracking-wider text-walnut transition-all hover:bg-sand/25 bg-white font-semibold"
              >
                <Sparkles size={16} />
                Open Design Studio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {statCards.map((card) => {
            const Icon = card.icon

            return (
              <div key={card.key} className="group flex items-center justify-between rounded-2xl border border-sand bg-white p-5 shadow-sm transition-all hover:border-terracotta">
                <div className="flex items-center gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${card.tone}`}>
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold text-walnut/40 uppercase tracking-widest">{card.label}</p>
                    <span className="text-xl font-bold text-walnut">{loading ? '-' : stats[card.key]}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {/* Recents grid block */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-sand bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-semibold text-walnut">Recent Base Materials</h2>
            <Link to="/upload" className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:text-terracotta/80 transition-colors bg-terracotta/10 px-2.5 py-1.5 rounded-lg border border-terracotta/20">
              Add New <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex-1 grid gap-3 text-xs">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="group flex items-center gap-4 rounded-xl border border-sand/20 p-3 transition-colors hover:bg-sand/10">
                <div className="h-14 w-14 overflow-hidden rounded-lg border border-sand/40 bg-ivory flex items-center justify-center p-1">
                  <img src={product.image_url} alt={product.category} className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize text-walnut">{product.category}</p>
                  <p className="text-[10px] font-semibold text-walnut/40 mt-1">
                    Uploaded {new Date(product.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}

            {!loading && products.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-sand bg-sand/5 py-10 px-4 text-center">
                <PackageCheck size={24} className="text-sand/60 mb-2" />
                <p className="text-xs font-semibold text-walnut/50">No product templates uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-sand bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-semibold text-walnut">Recent Designs</h2>
            <Link to="/designs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-olive hover:text-olive/80 transition-colors bg-olive/10 px-2.5 py-1.5 rounded-lg border border-olive/20">
              View Gallery <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex-1 grid gap-3 text-xs">
            {designs.slice(0, 4).map((design) => (
              <div key={design.id} className="group flex items-center gap-4 rounded-xl border border-sand/20 p-3 transition-colors hover:bg-sand/10">
                <div className="h-14 w-14 overflow-hidden rounded-lg border border-sand/40 bg-ivory flex items-center justify-center p-1">
                  <img src={design.ai_image} alt="Manual design" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm text-walnut">{design.product?.category || 'Custom Design'}</p>
                  <p className="truncate text-[10px] font-semibold text-walnut/40 mt-1">{design.prompt || 'Custom Canvas'}</p>
                </div>
              </div>
            ))}

            {!loading && designs.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-sand bg-sand/5 py-10 px-4 text-center">
                <Images size={24} className="text-sand/60 mb-2" />
                <p className="text-xs font-semibold text-walnut/50">No customized designs saved yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Marketplace Live storefront */}
      {approvedListings.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-semibold text-walnut">Your Live Storefront Inventory</h2>
              <p className="text-xs text-walnut/50 mt-0.5 font-semibold">Approved custom leather creations currently active in the marketplace store catalog.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-100 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              {approvedListings.length} Live Items
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approvedListings.map((listing) => (
              <div key={listing.id} className="group relative rounded-2xl border border-sand bg-white p-3 overflow-hidden shadow-sm hover:border-terracotta transition-all duration-300 flex flex-col justify-between">
                <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1 rounded-full bg-walnut/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-ivory border border-white/10">
                  {listing.design?.product?.category || 'Leather'}
                </span>

                <div className="aspect-square bg-ivory/50 rounded-xl flex items-center justify-center overflow-hidden p-4 border border-sand/10">
                  <img src={listing.design?.ai_image} alt={listing.title} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </div>

                <div className="mt-3 text-xs">
                  <h3 className="font-semibold text-walnut truncate">{listing.title}</h3>
                  
                  <div className="mt-2.5 pt-2.5 border-t border-sand/30 grid grid-cols-2 gap-y-2.5 text-[10px] font-semibold text-walnut/60">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5">List Price</span>
                      <span className="text-xs font-bold text-terracotta">₹{listing.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5">Remaining Stock</span>
                      <span className="text-xs font-bold text-walnut">{listing.quantity} left</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5">Stocks Sold</span>
                      <span className="text-xs font-bold text-olive">{listing.units_sold || 0} sold</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase tracking-widest text-walnut/40 mb-0.5">Net Earnings</span>
                      <span className="text-xs font-bold text-terracotta">₹{listing.net_earnings ? listing.net_earnings.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEdit(listing)}
                    className="mt-4.5 w-full inline-flex items-center justify-center gap-1 rounded-xl border border-sand bg-ivory hover:bg-sand/15 py-2.5 text-[10px] font-bold uppercase tracking-wider text-walnut transition-all"
                  >
                    <Edit3 size={11} />
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full listings history */}
      <section className="rounded-2xl border border-sand bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-sand/30 bg-white px-6 py-5">
          <h2 className="text-base font-semibold text-walnut">Active Sale Requests</h2>
          <p className="text-xs text-walnut/40 mt-1 font-semibold">Status of design templates you have submitted to the public store catalog.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-sand/10 text-[10px] font-semibold uppercase tracking-wider text-walnut/50 border-b border-sand/20">
              <tr>
                <th className="px-6 py-3.5">Design Title</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Remaining Stock</th>
                <th className="px-6 py-3.5">Units Sold</th>
                <th className="px-6 py-3.5">Net Earnings (90%)</th>
                <th className="px-6 py-3.5">Current Status</th>
                <th className="px-6 py-3.5">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 bg-white text-xs text-walnut/80">
              {listings.map((listing) => (
                <tr key={listing.id} className="transition-colors hover:bg-sand/5 group">
                  <td className="px-6 py-4 font-semibold text-walnut group-hover:text-terracotta transition-colors">{listing.title}</td>
                  <td className="px-6 py-4 font-semibold text-walnut/60">₹{listing.price}</td>
                  <td className="px-6 py-4 font-semibold text-walnut/60">{listing.quantity} units</td>
                  <td className="px-6 py-4 font-semibold text-olive">{listing.units_sold || 0} sold</td>
                  <td className="px-6 py-4 font-semibold text-terracotta">₹{listing.net_earnings ? listing.net_earnings.toFixed(2) : '0.00'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                      listing.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      listing.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <span className={`h-1 w-1 rounded-full ${
                        listing.status === 'approved' ? 'bg-emerald-500' :
                        listing.status === 'rejected' ? 'bg-rose-500' :
                        'bg-amber-500 animate-pulse'
                      }`}></span>
                      {listing.status === 'approved' ? 'Approved' : listing.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-walnut/40 font-semibold">{new Date(listing.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
              {!loading && listings.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <Sparkles size={24} className="text-sand/60 mb-2" />
                      <p className="text-xs font-semibold text-walnut/40">No active marketplace sale requests.</p>
                      <Link to="/designs" className="mt-1.5 text-xs font-semibold text-terracotta hover:text-terracotta/80 underline underline-offset-2">Submit a design</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Listing Modal Overlay */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-walnut/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-3xl border border-sand bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingListing(null)}
              className="absolute top-4 right-4 h-7 w-7 rounded-full bg-sand/10 hover:bg-sand/20 text-walnut/60 flex items-center justify-center transition-all"
            >
              <X size={15} />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-walnut uppercase tracking-widest flex items-center gap-1.5">
                <Edit3 size={16} className="text-terracotta" />
                Edit Inventory Details
              </h3>
              <p className="text-[10px] font-semibold text-walnut/50">Update listing description and stocks. Pricing and design image cannot be modified.</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2 text-xs font-semibold text-walnut">
              {/* Image Preview (Read-Only) */}
              <div className="flex items-center gap-3 rounded-2xl bg-ivory p-3 border border-sand/30">
                <div className="h-12 w-12 rounded-lg bg-white p-1 border border-sand/20 flex-shrink-0 flex items-center justify-center">
                  <img src={editingListing.design?.ai_image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-walnut/40">Design Overlay Preview</span>
                  <span className="text-[11px] font-bold text-walnut/70">{editingListing.design?.product?.category || 'Leather Product'}</span>
                </div>
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Listing Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
                />
              </div>

              {/* Description input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Listing Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut resize-none"
                  placeholder="Describe your custom printed leather masterpiece..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* List Price (Read-only) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/40">List Price (₹ INR)</label>
                  <input
                    type="text"
                    value={`₹${editingListing.price}`}
                    disabled
                    className="w-full rounded-xl border border-sand/40 bg-sand/10 px-3.5 py-2.5 text-walnut/50 font-bold cursor-not-allowed outline-none"
                  />
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">No. of Stocks</label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    min="0"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="flex-1 rounded-xl border border-sand py-3 text-[10px] font-bold uppercase tracking-wider text-walnut hover:bg-sand/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-walnut hover:bg-walnut/90 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-colors shadow-sm"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
