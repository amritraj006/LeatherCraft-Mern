import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500 mt-6 px-4">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-walnut border border-sand/40">
          Support Desk
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-walnut leading-tight">
          We're Here to Help You
        </h1>
        <p className="text-xs md:text-sm text-walnut/60 font-semibold max-w-xl mx-auto leading-relaxed">
          Need order help, delivery tracking, or want to register as a seller partner? Send us a message!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Contact Info Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-6 text-xs font-semibold text-walnut/70">
            <div className="flex gap-4">
              <Mail className="text-terracotta flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-walnut text-[11px] uppercase tracking-wider">Email Support</h4>
                <p className="text-[10px] mt-0.5">support@leathercraft.in</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="text-olive flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-walnut text-[11px] uppercase tracking-wider">Helpline Number</h4>
                <p className="text-[10px] mt-0.5">+91 1800-LEATHER (Toll-Free)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="text-walnut flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-walnut text-[11px] uppercase tracking-wider">Office Address</h4>
                <p className="text-[10px] mt-0.5">MG Road, Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Pane */}
        <div className="md:col-span-7">
          <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-bold text-walnut">Message Sent!</h3>
                <p className="text-xs text-walnut/60 leading-relaxed font-semibold">
                  We have received your message. Our team will contact you back in 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Your Name</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
