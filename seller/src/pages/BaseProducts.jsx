import { Trash2, Image as ImageIcon, Loader2, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import api, { getApiError } from '../api/client'

export default function BaseProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await api.get('/products')
        setProducts(data.products || [])
      } catch (err) {
        setError(getApiError(err))
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  async function handleDeleteProduct(productId) {
    if (!window.confirm('Are you sure you want to delete this base product? This will permanently remove the base material file from the server storage and delete all customized seller designs associated with it.')) return
    
    setDeletingId(productId)
    setError('')
    try {
      await api.delete(`/products/${productId}`)
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Material Gallery</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Manage Base Materials</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          View, audit, and remove raw product templates uploaded to your studio portfolio. Removing templates cleanses related designs instantly.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {/* Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-slate-800">Your Base Materials Inventory</h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 border border-slate-200/50">
            {products.length} Base Templates
          </span>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center bg-white/30 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto mb-4">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No base templates uploaded</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't uploaded any product templates yet. Visit the **Upload** page to add your raw belt, shoe, wallet, or bag canvases!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group relative rounded-2xl border border-slate-200 bg-white p-3 overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
                {/* Visual design indicator badge */}
                <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10">
                  {product.category}
                </span>

                {/* Aspect square base image */}
                <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden p-4">
                  <img src={product.image_url} alt={product.category} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </div>

                {/* Details Footer */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {new Date(product.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-teal-600 uppercase tracking-widest">Base Canvas</span>
                </div>

                {/* Hover delete overlay block */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 rounded-2xl gap-2">
                  {deletingId === product.id ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all duration-200"
                      title="Permanently Delete Material & Associated Designs"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <span className="text-[9px] font-semibold uppercase text-white tracking-widest mt-1">Delete Material</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
