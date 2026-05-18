import { Redo2, Undo2, ZoomIn, ZoomOut, Grid, Download, Save } from 'lucide-react'

const ZOOM_STEP = 0.15

export default function StudioTopBar({
  selectedProduct,
  zoom,
  setZoom,
  canvas,
  canUndo,
  canRedo,
  undo,
  redo,
  showGrid,
  setShowGrid,
  saving,
  onSave,
  onDownload,
}) {
  function handleZoomIn() {
    if (!canvas) return
    const next = Math.min(3, zoom + ZOOM_STEP)
    canvas.setZoom(next)
    canvas.setWidth(600 * next)
    canvas.setHeight(450 * next)
    setZoom(next)
  }

  function handleZoomOut() {
    if (!canvas) return
    const next = Math.max(0.3, zoom - ZOOM_STEP)
    canvas.setZoom(next)
    canvas.setWidth(600 * next)
    canvas.setHeight(450 * next)
    setZoom(next)
  }

  function handleZoomReset() {
    if (!canvas) return
    canvas.setZoom(1)
    canvas.setWidth(600)
    canvas.setHeight(450)
    setZoom(1)
  }

  return (
    <div className="studio-topbar">
      {/* Left: product name */}
      <div className="studio-topbar-title">
        <span className="studio-topbar-label">Design Studio</span>
        <span className="studio-topbar-product">
          {selectedProduct
            ? `${selectedProduct.category?.charAt(0).toUpperCase()}${selectedProduct.category?.slice(1)} #${selectedProduct.id}`
            : 'No product selected'}
        </span>
      </div>

      {/* Center: undo / redo / grid / zoom */}
      <div className="studio-topbar-center">
        <button
          onClick={undo} disabled={!canUndo}
          className="studio-icon-btn" title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo} disabled={!canRedo}
          className="studio-icon-btn" title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>

        <div className="studio-topbar-divider" />

        <button
          onClick={() => setShowGrid(g => !g)}
          className={`studio-icon-btn ${showGrid ? 'studio-icon-btn--active' : ''}`}
          title="Toggle Grid"
        >
          <Grid size={16} />
        </button>

        <div className="studio-topbar-divider" />

        <button onClick={handleZoomOut} className="studio-icon-btn" title="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <button
          onClick={handleZoomReset}
          className="studio-zoom-label"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={handleZoomIn} className="studio-icon-btn" title="Zoom In">
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Right: download / save */}
      <div className="studio-topbar-right">
        <button onClick={onDownload} className="studio-btn studio-btn--ghost" title="Download PNG">
          <Download size={15} />
          <span>Export</span>
        </button>
        <button
          onClick={onSave}
          disabled={!selectedProduct || saving}
          className="studio-btn studio-btn--primary"
          title="Save to gallery"
        >
          <Save size={15} />
          <span>{saving ? 'Saving…' : 'Save Design'}</span>
        </button>
      </div>
    </div>
  )
}
