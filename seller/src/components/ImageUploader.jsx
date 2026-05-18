import { ImagePlus, Loader2, UploadCloud, Info } from 'lucide-react'
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
    if (!file) return
    onSubmit({ file, category })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      
      {/* Left: Drag and drop zone */}
      <label className={`group relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${preview ? 'border-transparent bg-ivory/30' : 'border-sand bg-ivory/50 hover:border-terracotta hover:bg-terracotta/5'}`}>
        {preview ? (
          <>
            <img src={preview} alt="Selected leather product" className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-walnut/0 transition-colors duration-300 group-hover:bg-walnut/5"></div>
            <span className="absolute bottom-6 rounded-full bg-walnut/90 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Click to replace image
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center px-6 text-center">
            <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-sand shadow-sm border border-sand/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-terracotta group-hover:border-terracotta/30">
              <ImagePlus size={32} />
            </span>
            <span className="text-xl font-serif font-black text-walnut">Select template image</span>
            <span className="mt-3 max-w-xs text-xs font-semibold leading-relaxed text-walnut/50">
              Upload a clear, high-resolution photo of your raw leather product (JPG, PNG, WebP up to 10MB).
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>

      {/* Right: Controls */}
      <div className="flex flex-col justify-center space-y-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-walnut">Template Details</h3>
          <p className="text-[11px] font-semibold text-walnut/50 mt-1 uppercase tracking-widest">Configure your base material</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/70" htmlFor="category">
            Product Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full appearance-none rounded-xl border border-sand bg-white px-4 py-3.5 text-sm font-bold text-walnut outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 cursor-pointer"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-walnut/50">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-ivory/80 border border-sand/40 p-4">
          <Info size={16} className="text-terracotta mt-0.5 flex-shrink-0" />
          <p className="text-[11px] font-semibold leading-relaxed text-walnut/70">
            Uploaded templates will be securely stored in your private seller account. You can use these templates endlessly in the Design Studio to create and list new product variations.
          </p>
        </div>

        <div className="pt-4 border-t border-sand/30">
          <button
            type="submit"
            disabled={!file || loading}
            className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-walnut px-4 py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-walnut/90 disabled:opacity-50 disabled:hover:translate-y-0 hover:-translate-y-0.5"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} className="transition-transform group-hover:-translate-y-1" />}
            {loading ? 'Uploading...' : 'Save to Portfolio'}
          </button>
        </div>
      </div>
    </form>
  )
}
