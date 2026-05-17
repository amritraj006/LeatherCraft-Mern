import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, Lock, AlertCircle } from 'lucide-react'
import api, { getApiError } from '../api/client'
import { useCart } from '../store/useCart'
import { useAuth } from '../store/useAuth'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#4A3228',
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#e53e3e',
      iconColor: '#e53e3e',
    },
  },
}

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  
  const { items, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const totalAmount = getTotal()

  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const savedAddresses = user?.addresses || []

  const handleSelectSavedAddress = (e) => {
    const selectedId = Number(e.target.value)
    if (!selectedId) return

    const selected = savedAddresses.find(a => a.id === selectedId)
    if (selected) {
      setAddress(selected.street)
      setCity(selected.city)
      setZipCode(selected.zip)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!fullName || !email || !address || !city || !zipCode) {
      setError('Please complete all shipping and contact details.')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const cartItems = items.map(item => ({
        id: item.product.id,
        quantity: item.quantity
      }))

      const intentResponse = await api.post('/payments/create-intent', {
        items: cartItems
      })

      const { clientSecret } = intentResponse.data

      const cardElement = elements.getElement(CardElement)
      const stripeResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: fullName,
            email: email,
            address: {
              line1: address,
              city: city,
              postal_code: zipCode,
            }
          }
        }
      })

      if (stripeResult.error) {
        setError(stripeResult.error.message)
        setProcessing(false)
        return
      }

      if (stripeResult.paymentIntent.status === 'succeeded') {
        await api.post('/payments/confirm', {
          payment_intent_id: stripeResult.paymentIntent.id
        })

        clearCart()
        navigate('/payment-success')
      } else {
        setError('Payment verification incomplete. Please try again.')
        setProcessing(false)
      }
    } catch (err) {
      setError(getApiError(err))
      setProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="lg:col-span-12 max-w-md mx-auto text-center p-8 rounded-3xl border border-sand bg-white shadow-sm space-y-6">
        <div className="h-14 w-14 bg-sand/20 rounded-full flex items-center justify-center text-walnut/60 mx-auto">
          <Lock size={24} />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-walnut">Login Required</h2>
          <p className="text-xs text-walnut/50 font-semibold max-w-sm mx-auto leading-relaxed">
            Please log in or create a customer account to process your payment safely.
          </p>
        </div>
        <div className="pt-2 flex gap-3 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-walnut px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-walnut/90 transition-colors shadow-sm"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-walnut hover:bg-sand/15 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12 max-w-6xl mx-auto">
      {/* Left side: Shipping Details Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3">Shipping & Contact Info</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {savedAddresses.length > 0 && (
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Auto-fill Saved Address</label>
                <select
                  onChange={handleSelectSavedAddress}
                  className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-bold text-walnut outline-none"
                >
                  <option value="">-- Choose a Saved Address --</option>
                  {savedAddresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label}: {addr.street}, {addr.city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>
            
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@example.com"
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Luxury Leather Lane"
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Town / City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-walnut/50">Postal ZIP Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="94103"
                required
                className="w-full rounded-xl border border-sand bg-ivory px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 text-walnut"
              />
            </div>
          </div>
        </div>

        {/* Secure credit card input panel */}
        <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3">Secure Stripe Card Details</h2>
          
          <div className="rounded-xl border border-sand bg-ivory p-4">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          <div className="text-[10px] font-semibold text-walnut/50 flex items-center gap-1.5 leading-none">
            <Lock size={12} className="text-olive" />
            <span>Card transactions are processed immediately under Stripe PCI compliance parameters.</span>
          </div>
        </div>
      </div>

      {/* Right side: Items Overview and checkout action */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-walnut uppercase tracking-widest border-b border-sand/30 pb-3">Your Order Items</h3>

          {/* Simple items grid */}
          <div className="max-h-52 overflow-y-auto space-y-3.5 pr-2">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3 text-xs">
                <div className="h-10 w-10 bg-ivory rounded-lg border border-sand/20 flex items-center justify-center p-1.5 flex-shrink-0">
                  <img src={item.product.design?.ai_image} alt={item.product.title} className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 min-w-0 font-semibold">
                  <p className="text-walnut truncate">{item.product.title}</p>
                  <p className="text-[9px] text-walnut/40 uppercase tracking-widest mt-0.5">{item.quantity} x ₹{item.product.price}</p>
                </div>
                <span className="font-bold text-terracotta">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3.5 border-t border-sand/20 pt-4 text-xs font-semibold text-walnut/60">
            <div className="flex justify-between">
              <span>Order Subtotal</span>
              <span className="text-walnut font-bold">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="text-emerald-700 font-bold uppercase text-[9px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Free</span>
            </div>
            <div className="flex justify-between border-t border-sand/30 pt-4 text-sm font-bold text-walnut">
              <span>Total Bill</span>
              <span className="text-base font-black text-terracotta">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 shadow-sm flex items-start gap-2">
              <AlertCircle size={15} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={processing || items.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-walnut hover:bg-walnut/90 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} />
              {processing ? 'Processing Securely...' : `Pay ₹${totalAmount.toFixed(2)}`}
            </button>
          </div>

          <div className="text-center">
            <p className="text-[10px] leading-relaxed text-walnut/40 font-semibold flex items-center justify-center gap-1">
              <Lock size={10} /> Test Card: Enter 4242 repeated for standard test clearance.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
