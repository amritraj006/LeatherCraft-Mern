import { LockKeyhole, Mail, Scissors } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiError } from '../api/client'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(form)
      navigate('/dashboard')
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12 font-sans">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-sand bg-white shadow-lg lg:grid-cols-[0.95fr_1.05fr] animate-in fade-in zoom-in duration-500">
        
        {/* Left Side: Brand Panel */}
        <div className="bg-walnut p-8 text-ivory sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-terracotta/10 rounded-full filter blur-3xl -z-0"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta text-white shadow-md border border-white/10">
              <Scissors size={22} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight text-white leading-tight">
                Seller Workspace
              </h1>
              <p className="max-w-md text-xs sm:text-sm leading-relaxed text-ivory/70 font-semibold">
                List base products, generate custom design print overlays using our AI design studio, and keep approved leather creations in one unified hub.
              </p>
            </div>
          </div>

          <div className="mt-12 relative z-10 grid gap-3.5 text-xs font-bold text-ivory/90">
            <div className="flex items-center gap-3 rounded-xl border border-sand/15 bg-white/5 px-4 py-3.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-terracotta"></span>
              <span>Stripe Integrated Catalog Syncing</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-sand/15 bg-white/5 px-4 py-3.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-terracotta"></span>
              <span>Generative AI Design Overlay Studio</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-sand/15 bg-white/5 px-4 py-3.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-terracotta"></span>
              <span>Escrow Protected Real-time Payouts</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta bg-terracotta/10 border border-terracotta/20 px-3 py-1 rounded-full">
              Partner Portal
            </span>
            <h2 className="mt-4 text-2xl font-serif font-bold text-walnut">Login to Workspace</h2>
            <p className="text-xs text-walnut/50 mt-1 font-semibold">Enter your seller credentials to continue to your dashboard.</p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-walnut/50">Email Address</span>
              <span className="flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3.5 py-2.5 transition-all focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/10">
                <Mail size={16} className="text-walnut/40" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                  className="w-full border-0 bg-transparent text-xs font-semibold text-walnut outline-none placeholder:text-walnut/30"
                  placeholder="seller@example.com"
                  required
                />
              </span>
            </label>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-walnut/50">Password</span>
              <span className="flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3.5 py-2.5 transition-all focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/10">
                <LockKeyhole size={16} className="text-walnut/40" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
                  className="w-full border-0 bg-transparent text-xs font-semibold text-walnut outline-none placeholder:text-walnut/30"
                  placeholder="••••••••"
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-walnut py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-walnut/90 disabled:opacity-50 mt-2"
            >
              {loading ? 'Logging in...' : 'Enter Workspace'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-walnut/50 font-semibold border-t border-sand/20 pt-6">
            New seller?{' '}
            <Link to="/register" className="font-bold text-terracotta hover:underline">
              Create a workspace account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
