import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { Mail, Lock, AlertCircle, LogIn, Store, ShieldCheck, Sparkles } from 'lucide-react'

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
      navigate('/shop')
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-walnut/5 border border-sand/40 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand Showcase */}
        <div className="md:w-5/12 bg-walnut p-10 text-ivory flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Subtle background textures */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-terracotta/10 rounded-full filter blur-3xl -z-0"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ivory text-walnut shadow-md border border-white/10 hover:scale-105 transition-transform">
              <Store size={22} />
            </Link>
            
            <div className="space-y-4 pt-8">
              <h1 className="text-3xl font-serif font-extrabold tracking-tight text-white leading-tight">
                Welcome Back to LeatherCraft
              </h1>
              <p className="text-sm leading-relaxed text-ivory/70 font-semibold max-w-sm">
                Sign in to explore bespoke leather wallets, premium bags, and signature jackets customized by verified artisans.
              </p>
            </div>
          </div>

          <div className="mt-12 relative z-10 grid gap-4 text-xs font-bold text-ivory/90">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"><ShieldCheck size={14} className="text-terracotta" /></div>
              <span>Secure Stripe Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm"><Sparkles size={14} className="text-terracotta" /></div>
              <span>Curated Custom Designs</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-14 flex flex-col justify-center bg-white relative">
          <div className="absolute top-8 right-8 text-xs font-bold uppercase tracking-widest text-walnut/40 hidden sm:block">
            Customer Portal
          </div>
          
          <div className="max-w-md w-full mx-auto">
            <div className="text-center md:text-left space-y-2 mb-8">
              <h2 className="text-2xl font-serif font-black text-walnut">Sign In</h2>
              <p className="text-xs text-walnut/60 font-semibold">Enter your email and password to access your account.</p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Password</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Sign In <LogIn size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-sand/30">
              <p className="text-xs text-walnut/60 font-semibold">
                New to LeatherCraft?{' '}
                <Link to="/register" className="font-bold text-terracotta hover:underline hover:text-orange-600 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
