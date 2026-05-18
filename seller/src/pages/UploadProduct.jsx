import { CheckCircle2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import api, { getApiError } from '../api/client'
import ImageUploader from '../components/ImageUploader'
import { Link } from 'react-router-dom'

export default function UploadProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploaded, setUploaded] = useState(null)

  async function uploadProduct({ file, category }) {
    setLoading(true)
    setError('')
    setUploaded(null)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('category', category)

    try {
      const { data } = await api.post('/product/upload', formData)
      setUploaded(data.product)
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-sand/30 rounded-full filter blur-2xl -z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Material Management</p>
          <h1 className="mt-2 text-3xl font-serif font-black tracking-tight text-walnut">Add Base Templates</h1>
          <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-walnut/60">
            Upload original high-resolution templates of belts, shoes, bags, or other leather accessories. You can then use the Design Studio to edit and apply custom prints onto them.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {uploaded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-olive/30 bg-olive/5 p-6 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-olive/20 text-olive">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-walnut">Template Uploaded Successfully</p>
              <p className="text-xs font-semibold text-walnut/60 mt-1">
                Your <strong>{uploaded.category}</strong> canvas is now ready for customization.
              </p>
            </div>
          </div>
          <Link
            to="/studio"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-walnut px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-walnut/90 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Sparkles size={14} /> Open Studio
          </Link>
        </div>
      )}

      {/* Upload pane */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="h-1.5 w-1.5 rounded-full bg-terracotta"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-walnut">Upload Base Template</h2>
        </div>
        <div className="rounded-3xl border border-sand/60 bg-white p-6 md:p-8 shadow-sm">
          <ImageUploader onSubmit={uploadProduct} loading={loading} />
        </div>
      </section>
    </div>
  )
}
