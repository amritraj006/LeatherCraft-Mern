import { Download, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function DesignCard({ design, onDelete, onList }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)

    try {
      await onDelete(design.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-px bg-slate-200">
        <div className="relative aspect-square bg-slate-100">
          <img src={design.original_image} alt="Original design" className="h-full w-full object-cover" />
          <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-black text-slate-700">
            Before
          </span>
        </div>
        <div className="relative aspect-square bg-slate-100">
          <img src={design.ai_image} alt="Manual design" className="h-full w-full object-cover" />
          <span className="absolute left-2 top-2 rounded bg-teal-700 px-2 py-1 text-xs font-black text-white">
            After
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-teal-700">
              {design.product?.category || 'Leather product'}
            </p>
            <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-700">{design.prompt}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
          {design.listed_product ? (
            <span className={`inline-flex items-center rounded-md px-3 py-2 text-xs font-bold border ${
              design.listed_product.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              design.listed_product.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {design.listed_product.status === 'approved' ? 'Approved for Sale' : 
               design.listed_product.status === 'rejected' ? 'Listing Rejected' : 'Pending Admin Approval'}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onList?.(design)}
              className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              List for Sale
            </button>
          )}
          <div className="flex gap-2">
            <a
              href={design.ai_image}
              target="_blank"
              rel="noreferrer"
              download={`leather-design-${design.id}.png`}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
            >
              <Download size={16} />
              <span className="sr-only sm:not-sr-only">Download</span>
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
            >
              <Trash2 size={16} />
              <span className="sr-only sm:not-sr-only">{deleting ? '...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
