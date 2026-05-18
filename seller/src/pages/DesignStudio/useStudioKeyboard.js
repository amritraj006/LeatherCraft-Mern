import { useEffect } from 'react'

/**
 * Registers keyboard shortcuts for the canvas editor.
 * Delete / Backspace  → delete selected object
 * Ctrl/Cmd + Z        → undo
 * Ctrl/Cmd + Shift+Z  → redo
 * Escape              → deselect
 * [ / ]               → send backward / bring forward
 */
export function useStudioKeyboard({ canvas, activeObject, deleteActive, undo, redo }) {
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName?.toLowerCase()
      // Don't intercept when typing into inputs
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return

      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
        e.preventDefault()
        deleteActive()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }

      if (e.key === 'Escape' && canvas) {
        canvas.discardActiveObject()
        canvas.renderAll()
      }

      if (e.key === '[' && canvas && activeObject) {
        e.preventDefault()
        canvas.sendObjectBackwards(activeObject)
        canvas.renderAll()
      }

      if (e.key === ']' && canvas && activeObject) {
        e.preventDefault()
        canvas.bringObjectForward(activeObject)
        canvas.renderAll()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canvas, activeObject, deleteActive, undo, redo])
}
