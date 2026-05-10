import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Users, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const NICHES = ['ALL', 'TECH', 'FASHION', 'FOOD', 'TRAVEL', 'FITNESS', 'GAMING', 'EDUCATION', 'FINANCE', 'LIFESTYLE', 'OTHER']
const PLATFORMS = ['ALL', 'YOUTUBE', 'INSTAGRAM', 'BOTH']

export default function SearchInfluencers() {
  const navigate = useNavigate()
  const [influencers, setInfluencers] = useState([])
  const [loading, setLoading] = useState(true)
  const [platform, setPlatform] = useState('')
  const [niche, setNiche] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => { fetchInfluencers({}) }, [])

  const fetchInfluencers = async (f) => {
    setLoading(true)
    try {
      const params = {}
      if (f.platform && f.platform !== 'ALL') params.platform = f.platform
      if (f.niche && f.niche !== 'ALL') params.niche = f.niche
      if (f.maxPrice) params.maxPrice = f.maxPrice
      const res = await api.get('/api/influencers', { params })
      setInfluencers(res.data)
    } catch (err) {
      toast.error('Failed to load influencers')
    } finally {
      setLoading(false)
    }
  }

  const handlePlatform = (p) => {
    setPlatform(p)
    fetchInfluencers({ platform: p, niche, maxPrice })
  }

  const handleNiche = (n) => {
    setNiche(n)
    fetchInfluencers({ platform, niche: n, maxPrice })
  }

  const handleSearch = () => {
    fetchInfluencers({ platform, niche, maxPrice })
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            Find Influencers
          </h1>
          <p style={{ color: '#64748b' }}>Discover the perfect creator for your brand</p>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 28 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#374151', fontWeight: 600, fontSize: 15 }}>
            <Filter size={16} /> Filters
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>PLATFORM</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PLATFORMS.map((p) => (
                  <button key={p} onClick={() => handlePlatform(p)} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: platform === p || (p === 'ALL' && !platform) ? 'none' : '1px solid #e2e8f0',
                    background: platform === p || (p === 'ALL' && !platform) ? '#2563eb' : 'white',
                    color: platform === p || (p === 'ALL' && !platform) ? 'white' : '#64748b',
                  }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>NICHE</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {NICHES.slice(0, 6).map((n) => (
                  <button key={n} onClick={() => handleNiche(n)} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: niche === n || (n === 'ALL' && !niche) ? 'none' : '1px solid #e2e8f0',
                    background: niche === n || (n === 'ALL' && !niche) ? '#7c3aed' : 'white',
                    color: niche === n || (n === 'ALL' && !niche) ? 'white' : '#64748b',
                  }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>MAX BUDGET (₹)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="e.g. 50000"
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button onClick={handleSearch} style={{ padding: '8px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  <Search size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div style={{ marginBottom: 16, color: '#64748b', fontSize: 14 }}>
          {loading ? 'Searching...' : `${influencers.length} influencer${influencers.length !== 1 ? 's' : ''} found`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #eff6ff', borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : influencers.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 20, padding: '60px 40px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
            <Users size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>No influencers found</h3>
            <p style={{ color: '#94a3b8' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {influencers.map((inf, i) => (
              <motion.div
                key={inf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ background: 'white', borderRadius: 20, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                    {inf.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{inf.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{inf.channelOrHandle || inf.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: '#eff6ff', color: '#2563eb' }}>{inf.platform}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: '#f5f3ff', color: '#7c3aed' }}>{inf.niche}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {[
                    { value: inf.followerCount >= 1000000 ? `${(inf.followerCount/1000000).toFixed(1)}M` : inf.followerCount >= 1000 ? `${(inf.followerCount/1000).toFixed(0)}K` : inf.followerCount, label: 'Followers' },
                    { value: `₹${inf.pricePerPost?.toLocaleString()}`, label: 'Per Post' },
                    { value: inf.averageRating > 0 ? inf.averageRating?.toFixed(1) : '—', label: 'Rating' },
                  ].map((stat) => (
                    <div key={stat.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{stat.value}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {inf.bio && (
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>
                    {inf.bio?.substring(0, 80)}{inf.bio?.length > 80 ? '...' : ''}
                  </p>
                )}

                <button
                  onClick={() => navigate('/deals')}
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  Send Proposal
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}