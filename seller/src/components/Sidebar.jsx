import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import NotificationBell from './NotificationBell'
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

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Template', icon: Upload },
  { to: '/products', label: 'Base Materials', icon: Package },
  { to: '/studio', label: 'Design Studio', icon: WandSparkles },
  { to: '/designs', label: 'Designs Gallery', icon: Images },
  { to: '/sales', label: 'Sales Records', icon: DollarSign },
  { to: '/account', label: 'My Account', icon: User },
]

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) => [
    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200',
    isActive
      ? 'bg-walnut text-white shadow-sm shadow-walnut/20 translate-x-1'
      : 'text-walnut/70 hover:bg-sand/20 hover:text-walnut',
  ].join(' ')

  return (
    <>
      {/* Mobile Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-sand/30 bg-white/90 backdrop-blur-md px-4 md:hidden fixed top-0 w-full z-30">
        <NavLink to="/dashboard" className="flex items-center gap-2 text-walnut">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-walnut text-white shadow-md">
            <Scissors size={16} className="rotate-90 text-sand" />
          </span>
          <span className="block text-sm font-serif font-extrabold tracking-tight">LeatherCraft</span>
        </NavLink>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sand bg-white text-walnut hover:bg-sand/10"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-walnut/30 backdrop-blur-sm md:hidden transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar Panel Container */}
      <aside
        className={`w-64 border-r border-sand/40 bg-white/95 backdrop-blur-md md:bg-white/70 flex flex-col z-50 md:z-10 shadow-sm fixed md:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-sand/30 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-3 text-walnut group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-walnut text-white shadow-md transition-transform group-hover:scale-105">
              <Scissors size={20} className="rotate-90 text-sand" />
            </span>
            <div>
              <span className="block text-sm font-serif font-extrabold tracking-tight text-walnut leading-none">LeatherCraft</span>
              <span className="inline-flex items-center gap-1 rounded bg-terracotta/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-terracotta border border-terracotta/20 mt-1.5">
                Seller Studio
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sand/15 text-walnut/70"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* User Block & Logout */}
        <div className="p-4 border-t border-sand/30 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sand/20 border border-sand/40 text-walnut font-semibold uppercase">
                {user?.name?.[0] || 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-walnut truncate leading-none">{user?.name}</p>
                <p className="text-[10px] font-semibold text-terracotta uppercase tracking-widest mt-1">Merchant</p>
              </div>
            </div>
            <NotificationBell />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-150"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
