import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import api from '../api/client'
import { User, ShieldCheck, Camera, Trash2 } from 'lucide-react'

export default function Account() {
  const { user, setUser } = useAuth()
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
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
      setUser(data.user)
      
      // Clear passwords
      setForm(prev => ({ ...prev, password: '', password_confirmation: '' }))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update account.')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatarLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const { data } = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setSuccess('Profile image updated successfully.')
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload profile image.')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    setAvatarLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data } = await api.delete('/user/avatar')
      setSuccess('Profile image removed successfully.')
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to remove profile image.')
    } finally {
      setAvatarLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 h-64 w-64 bg-terracotta/5 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group flex h-20 w-20 items-center justify-center rounded-full bg-walnut text-ivory shadow-md border border-sand/40 overflow-hidden cursor-pointer flex-shrink-0">
            {avatarLoading ? (
              <span className="h-6 w-6 border-2 border-ivory border-t-transparent rounded-full animate-spin"></span>
            ) : user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={32} />
            )}
            <label className="absolute inset-0 bg-walnut/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera size={18} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-serif font-black text-walnut tracking-tight">Account Settings</h1>
            <p className="text-xs text-walnut/60 mt-2 font-semibold">Manage your seller profile, update your secure password, and maintain your store identity.</p>
            {user?.avatar_url && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={avatarLoading}
                className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-rose-600 hover:text-rose-700 transition"
              >
                <Trash2 size={10} /> Remove Profile Image
              </button>
            )}
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-2xl border border-olive/30 bg-olive/5 px-6 py-4 text-xs font-bold text-olive shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-olive animate-pulse"></div>
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold text-rose-700 shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-sand/60 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 md:p-10 flex-1 space-y-8">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-terracotta" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-walnut">Personal Information</h3>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-walnut/50">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sand bg-ivory/50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all text-walnut"
                  required
                />
              </div>
              
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sand bg-ivory/50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all text-walnut"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-sand/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-olive" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-walnut">Security Settings</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-walnut/40 bg-sand/10 px-3 py-1.5 rounded-full border border-sand/30 shadow-sm">
                Leave blank to keep current password
              </span>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-walnut/50">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sand bg-ivory/50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all text-walnut"
                  minLength={8}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-walnut/50">Confirm Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-sand bg-ivory/50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition-all text-walnut"
                  minLength={8}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-ivory/30 px-8 py-6 border-t border-sand/30 flex justify-end">
          <button
            type="submit"
            disabled={loading || (form.password && form.password !== form.password_confirmation)}
            className="rounded-xl bg-walnut px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-walnut/90 hover:-translate-y-0.5 disabled:bg-sand disabled:text-walnut/50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
