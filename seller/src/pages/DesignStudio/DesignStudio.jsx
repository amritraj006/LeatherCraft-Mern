import * as fabric from 'fabric'
import { useEffect, useMemo, useRef, useState } from 'react'
import api, { getApiError } from '../../api/client'
import StudioLeftPanel from './StudioLeftPanel'
import StudioRightPanel from './StudioRightPanel'
import StudioTopBar from './StudioTopBar'
import { useStudioHistory } from './useStudioHistory'
import { useStudioKeyboard } from './useStudioKeyboard'
import './studio.css'

const CANVAS_W = 700
const CANVAS_H = 500

export default function DesignStudio() {
  // ── Product list ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)

  // ── Canvas ────────────────────────────────────────────────────────────────
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [activeObject, setActiveObject] = useState(null)
  const [activeTool, setActiveTool] = useState('select')
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(false)
  const [revision, setRevision] = useState(0)
  const imageInputRef = useRef(null)

  // ── Feedback ──────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // ── History ───────────────────────────────────────────────────────────────
  const { snapshot, undo, redo, canUndo, canRedo } = useStudioHistory(canvas)

  // ── Load products ─────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true
    api.get('/products').then(({ data }) => {
      if (!alive) return
      const list = data.products || []
      setProducts(list)
      setSelectedProductId(String(list[0]?.id || ''))
    }).catch(err => {
      if (alive) setError(getApiError(err))
    }).finally(() => {
      if (alive) setLoadingProducts(false)
    })
    return () => { alive = false }
  }, [])

  // ── Init Canvas ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fc = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#f8f5f0',
      preserveObjectStacking: true,
    })

    // Snap-to-grid guide lines on move (optional visual aid)
    fc.on('selection:created', e => { setActiveObject(e.selected[0]); setRevision(r => r + 1) })
    fc.on('selection:updated', e => { setActiveObject(e.selected[0]); setRevision(r => r + 1) })
    fc.on('selection:cleared', () => { setActiveObject(null); setRevision(r => r + 1) })
    fc.on('object:modified', () => { setActiveObject(fc.getActiveObject()); setRevision(r => r + 1); snapshot() })
    fc.on('path:created', () => snapshot())

    setCanvas(fc)
    return () => fc.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Grid overlay ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvas) return
    // Remove old grid
    const existing = canvas.getObjects().filter(o => o._isGrid)
    existing.forEach(o => canvas.remove(o))

    if (showGrid) {
      const step = 40
      const lines = []
      for (let x = 0; x <= CANVAS_W; x += step) {
        const l = new fabric.Line([x, 0, x, CANVAS_H], {
          stroke: 'rgba(74,50,40,0.08)', strokeWidth: 1,
          selectable: false, evented: false, _isGrid: true,
        })
        lines.push(l)
      }
      for (let y = 0; y <= CANVAS_H; y += step) {
        const l = new fabric.Line([0, y, CANVAS_W, y], {
          stroke: 'rgba(74,50,40,0.08)', strokeWidth: 1,
          selectable: false, evented: false, _isGrid: true,
        })
        lines.push(l)
      }
      lines.forEach(l => canvas.add(l))
      canvas.sendObjectToBack(lines[0])
      canvas.renderAll()
    } else {
      canvas.renderAll()
    }
  }, [canvas, showGrid])

  // ── Load background image when product changes ────────────────────────────
  const selectedProduct = useMemo(
    () => products.find(p => String(p.id) === String(selectedProductId)),
    [products, selectedProductId],
  )

  useEffect(() => {
    if (!canvas || !selectedProduct) return

    // Clear non-grid objects
    canvas.getObjects().filter(o => !o._isGrid).forEach(o => canvas.remove(o))
    canvas.backgroundImage = null
    setActiveObject(null)

    let imgUrl = selectedProduct.image_url
    if (imgUrl.includes('localhost') || imgUrl.includes('127.0.0.1')) {
      imgUrl = imgUrl.replace(/^https?:\/\/[^/]+/, '')
    }

    fabric.FabricImage.fromURL(imgUrl, { crossOrigin: 'anonymous' }).then(img => {
      const scale = Math.min(CANVAS_W / img.width, CANVAS_H / img.height) * 0.92
      img.set({
        scaleX: scale, scaleY: scale,
        originX: 'center', originY: 'center',
        top: CANVAS_H / 2, left: CANVAS_W / 2,
      })
      canvas.backgroundImage = img
      canvas.renderAll()
      snapshot()
    }).catch(err => console.error('Background load error:', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, selectedProduct])

  // ── Image upload handler ──────────────────────────────────────────────────
  function handleImageFile(e) {
    const file = e.target.files?.[0]
    if (!file || !canvas) return
    const reader = new FileReader()
    reader.onload = async f => {
      const img = await fabric.FabricImage.fromURL(f.target.result)
      img.set({ left: CANVAS_W / 2, top: CANVAS_H / 2, originX: 'center', originY: 'center' })
      img.scaleToWidth(180)
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      snapshot()
      setActiveTool('select')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Update active object ──────────────────────────────────────────────────
  function update(props) {
    if (!canvas || !activeObject) return
    activeObject.set(props)
    canvas.renderAll()
    setActiveObject(canvas.getActiveObject())
    setRevision(r => r + 1)
  }

  // ── Delete active object ──────────────────────────────────────────────────
  function deleteActive() {
    if (!canvas || !activeObject) return
    canvas.remove(activeObject)
    canvas.discardActiveObject()
    canvas.renderAll()
    setActiveObject(null)
    setRevision(r => r + 1)
    snapshot()
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useStudioKeyboard({ canvas, activeObject, deleteActive, undo, redo })

  // ── Download ──────────────────────────────────────────────────────────────
  function handleDownload() {
    if (!canvas) return
    canvas.discardActiveObject()
    canvas.renderAll()
    const url = canvas.toDataURL({ format: 'png', multiplier: 2 })
    const a = document.createElement('a')
    a.href = url
    a.download = `leathercraft-design-${Date.now()}.png`
    a.click()
  }

  // ── Save design ───────────────────────────────────────────────────────────
  async function handleSave() {
    if (!selectedProduct || !canvas) return
    setSaving(true)
    setError('')
    setNotice('')
    canvas.discardActiveObject()
    canvas.renderAll()

    try {
      const dataURL = canvas.toDataURL({ format: 'jpeg', quality: 0.88 })
      const byteStr = atob(dataURL.split(',')[1])
      const mime = dataURL.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteStr.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i)
      const blob = new Blob([ab], { type: mime })

      const fd = new FormData()
      fd.append('product_id', selectedProduct.id)
      fd.append('original_image', selectedProduct.image_url)
      fd.append('design_image', blob, 'design.jpg')

      await api.post('/design/save', fd)
      setNotice('✓ Design saved to your gallery!')
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="design-studio">
      {/* Hidden image file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleImageFile}
        onClick={e => { e.target.value = null }}
      />

      {/* Top Bar */}
      <StudioTopBar
        selectedProduct={selectedProduct}
        zoom={zoom}
        setZoom={setZoom}
        canvas={canvas}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={undo}
        redo={redo}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        saving={saving}
        onSave={handleSave}
        onDownload={handleDownload}
      />

      {/* Notifications */}
      {(error || notice) && (
        <div className={`studio-toast ${error ? 'studio-toast--error' : 'studio-toast--success'}`}>
          {error || notice}
        </div>
      )}

      {/* Body */}
      <div className="studio-body">
        {/* Left tools */}
        <StudioLeftPanel
          canvas={canvas}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          snapshot={snapshot}
          imageInputRef={imageInputRef}
        />

        {/* Canvas area */}
        <div className="studio-canvas-area">
          {/* Product selector bar */}
          <div className="studio-product-bar">
            <span className="studio-product-bar-label">Base Product</span>
            <select
              value={selectedProductId}
              onChange={e => { setSelectedProductId(e.target.value); setError(''); setNotice('') }}
              disabled={loadingProducts || products.length === 0}
              className="studio-product-select"
            >
              {loadingProducts && <option>Loading…</option>}
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.category?.charAt(0).toUpperCase()}{p.category?.slice(1)} #{p.id}
                </option>
              ))}
            </select>
            <span className="studio-shortcut-hint">
              [ ] layer &nbsp;|&nbsp; Del remove &nbsp;|&nbsp; Ctrl+Z undo &nbsp;|&nbsp; Ctrl+Y redo
            </span>
          </div>

          {/* The canvas */}
          <div className="studio-canvas-wrapper">
            {!selectedProduct && !loadingProducts && (
              <div className="studio-canvas-placeholder">
                <p>Select a base product above to start designing</p>
              </div>
            )}
            <div className="studio-canvas-inner" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>

        {/* Right properties */}
        <StudioRightPanel
          canvas={canvas}
          activeObject={activeObject}
          update={update}
          deleteActive={deleteActive}
          snapshot={snapshot}
        />
      </div>
    </div>
  )
}
