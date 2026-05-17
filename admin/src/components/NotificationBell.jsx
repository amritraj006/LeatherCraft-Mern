import { useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../store/useNotifications'
import { Link } from 'react-router-dom'

export default function NotificationBell() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const { notifications, fetchNotifications } = useNotifications()

  // Poll for notifications every 20 seconds if user is logged in
  useEffect(() => {
    if (!user) return
    
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 20000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  if (!user) return null

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <Link
      to="/notifications"
      className="relative group p-2 rounded-xl bg-walnut/5 hover:bg-walnut/10 border border-sand/20 text-walnut transition-all flex items-center justify-center cursor-pointer"
    >
      <Bell size={16} className={unreadCount > 0 ? 'animate-bounce' : ''} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white animate-pulse">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}
