import { create } from 'zustand'

export const useCart = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('leathercraft_cart') || '[]'),

  addItem: (product, quantity = 1) => {
    const currentItems = get().items
    const existingIndex = currentItems.findIndex(i => i.product.id === product.id)

    let newItems = []
    if (existingIndex > -1) {
      newItems = currentItems.map((item, idx) => 
        idx === existingIndex 
          ? { ...item, quantity: Math.min(product.quantity, item.quantity + quantity) }
          : item
      )
    } else {
      newItems = [...currentItems, { product, quantity }]
    }

    set({ items: newItems })
    localStorage.setItem('leathercraft_cart', JSON.stringify(newItems))
  },

  removeItem: (productId) => {
    const newItems = get().items.filter(i => i.product.id !== productId)
    set({ items: newItems })
    localStorage.setItem('leathercraft_cart', JSON.stringify(newItems))
  },

  updateQuantity: (productId, quantity) => {
    const newItems = get().items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: Math.max(1, Math.min(item.product.quantity, quantity)) }
        : item
    )
    set({ items: newItems })
    localStorage.setItem('leathercraft_cart', JSON.stringify(newItems))
  },

  clearCart: () => {
    set({ items: [] })
    localStorage.removeItem('leathercraft_cart')
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  }
}))
