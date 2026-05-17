import { AlignCenter, AlignLeft, AlignRight, Image as ImageIcon, Save, Trash2, Type, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as fabric from 'fabric'
import api, { getApiError } from '../api/client'

export default function AIDesignStudio() {
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Fabric Canvas state
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [activeObject, setActiveObject] = useState(null)
  const [updateTrigger, setUpdateTrigger] = useState(0)

  useEffect(() => {
    let active = true

    async function loadProducts() {
      try {
        const { data } = await api.get('/products')

        if (active) {
          const nextProducts = data.products || []
          setProducts(nextProducts)
          setSelectedProductId((current) => current || String(nextProducts[0]?.id || ''))
        }
      } catch (apiError) {
        if (active) {
          setError(getApiError(apiError))
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

  // Initialize Fabric Canvas
  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 450,
      backgroundColor: '#f8fafc',
      preserveObjectStacking: true, // keeps objects layered correctly when selected
    })

    // Add event listeners
    initCanvas.on('selection:created', (e) => { setActiveObject(e.selected[0]); setUpdateTrigger(prev => prev + 1); })
    initCanvas.on('selection:updated', (e) => { setActiveObject(e.selected[0]); setUpdateTrigger(prev => prev + 1); })
    initCanvas.on('selection:cleared', () => { setActiveObject(null); setUpdateTrigger(prev => prev + 1); })
    initCanvas.on('object:modified', () => { setActiveObject(initCanvas.getActiveObject()); setUpdateTrigger(prev => prev + 1); })

    setCanvas(initCanvas)

    return () => {
      initCanvas.dispose()
    }
  }, [])

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(selectedProductId)),
    [products, selectedProductId],
  )

  // Load product image onto canvas background
  useEffect(() => {
    if (!canvas || !selectedProduct) return

    async function loadBackgroundImage() {
      // Fix absolute URLs to be proxy-relative to avoid CORS in local dev if needed
      let imgUrl = selectedProduct.image_url
      if (imgUrl.includes('localhost') || imgUrl.includes('127.0.0.1')) {
        imgUrl = imgUrl.replace(/^https?:\/\/[^\/]+/, '')
      }

      try {
        const img = await fabric.FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' })
        
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
        
        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'center',
          top: canvas.height / 2,
          left: canvas.width / 2
        })

        // We set it as a background image so it stays behind everything
        canvas.backgroundImage = img
        canvas.renderAll()
      } catch (err) {
        console.error("Failed to load background image", err)
      }
    }
    
    loadBackgroundImage()

    // When changing product, clear existing overlays
    canvas.clear()
    setActiveObject(null)
  }, [canvas, selectedProduct])

  function selectProduct(productId) {
    setSelectedProductId(String(productId))
    setNotice('')
    setError('')
  }

  const addTextOverlay = () => {
    if (!canvas) return
    const text = new fabric.IText('Double click to edit', {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontFamily: 'Arial',
      fill: '#000000',
      fontSize: 32,
      originX: 'center',
      originY: 'center',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  const addImageOverlay = (e) => {
    const file = e.target.files?.[0]
    if (!file || !canvas) return

    const reader = new FileReader()
    reader.onload = async (f) => {
      const data = f.target.result
      try {
        const img = await fabric.FabricImage.fromURL(data)
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
        })
        img.scaleToWidth(150)
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      } catch (err) {
        console.error("Failed to add image overlay", err)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = '' // Reset input
  }

  const deleteActiveObject = () => {
    if (!canvas || !activeObject) return
    canvas.remove(activeObject)
    canvas.discardActiveObject()
    canvas.renderAll()
    setActiveObject(null)
  }

  const updateActiveObject = (updates) => {
    if (!canvas || !activeObject) return
    activeObject.set(updates)
    canvas.renderAll()
    setUpdateTrigger(prev => prev + 1)
  }

  const alignObject = (position) => {
    if (!canvas || !activeObject) return

    const objWidth = activeObject.width * (activeObject.scaleX || 1)
    const objHeight = activeObject.height * (activeObject.scaleY || 1)

    // Boundaries of the canvas
    const padding = 20 // nice gap from edges
    const leftEdge = objWidth / 2 + padding
    const rightEdge = canvas.width - (objWidth / 2) - padding
    const topEdge = objHeight / 2 + padding
    const bottomEdge = canvas.height - (objHeight / 2) - padding
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    let left = centerX
    let top = centerY

    switch (position) {
      case 'top-left':
        left = leftEdge
        top = topEdge
        break
      case 'top-center':
        left = centerX
        top = topEdge
        break
      case 'top-right':
        left = rightEdge
        top = topEdge
        break
      case 'middle-left':
        left = leftEdge
        top = centerY
        break
      case 'middle-center':
        left = centerX
        top = centerY
        break
      case 'middle-right':
        left = rightEdge
        top = centerY
        break
      case 'bottom-left':
        left = leftEdge
        top = bottomEdge
        break
      case 'bottom-center':
        left = centerX
        top = bottomEdge
        break
      case 'bottom-right':
        left = rightEdge
        top = bottomEdge
        break
    }

    activeObject.set({ left, top })
    activeObject.setCoords() // updates bounding boxes in Fabric
    canvas.renderAll()
    setUpdateTrigger(prev => prev + 1)
  }

  const handleSaveDesign = async () => {
    if (!selectedProduct) {
      setError('Select a product first.')
      return
    }

    if (!canvas) return

    setSaving(true)
    setError('')
    setNotice('')
    canvas.discardActiveObject()
    canvas.renderAll()

    try {
      // DataURL export
      // DataURL export as JPEG (much smaller file size to fit within PHP upload_max_filesize)
      const dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.85
      })

      // Convert DataURL to Blob synchronously (extremely robust, avoids CSP/fetch issues)
      const byteString = atob(dataURL.split(',')[1])
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })

      const formData = new FormData()
      formData.append('product_id', selectedProduct.id)
      formData.append('original_image', selectedProduct.image_url)
      formData.append('design_image', blob, 'design.jpg')

      await api.post('/design/save', formData)
      setNotice('Design composited and saved to your gallery.')
    } catch (apiError) {
      console.error('Save design error:', apiError)
      if (apiError.response?.status === 422 && apiError.response?.data?.errors) {
        const validationErrors = Object.values(apiError.response.data.errors).flat().join(', ')
        setError(`Validation failed: ${validationErrors}`)
      } else {
        setError(apiError instanceof Error ? apiError.message : getApiError(apiError))
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Design Studio</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Canvas Editor</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Select a base product, add image or text overlays, resize and position them, then save the final result.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          {notice}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Tools */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="product">
              Base Product
            </label>
            <select
              id="product"
              value={selectedProductId}
              onChange={(event) => selectProduct(event.target.value)}
              disabled={loadingProducts || products.length === 0}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-100"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)} #{product.id}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Add Elements</h3>
            <button
              onClick={addTextOverlay}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Type size={18} className="text-teal-600" />
              Add Text
            </button>
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <ImageIcon size={18} className="text-indigo-600" />
              Add Image
              <input type="file" accept="image/*" className="sr-only" onChange={addImageOverlay} onClick={(e) => { e.target.value = null }} />
            </label>
          </div>

          {activeObject && (
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-2 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Edit Selection</h3>
                <button
                  onClick={deleteActiveObject}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                  title="Delete element"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* General Controls (Opacity, Layering) */}
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span>Opacity</span>
                    <span>{Math.round((activeObject.opacity || 1) * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={activeObject.opacity || 1}
                    onChange={(e) => updateActiveObject({ opacity: parseFloat(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { canvas.bringObjectForward(activeObject); canvas.renderAll(); setUpdateTrigger(prev => prev + 1); }} className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-lg font-semibold text-slate-700 transition-colors">Bring Forward</button>
                  <button onClick={() => { canvas.sendObjectBackwards(activeObject); canvas.renderAll(); setUpdateTrigger(prev => prev + 1); }} className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-lg font-semibold text-slate-700 transition-colors">Send Backward</button>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => { canvas.centerObjectH(activeObject); canvas.renderAll(); setUpdateTrigger(prev => prev + 1); }} className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-lg font-semibold text-slate-700 transition-colors">Center Horiz.</button>
                  <button onClick={() => { canvas.centerObjectV(activeObject); canvas.renderAll(); setUpdateTrigger(prev => prev + 1); }} className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-lg font-semibold text-slate-700 transition-colors">Center Vert.</button>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Align to Edges</label>
                  <div className="grid grid-cols-3 gap-1.5 w-36 mx-auto bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl">
                    {[
                      { pos: 'top-left', label: '↖', title: 'Top Left' },
                      { pos: 'top-center', label: '↑', title: 'Top Center' },
                      { pos: 'top-right', label: '↗', title: 'Top Right' },
                      { pos: 'middle-left', label: '←', title: 'Middle Left' },
                      { pos: 'middle-center', label: '•', title: 'Center' },
                      { pos: 'middle-right', label: '→', title: 'Middle Right' },
                      { pos: 'bottom-left', label: '↙', title: 'Bottom Left' },
                      { pos: 'bottom-center', label: '↓', title: 'Bottom Center' },
                      { pos: 'bottom-right', label: '↘', title: 'Bottom Right' }
                    ].map(btn => (
                      <button
                        key={btn.pos}
                        onClick={() => alignObject(btn.pos)}
                        title={btn.title}
                        type="button"
                        className="h-8 w-10 flex items-center justify-center text-sm font-semibold rounded-lg bg-white border border-slate-200 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 transition-colors shadow-sm"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeObject.type === 'i-text' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2">Color</label>
                    <input
                      type="color"
                      value={activeObject.fill}
                      onChange={(e) => updateActiveObject({ fill: e.target.value })}
                      className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer p-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Font Size</label>
                      <input
                        type="number"
                        min="10"
                        max="150"
                        value={activeObject.fontSize || 32}
                        onChange={(e) => updateActiveObject({ fontSize: parseInt(e.target.value) || 12 })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Font Family</label>
                      <select
                        value={activeObject.fontFamily}
                        onChange={(e) => updateActiveObject({ fontFamily: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-500"
                      >
                        {['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button onClick={() => updateActiveObject({ fontWeight: activeObject.fontWeight === 'bold' ? 'normal' : 'bold' })} className={`flex-1 py-2 text-sm font-serif transition-colors ${activeObject.fontWeight === 'bold' ? 'bg-slate-200 font-bold text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>B</button>
                    <button onClick={() => updateActiveObject({ fontStyle: activeObject.fontStyle === 'italic' ? 'normal' : 'italic' })} className={`flex-1 py-2 text-sm font-serif italic border-l border-r border-slate-200 transition-colors ${activeObject.fontStyle === 'italic' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>I</button>
                    <button onClick={() => updateActiveObject({ underline: !activeObject.underline })} className={`flex-1 py-2 text-sm transition-colors underline ${activeObject.underline ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}>U</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSaveDesign}
            disabled={!selectedProduct || saving}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-slate-800 disabled:bg-slate-300"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Design Composite'}
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/60 bg-slate-100 p-8 shadow-inner overflow-hidden min-h-[500px] relative">
          <div className={`shadow-2xl rounded overflow-hidden border border-slate-200 bg-white relative transition-opacity ${!selectedProduct ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
            <canvas ref={canvasRef} />
          </div>
          
          {!selectedProduct && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm font-semibold text-slate-500 z-10">
              <UploadCloud size={40} className="mb-3 text-slate-300" />
              Please select a base product to start designing.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
