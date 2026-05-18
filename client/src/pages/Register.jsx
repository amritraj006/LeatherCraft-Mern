import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { User, Mail, Lock, AlertCircle, UserPlus, Store, Heart, Truck } from 'lucide-react'

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
      navigate('/shop')
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-walnut/5 border border-sand/40 overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Right Side: Brand Showcase */}
        <div className="md:w-5/12 bg-ivory p-10 text-walnut flex flex-col justify-between relative overflow-hidden hidden md:flex border-l border-sand/40">
          <div className="absolute bottom-0 right-0 h-64 w-64 bg-terracotta/5 rounded-full filter blur-3xl -z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-walnut text-white shadow-md hover:scale-105 transition-transform">
              <Store size={22} />
            </Link>
            
            <div className="space-y-4 pt-8">
              <h1 className="text-3xl font-serif font-extrabold tracking-tight text-walnut leading-tight">
                Join the LeatherCraft Club
              </h1>
              <p className="text-sm leading-relaxed text-walnut/60 font-semibold max-w-sm">
                Create an account to start shopping premium bespoke leather goods directly from verified artisans.
              </p>
            </div>
          </div>

          <div className="mt-12 relative z-10 grid gap-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-sand/50 text-terracotta"><Heart size={16} /></div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-walnut">Save Favorites</h4>
                <p className="text-[11px] font-semibold text-walnut/50 mt-1">Keep track of the designs you love.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-sand/50 text-olive"><Truck size={16} /></div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-walnut">Track Orders</h4>
                <p className="text-[11px] font-semibold text-walnut/50 mt-1">Real-time updates on your deliveries.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side: Form Panel */}
        <div className="md:w-7/12 p-8 sm:p-14 flex flex-col justify-center bg-white relative">
          <div className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-walnut/40 hidden sm:block">
            Customer Portal
          </div>
          
          <div className="max-w-md w-full mx-auto">
            <div className="text-center md:text-left space-y-2 mb-8 mt-4 sm:mt-0">
              <h2 className="text-2xl font-serif font-black text-walnut">Create Account</h2>
              <p className="text-xs text-walnut/60 font-semibold">Fill in your details to get started.</p>
            </div>

            {(error || localError) && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-start gap-2 animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
                <span>{localError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Full Name</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-walnut/40 transition-colors group-focus-within:text-terracotta">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
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
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
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
                {loading ? 'Creating...' : (
                  <>
                    Sign Up <UserPlus size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-sand/30">
              <p className="text-xs text-walnut/60 font-semibold mb-2">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-terracotta hover:underline hover:text-orange-600 transition-colors">
                  Log in instead
                </Link>
              </p>
              <p className="text-[10px] text-walnut/40 font-semibold uppercase tracking-wider">
                Want to sell your designs?{' '}
                <a href="http://localhost:5173/register" className="font-bold text-walnut/80 hover:text-walnut hover:underline transition-colors">
                  Signup as Seller
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
