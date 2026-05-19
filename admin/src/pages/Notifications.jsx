import { useEffect } from 'react'
import { useNotifications } from '../store/useNotifications'
import { Bell, Check, ShoppingBag, ShieldCheck, Sparkles, Info, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Notifications() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const { notifications, fetchNotifications, markAllAsRead, markAsRead, loading } = useNotifications()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [fetchNotifications])

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-4">
        <Bell size={40} className="text-sand animate-bounce" />
        <h2 className="text-xl font-bold text-walnut">Please Login to view notifications</h2>
        <Link to="/" className="px-6 py-2.5 rounded-xl bg-walnut text-white font-bold text-xs uppercase tracking-wider hover:bg-walnut/90 transition-all">
          Login now
        </Link>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag size={18} className="text-emerald-600" />
      case 'approval':
        return <ShieldCheck size={18} className="text-olive" />
      case 'listing':
        return <Sparkles size={18} className="text-terracotta" />
      default:
        return <Info size={18} className="text-walnut/40" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-500">
      {/* Header breadcrumb bar */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-walnut/60 hover:text-walnut transition-colors uppercase tracking-widest">
          <ArrowLeft size={14} className="text-terracotta" /> Back to Dashboard
        </Link>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand bg-white text-[10px] font-bold uppercase tracking-widest text-walnut hover:bg-sand/10 transition-all cursor-pointer shadow-sm"
          >
            <Check size={12} className="text-olive" /> Mark all read
          </button>
        )}
      </div>

      {/* Hero Title */}
      <div className="p-8 rounded-3xl border border-sand/40 bg-white shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-bold text-terracotta uppercase tracking-widest">Admin Control Desk</span>
          <h1 className="text-3xl font-serif font-black text-walnut tracking-tight flex items-center gap-2">
            <Bell size={28} className="text-terracotta animate-pulse" />
            Notifications Hub
          </h1>
          <p className="text-xs text-walnut/50 font-semibold">
            Track real-time partner product submissions, client checkout events & Stripe commissions.
          </p>
        </div>

        <div className="h-fit px-4 py-2.5 rounded-2xl bg-sand/10 border border-sand/30 flex items-center gap-3 relative z-10">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-[10px] font-bold text-walnut uppercase tracking-widest">
            {unreadCount} Unread Alerts
          </span>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-sand border-t-terracotta"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-sand/40 shadow-sm flex flex-col items-center justify-center gap-3">
            <Bell size={32} className="text-sand" />
            <h3 className="font-bold text-walnut text-sm uppercase tracking-wider">Your Inbox is Empty</h3>
            <p className="text-xs text-walnut/40 max-w-sm">
              Any seller product submissions, buyer checkout logs or escrow payouts will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-sand/30 shadow-sm overflow-hidden divide-y divide-sand/15">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`p-6 transition-colors flex items-start gap-4 cursor-pointer ${
                  n.is_read ? 'bg-white opacity-60' : 'bg-ivory/15 hover:bg-ivory/30'
                }`}
              >
                <div className="h-10 w-10 rounded-xl bg-sand/15 border border-sand/35 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-serif font-black text-walnut">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!n.is_read && (
                        <span className="px-2.5 py-0.5 text-[8px] font-black text-white bg-rose-600 rounded-full uppercase tracking-wider shadow-sm">
                          New
                        </span>
                      )}
                      <span className="text-[9px] text-walnut/40 font-bold uppercase tracking-widest">
                        {new Date(n.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-walnut/60 leading-relaxed font-semibold">
                    {n.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
