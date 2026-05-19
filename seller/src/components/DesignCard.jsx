import { Download, Trash2, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function DesignCard({ design, onDelete, onList }) {
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function handleDelete() {
    setDeleting(true)

    try {
      await onDelete(design.id)
    } finally {
      setDeleting(false)
    }
  }

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)

    try {
      const response = await fetch(design.ai_image, {
        mode: 'cors'
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `leather-design-${design.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading the image:', error)
      // Fallback: open in new tab if CORS or other network issue occurs
      window.open(design.ai_image, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-sand/60 bg-white shadow-sm transition-all duration-300 hover:border-terracotta/50 hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <div className="grid grid-cols-2 gap-px bg-sand/30 border-b border-sand/30">
        <div className="relative aspect-square bg-ivory/50 flex items-center justify-center p-2">
          <img src={design.original_image} alt="Original design" className="h-full w-full object-contain mix-blend-multiply" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-walnut/70 shadow-sm backdrop-blur-md">
            Base Material
          </span>
        </div>
        <div className="relative aspect-square bg-white flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-gradient-to-tr from-sand/10 to-transparent opacity-50"></div>
          <img src={design.ai_image} alt="Manual design" className="relative z-10 h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 z-20 rounded-full bg-walnut/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-md">
            Printed Result
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta mb-1">
            {design.product?.category || 'Custom Canvas'}
          </p>
          <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-walnut">
            {design.prompt || 'Manual canvas design'}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand/30 pt-4">
          {design.listed_product ? (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest border ${
              design.listed_product.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              design.listed_product.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                design.listed_product.status === 'approved' ? 'bg-emerald-500' :
                design.listed_product.status === 'rejected' ? 'bg-rose-500' :
                'bg-amber-500 animate-pulse'
              }`}></span>
              {design.listed_product.status === 'approved' ? 'Selling Live' : 
               design.listed_product.status === 'rejected' ? 'Rejected' : 'Pending Approval'}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onList?.(design)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-walnut px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-walnut/90 shadow-sm"
            >
              List for Sale <ArrowRight size={12} />
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-sand bg-ivory text-walnut transition hover:border-terracotta hover:bg-terracotta/10 hover:text-terracotta disabled:opacity-50"
              title={downloading ? 'Downloading...' : 'Download Image'}
            >
              {downloading ? (
                <span className="h-3 w-3 border-2 border-walnut border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Download size={14} />
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
              title="Delete Design"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
