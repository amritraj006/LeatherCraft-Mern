import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { User, Eye, ArrowRight, Search } from 'lucide-react'

export default function Sellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredSellers = sellers.filter(seller => 
    (seller.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (seller.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-sand border-t-terracotta"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="p-8 rounded-3xl border border-sand/40 bg-white shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-widest">Merchant network</span>
          <h1 className="text-3xl font-serif font-black text-walnut tracking-tight">Sellers Directory</h1>
          <p className="text-xs text-walnut/50 font-semibold mt-1">Browse registered merchant profiles, overall gallery design counts, and performance portfolios.</p>
        </div>
      </div>

      {/* Sellers List Container */}
      <div className="premium-card rounded-3xl overflow-hidden border border-sand/40 bg-white shadow-sm">
        {/* Search header bar */}
        <div className="border-b border-sand/20 px-6 py-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif font-black text-walnut">Active Artisans Directory</h2>
            <p className="text-xs text-walnut/50 font-semibold mt-1">Verified partner profiles and volume statistics.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-sand bg-ivory/30 rounded-xl text-xs font-bold text-walnut focus:bg-white focus:border-terracotta outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-walnut">
            <thead className="bg-ivory/50 text-[10px] font-bold uppercase tracking-widest text-walnut/50 border-b border-sand/20">
              <tr>
                <th className="px-6 py-4">Seller Merchant</th>
                <th className="px-6 py-4">Account Email</th>
                <th className="px-6 py-4">Gallery Volume</th>
                <th className="px-6 py-4 text-right">Portfolio Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/10 bg-white text-xs">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-ivory/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand/15 border border-sand/30 text-walnut shadow-sm font-black text-xs">
                        {seller.name?.charAt(0).toUpperCase() || 'M'}
                      </div>
                      <span className="font-bold text-walnut">{seller.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-walnut/40">{seller.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-olive/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-olive border border-olive/20">
                      {seller.designs_count} Designs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/sellers/${seller.id}/designs`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-walnut hover:bg-walnut/90 border border-transparent px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-walnut/10 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <Eye size={12} className="text-sand" /> View Designs <ArrowRight size={10} className="opacity-60" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredSellers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-walnut/40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <User size={24} className="text-sand" />
                      <span className="text-xs font-bold uppercase tracking-wider">No matching sellers found</span>
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
