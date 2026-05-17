import { useEffect, useState } from 'react'
import api from '../api/client'
import { IndianRupee, ShoppingCart, Calendar, User, Package } from 'lucide-react'
import { useToast } from '../store/useToast'

export default function Dashboard() {
  const addToast = useToast((state) => state.addToast)
  const [sales, setSales] = useState([])
  const [totalCommission, setTotalCommission] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get('/admin/sales')
        setSales(data.sales)
        setTotalCommission(data.total_admin_commission)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const handleUpdateStatus = async (saleId, newStatus) => {
    try {
      await api.patch(`/admin/sales/${saleId}/status`, { status: newStatus })
      setSales(sales.map(s => s.id === saleId ? { ...s, status: newStatus } : s))
      addToast(`Order #${saleId} status successfully changed to "${newStatus}"!`, 'success')
    } catch (err) {
      console.error('Failed to update sale status:', err)
      addToast('Failed to update order status. Please try again.', 'error')
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
      {/* Title block */}
      <div className="flex flex-col gap-1.5 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Overview</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Real-time marketplace volume, transaction ledgers, and revenue split metrics.</p>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shadow-sm">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Total Admin Revenue</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">₹{Number(totalCommission).toFixed(2)}</p>
            <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-0.5 text-[9px] font-semibold text-teal-700 mt-2 border border-teal-100/50">
              10% split active
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
            <ShoppingCart size={22} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Total Sales Volume</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{sales.length}</p>
            <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-700 mt-2 border border-indigo-100/50">
              Approved products only
            </span>
          </div>
        </div>
      </div>

      {/* Recent sales table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Recent Sales Ledgers</h2>
            <p className="text-xs text-slate-400 mt-1">List of latest customer transactions on seller listings.</p>
          </div>
          <span className="flex h-7 items-center gap-1.5 rounded-full bg-slate-50 px-2.5 text-xs font-semibold text-slate-500 border border-slate-200/50">
            <Calendar size={12} /> Real-time
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Product Title</th>
                <th className="px-6 py-3.5">Seller Details</th>
                <th className="px-6 py-3.5">Buyer Details</th>
                <th className="px-6 py-3.5 text-right">Order Amount</th>
                <th className="px-6 py-3.5 text-right">Admin Cut (10%)</th>
                <th className="px-6 py-3.5 text-center">Order Status</th>
                <th className="px-6 py-3.5 text-center">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-xs">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {sale.listed_product?.title || 'Premium Leather Craft'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{sale.seller?.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{sale.seller?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sale.buyer ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{sale.buyer.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{sale.buyer.email}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Guest Shopper</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-500">₹{Number(sale.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                      +₹{Number(sale.admin_commission).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={sale.status || 'confirmed'}
                      onChange={(e) => handleUpdateStatus(sale.id, e.target.value)}
                      className={`rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider outline-none border transition-colors cursor-pointer ${
                        sale.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : sale.status === 'shipped'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : sale.status === 'processing'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-slate-400">
                    {new Date(sale.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-xs font-semibold">No sales recorded yet</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
