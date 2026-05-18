import { LockKeyhole, Mail, Scissors, UserRound, AlertCircle, ArrowRight, Palette, LineChart } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiError } from '../api/client'
import { useAuth } from '../context/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(form)
      navigate('/dashboard')
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-ivory px-4 py-12 font-sans">
      <section className="flex w-full max-w-5xl flex-col md:flex-row-reverse overflow-hidden rounded-3xl border border-sand/60 bg-white shadow-xl shadow-walnut/5 animate-in fade-in zoom-in duration-500">
        
        {/* Right Side: Brand Panel */}
        <div className="md:w-5/12 bg-ivory p-10 text-walnut flex flex-col justify-between relative overflow-hidden hidden md:flex border-l border-sand/40">
          {/* Subtle background textures */}
          <div className="absolute bottom-0 right-0 h-64 w-64 bg-olive/10 rounded-full filter blur-3xl -z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-walnut text-ivory shadow-md border border-sand/50 hover:scale-105 transition-transform">
              <Scissors size={22} />
            </div>
            
            <div className="space-y-4 pt-8">
              <h1 className="text-3xl font-serif font-extrabold tracking-tight text-walnut leading-[1.1]">
                Become a Partner
              </h1>
              <p className="text-sm leading-relaxed text-walnut/60 font-semibold max-w-[280px]">
                Join LeatherCraft's exclusive seller network. Create bespoke designs and sell premium leather goods directly to customers.
              </p>
            </div>
          </div>

          <div className="mt-12 relative z-10 grid gap-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-sand/50 text-olive"><Palette size={16} /></div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-walnut">Advanced Design Tool</h4>
                <p className="text-[11px] font-semibold text-walnut/50 mt-1">Professional canvas editor with layers & AI overlays.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-sand/50 text-terracotta"><LineChart size={16} /></div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-walnut">Sales Analytics</h4>
                <p className="text-[11px] font-semibold text-walnut/50 mt-1">Track conversions and payouts effortlessly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-14 flex flex-col justify-center bg-white relative">
          <div className="absolute top-8 left-8 text-[10px] font-extrabold uppercase tracking-widest text-terracotta bg-terracotta/10 border border-terracotta/20 px-3 py-1 rounded-full hidden sm:block">
            Partner Portal
          </div>
          
          <div className="max-w-md w-full mx-auto">
            <div className="text-center md:text-left space-y-2 mb-8 mt-4 sm:mt-0">
              <h2 className="text-2xl font-serif font-black text-walnut">Create Workspace</h2>
              <p className="text-xs text-walnut/60 font-semibold">Fill in your details to set up your seller account.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Full Name</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                    <UserRound size={16} />
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Amrit Raj"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="seller@example.com"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Password</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                      <LockKeyhole size={16} />
                    </span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(event) => updateField('password', event.target.value)}
                      placeholder="Min 8 chars"
                      required
                      className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Confirm</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                      <LockKeyhole size={16} />
                    </span>
                    <input
                      type="password"
                      value={form.password_confirmation}
                      onChange={(event) => updateField('password_confirmation', event.target.value)}
                      placeholder="Repeat"
                      required
                      className="w-full rounded-xl border border-sand bg-ivory/50 pl-11 pr-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 text-walnut transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md shadow-walnut/10 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Creating workspace...' : (
                  <>
                    Register Workspace <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-sand/30">
              <p className="text-xs text-walnut/60 font-semibold">
                Already have a workspace?{' '}
                <Link to="/login" className="font-bold text-terracotta hover:underline hover:text-orange-600 transition-colors">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}
