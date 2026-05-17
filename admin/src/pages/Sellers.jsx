import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { User, Eye, ArrowRight } from 'lucide-react'

export default function Sellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSellers() {
      try {
        const { data } = await api.get('/admin/sellers')
        setSellers(data.sellers)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadSellers()
  }, [])

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
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Sellers Directory</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Browse registered merchant profiles, overall gallery design counts, and performance portfolios.</p>
      </div>

      {/* Sellers List Container */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Seller Merchant</th>
                <th className="px-6 py-3.5">Account Email</th>
                <th className="px-6 py-3.5">Gallery Volume</th>
                <th className="px-6 py-3.5 text-right">Portfolio Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-xs">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-slate-700">{seller.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-400">{seller.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold text-teal-700 border border-teal-200/20">
                      {seller.designs_count} Designs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/sellers/${seller.id}/designs`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      <Eye size={14} /> View Designs <ArrowRight size={12} className="opacity-60" />
                    </Link>
                  </td>
                </tr>
              ))}
              {sellers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-xs font-semibold">No sellers found in the directory</span>
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
