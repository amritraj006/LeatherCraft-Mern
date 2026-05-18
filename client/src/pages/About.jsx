import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Code2, Cpu, ShieldCheck } from 'lucide-react'

const developers = [
  {
    name: 'Amrit Raj',
    role: 'Lead Full-Stack Architect',
    bio: 'Pioneered the robust Laravel REST API gateway, secure Stripe pipelines, and high-performance React client modules.',
    tags: ['Laravel', 'React & Vite', 'Stripe API'],
    icon: Code2,
    initials: 'AR',
    image: '',
    tone: 'bg-terracotta/10 text-terracotta border-terracotta/20',
  },
  {
    name: 'Harsh Kumar',
    role: 'System Security & Databases',
    bio: 'Architected database relationships, robust migrations, API session controllers, and system security controls.',
    tags: ['Database', 'System Security', 'REST APIs'],
    icon: Cpu,
    initials: 'HK',
    image: '',
    tone: 'bg-olive/10 text-olive border-olive/20',
  },
  {
    name: 'Sundram Sharma',
    role: 'UI/UX & Storefront Director',
    bio: 'Designed the storefront experience, payment pages, customer orders ledger, and seller dashboard templates.',
    tags: ['UI/UX Design', 'Client Modules', 'Aesthetics'],
    icon: ShieldCheck,
    initials: 'SS',
    image: '',
    tone: 'bg-sand/30 text-walnut border-sand/40',
  }
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 animate-in fade-in duration-500 mt-6 px-4">
      {/* Title block */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-walnut border border-sand/40">
          Our Story
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-walnut leading-tight">
          High Quality Custom Printed Leather Products
        </h1>
        <p className="text-xs md:text-sm text-walnut/60 font-semibold max-w-xl mx-auto leading-relaxed">
          We bring you premium printed leather wallets, bags and jackets prepared directly by top local sellers.
        </p>
      </div>

      {/* Vision & Guarantee Grid */}
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4 text-xs font-semibold text-walnut/70 leading-relaxed">
          <h2 className="text-lg font-bold text-walnut">Our Vision</h2>
          <p>
            LeatherCraft is a platform where creative local print designers list standard leather items with beautiful custom patterns.
          </p>
          <p>
            shoppers get to choose from a wide catalog of unique designs, printed with maximum accuracy and high scratch resistance, delivered directly to their doorstep.
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-white p-6 shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-walnut text-sm flex items-center gap-1.5">
            <Sparkles size={16} className="text-terracotta" />
            Our Quality Guarantee
          </h3>
          <ul className="space-y-2 text-[11px] leading-relaxed text-walnut/60">
            <li>● Genuine high-grade leather material base.</li>
            <li>● Safe and eco-friendly printing ink technology.</li>
            <li>● Fast delivery and safe customer support.</li>
            <li>● Live seller dashboard inventory managers.</li>
          </ul>
        </div>
      </section>

      {/* Meet the Developers Section */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-sm font-bold text-walnut uppercase tracking-widest">Meet the Builders</h2>
          <p className="text-xs text-walnut/50 font-semibold max-w-md mx-auto leading-relaxed">
            The creative minds and autonomous intelligence powering this custom printed leather experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {developers.map((dev) => {
            return (
              <div key={dev.name} className="group relative rounded-2xl border border-sand bg-white p-5 shadow-sm hover:border-terracotta hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Header: Profile image & Name info */}
                  <div className="flex items-center gap-3">
                    {dev.image ? (
                      <img
                        src={dev.image}
                        alt={dev.name}
                        className="h-12 w-12 rounded-full object-cover border border-sand"
                      />
                    ) : (
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm border flex-shrink-0 ${dev.tone}`}>
                        {dev.initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-walnut text-sm group-hover:text-terracotta transition-colors">{dev.name}</h3>
                      <p className="text-[10px] font-bold text-walnut/40 uppercase tracking-wider">{dev.role}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold leading-relaxed text-walnut/60">{dev.bio}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {dev.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-bold bg-ivory px-2 py-0.5 rounded text-walnut/60 border border-sand/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Action link */}
      <div className="text-center pt-4">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-terracotta hover:underline">
          Explore products <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
