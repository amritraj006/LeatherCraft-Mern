import { useEffect, useState } from 'react'
import api from '../api/client'
import { CheckCircle, XCircle, ShoppingBag, User } from 'lucide-react'
import { useToast } from '../store/useToast'

export default function Products() {
  const addToast = useToast((state) => state.addToast)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pending Products Review</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Approve or reject newly custom-crafted leather designs submitted by registered sellers.</p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="glass-card rounded-2xl overflow-hidden flex flex-col relative group">
            {/* Visual top design tag */}
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10">
              {product.design?.product?.category || 'Leather'}
            </span>

            {/* Design Image container */}
            <div className="aspect-square bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={product.design?.ai_image}
                alt={product.title}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Product details */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex-1 text-xs">
                <h3 className="text-base font-semibold text-slate-800 leading-snug group-hover:text-teal-600 transition-colors">
                  {product.title}
                </h3>
                
                {/* Seller Detail Block */}
                <div className="mt-2.5 flex items-center gap-2 font-semibold text-slate-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <User size={11} />
                  </span>
                  <span>
                    By <strong className="text-slate-700 font-semibold">{product.user?.name}</strong>
                  </span>
                </div>

                <p className="mt-3.5 leading-relaxed text-slate-400 font-semibold">
                  {product.description || 'Custom crafted and hand-stitched leather product featuring a modern premium design canvas composition.'}
                </p>
              </div>

              {/* Price & Action button footer */}
              <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Marketplace Price</span>
                  <span className="text-lg font-bold text-slate-800">₹{product.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">No of Stocks</span>
                  <span className="text-sm font-semibold text-slate-700">{product.quantity} units</span>
                </div>
              </div>
              
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleStatusChange(product.id, 'approved')}
                  disabled={updatingId === product.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => handleStatusChange(product.id, 'rejected')}
                  disabled={updatingId === product.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/40 text-rose-700 py-2 text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center bg-white/30 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto mb-4">
              <ShoppingBag size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">All caught up!</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm mx-auto">There are currently no new leather product approvals pending in the seller queue.</p>
          </div>
        )}
      </div>
    </div>
  )
}
