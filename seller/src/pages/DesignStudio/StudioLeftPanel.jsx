import * as fabric from 'fabric'
import {
  Circle, ImageIcon, Minus, Move, Pencil,
  Square, Triangle, Type
} from 'lucide-react'

const TOOLS = [
  { id: 'select', Icon: Move, label: 'Select (V)' },
  { id: 'text', Icon: Type, label: 'Text (T)' },
  { id: 'image', Icon: ImageIcon, label: 'Image (I)' },
  { id: 'rect', Icon: Square, label: 'Rectangle (R)' },
  { id: 'circle', Icon: Circle, label: 'Circle (C)' },
  { id: 'triangle', Icon: Triangle, label: 'Triangle' },
  { id: 'line', Icon: Minus, label: 'Line (L)' },
  { id: 'draw', Icon: Pencil, label: 'Draw (D)' },
]

export default function StudioLeftPanel({ canvas, activeTool, setActiveTool, snapshot, imageInputRef }) {
  function selectTool(toolId) {
    if (!canvas) return
    setActiveTool(toolId)

    // Configure canvas drawing mode
    if (toolId === 'draw') {
      canvas.isDrawingMode = true
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
      }
      canvas.freeDrawingBrush.width = 4
      canvas.freeDrawingBrush.color = '#4A3228'
    } else {
      canvas.isDrawingMode = false
    }

    // Immediately act for shape/text tools
    if (toolId === 'text') addText(canvas, snapshot)
    if (toolId === 'rect') addRect(canvas, snapshot)
    if (toolId === 'circle') addCircle(canvas, snapshot)
    if (toolId === 'triangle') addTriangle(canvas, snapshot)
    if (toolId === 'line') addLine(canvas, snapshot)
    if (toolId === 'image') imageInputRef.current?.click()

    // After adding a shape, switch back to select
    if (['text', 'rect', 'circle', 'triangle', 'line'].includes(toolId)) {
      setTimeout(() => setActiveTool('select'), 50)
    }
  }

  return (
    <div className="studio-left-panel">
      {TOOLS.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => selectTool(id)}
          title={label}
          className={`studio-tool-btn ${activeTool === id ? 'studio-tool-btn--active' : ''}`}
        >
          <Icon size={18} />
          <span className="studio-tool-label">{label.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Shape factories ────────────────────────────────────────────────────────

export function addText(canvas, snapshot) {
  const text = new fabric.IText('Edit me', {
    left: 150, top: 150,
    fontFamily: 'Outfit',
    fill: '#4A3228',
    fontSize: 36,
    fontWeight: 'bold',
  })
  canvas.add(text)
  canvas.setActiveObject(text)
  canvas.renderAll()
  snapshot?.()
}

export function addRect(canvas, snapshot) {
  const rect = new fabric.Rect({
    left: 120, top: 120,
    width: 180, height: 120,
    fill: '#C96A3D',
    rx: 8, ry: 8,
    stroke: 'transparent', strokeWidth: 0,
  })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.renderAll()
  snapshot?.()
}

export function addCircle(canvas, snapshot) {
  const circle = new fabric.Circle({
    left: 150, top: 130,
    radius: 70,
    fill: '#66734F',
    stroke: 'transparent', strokeWidth: 0,
  })
  canvas.add(circle)
  canvas.setActiveObject(circle)
  canvas.renderAll()
  snapshot?.()
}

export function addTriangle(canvas, snapshot) {
  const tri = new fabric.Triangle({
    left: 140, top: 110,
    width: 160, height: 140,
    fill: '#D8C3A5',
    stroke: 'transparent', strokeWidth: 0,
  })
  canvas.add(tri)
  canvas.setActiveObject(tri)
  canvas.renderAll()
  snapshot?.()
}

export function addLine(canvas, snapshot) {
  const line = new fabric.Line([100, 200, 400, 200], {
    stroke: '#4A3228', strokeWidth: 3,
    selectable: true,
  })
  canvas.add(line)
  canvas.setActiveObject(line)
  canvas.renderAll()
  snapshot?.()
}
