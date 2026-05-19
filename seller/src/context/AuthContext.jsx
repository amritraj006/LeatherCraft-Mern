import { useCallback, useEffect, useMemo, useState } from 'react'
import api, { TOKEN_KEY } from '../api/client'
import AuthContext from './authContext'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(Boolean(token))

  useEffect(() => {
    let active = true

    async function loadUser() {
      if (!token) {
        setInitializing(false)
        return
      }

      try {
        const { data } = await api.get('/user')

        if (active) {
          setUser(data.user)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)

        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) {
          setInitializing(false)
        }
      }
    }

    loadUser()

    return () => {
      active = false
    }
  }, [token])

  function persistSession(authPayload) {
    localStorage.setItem(TOKEN_KEY, authPayload.token)
    setToken(authPayload.token)
    setUser(authPayload.user)
  }

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/login', credentials)
    persistSession(data)
    return data.user
  }, [])

  const register = useCallback(async (values) => {
    const { data } = await api.post('/register', values)
    persistSession(data)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      initializing,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      register,
      token,
      user,
      setUser,
    }),
    [initializing, login, logout, register, token, user, setUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
