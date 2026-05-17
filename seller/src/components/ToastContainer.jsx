import { useToast } from '../store/useToast'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 max-w-xs md:max-w-sm w-full pointer-events-none items-center">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-xl border border-sand/40 animate-in slide-in-from-top-4 fade-in duration-300 relative overflow-hidden`}
          >
            {/* Status Colored Left bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                isSuccess ? 'bg-emerald-500' : isError ? 'bg-terracotta' : 'bg-sand'
              }`}
            />

            <div className="flex items-center gap-3 pl-1">
              {isSuccess ? (
                <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
              ) : isError ? (
                <AlertCircle size={18} className="text-terracotta flex-shrink-0" />
              ) : (
                <Info size={18} className="text-walnut/50 flex-shrink-0" />
              )}
              <span className="text-xs font-bold text-walnut leading-relaxed">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-walnut/30 hover:text-walnut/60 transition-colors flex-shrink-0 p-0.5 rounded-full hover:bg-sand/15"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
