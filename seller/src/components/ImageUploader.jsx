import { ImagePlus, Loader2, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const categories = ['bag', 'belt', 'shoe', 'wallet', 'jacket', 'accessory']

export default function ImageUploader({ onSubmit, loading }) {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState(categories[0])
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  function handleSubmit(event) {
    event.preventDefault()

    if (!file) {
      return
    }

    onSubmit({ file, category })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <label className="flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-white transition hover:border-teal-500 hover:bg-teal-50/40">
        {preview ? (
          <img src={preview} alt="Selected leather product" className="h-full max-h-[34rem] w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center px-6 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-teal-50 text-teal-700">
              <ImagePlus size={26} />
            </span>
            <span className="text-lg font-black text-slate-950">Select a product image</span>
            <span className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              JPG, PNG, or WebP leather goods up to 10 MB.
            </span>
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-800" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Product uploads are stored through the backend storage service and attached to your seller account.
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:bg-slate-300"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            Upload Product
          </button>
        </div>
      </div>
    </form>
  )
}
