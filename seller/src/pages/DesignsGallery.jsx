import { Images } from 'lucide-react'
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Design Portfolio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Saved Creations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Review your custom designs, download them, or request admin approval to list them on the LeatherCraft marketplace.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs font-semibold text-slate-400">
          Loading saved designs...
        </div>
      ) : designs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} onDelete={deleteDesign} onList={openListModal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <Images size={20} />
          </span>
          <h2 className="mt-4 text-base font-semibold text-slate-800">No saved designs yet</h2>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
            Visit the Design Studio to create and save your custom product variations.
          </p>
        </div>
      )}

      {listingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-walnut/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-sand animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-semibold text-walnut">List for Sale</h3>
            <p className="text-xs text-walnut/50 mt-1 font-semibold">
              Set details, pricing, and stock quantity for your design to list it on the marketplace.
            </p>

            {listError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
                {listError}
              </div>
            )}

            <form onSubmit={submitListing} className="mt-4 space-y-4 text-xs">
              <div>
                <label htmlFor="title" className="mb-1 block font-semibold text-walnut/60 uppercase tracking-widest text-[9px]">
                  Product Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={listForm.title}
                  onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/5 font-semibold text-walnut"
                  placeholder="e.g. Vintage Leather Satchel Redesign"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="mb-1 block font-semibold text-walnut/60 uppercase tracking-widest text-[9px]">
                    Price (₹)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={listForm.price}
                    onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
                    className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/5 font-semibold text-walnut"
                    placeholder="e.g. 199.99"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="mb-1 block font-semibold text-walnut/60 uppercase tracking-widest text-[9px]">
                    No of Stocks
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={listForm.quantity}
                    onChange={(e) => setListForm({ ...listForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-sand bg-white px-3 py-2.5 text-sm outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/5 font-semibold text-walnut"
                    placeholder="e.g. 10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="mb-1 block font-semibold text-walnut/60 uppercase tracking-widest text-[9px]">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={listForm.description}
                  onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/5 font-semibold text-walnut"
                  placeholder="Describe your design..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-sand/30 pt-4">
                <button
                  type="button"
                  onClick={() => setListingDesign(null)}
                  disabled={submittingList}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-walnut/50 transition hover:bg-sand/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingList || !listForm.title || !listForm.price || !listForm.quantity}
                  className="rounded-xl bg-walnut px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-walnut/90 disabled:opacity-50"
                >
                  {submittingList ? 'Listing...' : 'List Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
