import {
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Upload,
  WandSparkles,
  X,
  DollarSign,
  User,
  Package
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/products', label: 'Base Materials', icon: Package },
  { to: '/studio', label: 'Design Studio', icon: WandSparkles },
  { to: '/designs', label: 'Designs', icon: Images },
  { to: '/sales', label: 'Sales', icon: DollarSign },
  { to: '/account', label: 'Account', icon: User },
]

function linkClass({ isActive }) {
  return [
    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-teal-700 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ')
}

export default function Navbar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-md transition-all">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="flex items-center gap-3 text-slate-950 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-md transition-transform group-hover:scale-105">
            <Scissors size={20} />
          </span>
          <span>
            <span className="block text-base font-serif font-extrabold tracking-tight">LeatherCraft</span>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller Studio</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-1.5 md:flex bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                <Icon size={16} />
                {link.label}
              </NavLink>
            )
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</p>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{user?.role}</p>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 border border-slate-200 shadow-sm"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50 transition"
          title="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-3 md:hidden absolute w-full shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon

              return (
                 <NavLink
                  key={link.to}
                  to={link.to}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={17} />
                  {link.label}
                </NavLink>
              )
            })}
            <div className="h-px w-full bg-slate-100 my-2"></div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 border border-rose-100"
            >
              <LogOut size={17} />
              Secure Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
