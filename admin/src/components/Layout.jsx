import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag, LogOut, Scissors, Menu, X } from 'lucide-react'

import ToastContainer from './ToastContainer'
import NotificationBell from './NotificationBell'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products Review', path: '/products', icon: ShoppingBag },
    { name: 'Sellers Directory', path: '/sellers', icon: Users },
  ]

  return (
    <div className="flex h-screen bg-ivory/30 overflow-hidden relative font-sans">
      <ToastContainer />
      {/* Mobile Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-sand/35 bg-white/90 backdrop-blur-md px-4 md:hidden fixed top-0 w-full z-30">
        <Link to="/dashboard" className="flex items-center gap-2 text-walnut">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-walnut text-white shadow-md">
            <Scissors size={16} className="rotate-90 text-sand" />
          </span>
          <span className="block text-sm font-serif font-black tracking-tight">LeatherCraft</span>
          <span className="inline-flex items-center gap-1 rounded bg-terracotta/10 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-terracotta border border-terracotta/20">
            Admin HQ
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sand bg-white text-walnut hover:bg-sand/10 transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-walnut/30 backdrop-blur-sm md:hidden transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`w-64 border-r border-sand/35 bg-white/95 backdrop-blur-md md:bg-white/70 flex flex-col z-50 md:z-10 shadow-sm fixed md:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-sand/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-walnut text-white shadow-md shadow-walnut/15">
              <Scissors size={20} className="rotate-90 text-sand" />
            </span>
            <div>
              <h1 className="text-lg font-serif font-black tracking-tight text-walnut leading-none">LeatherCraft</h1>
              <span className="inline-flex items-center gap-1 rounded bg-terracotta/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-terracotta border border-terracotta/20 mt-1.5">
                Admin HQ
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sand/15 text-walnut/70 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-250 cursor-pointer ${
                  isActive
                    ? 'bg-walnut text-white shadow-md shadow-walnut/15 translate-x-1'
                    : 'text-walnut/60 hover:bg-sand/15 hover:text-walnut hover:translate-x-1'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={16} className={isActive ? 'text-sand' : 'text-walnut/40'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sand/20 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-walnut text-sand border border-sand/35 font-bold uppercase text-xs shadow-sm">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-walnut truncate leading-none">Admin User</p>
                <p className="text-[9px] font-black text-terracotta uppercase tracking-widest mt-1">Superuser</p>
              </div>
            </div>
            <NotificationBell />
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 px-3 py-3 rounded-xl text-[10px] font-bold tracking-wider uppercase text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-200/35 cursor-pointer"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0 relative">
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
