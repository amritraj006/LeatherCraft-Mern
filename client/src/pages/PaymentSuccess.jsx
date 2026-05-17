import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingBag } from 'lucide-react'

export default function PaymentSuccess() {
  return (
    <div className="max-w-xl mx-auto mt-16 p-12 text-center rounded-3xl border border-sand bg-white shadow-sm space-y-6 animate-in zoom-in duration-300">
      <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 mx-auto animate-bounce">
        <CheckCircle2 size={32} />
      </div>
      
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
          Payment Success
        </span>
        <h2 className="text-2xl font-black text-walnut mt-2">Order Placed Successfully!</h2>
        <p className="text-xs text-walnut/50 font-semibold max-w-sm mx-auto leading-relaxed">
          Your Stripe card payment was successful! The seller has been notified and your custom leather item is being prepared for delivery.
        </p>
      </div>

      <div className="rounded-xl border border-sand/40 bg-ivory/50 p-4 space-y-1.5 text-xs text-left font-semibold text-walnut/60">
        <p className="font-bold text-walnut">What happens next?</p>
        <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
          <li>The seller prints your selected pattern onto the leather item.</li>
          <li>Item is inspected to guarantee excellent quality.</li>
          <li>A courier tracking number will be sent to your email address within 48 hours.</li>
        </ul>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-walnut px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-walnut/90 transition-colors shadow-sm"
        >
          <ShoppingBag size={14} /> Back to Storefront
        </Link>
      </div>
    </div>
  )
}
