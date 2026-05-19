import { useEffect, useState } from 'react'
import api from '../api/client'
import { IndianRupee, Search, Download } from 'lucide-react'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchSales() {
      try {
        const { data } = await api.get('/sales')
        setSales(data.sales)
        setTotalEarnings(data.total_earnings)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSales()
  }, [])

  const filteredSales = sales.filter(sale => {
    return (sale.listed_product?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  })

  const exportToCSV = () => {
    if (filteredSales.length === 0) return
    const headers = ['Sale ID', 'Product Title', 'Sale Date', 'Sale Price', 'Earnings (90%)']
    const rows = filteredSales.map(sale => [
      sale.id,
      sale.listed_product?.title || 'Premium Leather Craft',
      new Date(sale.created_at).toLocaleDateString(),
      Number(sale.amount).toFixed(2),
      Number(sale.seller_earnings).toFixed(2)
    ])

    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `LeatherCraft_Seller_Earnings_Report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-olive/10 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-olive">Financials</p>
          <h1 className="mt-2 text-3xl font-serif font-black tracking-tight text-walnut">Sales & Earnings</h1>
          <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-walnut/60">
            Track the products you've sold on the marketplace and monitor your total net earnings after platform commission.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-6 shadow-sm transition-all hover:border-terracotta/50 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 to-transparent opacity-50"></div>
          <div className="relative z-10 flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-terracotta border border-sand/60 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-walnut/50 uppercase tracking-widest mb-1">Total Net Earnings</p>
              <p className="text-3xl font-black text-walnut tracking-tight">₹{Number(totalEarnings).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="rounded-3xl border border-sand/60 bg-white shadow-sm overflow-hidden flex flex-col mt-8">
        <div className="border-b border-sand/30 bg-ivory/30 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-walnut">Transaction History</h2>
            <p className="text-[11px] font-semibold text-walnut/50 mt-1 uppercase tracking-widest">Detailed log of successful sales</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-sand/60 bg-white rounded-xl text-xs font-bold text-walnut focus:border-terracotta outline-none transition-all"
              />
            </div>

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
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-sand/10 text-[10px] font-bold uppercase tracking-widest text-walnut/50 border-b border-sand/30">
              <tr>
                <th className="px-8 py-4">Product Design</th>
                <th className="px-6 py-4">Purchase Date</th>
                <th className="px-6 py-4">Sale Price</th>
                <th className="px-8 py-4 text-right">Your Earnings (90%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 bg-white text-xs font-semibold text-walnut/80">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="transition-colors hover:bg-sand/5 group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-xl border border-sand/40 bg-ivory flex items-center justify-center p-1 shadow-sm">
                        <img 
                          src={sale.listed_product?.design?.product?.image_url} 
                          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" 
                          alt=""
                        />
                      </div>
                      <span className="font-bold text-walnut text-sm">{sale.listed_product?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-walnut/50 font-semibold">{new Date(sale.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-6 py-4 font-semibold text-walnut/60">₹{sale.amount}</td>
                  <td className="px-8 py-4 text-right">
                    <span className="inline-flex items-center rounded-full bg-olive/10 px-3 py-1.5 text-[11px] font-black text-olive border border-olive/20 shadow-sm">
                      +₹{sale.seller_earnings}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <IndianRupee size={32} className="text-sand/60 mb-4" />
                      <p className="text-sm font-bold text-walnut">No transaction history found.</p>
                      <p className="text-xs font-semibold text-walnut/50 mt-1">List more custom products to increase your chances of earning.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
