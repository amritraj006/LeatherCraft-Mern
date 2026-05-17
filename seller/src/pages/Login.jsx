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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-950 p-8 text-white sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-500 text-slate-950">
            <Scissors size={24} />
          </div>
          <h1 className="mt-8 text-3xl font-black tracking-normal">Seller workspace</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Manage product uploads, add manual concepts, and keep approved leather designs in one place.
          </p>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-200">
            <span className="rounded-md border border-white/10 px-4 py-3">Cloud image storage</span>
            <span className="rounded-md border border-white/10 px-4 py-3">JWT protected APIs</span>
            <span className="rounded-md border border-white/10 px-4 py-3">Manual design comparisons</span>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-teal-700">Welcome back</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Login to continue</h2>
          </div>

          {error && (
            <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-800">Email</span>
              <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
                  className="w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  placeholder="seller@example.com"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">Password</span>
              <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
                  className="w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  placeholder="Your password"
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-teal-800 disabled:bg-slate-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New seller?{' '}
            <Link to="/register" className="font-black text-teal-700 hover:text-teal-900">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
