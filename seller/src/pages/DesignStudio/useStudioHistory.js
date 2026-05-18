import { useCallback, useRef, useState } from 'react'

/**
 * Undo / Redo history for a Fabric.js canvas.
 * Call `snapshot()` after every user-initiated change.
 * Compatible with Fabric v6 (Promise-based loadFromJSON).
 */
export function useStudioHistory(canvas) {
  const [historyIndex, setHistoryIndex] = useState(-1)
  const history = useRef([])
  const isRestoring = useRef(false)

  const snapshot = useCallback(() => {
    if (!canvas || isRestoring.current) return
    const json = canvas.toJSON(['id', 'selectable', 'evented', '_isGrid'])
    // Discard any "future" states when a new action is made
    history.current = history.current.slice(0, historyIndex + 1)
    history.current.push(json)
    setHistoryIndex(history.current.length - 1)
  }, [canvas, historyIndex])

  const undo = useCallback(async () => {
    if (!canvas || historyIndex <= 0) return
    const prev = historyIndex - 1
    isRestoring.current = true
    try {
      await canvas.loadFromJSON(history.current[prev])
      canvas.renderAll()
      setHistoryIndex(prev)
    } finally {
      isRestoring.current = false
    }
  }, [canvas, historyIndex])

  const redo = useCallback(async () => {
    if (!canvas || historyIndex >= history.current.length - 1) return
    const next = historyIndex + 1
    isRestoring.current = true
    try {
      await canvas.loadFromJSON(history.current[next])
      canvas.renderAll()
      setHistoryIndex(next)
    } finally {
      isRestoring.current = false
    }
  }, [canvas, historyIndex])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.current.length - 1

  return { snapshot, undo, redo, canUndo, canRedo }
}
