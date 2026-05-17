import { create } from 'zustand'
import api from '../api/client'

export const useNotifications = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  
  fetchNotifications: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/notifications')
      set({ notifications: response.data.notifications || [] })
    } catch (err) {
      set({ error: 'Failed to load notifications' })
    } finally {
      set({ loading: false })
    }
  },
  
  markAllAsRead: async () => {
    try {
      await api.patch('/notifications/read-all')
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true }))
      }))
    } catch (err) {
      console.error(err)
    }
  },
  
  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n)
      }))
    } catch (err) {
      console.error(err)
    }
  }
}))
