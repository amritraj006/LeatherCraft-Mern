import {
  Bold, ChevronDown, ChevronUp,
  FlipHorizontal, FlipVertical,
  Italic, RotateCcw, RotateCw,
  Trash2, Underline
} from 'lucide-react'

const FONTS = [
  'Outfit', 'Playfair Display', 'Arial', 'Georgia',
  'Times New Roman', 'Courier New', 'Verdana',
  'Impact', 'Trebuchet MS', 'Comic Sans MS',
]

const ALIGN_PRESETS = [
  { pos: 'top-left', label: '↖' },
  { pos: 'top-center', label: '↑' },
  { pos: 'top-right', label: '↗' },
  { pos: 'middle-left', label: '←' },
  { pos: 'middle-center', label: '⊙' },
  { pos: 'middle-right', label: '→' },
  { pos: 'bottom-left', label: '↙' },
  { pos: 'bottom-center', label: '↓' },
  { pos: 'bottom-right', label: '↘' },
]

export default function StudioRightPanel({ canvas, activeObject, update, deleteActive, snapshot }) {
  if (!canvas) return null

  const obj = activeObject
  const isText = obj?.type === 'i-text' || obj?.type === 'text'
  const isImage = obj?.type === 'image'
  const isShape = obj && !isText && !isImage && obj.type !== 'line'

  function alignTo(pos) {
    if (!obj || !canvas) return
    const ow = obj.getScaledWidth()
    const oh = obj.getScaledHeight()
    const pad = 10
    const cw = 600, ch = 450
    const map = {
      'top-left': { left: ow / 2 + pad, top: oh / 2 + pad },
      'top-center': { left: cw / 2, top: oh / 2 + pad },
      'top-right': { left: cw - ow / 2 - pad, top: oh / 2 + pad },
      'middle-left': { left: ow / 2 + pad, top: ch / 2 },
      'middle-center': { left: cw / 2, top: ch / 2 },
      'middle-right': { left: cw - ow / 2 - pad, top: ch / 2 },
      'bottom-left': { left: ow / 2 + pad, top: ch - oh / 2 - pad },
      'bottom-center': { left: cw / 2, top: ch - oh / 2 - pad },
      'bottom-right': { left: cw - ow / 2 - pad, top: ch - oh / 2 - pad },
    }
    obj.set(map[pos])
    obj.setCoords()
    canvas.renderAll()
    snapshot?.()
  }

  function rotate(deg) {
    if (!obj) return
    obj.set({ angle: ((obj.angle || 0) + deg + 360) % 360 })
    canvas.renderAll()
    snapshot?.()
  }

  function flipH() {
    if (!obj) return
    obj.set({ flipX: !obj.flipX })
    canvas.renderAll()
    snapshot?.()
  }

  function flipV() {
    if (!obj) return
    obj.set({ flipY: !obj.flipY })
    canvas.renderAll()
    snapshot?.()
  }

  function layer(dir) {
    if (!obj) return
    if (dir === 'up') canvas.bringObjectForward(obj)
    else canvas.sendObjectBackwards(obj)
    canvas.renderAll()
    snapshot?.()
  }

  if (!obj) {
    return (
      <div className="studio-right-panel studio-right-panel--empty">
        <p>Select an element to edit its properties</p>
      </div>
    )
  }

  return (
    <div className="studio-right-panel">
      {/* Header */}
      <div className="studio-panel-header">
        <span className="studio-panel-title">{obj.type?.toUpperCase()}</span>
        <button onClick={deleteActive} className="studio-delete-btn" title="Delete (Del)">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Opacity */}
      <div className="studio-prop-group">
        <div className="studio-prop-row">
          <span className="studio-prop-label">Opacity</span>
          <span className="studio-prop-value">{Math.round((obj.opacity ?? 1) * 100)}%</span>
        </div>
        <input
          type="range" min="0.05" max="1" step="0.05"
          value={obj.opacity ?? 1}
          onChange={e => update({ opacity: parseFloat(e.target.value) })}
          className="studio-slider"
        />
      </div>

      {/* Rotation */}
      <div className="studio-prop-group">
        <div className="studio-prop-row">
          <span className="studio-prop-label">Rotation</span>
          <span className="studio-prop-value">{Math.round(obj.angle ?? 0)}°</span>
        </div>
        <div className="studio-btn-row">
          <button onClick={() => rotate(-15)} className="studio-sm-btn" title="Rotate -15°"><RotateCcw size={13} /> -15°</button>
          <button onClick={() => rotate(-1)} className="studio-sm-btn" title="Rotate -1°"><RotateCcw size={13} /> -1°</button>
          <button onClick={() => rotate(1)} className="studio-sm-btn" title="Rotate 1°"><RotateCw size={13} /> 1°</button>
          <button onClick={() => rotate(15)} className="studio-sm-btn" title="Rotate 15°"><RotateCw size={13} /> 15°</button>
        </div>
        <input
          type="range" min="0" max="360" step="1"
          value={obj.angle ?? 0}
          onChange={e => { update({ angle: parseInt(e.target.value) }); snapshot?.() }}
          className="studio-slider"
        />
      </div>

      {/* Flip (image or shape) */}
      {(isImage || isShape) && (
        <div className="studio-prop-group">
          <span className="studio-prop-label">Flip</span>
          <div className="studio-btn-row">
            <button onClick={flipH} className={`studio-sm-btn ${obj.flipX ? 'studio-sm-btn--active' : ''}`}><FlipHorizontal size={13} /> H</button>
            <button onClick={flipV} className={`studio-sm-btn ${obj.flipY ? 'studio-sm-btn--active' : ''}`}><FlipVertical size={13} /> V</button>
          </div>
        </div>
      )}

      {/* Fill / stroke for shapes */}
      {isShape && (
        <div className="studio-prop-group">
          <div className="studio-color-row">
            <div>
              <span className="studio-prop-label">Fill</span>
              <input type="color" value={typeof obj.fill === 'string' ? obj.fill : '#C96A3D'}
                onChange={e => update({ fill: e.target.value })}
                className="studio-color-input"
              />
            </div>
            <div>
              <span className="studio-prop-label">Stroke</span>
              <input type="color" value={obj.stroke || '#000000'}
                onChange={e => update({ stroke: e.target.value })}
                className="studio-color-input"
              />
            </div>
            <div>
              <span className="studio-prop-label">Width</span>
              <input type="number" min="0" max="20" value={obj.strokeWidth ?? 0}
                onChange={e => update({ strokeWidth: parseInt(e.target.value) })}
                className="studio-num-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Line stroke */}
      {obj.type === 'line' && (
        <div className="studio-prop-group">
          <div className="studio-color-row">
            <div>
              <span className="studio-prop-label">Color</span>
              <input type="color" value={obj.stroke || '#4A3228'}
                onChange={e => update({ stroke: e.target.value })}
                className="studio-color-input"
              />
            </div>
            <div>
              <span className="studio-prop-label">Width</span>
              <input type="number" min="1" max="30" value={obj.strokeWidth ?? 3}
                onChange={e => update({ strokeWidth: parseInt(e.target.value) })}
                className="studio-num-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Text controls */}
      {isText && (
        <div className="studio-prop-group">
          <span className="studio-prop-label">Color</span>
          <input type="color" value={obj.fill || '#000000'}
            onChange={e => update({ fill: e.target.value })}
            className="studio-color-input studio-color-input--full"
          />

          <div className="studio-two-col">
            <div>
              <span className="studio-prop-label">Font</span>
              <select value={obj.fontFamily || 'Outfit'}
                onChange={e => update({ fontFamily: e.target.value })}
                className="studio-select"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <span className="studio-prop-label">Size</span>
              <input type="number" min="8" max="200" value={obj.fontSize ?? 36}
                onChange={e => update({ fontSize: parseInt(e.target.value) || 12 })}
                className="studio-num-input"
              />
            </div>
          </div>

          <div className="studio-style-row">
            <button
              onClick={() => update({ fontWeight: obj.fontWeight === 'bold' ? 'normal' : 'bold' })}
              className={`studio-style-btn ${obj.fontWeight === 'bold' ? 'studio-style-btn--active' : ''}`}
            ><Bold size={13} /></button>
            <button
              onClick={() => update({ fontStyle: obj.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`studio-style-btn ${obj.fontStyle === 'italic' ? 'studio-style-btn--active' : ''}`}
            ><Italic size={13} /></button>
            <button
              onClick={() => update({ underline: !obj.underline })}
              className={`studio-style-btn ${obj.underline ? 'studio-style-btn--active' : ''}`}
            ><Underline size={13} /></button>
          </div>

          <div className="studio-two-col">
            <div>
              <span className="studio-prop-label">Stroke</span>
              <input type="color" value={obj.stroke || '#ffffff'}
                onChange={e => update({ stroke: e.target.value })}
                className="studio-color-input"
              />
            </div>
            <div>
              <span className="studio-prop-label">Width</span>
              <input type="number" min="0" max="10" value={obj.strokeWidth ?? 0}
                onChange={e => update({ strokeWidth: parseInt(e.target.value) })}
                className="studio-num-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Layering */}
      <div className="studio-prop-group">
        <span className="studio-prop-label">Layer Order</span>
        <div className="studio-btn-row">
          <button onClick={() => layer('up')} className="studio-sm-btn"><ChevronUp size={13} /> Forward</button>
          <button onClick={() => layer('down')} className="studio-sm-btn"><ChevronDown size={13} /> Backward</button>
        </div>
        <div className="studio-btn-row">
          <button onClick={() => { canvas.bringObjectToFront(obj); canvas.renderAll(); snapshot?.() }} className="studio-sm-btn">To Front</button>
          <button onClick={() => { canvas.sendObjectToBack(obj); canvas.renderAll(); snapshot?.() }} className="studio-sm-btn">To Back</button>
        </div>
      </div>

      {/* Align */}
      <div className="studio-prop-group">
        <span className="studio-prop-label">Align on Canvas</span>
        <div className="studio-align-grid">
          {ALIGN_PRESETS.map(({ pos, label }) => (
            <button key={pos} onClick={() => alignTo(pos)} className="studio-align-btn" title={pos}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
