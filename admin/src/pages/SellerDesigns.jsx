import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'
import { ArrowLeft, Image as ImageIcon, Calendar } from 'lucide-react'

export default function SellerDesigns() {
  const { id } = useParams()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDesigns() {
      try {
        const { data } = await api.get(`/admin/sellers/${id}/designs`)
        setDesigns(data.designs)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDesigns()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-sand border-t-terracotta"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Navigation Header */}
      <div className="p-8 rounded-3xl border border-sand/40 bg-white shadow-sm relative overflow-hidden flex items-center gap-5">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay pointer-events-none"></div>
        <Link
          to="/sellers"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-sand hover:bg-sand/15 text-walnut transition-all shadow-sm z-10 cursor-pointer flex-shrink-0"
          title="Back to Sellers Directory"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="relative z-10">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-widest">Merchant portfolio</span>
          <h1 className="text-3xl font-serif font-black text-walnut tracking-tight leading-tight">Seller Designs Portfolio</h1>
          <p className="text-xs text-walnut/50 font-semibold mt-1">Explore active canvas compositions and custom leather craft layouts.</p>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {designs.map((design) => (
          <div key={design.id} className="premium-card rounded-3xl overflow-hidden flex flex-col relative group bg-white border border-sand/30 shadow-sm">
            {/* Visual design indicator badge */}
            <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-walnut/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-ivory border border-white/10 shadow-sm">
              Manual Craft
            </span>

            {/* Design canvas image rendering */}
            <div className="aspect-square bg-ivory/40 p-5 border-b border-sand/20 flex items-center justify-center overflow-hidden">
              <img
                src={design.ai_image}
                alt="Custom Canvas Design"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content panel */}
            <div className="p-5 flex-1 flex flex-col justify-between text-xs">
              <div>
                <p className="text-[9px] font-bold text-walnut/40 uppercase tracking-widest">Base Product Category</p>
                <p className="text-sm font-serif font-black text-walnut mt-1 capitalize leading-tight group-hover:text-terracotta transition-colors">
                  {design.product?.category || 'Leather Craft'}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-sand/20 flex items-center gap-1.5 text-[10px] font-bold text-walnut/40 uppercase tracking-wider">
                <Calendar size={12} className="opacity-80 text-terracotta" />
                <span>
                  Saved {new Date(design.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {designs.length === 0 && (
          <div className="col-span-full rounded-3xl border border-sand/40 p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/15 text-terracotta">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-sm font-bold text-walnut uppercase tracking-wider">No Designs Created</h3>
            <p className="text-xs font-semibold text-walnut/40 max-w-sm">This seller hasn't crafted any designs or custom composition layouts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
