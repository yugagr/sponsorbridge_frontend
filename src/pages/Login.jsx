import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', form)
      const data = res.data
      login({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      }, data.token)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
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
          background: 'linear-gradient(135deg, #1d4ed8, #0891b2)',
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
          The smartest way to manage influencer deals
        </h2>
        <p style={{ fontSize: 17, opacity: 0.8, lineHeight: 1.7, marginBottom: 48 }}>
          Connect brands with influencers, manage deals end-to-end,
          and get paid on time — every time.
        </p>

        {[
          '✓ JWT secured authentication',
          '✓ Real-time deal tracking',
          '✓ Automated payment release',
          '✓ Verified reviews system',
        ].map((item) => (
          <div key={item} style={{
            fontSize: 15, opacity: 0.9, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            {item}
          </div>
        ))}
      </motion.div>

      {/* RIGHT PANEL — FORM */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          flex: 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 40
        }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <h1 style={{
            fontSize: 32, fontWeight: 800,
            color: '#0f172a', marginBottom: 8
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#64748b', marginBottom: 36, fontSize: 16 }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div style={{ marginBottom: 20 }}>
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
                    transition: 'border-color 0.2s',
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
                  placeholder="••••••••"
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
                  ? '#93c5fd'
                  : 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                transition: 'all 0.2s'
              }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: 15 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>

          {/* demo credentials hint */}
          <div style={{
            marginTop: 32, padding: 16,
            background: '#f8fafc', borderRadius: 12,
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>
              Demo credentials
            </p>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              Influencer: riya@gmail.com / password123
            </p>
            <p style={{ fontSize: 13, color: '#64748b' }}>
              Brand: nike@gmail.com / password123
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  )
}