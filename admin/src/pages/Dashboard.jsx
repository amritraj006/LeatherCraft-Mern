import { useEffect, useState } from 'react'
import api from '../api/client'
import { IndianRupee, ShoppingCart, Calendar, User, Package, Download, Search } from 'lucide-react'
import { useToast } from '../store/useToast'

export default function Dashboard() {
  const addToast = useToast((state) => state.addToast)
  const [sales, setSales] = useState([])
  const [totalCommission, setTotalCommission] = useState(0)
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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

  const filteredSales = sales.filter(sale => {
    const titleMatch = (sale.listed_product?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    const sellerMatch = (sale.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const buyerMatch = (sale.buyer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = statusFilter === 'all' || (sale.status || 'confirmed') === statusFilter
    return (titleMatch || sellerMatch || buyerMatch) && statusMatch
  })

  const exportToCSV = () => {
    if (filteredSales.length === 0) {
      addToast('No transaction records to export.', 'error')
      return
    }
    const headers = ['Order ID', 'Product Title', 'Seller Name', 'Seller Email', 'Buyer Name', 'Buyer Email', 'Order Amount', 'Admin Commission', 'Status', 'Date']
    const rows = filteredSales.map(sale => [
      sale.id,
      sale.listed_product?.title || 'Premium Leather Craft',
      sale.seller?.name || 'N/A',
      sale.seller?.email || 'N/A',
      sale.buyer?.name || 'Guest Shopper',
      sale.buyer?.email || 'N/A',
      Number(sale.amount).toFixed(2),
      Number(sale.admin_commission).toFixed(2),
      sale.status || 'confirmed',
      new Date(sale.created_at).toLocaleDateString()
    ])

    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `LeatherCraft_Admin_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('Admin transaction report successfully downloaded!', 'success')
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-sand border-t-terracotta"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Title block */}
      <div className="p-8 rounded-3xl border border-sand/40 bg-white shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-widest">HQ Operations Desk</span>
          <h1 className="text-3xl font-serif font-black text-walnut tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-walnut/50 font-semibold mt-1">
            Real-time marketplace volume, transaction ledgers, and revenue split metrics.
          </p>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="premium-card rounded-3xl p-7 flex items-center gap-5 relative overflow-hidden">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand/15 border border-sand/30 text-walnut shadow-sm flex-shrink-0">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-walnut/40">Total Admin Revenue</p>
            <p className="text-3xl font-serif font-black text-walnut mt-1">₹{Number(totalCommission).toFixed(2)}</p>
            <span className="inline-flex items-center gap-1 rounded bg-terracotta/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-terracotta mt-2.5 border border-terracotta/20">
              10% split active
            </span>
          </div>
        </div>

        <div className="premium-card rounded-3xl p-7 flex items-center gap-5 relative overflow-hidden">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand/15 border border-sand/30 text-walnut shadow-sm flex-shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-walnut/40">Total Sales Volume</p>
            <p className="text-3xl font-serif font-black text-walnut mt-1">{sales.length}</p>
            <span className="inline-flex items-center gap-1 rounded bg-olive/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-olive mt-2.5 border border-olive/20">
              Approved Products Only
            </span>
          </div>
        </div>
      </div>

      {/* Recent sales table */}
      <div className="premium-card rounded-3xl overflow-hidden border border-sand/40">
        <div className="border-b border-sand/20 px-6 py-6 flex flex-col xl:flex-row xl:items-center justify-between bg-white gap-4">
          <div>
            <h2 className="text-lg font-serif font-black text-walnut">Recent Sales Ledgers</h2>
            <p className="text-xs text-walnut/50 font-semibold mt-1">List of latest customer transactions on seller listings.</p>
          </div>
          
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full xl:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/40" />
              <input
                type="text"
                placeholder="Search products, buyers, sellers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-sand bg-ivory/30 rounded-xl text-xs font-bold text-walnut focus:bg-white focus:border-terracotta outline-none transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-sand bg-ivory/30 rounded-xl text-xs font-bold uppercase tracking-wider text-walnut/70 focus:bg-white focus:border-terracotta outline-none transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={exportToCSV}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-transparent rounded-xl bg-walnut hover:bg-walnut/90 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-walnut/10 hover:shadow-lg transition-all cursor-pointer flex-shrink-0"
            >
              <Download size={12} className="text-sand" /> Export CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-walnut">
            <thead className="bg-ivory/50 text-[10px] font-bold uppercase tracking-widest text-walnut/50 border-b border-sand/20">
              <tr>
                <th className="px-6 py-4">Product Title</th>
                <th className="px-6 py-4">Seller Details</th>
                <th className="px-6 py-4">Buyer Details</th>
                <th className="px-6 py-4 text-right">Order Amount</th>
                <th className="px-6 py-4 text-right">Admin Cut (10%)</th>
                <th className="px-6 py-4 text-center">Order Status</th>
                <th className="px-6 py-4 text-center">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/10 bg-white text-xs">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-ivory/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-walnut">
                    {sale.listed_product?.title || 'Premium Leather Craft'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-walnut">{sale.seller?.name}</span>
                      <span className="text-[10px] text-walnut/40 font-semibold mt-0.5">{sale.seller?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sale.buyer ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-walnut">{sale.buyer.name}</span>
                        <span className="text-[10px] text-walnut/40 font-semibold mt-0.5">{sale.buyer.email}</span>
                      </div>
                    ) : (
                      <span className="text-walnut/40 italic font-semibold">Guest Shopper</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-walnut/70">₹{Number(sale.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/30">
                      +₹{Number(sale.admin_commission).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={sale.status || 'confirmed'}
                      onChange={(e) => handleUpdateStatus(sale.id, e.target.value)}
                      className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider outline-none border transition-all cursor-pointer ${
                        sale.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : sale.status === 'shipped'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : sale.status === 'processing'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-walnut/40">
                    {new Date(sale.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-walnut/40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ShoppingCart size={24} className="text-sand" />
                      <span className="text-xs font-bold uppercase tracking-wider">No matching transaction records</span>
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
