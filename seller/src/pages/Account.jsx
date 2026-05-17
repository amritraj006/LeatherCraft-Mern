import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import { User } from 'lucide-react'

export default function Account() {
  const { user } = useAuth()
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data } = await api.put('/user', form)
      setSuccess('Account details updated successfully.')
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Clear passwords
      setForm(prev => ({ ...prev, password: '', password_confirmation: '' }))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="relative flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Account Settings</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Manage your seller profile and update your secure password.</p>
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-xs font-semibold text-emerald-800 shadow-sm flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs font-semibold text-rose-800 shadow-sm flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all bg-slate-50 focus:bg-white text-slate-700"
                required
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all bg-slate-50 focus:bg-white text-slate-700"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-6 flex items-center justify-between">
              Security Settings
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/50">Leave blank to keep current password</span>
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50 focus:bg-white text-slate-700"
                  minLength={8}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Confirm Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all bg-slate-50 focus:bg-white text-slate-700"
                  minLength={8}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading || (form.password && form.password !== form.password_confirmation)}
            className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
