import { LockKeyhole, Mail, Scissors, AlertCircle, ArrowRight } from 'lucide-react'
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
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-ivory px-4 py-12 font-sans">
      <section className="flex w-full max-w-5xl flex-col md:flex-row overflow-hidden rounded-3xl border border-sand/60 bg-white shadow-xl shadow-walnut/5 animate-in fade-in zoom-in duration-500">
        
        {/* Left Side: Brand Panel */}
        <div className="md:w-5/12 bg-walnut p-10 text-ivory flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Subtle background textures */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-terracotta/10 rounded-full filter blur-3xl -z-0"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ivory text-walnut shadow-md border border-white/10 hover:scale-105 transition-transform">
              <Scissors size={22} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-serif font-extrabold tracking-tight text-white leading-[1.1]">
                Seller Workspace
              </h1>
              <p className="max-w-[280px] text-sm leading-relaxed text-ivory/70 font-semibold">
                Manage your base products, generate custom design print overlays using our AI design studio, and track sales in real-time.
              </p>
            </div>
          </div>

          <div className="mt-12 relative z-10 grid gap-3 text-xs font-bold text-ivory/90">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-terracotta shrink-0"></div>
              <span>Stripe Catalog Syncing</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-terracotta shrink-0"></div>
              <span>Advanced Design Studio</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-terracotta shrink-0"></div>
              <span>Escrow Protected Payouts</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-14 flex flex-col justify-center bg-white relative">
          <div className="absolute top-8 right-8 text-[10px] font-extrabold uppercase tracking-widest text-terracotta bg-terracotta/10 border border-terracotta/20 px-3 py-1 rounded-full hidden sm:block">
            Partner Portal
          </div>
          
          <div className="max-w-md w-full mx-auto">
            <div className="text-center md:text-left space-y-2 mb-8">
              <h2 className="text-2xl font-serif font-black text-walnut">Login to Workspace</h2>
              <p className="text-xs text-walnut/60 font-semibold">Enter your seller credentials to access the dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                    placeholder="seller@example.com"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Password</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                    <LockKeyhole size={16} />
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md shadow-walnut/10 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Enter Workspace <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-sand/30">
              <p className="text-xs text-walnut/60 font-semibold">
                New seller?{' '}
                <Link to="/register" className="font-bold text-terracotta hover:underline hover:text-orange-600 transition-colors">
                  Create a workspace account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}
