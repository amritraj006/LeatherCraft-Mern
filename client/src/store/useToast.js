import { create } from 'zustand'

export const useToast = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }))
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, 4000)
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }
}))
