import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../components/CheckoutForm'

// Initialize Stripe Publishable Key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY || 
  'pk_test_51NzSdoJ0rUpE4V5Xp98NqRzDq2LszM4B7vQo2K5zKzM4B7vQo2K5zKzM4B7vQo2K5zKzM4B7vQo2K5z'
)

export default function Payment() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500 mt-6 px-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-walnut">Secure Checkout</h1>
        <p className="text-xs text-walnut/50 mt-1 font-semibold">Enter your shipping information and complete your order using Stripe Payments.</p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  )
}
