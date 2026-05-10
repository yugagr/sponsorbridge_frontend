import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'INFLUENCER'
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/auth/register', form)
      const data = res.data
      login({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      }, data.token)
      toast.success(`Welcome to SponsorBridge, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #f8fafc 100%)'
    }}>

      {/* LEFT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 80px',
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: 'white'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={20} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 700 }}>SponsorBridge</span>
        </div>

        <h2 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
          Join thousands of creators and brands
        </h2>
        <p style={{ fontSize: 17, opacity: 0.8, lineHeight: 1.7, marginBottom: 48 }}>
          Whether you're an influencer looking for brand deals or a brand
          looking for the perfect creator — SponsorBridge has you covered.
        </p>

        {/* role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { emoji: '🎬', title: 'For Influencers', desc: 'Get discovered, manage deals, track payments' },
            { emoji: '🏢', title: 'For Brands', desc: 'Find creators, send proposals, track ROI' },
          ].map((card) => (
            <div key={card.title} style={{
              padding: '16px 20px', borderRadius: 14,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ fontSize: 28 }}>{card.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{card.title}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 40
        }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            Create your account
          </h1>
          <p style={{ color: '#64748b', marginBottom: 36, fontSize: 16 }}>
            Free forever. No credit card required.
          </p>

          <form onSubmit={handleSubmit}>

            {/* ROLE TOGGLE */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 14,
                fontWeight: 600, color: '#374151', marginBottom: 8
              }}>
                I am a...
              </label>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 10, padding: 4, background: '#f1f5f9', borderRadius: 12
              }}>
                {['INFLUENCER', 'BRAND'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    style={{
                      padding: '10px 0',
                      background: form.role === role
                        ? 'white' : 'transparent',
                      border: 'none', borderRadius: 10,
                      fontWeight: 600, fontSize: 14,
                      color: form.role === role ? '#2563eb' : '#64748b',
                      cursor: 'pointer',
                      boxShadow: form.role === role
                        ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                    {role === 'INFLUENCER' ? '🎬 Influencer' : '🏢 Brand'}
                  </button>
                ))}
              </div>
            </div>

            {/* NAME */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 14,
                fontWeight: 600, color: '#374151', marginBottom: 8
              }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#94a3b8'
                }} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  style={{
                    width: '100%', padding: '14px 14px 14px 44px',
                    border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 15, outline: 'none', boxSizing: 'border-box',
                    background: 'white'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 14,
                fontWeight: 600, color: '#374151', marginBottom: 8
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#94a3b8'
                }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%', padding: '14px 14px 14px 44px',
                    border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 15, outline: 'none', boxSizing: 'border-box',
                    background: 'white'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block', fontSize: 14,
                fontWeight: 600, color: '#374151', marginBottom: 8
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: '#94a3b8'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  style={{
                    width: '100%', padding: '14px 44px 14px 44px',
                    border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 15, outline: 'none', boxSizing: 'border-box',
                    background: 'white'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#94a3b8'
                  }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading
                  ? '#c4b5fd'
                  : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                transition: 'all 0.2s'
              }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 15 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}