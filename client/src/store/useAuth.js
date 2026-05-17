import { create } from 'zustand'
import api from '../api/client'

export const useAuth = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('customer_user') || 'null'),
  token: localStorage.getItem('customer_token') || '',
  loading: false,
  error: '',

  login: async (email, password) => {
    set({ loading: true, error: '' })
    try {
      const response = await api.post('/login', { email, password })
      const { user, token } = response.data
      
      localStorage.setItem('customer_user', JSON.stringify(user))
      localStorage.setItem('customer_token', token)
      
      set({ user, token, loading: false })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.'
      set({ error: msg, loading: false })
      return false
    }
  },

  register: async (name, email, password, passwordConfirmation) => {
    set({ loading: true, error: '' })
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation || password
      })
      const { user, token } = response.data

      localStorage.setItem('customer_user', JSON.stringify(user))
      localStorage.setItem('customer_token', token)

      set({ user, token, loading: false })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.'
      set({ error: msg, loading: false })
      return false
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: '' })
    try {
      const response = await api.put('/user', profileData)
      const { user } = response.data

      localStorage.setItem('customer_user', JSON.stringify(user))
      set({ user, loading: false })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Profile update failed.'
      set({ error: msg, loading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('customer_user')
    localStorage.removeItem('customer_token')
    set({ user: null, token: '' })
  }
}))
