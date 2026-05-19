import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { Scissors } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/login', { email, password })
      if (data.user?.role !== 'admin') {
        throw new Error('Not an admin account.')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory/50 relative overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-10 z-10 relative border border-sand/40 shadow-xl shadow-walnut/5 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-10 text-center flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-walnut text-white shadow-lg shadow-walnut/20 mb-5 hover:scale-105 transition-transform duration-300">
            <Scissors size={26} className="rotate-90 text-sand" />
          </span>
          <h1 className="text-3xl font-serif font-black text-walnut tracking-tight">LeatherCraft</h1>
          <div className="mt-2.5 inline-flex items-center gap-1 rounded bg-terracotta/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-terracotta border border-terracotta/25">
            Admin HQ
          </div>
          <p className="mt-4 text-xs font-semibold text-walnut/50 uppercase tracking-wider max-w-xs">
            Securely authorize into the administration control desk.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200/40 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-walnut/50 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-sand bg-ivory/50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all font-semibold text-walnut"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-walnut/50 uppercase tracking-widest">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-sand bg-ivory/50 px-4 py-3 text-sm outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all font-semibold text-walnut"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-walnut hover:bg-walnut/90 px-4 py-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-md shadow-walnut/15 hover:shadow-lg hover:shadow-walnut/25 active:translate-y-[1px] disabled:opacity-50 disabled:translate-y-0 mt-4 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Secure Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
