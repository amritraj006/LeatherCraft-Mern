import { Images, X, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import api, { getApiError } from '../api/client'
import DesignCard from '../components/DesignCard'
import { useToast } from '../store/useToast'

export default function DesignsGallery() {
  const addToast = useToast((state) => state.addToast)
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDesigns() {
      try {
        const { data } = await api.get('/designs')

        if (active) {
          setDesigns(data.designs || [])
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

    loadDesigns()

    return () => {
      active = false
    }
  }, [])

  async function deleteDesign(id) {
    await api.delete(`/design/${id}`)
    setDesigns((current) => current.filter((design) => design.id !== id))
  }

  const [listingDesign, setListingDesign] = useState(null)
  const [listForm, setListForm] = useState({ title: '', price: '', quantity: 1, description: '' })
  const [submittingList, setSubmittingList] = useState(false)
  const [listError, setListError] = useState('')

  function openListModal(design) {
    setListingDesign(design)
    setListForm({ title: '', price: '', quantity: 1, description: '' })
    setListError('')
  }

  async function submitListing(e) {
    e.preventDefault()
    if (!listingDesign) return

    setSubmittingList(true)
    setListError('')

    try {
      const response = await api.post('/marketplace/products', {
        design_id: listingDesign.id,
        title: listForm.title,
        price: listForm.price,
        quantity: listForm.quantity,
        description: listForm.description,
      })
      setDesigns(prev => prev.map(d => d.id === listingDesign.id ? { ...d, listed_product: response.data.listed_product } : d))
      setListingDesign(null)
      addToast('Product submitted for listing. Waiting for admin approval!', 'success')
    } catch (apiError) {
      setListError(getApiError(apiError))
    } finally {
      setSubmittingList(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-olive/10 rounded-full filter blur-2xl -z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-olive">Design Portfolio</p>
          <h1 className="mt-2 text-3xl font-serif font-black tracking-tight text-walnut">Saved Creations</h1>
          <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-walnut/60">
            Review your custom designs generated in the studio. You can download your mockups, delete discards, or list your best work directly to the LeatherCraft marketplace.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="h-96 animate-pulse rounded-2xl border border-sand bg-white/50 p-4">
              <div className="h-48 rounded-xl bg-sand/20 mb-4"></div>
              <div className="h-4 w-1/2 rounded bg-sand/20 mb-2"></div>
              <div className="h-3 w-3/4 rounded bg-sand/10"></div>
            </div>
          ))}
        </div>
      ) : designs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} onDelete={deleteDesign} onList={openListModal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sand/60 bg-white px-6 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/10 text-walnut/40 shadow-sm mb-4">
            <Images size={28} />
          </span>
          <h2 className="text-xl font-serif font-bold text-walnut">No saved designs yet</h2>
          <p className="mt-2 max-w-sm text-xs font-semibold leading-relaxed text-walnut/50">
            Open the Design Studio, select a base material, and start creating beautiful printed overlays.
          </p>
        </div>
      )}

      {/* Listing Modal */}
      {listingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-walnut/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-3xl border border-sand bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setListingDesign(null)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-sand/20 hover:bg-sand/40 text-walnut flex items-center justify-center transition-all"
            >
              <X size={16} />
            </button>

            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-serif font-black text-walnut flex items-center gap-2">
                <Store size={20} className="text-terracotta" /> List for Sale
              </h3>
              <p className="text-[11px] font-semibold text-walnut/50">
                Set details, pricing, and stock to push this design to the public store.
              </p>
            </div>

            {listError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[11px] font-semibold text-rose-700">
                {listError}
              </div>
            )}

            <form onSubmit={submitListing} className="space-y-4 text-xs font-semibold text-walnut">
              
              <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-sand/40 mb-2">
                <div className="h-14 w-14 rounded-xl bg-white p-2 border border-sand/30 shadow-sm flex-shrink-0">
                  <img src={listingDesign.ai_image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-walnut/40 font-bold mb-1">Design Preview</span>
                  <span className="text-sm font-bold text-walnut">{listingDesign.product?.category || 'Custom Product'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Product Title</label>
                <input
                  type="text"
                  required
                  value={listForm.title}
                  onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
                  placeholder="e.g. Vintage Printed Leather Satchel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Price (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={listForm.price}
                    onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
                    className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
                    placeholder="2999"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Total Stock</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={listForm.quantity}
                    onChange={(e) => setListForm({ ...listForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={listForm.description}
                  onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 resize-none"
                  placeholder="Tell buyers about this custom creation..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-sand/30">
                <button
                  type="button"
                  onClick={() => setListingDesign(null)}
                  disabled={submittingList}
                  className="w-1/3 rounded-xl border border-sand bg-ivory hover:bg-sand/20 py-3.5 text-[10px] font-bold uppercase tracking-widest text-walnut transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingList || !listForm.title || !listForm.price || !listForm.quantity}
                  className="w-2/3 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {submittingList ? 'Listing...' : 'Publish to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
