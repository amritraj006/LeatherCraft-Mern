import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import api, { getApiError } from '../api/client'
import ImageUploader from '../components/ImageUploader'

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Material Management</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Add Leather Product Templates</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Upload original high-resolution templates of belts, shoes, bags, or other accessories. You can then use the Design Studio to edit and apply custom designs onto them.
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {uploaded && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-xs font-semibold text-emerald-850 shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Uploaded <strong>{uploaded.category}</strong> successfully! Open the Design Studio to apply overlays and create customized products.</span>
        </div>
      )}

      {/* Upload pane */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800 px-1">Upload Base Template</h2>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <ImageUploader onSubmit={uploadProduct} loading={loading} />
        </div>
      </div>
    </div>
  )
}
