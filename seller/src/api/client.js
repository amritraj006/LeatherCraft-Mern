import axios from 'axios'

const TOKEN_KEY = 'leathercraft_seller_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Automatically handle 401 Unauthorized responses to clear stale sessions
api.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.location.href = '/login'
    }
  }
  return Promise.reject(error)
})

export function getApiError(error) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  const validation = error.response?.data?.errors

  if (validation) {
    return Object.values(validation).flat().join(' ')
  }

  return 'Something went wrong. Please try again.'
}

export { TOKEN_KEY }
export default api
