import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { User, Mail, Lock, AlertCircle, UserPlus } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [localError, setLocalError] = useState('')
  const navigate = useNavigate()
  
  const { register, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!name || !email || !password || !passwordConfirm) {
      setLocalError('All fields are required.')
      return
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.')
      return
    }

    if (password !== passwordConfirm) {
      setLocalError('Passwords do not match. Please try again.')
      return
    }
    
    const success = await register(name, email, password, passwordConfirm)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl border border-sand bg-white shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-walnut">Create Account</h1>
        <p className="text-xs text-walnut/60 font-semibold">
          Sign up to purchase printed wallets, bags & jackets with secure Stripe checkout.
        </p>
      </div>

      {(error || localError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Your Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40">
              <User size={14} />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amrit Raj"
              required
              className="w-full rounded-xl border border-sand bg-ivory pl-10 pr-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
            />
          </div>
        </div>

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
          <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Password (Min 8 characters)</label>
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

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Confirm Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40">
              <Lock size={14} />
            </span>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
          <UserPlus size={14} />
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-sand/20">
        <p className="text-xs text-walnut/60 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-terracotta hover:underline">
            Log In Here
          </Link>
        </p>
      </div>
    </div>
  )
}
