import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    
    const success = await login(email, password)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl border border-sand bg-white shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-walnut">Welcome Back!</h1>
        <p className="text-xs text-walnut/60 font-semibold">
          Log in to your account to buy printed leather wallets, bags & jackets.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40">
              <Mail size={14} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              required
              className="w-full rounded-xl border border-sand bg-ivory pl-10 pr-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40">
              <Lock size={14} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-sand bg-ivory pl-10 pr-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm disabled:opacity-50"
        >
          <LogIn size={14} />
          {loading ? 'Logging you in...' : 'Log In'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-sand/20">
        <p className="text-xs text-walnut/60 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-terracotta hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  )
}
