import { useEffect } from 'react'
import { useNotifications } from '../store/useNotifications'
import { useAuth } from '../context/useAuth'
import { Bell, Check, ShoppingBag, ShieldCheck, Sparkles, Info, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Notifications() {
  const { user } = useAuth()
  const { notifications, fetchNotifications, markAllAsRead, markAsRead, loading } = useNotifications()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, fetchNotifications])

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header breadcrumb bar */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-walnut/60 hover:text-walnut transition-colors uppercase tracking-widest">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand bg-white text-[10px] font-bold uppercase tracking-widest text-walnut hover:bg-sand/20 transition-all cursor-pointer shadow-sm"
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Hero Title */}
      <section className="relative overflow-hidden rounded-3xl border border-sand/60 bg-white p-8 md:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 h-64 w-64 bg-rose-600/5 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">Notification Center</p>
          <h1 className="mt-2 text-3xl font-serif font-black tracking-tight text-walnut flex items-center gap-3">
            <Bell size={28} className="text-terracotta" />
            Alerts Hub
          </h1>
          <p className="mt-3 max-w-xl text-xs font-semibold leading-relaxed text-walnut/60">
            Track catalog approvals, sales purchases & net earnings reports instantly.
          </p>
        </div>

        <div className="relative z-10 h-fit px-5 py-3.5 rounded-2xl bg-ivory/50 border border-sand/40 flex items-center gap-3 shadow-sm">
          <span className="h-3 w-3 rounded-full bg-rose-600 animate-pulse" />
          <span className="text-[11px] font-bold text-walnut uppercase tracking-widest">
            {unreadCount} Unread Alerts
          </span>
        </div>
      </section>

      {/* Main List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-terracotta"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sand/60 bg-white px-6 py-20 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sand/10 text-walnut/40 shadow-sm mb-4">
              <Bell size={28} />
            </span>
            <h3 className="text-xl font-serif font-bold text-walnut">Your inbox is empty</h3>
            <p className="mt-2 max-w-sm text-xs font-semibold leading-relaxed text-walnut/50">
              Any seller product approvals, commission details or customer transactions will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-sand/60 shadow-sm overflow-hidden divide-y divide-sand/30">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`p-6 md:p-8 transition-colors flex items-start gap-5 cursor-pointer ${
                  n.is_read ? 'bg-white opacity-70' : 'bg-ivory/30 hover:bg-ivory/50'
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-white border border-sand/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-walnut">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      {!n.is_read && (
                        <span className="px-2.5 py-1 text-[9px] font-bold text-white bg-rose-600 rounded-full uppercase tracking-widest shadow-sm">
                          New
                        </span>
                      )}
                      <span className="text-[10px] text-walnut/40 font-bold uppercase tracking-widest">
                        {new Date(n.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-walnut/70 leading-relaxed font-semibold max-w-3xl">
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
