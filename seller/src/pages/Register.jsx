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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-950 text-white">
            <Scissors size={22} />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-teal-700">Seller registration</p>
            <h1 className="text-2xl font-black text-slate-950">Create your account</h1>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-800">Name</span>
            <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
              <UserRound size={18} className="text-slate-400" />
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                placeholder="Your name"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-800">Email</span>
            <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
              <Mail size={18} className="text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                placeholder="seller@example.com"
                required
              />
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-800">Password</span>
              <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  className="w-full min-w-0 border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  placeholder="Min 8 characters"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">Confirm</span>
              <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(event) => updateField('password_confirmation', event.target.value)}
                  className="w-full min-w-0 border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  placeholder="Repeat password"
                  required
                />
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-teal-800 disabled:bg-slate-300"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-black text-teal-700 hover:text-teal-900">
            Login
          </Link>
        </p>
      </section>
    </main>
  )
}
