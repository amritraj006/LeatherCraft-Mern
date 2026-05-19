import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Layers, Store, Users, ExternalLink } from 'lucide-react'
import { getSellerPortalUrl } from '../utils/url'

export default function LandingPage() {
  const [sellerUrl, setSellerUrl] = useState(getSellerPortalUrl('/register'))

  useEffect(() => {
    setSellerUrl(getSellerPortalUrl('/register'))
  }, [])

  return (
    <div className="min-h-screen bg-ivory text-walnut font-sans flex flex-col justify-between overflow-hidden relative">
      {/* Abstract Design Elements */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-terracotta/5 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-walnut/5 rounded-full filter blur-3xl -z-10"></div>
      
      {/* Decorative Leather Texture overlay (soft opacity grid) */}
      <div className="absolute inset-0 bg-[radial-gradient(#8b5a2b_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] -z-10"></div>

      {/* Floating Logo Badge */}
      <header className="px-6 py-6 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-walnut text-ivory rounded-xl flex items-center justify-center border border-sand/50 shadow-md">
            <Store size={20} />
          </div>
          <div>
            <span className="text-lg font-serif font-extrabold tracking-tight text-walnut uppercase">LeatherCraft</span>
            <span className="block text-[8px] font-bold tracking-widest text-terracotta uppercase leading-none">Printed Leather Store</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-walnut/40 uppercase tracking-widest border border-sand/50 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md">
          Portal Gateway
        </span>
      </header>

      {/* Main Hero & Portals */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-6xl mx-auto w-full py-12 md:py-20 space-y-12 md:space-y-16">
        {/* Brand Headline Block */}
        <div className="text-center space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta border border-terracotta/20 animate-bounce">
            <Sparkles size={12} /> Welcome to LeatherCraft India
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-walnut leading-[1.1] md:leading-[1.15]">
            Where High-End Custom Print <br/>
            <span className="bg-gradient-to-r from-terracotta via-amber-700 to-walnut bg-clip-text text-transparent">Meets Premium Leather Craft</span>
          </h1>
          <p className="text-sm md:text-base leading-relaxed text-walnut/60 font-semibold max-w-2xl mx-auto">
            Choose your destination below to start exploring our printed luxury leather catalog as a buyer, or create a seller workspace to generate and sell custom printed designs.
          </p>
        </div>

        {/* Dynamic Side-by-Side Dual Portals */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Card 1: Shopping & Browsing (Customer) */}
          <Link
            to="/shop"
            className="group relative rounded-3xl border border-sand bg-white p-8 md:p-10 flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-xl hover:border-walnut transition-all duration-500 overflow-hidden transform hover:-translate-y-1.5"
          >
            {/* Visual glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-amber-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="space-y-6 relative z-10">
              <div className="h-14 w-14 bg-walnut text-ivory rounded-2xl flex items-center justify-center border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-walnut">Shop & Browse Products</h3>
                <p className="text-xs text-walnut/60 font-semibold leading-relaxed">
                  Browse beautiful wallets, bags, jackets, and accessories co-created with state-of-the-art AI. Purchase securely with escrow protection.
                </p>
              </div>
            </div>

            <div className="pt-8 relative z-10 flex items-center justify-between w-full">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-walnut">
                Enter Marketplace
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <span className="text-[10px] uppercase font-bold text-walnut/40 tracking-widest">Customer Portal</span>
            </div>
            
            {/* Elegant bottom accent line */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-walnut opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {/* Card 2: Become a Seller */}
          <a
            href={sellerUrl}
            className="group relative rounded-3xl border border-sand bg-white p-8 md:p-10 flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-xl hover:border-terracotta transition-all duration-500 overflow-hidden transform hover:-translate-y-1.5"
          >
            {/* Visual glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 via-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="space-y-6 relative z-10">
              <div className="h-14 w-14 bg-terracotta text-white rounded-2xl flex items-center justify-center border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-500">
                <Users size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-walnut">Become a Partner Seller</h3>
                <p className="text-xs text-walnut/60 font-semibold leading-relaxed">
                  List premium leather items, co-create custom print design prompts using our AI design studio, and open your virtual store to buyers across India.
                </p>
              </div>
            </div>

            <div className="pt-8 relative z-10 flex items-center justify-between w-full">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta">
                Seller Registration
                <ExternalLink size={13} className="group-hover:translate-y-[-1px] group-hover:translate-x-[1px] transition-transform duration-300" />
              </span>
              <span className="text-[10px] uppercase font-bold text-terracotta/40 tracking-widest">Seller Workspace</span>
            </div>

            {/* Elegant bottom accent line */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-terracotta opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>

        </div>

        {/* Commitment Badges */}
        <div className="w-full max-w-4xl border-t border-sand/40 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs font-semibold text-walnut/50 leading-relaxed">
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck size={18} className="text-terracotta" />
            <span className="font-bold text-walnut text-[11px] uppercase tracking-wider">Stripe Escrow Payments</span>
            <p className="text-[10px] max-w-[200px]">Secure transactions protecting buyers & sellers alike.</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Layers size={18} className="text-walnut" />
            <span className="font-bold text-walnut text-[11px] uppercase tracking-wider">AI Co-Creation Studio</span>
            <p className="text-[10px] max-w-[200px]">Stable Diffusion XL integration for custom prints.</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Users size={18} className="text-olive" />
            <span className="font-bold text-walnut text-[11px] uppercase tracking-wider">Verified Indian Craft</span>
            <p className="text-[10px] max-w-[200px]">100% genuine premium leather goods from verified partners.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-sand/30 text-center text-[10px] text-walnut/40 font-semibold bg-white/30 backdrop-blur-sm">
        © {new Date().getFullYear()} LeatherCraft India. Built with local pride & secure payment standard.
      </footer>
    </div>
  )
}