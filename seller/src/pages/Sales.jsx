import { useEffect, useState } from 'react'
import api from '../api/client'
import { IndianRupee } from 'lucide-react'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="text-slate-400 font-semibold p-12 text-center text-xs">Loading sales financials...</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Financials</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Sales & Earnings</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
          Track the products you've sold on the marketplace and monitor your total earnings after the platform commission.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:border-slate-300">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <IndianRupee size={22} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Net Earnings</p>
              <p className="text-3xl font-bold text-slate-800 tracking-tight">₹{Number(totalEarnings).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-800">Transaction History</h2>
          <p className="text-xs text-slate-400 mt-1">Detailed log of all your successful sales.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Product Design</th>
                <th className="px-6 py-3.5">Purchase Date</th>
                <th className="px-6 py-3.5">Sale Price</th>
                <th className="px-6 py-3.5">Your Earnings (90%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-xs">
              {sales.map((sale) => (
                <tr key={sale.id} className="transition-colors hover:bg-slate-50/40 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-200/40 bg-slate-50 flex items-center justify-center p-1">
                        <img 
                          src={sale.listed_product?.design?.product?.image_url} 
                          className="h-full w-full object-contain mix-blend-multiply" 
                          alt=""
                        />
                      </div>
                      <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{sale.listed_product?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-semibold">{new Date(sale.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-6 py-4 font-semibold text-slate-500">₹{sale.amount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                      +₹{sale.seller_earnings}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && sales.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <IndianRupee size={24} className="text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-400">No sales yet.</p>
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
