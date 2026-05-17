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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
        <Link
          to="/sellers"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          title="Back to Sellers Directory"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Seller Designs Portfolios</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Explore active canvas compositions and manually edited leather craft layouts.</p>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {designs.map((design) => (
          <div key={design.id} className="glass-card rounded-2xl overflow-hidden flex flex-col relative group bg-white border border-slate-200/80 shadow-sm">
            {/* Visual design indicator badge */}
            <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white border border-white/10">
              Manual Craft
            </span>

            {/* Design canvas image rendering */}
            <div className="aspect-square bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={design.ai_image}
                alt="Custom Canvas Design"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content panel */}
            <div className="p-4 flex-1 flex flex-col justify-between text-xs">
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Base Product category</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 capitalize leading-tight group-hover:text-teal-600 transition-colors">
                  {design.product?.category || 'Leather Craft'}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <Calendar size={12} className="opacity-80" />
                <span>
                  Saved {new Date(design.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {designs.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center bg-white/30 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mx-auto mb-4">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No designs created</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm mx-auto">This seller hasn't crafted any designs or custom composition layouts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
