import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, TrendingUp, Star, Users, DollarSign } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'white', overflow: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f1f5f9', padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
            SponsorBridge
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '8px 16px', background: 'none', border: 'none',
            color: '#64748b', fontWeight: 500, cursor: 'pointer', fontSize: 15
          }}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            padding: '10px 20px', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: 12, fontWeight: 600,
            cursor: 'pointer', fontSize: 15
          }}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', padding: '140px 40px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#eff6ff', color: '#2563eb', padding: '8px 16px',
            borderRadius: 999, fontSize: 14, fontWeight: 500, marginBottom: 32
          }}>
          <Zap size={14} />
          The #1 Platform for Influencer Brand Deals
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: 64, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: 24 }}>
          Where Brands Meet
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Influencers
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: 20, color: '#64748b', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Manage sponsorship deals end-to-end. Send proposals, track deliverables,
          release payments — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <button onClick={() => navigate('/register')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: 'white', border: 'none', borderRadius: 16,
            fontWeight: 700, fontSize: 18, cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(37,99,235,0.3)'
          }}>
            Start for Free <ArrowRight size={20} />
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '16px 32px', background: 'white',
            border: '2px solid #e2e8f0', color: '#475569',
            borderRadius: 16, fontWeight: 700, fontSize: 18, cursor: 'pointer'
          }}>
            View Demo
          </button>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 80, marginTop: 64 }}>
          {[
            { value: '10K+', label: 'Influencers' },
            { value: '2K+', label: 'Brands' },
            { value: '₹50Cr+', label: 'Deals Closed' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#1e293b' }}>{stat.value}</div>
              <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              Everything you need to close deals
            </h2>
            <p style={{ color: '#64748b', fontSize: 18 }}>
              From proposal to payment — we handle the entire workflow
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: <Users size={22} />, title: 'Smart Discovery', desc: 'Brands find the perfect influencer filtered by niche, platform, followers and budget.', bg: '#eff6ff', color: '#2563eb' },
              { icon: <TrendingUp size={22} />, title: 'Deal Lifecycle', desc: 'Full deal management from proposal to negotiation, deliverables and completion.', bg: '#f5f3ff', color: '#7c3aed' },
              { icon: <DollarSign size={22} />, title: 'Payment Tracking', desc: 'Secure payment release tied to deliverable approval. No more chasing payments.', bg: '#f0fdf4', color: '#16a34a' },
              { icon: <Shield size={22} />, title: 'Trust & Safety', desc: 'Both sides rate each other after every deal. Build your reputation over time.', bg: '#fff7ed', color: '#ea580c' },
              { icon: <Star size={22} />, title: 'Verified Reviews', desc: 'Only real deal participants can leave reviews. No fake ratings ever.', bg: '#fdf2f8', color: '#db2777' },
              { icon: <Zap size={22} />, title: 'Instant Dashboard', desc: 'Real-time stats — earnings, active deals, ratings — all in one view.', bg: '#ecfeff', color: '#0891b2' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  background: 'white', borderRadius: 20, padding: 32,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: f.bg, color: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 15 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              How it works
            </h2>
            <p style={{ color: '#64748b', fontSize: 18 }}>Three simple steps to your first deal</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {[
              { step: '01', title: 'Create your profile', desc: 'Influencers showcase their niche, platform and pricing. Brands set up their company profile.' },
              { step: '02', title: 'Connect & Negotiate', desc: 'Brands discover influencers, send proposals, negotiate terms and finalize the deal.' },
              { step: '03', title: 'Deliver & Get Paid', desc: 'Influencer delivers content, brand approves, payment releases automatically.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                viewport={{ once: true }}>
                <div style={{ fontSize: 72, fontWeight: 900, color: '#eff6ff', lineHeight: 1 }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: '-16px 0 12px' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '40px 40px 80px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            borderRadius: 32, padding: '80px 60px', textAlign: 'center', color: 'white'
          }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            Ready to bridge the gap?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 32 }}>
            Join thousands of influencers and brands closing deals every day
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 40px', background: 'white', color: '#2563eb',
              border: 'none', borderRadius: 16, fontWeight: 700,
              fontSize: 18, cursor: 'pointer'
            }}>
            Get Started Free →
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '24px 40px', borderTop: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={12} color="white" />
          </div>
          <span style={{ fontWeight: 600, color: '#475569' }}>SponsorBridge</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Built with Spring Boot + React</p>
      </footer>
    </div>
  )
}