import { useState, useEffect } from 'react'
import { Sparkles, Library, Image as ImageIcon, Download, Store, X } from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useToast } from '../store/useToast'

export default function AIDesign() {
  const addToast = useToast((state) => state.addToast)
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [stylePreset, setStylePreset] = useState('none')
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  
  // The generated design result
  const [generatedDesign, setGeneratedDesign] = useState(null)

  // Loading products
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Listing Modal State
  const [listingDesign, setListingDesign] = useState(null)
  const [listForm, setListForm] = useState({ title: '', price: '', quantity: 1, description: '' })
  const [submittingList, setSubmittingList] = useState(false)
  const [listError, setListError] = useState('')

  // Preset prompts
  const presetPrompts = [
    'Royal Mughal floral pattern with gold leaf borders',
    'A majestic roaring tiger with traditional filigree borders',
    'Cyberpunk street graffiti art with vivid splatter details',
    'Minimalist geometric shapes with warm terracotta and sage accents',
    'Classic Victorian ivy carvings with metallic highlights',
    'Japanese sakura blossoms floating in running spring water'
  ]

  // Style Preset Definitions
  const stylePresets = [
    { id: 'none', label: 'Raw AI Graphic (No Preset)', suffix: '' },
    { id: 'embossed', label: 'Deeply Embossed Carving', suffix: ', highly detailed deep embossed leather carving, vintage leathercraft engraving style, textured leather grooves' },
    { id: 'embroidery', label: 'Needlework Embroidery', suffix: ', beautiful colourful silk thread embroidery, intricate sewing needlework stitching texture, 3d cloth fabric layers' },
    { id: 'vintage', label: 'Vintage Royal Painting', suffix: ', exquisite antique renaissance oil painting style, royal oil canvas paint strokes, gold leaf cracks' },
    { id: 'neon', label: 'Cyberpunk Neon Glow', suffix: ', futuristic cyber lineart vector, glowing bright synthwave neon lines on pitch black carbon fiber, glowing wires' }
  ]

  useEffect(() => {
    let active = true

    async function loadProducts() {
      try {
        const { data } = await api.get('/products')
        if (active) {
          const nextProducts = data.products || []
          setProducts(nextProducts)
          if (nextProducts.length > 0) {
            setSelectedProductId(nextProducts[0].id)
          }
        }
      } catch (err) {
        if (active) {
          setError(getApiError(err))
        }
      } finally {
        if (active) {
          setLoadingProducts(false)
        }
      }
    }

    loadProducts()
    return () => {
      active = false
    }
  }, [])

  const selectedProduct = products.find(p => p.id === selectedProductId)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!selectedProductId || !prompt) {
      addToast('Please choose a base product and enter a descriptive prompt.', 'error')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedDesign(null)

    // Combine user prompt with the selected style preset suffix for premium AI output
    const activePreset = stylePresets.find(s => s.id === stylePreset)
    const combinedPrompt = `${prompt}${activePreset ? activePreset.suffix : ''}`

    try {
      const response = await api.post('/design/generate-ai', {
        product_id: selectedProductId,
        prompt: combinedPrompt
      })
      setGeneratedDesign(response.data.design)
      addToast('AI Design generated and saved to gallery successfully!', 'success')
    } catch (err) {
      setError(getApiError(err))
      addToast('Image generation failed. Try again with a different prompt.', 'error')
    } finally {
      setGenerating(false)
    }
  }

  // Secure cross-origin high-res download
  const handleDownload = async () => {
    if (!generatedDesign?.ai_image) return

    setDownloading(true)
    try {
      const response = await fetch(generatedDesign.ai_image, { mode: 'cors' })
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const tempLink = document.createElement('a')
      tempLink.href = objectUrl
      tempLink.download = `LeatherCraft_AI_Design_${generatedDesign.id || 'Gen'}.jpg`
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      URL.revokeObjectURL(objectUrl)
      addToast('Mockup image downloaded successfully!', 'success')
    } catch (err) {
      console.error('Download failed:', err)
      addToast('Failed to download image. Opening in a new tab instead.', 'error')
      window.open(generatedDesign.ai_image, '_blank')
    } finally {
      setDownloading(false)
    }
  }

  // Open Listing Modal
  function openListModal() {
    if (!generatedDesign) return
    setListingDesign(generatedDesign)
    setListForm({ title: '', price: '', quantity: 1, description: '' })
    setListError('')
  }

  // Submit Listing
  async function submitListing(e) {
    e.preventDefault()
    if (!listingDesign) return

    setSubmittingList(true)
    setListError('')

    try {
      const response = await api.post('/marketplace/products', {
        design_id: listingDesign.id,
        title: listForm.title,
        price: listForm.price,
        quantity: listForm.quantity,
        description: listForm.description,
      })
      setListingDesign(null)
      addToast('AI Design published to Marketplace successfully! Waiting for admin approval.', 'success')
    } catch (apiError) {
      setListError(getApiError(apiError))
    } finally {
      setSubmittingList(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-walnut/10 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta flex items-center gap-1.5">
            <Sparkles size={12} className="animate-pulse" /> Advanced Text-to-Image AI
          </p>
          <h1 className="mt-2 text-3xl font-serif font-black tracking-tight text-walnut">AI Canvas Designer</h1>
          <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-walnut/60">
            Generate stunning custom patterns, textures, and bespoke designs instantly using Flux AI. Select a base material product, describe your creative idea, and watch it generate in real-time.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {/* Main Designer Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Side: Generator Controls Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="rounded-3xl border border-sand/60 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3 flex items-center gap-1.5">
              <Sparkles size={16} className="text-terracotta" />
              AI Design Prompt
            </h2>

            {/* Product Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">1. Select Base Product</label>
              {loadingProducts ? (
                <div className="h-10 bg-sand/10 animate-pulse rounded-xl"></div>
              ) : products.length === 0 ? (
                <div className="text-xs font-semibold text-walnut/50 p-4 border border-dashed border-sand/50 rounded-xl text-center">
                  No base materials found. Please upload a product template first!
                </div>
              ) : (
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-sand bg-ivory/30 rounded-xl text-xs font-bold text-walnut focus:bg-white focus:border-terracotta outline-none transition-all cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.category} ({p.name})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Style Preset Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">2. Apply Style Preset</label>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-sand bg-ivory/30 rounded-xl text-xs font-bold text-walnut focus:bg-white focus:border-terracotta outline-none transition-all cursor-pointer"
              >
                {stylePresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">3. Describe your Design</label>
              <textarea
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your design in detail... (e.g. vintage floral carvings, cyberpunk street art, geometric pastel patterns)"
                className="w-full px-4 py-3 border border-sand bg-ivory/30 rounded-xl text-xs font-semibold text-walnut focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 outline-none transition-all resize-none"
              />
            </div>

            {/* Prompt presets */}
            <div className="space-y-2">
              <label className="text-[8px] font-bold uppercase tracking-widest text-walnut/40">Prompt Inspiration</label>
              <div className="flex flex-wrap gap-1.5">
                {presetPrompts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="text-[9px] font-bold bg-sand/10 hover:bg-sand/30 border border-sand/40 text-walnut px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    + {preset.length > 25 ? preset.substring(0, 25) + '...' : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="submit"
              disabled={generating || products.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Generating AI Design...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-sand animate-pulse" />
                  Generate AI Mockup
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Interactive AI Result Display */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm h-full flex flex-col justify-between min-h-[450px]">
            <div>
              <h2 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3 flex items-center gap-1.5">
                <ImageIcon size={16} className="text-walnut/40" />
                Live Result Mockup
              </h2>
            </div>

            {generating ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-16 w-16 border-4 border-sand/20 border-t-terracotta rounded-full animate-spin"></div>
                  <Sparkles size={24} className="text-terracotta animate-ping" />
                </div>
                <div className="text-center space-y-1.5">
                  <p className="text-xs font-bold text-walnut">Generating bespoke textures via Flux AI</p>
                  <p className="text-[10px] text-walnut/40 font-semibold max-w-xs leading-relaxed">
                    This takes about 5 to 10 seconds to generate, render, and upload directly to Cloudinary.
                  </p>
                </div>
              </div>
            ) : generatedDesign ? (
              <div className="flex-1 flex flex-col justify-between py-4 space-y-6">
                
                {/* Result Cards Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square rounded-2xl border border-sand/40 bg-ivory/50 p-4 flex items-center justify-center overflow-hidden shadow-sm">
                    <img src={selectedProduct?.image_url} alt="Original product" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-walnut/60 shadow-sm">
                      Base Material
                    </span>
                  </div>

                  <div className="relative aspect-square rounded-2xl border border-sand/40 bg-white p-4 flex items-center justify-center overflow-hidden shadow-sm group">
                    <img src={generatedDesign.ai_image} alt="AI design result" className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-walnut/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Printed AI Result
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-ivory/50 border border-sand/30 p-4 space-y-1">
                  <p className="text-[8px] uppercase tracking-widest text-walnut/40 font-bold">Applied Prompt</p>
                  <p className="text-xs font-semibold leading-relaxed text-walnut italic">"{generatedDesign.prompt}"</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-sand/30">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-sand bg-ivory hover:bg-sand/15 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-walnut transition-all disabled:opacity-50"
                  >
                    {downloading ? (
                      <>
                        <span className="h-3 w-3 border-2 border-walnut border-t-transparent rounded-full animate-spin"></span>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={12} /> Download Mockup
                      </>
                    )}
                  </button>

                  <button
                    onClick={openListModal}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-walnut hover:bg-walnut/90 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-all shadow hover:shadow-md"
                  >
                    <Store size={12} className="text-sand" /> Publish to Store
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/10 text-walnut/40 shadow-sm mb-4">
                  <Sparkles size={28} />
                </span>
                <h3 className="text-base font-serif font-bold text-walnut">Ready to generate</h3>
                <p className="mt-1 max-w-xs text-xs font-semibold leading-relaxed text-walnut/40">
                  Select a leather template, type your desired print description, and press Generate above to see AI mockup renderings.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Listing Modal */}
      {listingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-walnut/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-3xl border border-sand bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setListingDesign(null)}
              className="absolute top-6 right-6 h-8 w-8 rounded-full bg-sand/20 hover:bg-sand/40 text-walnut flex items-center justify-center transition-all"
            >
              <X size={16} />
            </button>

            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-serif font-black text-walnut flex items-center gap-2">
                <Store size={20} className="text-terracotta" /> List AI Design for Sale
              </h3>
              <p className="text-[11px] font-semibold text-walnut/50">
                Set details, pricing, and stock to push this AI creation directly to the customer store.
              </p>
            </div>

            {listError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[11px] font-semibold text-rose-700">
                {listError}
              </div>
            )}

            <form onSubmit={submitListing} className="space-y-4 text-xs font-semibold text-walnut">
              
              <div className="flex items-center gap-4 rounded-2xl bg-ivory/50 p-4 border border-sand/40 mb-2">
                <div className="h-14 w-14 rounded-xl bg-white p-2 border border-sand/30 shadow-sm flex-shrink-0">
                  <img src={listingDesign.ai_image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-walnut/40 font-bold mb-1">Design Preview</span>
                  <span className="text-sm font-bold text-walnut">{listingDesign.product?.category || 'Custom Product'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Product Title</label>
                <input
                  type="text"
                  required
                  value={listForm.title}
                  onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
                  placeholder="e.g. Futuristic Dragon Leather Jacket"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Price (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={listForm.price}
                    onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
                    className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
                    placeholder="4999"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Total Stock</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={listForm.quantity}
                    onChange={(e) => setListForm({ ...listForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-walnut/50">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={listForm.description}
                  onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
                  className="w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 resize-none"
                  placeholder="Tell buyers about this custom AI designed masterpiece..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-sand/30">
                <button
                  type="button"
                  onClick={() => setListingDesign(null)}
                  disabled={submittingList}
                  className="w-1/3 rounded-xl border border-sand bg-ivory hover:bg-sand/20 py-3.5 text-[10px] font-bold uppercase tracking-widest text-walnut transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingList || !listForm.title || !listForm.price || !listForm.quantity}
                  className="w-2/3 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {submittingList ? 'Listing...' : 'Publish to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
