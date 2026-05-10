import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Star, Briefcase, Link, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PLATFORMS = ['YOUTUBE', 'INSTAGRAM', 'BOTH']
const NICHES = ['TECH', 'FASHION', 'FOOD', 'TRAVEL', 'FITNESS', 'GAMING', 'EDUCATION', 'FINANCE', 'LIFESTYLE', 'OTHER']

export default function Profile() {
  const { user } = useAuth()
  const isInfluencer = user?.role === 'INFLUENCER'
  const isBrand = user?.role === 'BRAND'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    platform: 'YOUTUBE',
    niche: 'TECH',
    channelOrHandle: '',
    followerCount: '',
    pricePerPost: '',
    bio: '',
    companyName: '',
    industry: '',
    website: '',
    description: '',
  })

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const endpoint = isInfluencer ? '/api/influencers/profile/me' : '/api/brands/profile/me'
      const res = await api.get(endpoint)
      setProfile(res.data)
      setForm(res.data)
      setHasProfile(true)
    } catch (err) {
      setHasProfile(false)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const endpoint = isInfluencer ? '/api/influencers/profile' : '/api/brands/profile'
      const method = hasProfile ? 'put' : 'post'
      await api[method](endpoint, form)
      toast.success('Profile saved!')
      setHasProfile(true)
      fetchProfile()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #eff6ff', borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>My Profile</h1>
          <p style={{ color: '#64748b' }}>{hasProfile ? 'Update your profile details' : 'Complete your profile to get started'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: 20, padding: 32, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>

          {/* AVATAR ROW */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 800 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{user?.name}</div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>{user?.email}</div>
              <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: isInfluencer ? '#eff6ff' : '#f0fdf4', color: isInfluencer ? '#2563eb' : '#16a34a' }}>
                {user?.role}
              </span>
            </div>
            {profile?.averageRating > 0 && (
              <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Star size={20} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{profile.averageRating}</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Average Rating</div>
              </div>
            )}
          </div>

          {/* INFLUENCER FORM */}
          {isInfluencer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Platform</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PLATFORMS.map((p) => (
                    <button key={p} type="button" onClick={() => setForm({ ...form, platform: p })}
                      style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: form.platform === p ? '#2563eb' : '#f1f5f9', color: form.platform === p ? 'white' : '#64748b', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Niche</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {NICHES.map((n) => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, niche: n })}
                      style={{ padding: '7px 14px', borderRadius: 10, border: 'none', background: form.niche === n ? '#7c3aed' : '#f1f5f9', color: form.niche === n ? 'white' : '#64748b', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <SimpleField label="Channel / Handle" name="channelOrHandle" value={form.channelOrHandle || ''} onChange={handleChange} placeholder="@YourChannel" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <SimpleField label="Follower Count" name="followerCount" type="number" value={form.followerCount || ''} onChange={handleChange} placeholder="e.g. 500000" />
                <SimpleField label="Price Per Post (₹)" name="pricePerPost" type="number" value={form.pricePerPost || ''} onChange={handleChange} placeholder="e.g. 25000" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Bio</label>
                <textarea name="bio" value={form.bio || ''} onChange={handleChange} placeholder="Tell brands about yourself..." rows={4}
                  style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
          )}

          {/* BRAND FORM */}
          {isBrand && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <SimpleField label="Company Name" name="companyName" value={form.companyName || ''} onChange={handleChange} placeholder="Your company name" />
              <SimpleField label="Industry" name="industry" value={form.industry || ''} onChange={handleChange} placeholder="e.g. Sports and Fitness" />
              <SimpleField label="Website" name="website" value={form.website || ''} onChange={handleChange} placeholder="https://yourwebsite.com" />
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Description</label>
                <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Tell influencers about your brand..." rows={4}
                  style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
          )}

          <button onClick={handleSave} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 28, padding: '13px 28px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <Save size={18} />
            {saving ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
          </button>
        </motion.div>

        {hasProfile && isInfluencer && profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 20, padding: 24, color: 'white' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, opacity: 0.9 }}>Your Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Followers', value: profile.followerCount >= 1000000 ? `${(profile.followerCount/1000000).toFixed(1)}M` : profile.followerCount >= 1000 ? `${(profile.followerCount/1000).toFixed(0)}K` : profile.followerCount },
                { label: 'Price/Post', value: `₹${profile.pricePerPost?.toLocaleString()}` },
                { label: 'Deals Done', value: profile.totalDealsCompleted ?? 0 },
              ].map((s) => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

function SimpleField({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }}
        onFocus={e => e.target.style.borderColor = '#2563eb'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  )
}