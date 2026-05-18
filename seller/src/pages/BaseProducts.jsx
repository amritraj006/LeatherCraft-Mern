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
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 h-64 w-64 bg-olive/10 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-olive">Material Gallery</p>
          <h1 className="mt-2 text-3xl font-serif font-black tracking-tight text-walnut">Manage Base Materials</h1>
          <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-walnut/60">
            View, audit, and remove raw product templates uploaded to your studio portfolio. Removing templates cleanses related designs instantly.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {/* Templates Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-serif font-bold text-walnut">Your Inventory</h2>
          <span className="inline-flex items-center rounded-full bg-ivory border border-sand/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-walnut/60 shadow-sm">
            {products.length} Templates
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sand/60 bg-white px-6 py-20 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/10 text-walnut/40 shadow-sm mb-4">
              <ImageIcon size={28} />
            </span>
            <h3 className="text-xl font-serif font-bold text-walnut">No base templates uploaded</h3>
            <p className="mt-2 max-w-sm text-xs font-semibold leading-relaxed text-walnut/50">
              You haven't uploaded any product templates yet. Visit the Upload page to add your raw belt, shoe, wallet, or bag canvases!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group relative rounded-3xl border border-sand/60 bg-white p-4 overflow-hidden shadow-sm hover:border-terracotta/50 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1">
                {/* Visual design indicator badge */}
                <span className="absolute top-6 left-6 z-10 inline-flex items-center gap-1 rounded-full bg-walnut/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white border border-white/10 shadow-sm">
                  {product.category}
                </span>

                {/* Aspect square base image */}
                <div className="aspect-square bg-ivory/50 rounded-2xl flex items-center justify-center overflow-hidden p-6 border border-sand/30">
                  <img src={product.image_url} alt={product.category} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </div>

                {/* Details Footer */}
                <div className="mt-4 pt-3 border-t border-sand/30 flex items-center justify-between text-[10px] font-bold text-walnut/50 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-terracotta" /> {new Date(product.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-olive">Raw Canvas</span>
                </div>

                {/* Hover delete overlay block */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute inset-0 bg-walnut/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 rounded-3xl gap-3">
                  {deletingId === product.id ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-500 hover:scale-110 active:scale-95 transition-all duration-200"
                      title="Permanently Delete Material & Associated Designs"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <span className="text-[10px] font-bold uppercase text-white tracking-widest mt-1">Delete File</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
