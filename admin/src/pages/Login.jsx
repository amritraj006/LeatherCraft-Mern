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
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 relative overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 z-10 relative">
        <div className="mb-8 text-center flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg mb-4">
            <Scissors size={24} className="rotate-90" />
          </span>
          <h1 className="text-3xl font-serif font-extrabold tracking-tight text-slate-800">LeatherCraft</h1>
          <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-widest font-serif">Access LeatherCraft Administration Panel</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 px-3.5 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all font-semibold"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-400 uppercase tracking-wider">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/60 px-3.5 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all font-semibold"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 shadow-md shadow-slate-950/10 hover:shadow-lg hover:shadow-slate-950/20 active:scale-[0.99] mt-2"
          >
            {loading ? 'Authenticating...' : 'Secure Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
