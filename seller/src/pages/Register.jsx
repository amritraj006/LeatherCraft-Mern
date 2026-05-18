import { LockKeyhole, Mail, Scissors, UserRound } from 'lucide-react'
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
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12 font-sans">
      <section className="w-full max-w-xl rounded-3xl border border-sand bg-white p-8 shadow-lg sm:p-10 animate-in fade-in zoom-in duration-500">
        
        {/* Header Block */}
        <div className="flex items-center gap-3.5 border-b border-sand/20 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-walnut text-ivory shadow-md border border-sand/50">
            <Scissors size={20} />
          </div>
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-terracotta bg-terracotta/10 border border-terracotta/20 px-2.5 py-0.5 rounded-full">
              Seller Registration
            </span>
            <h1 className="text-2xl font-serif font-bold text-walnut mt-1.5">Create Seller Workspace</h1>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Name Input */}
          <label className="block space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-walnut/50">Full Name</span>
            <span className="flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3.5 py-2.5 transition-all focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/10">
              <UserRound size={16} className="text-walnut/40" />
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full border-0 bg-transparent text-xs font-semibold text-walnut outline-none placeholder:text-walnut/30"
                placeholder="Amrit Raj"
                required
              />
            </span>
          </label>

          {/* Email Input */}
          <label className="block space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-walnut/50">Email Address</span>
            <span className="flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3.5 py-2.5 transition-all focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/10">
              <Mail size={16} className="text-walnut/40" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="w-full border-0 bg-transparent text-xs font-semibold text-walnut outline-none placeholder:text-walnut/30"
                placeholder="seller@example.com"
                required
              />
            </span>
          </label>

          {/* Password Blocks in Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Password */}
            <label className="block space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-walnut/50">Password</span>
              <span className="flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3.5 py-2.5 transition-all focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/10">
                <LockKeyhole size={16} className="text-walnut/40" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  className="w-full min-w-0 border-0 bg-transparent text-xs font-semibold text-walnut outline-none placeholder:text-walnut/30"
                  placeholder="Min 8 chars"
                  required
                />
              </span>
            </label>

            {/* Confirm */}
            <label className="block space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-walnut/50">Confirm Password</span>
              <span className="flex items-center gap-2 rounded-xl border border-sand bg-ivory/50 px-3.5 py-2.5 transition-all focus-within:border-terracotta focus-within:ring-4 focus-within:ring-terracotta/10">
                <LockKeyhole size={16} className="text-walnut/40" />
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(event) => updateField('password_confirmation', event.target.value)}
                  className="w-full min-w-0 border-0 bg-transparent text-xs font-semibold text-walnut outline-none placeholder:text-walnut/30"
                  placeholder="Repeat password"
                  required
                />
              </span>
            </label>
            
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-walnut py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-walnut/90 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating workspace...' : 'Register Workspace'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-walnut/50 font-semibold border-t border-sand/20 pt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-terracotta hover:underline">
            Log In here
          </Link>
        </p>
      </section>
    </main>
  )
}
