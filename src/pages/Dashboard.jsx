import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Handshake, Clock, CheckCircle,
  XCircle, Star, DollarSign, ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/dashboard')
      setData(res.data)
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{
      paddingTop: 64, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid #eff6ff', borderTopColor: '#2563eb',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const isInfluencer = user?.role === 'INFLUENCER'

  const statCards = [
    {
      label: 'Total Deals',
      value: data?.totalDeals ?? 0,
      icon: <Handshake size={22} />,
      bg: '#eff6ff', color: '#2563eb',
    },
    {
      label: 'Active Deals',
      value: data?.activeDeals ?? 0,
      icon: <TrendingUp size={22} />,
      bg: '#f0fdf4', color: '#16a34a',
    },
    {
      label: 'Pending',
      value: data?.pendingDeals ?? 0,
      icon: <Clock size={22} />,
      bg: '#fff7ed', color: '#ea580c',
    },
    {
      label: 'Completed',
      value: data?.completedDeals ?? 0,
      icon: <CheckCircle size={22} />,
      bg: '#f5f3ff', color: '#7c3aed',
    },
    {
      label: 'Rejected',
      value: data?.rejectedDeals ?? 0,
      icon: <XCircle size={22} />,
      bg: '#fff1f2', color: '#e11d48',
    },
    {
      label: isInfluencer ? 'Total Earnings' : 'Total Spent',
      value: `₹${((isInfluencer ? data?.totalEarnings : data?.totalSpent) ?? 0).toLocaleString()}`,
      icon: <DollarSign size={22} />,
      bg: '#ecfeff', color: '#0891b2',
    },
  ]

  const getStatusStyle = (status) => {
    const styles = {
      PENDING:     { bg: '#fff7ed', color: '#ea580c' },
      ACTIVE:      { bg: '#f0fdf4', color: '#16a34a' },
      COMPLETED:   { bg: '#eff6ff', color: '#2563eb' },
      REJECTED:    { bg: '#fff1f2', color: '#e11d48' },
      NEGOTIATING: { bg: '#f5f3ff', color: '#7c3aed' },
      CANCELLED:   { bg: '#f8fafc', color: '#64748b' },
    }
    return styles[status] || styles.PENDING
  }

  return (
    <div style={{
      paddingTop: 80, minHeight: '100vh',
      background: '#f8fafc', padding: '80px 40px 40px'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: 16 }}>
            Here's what's happening with your deals today
          </p>
        </motion.div>

        {/* STAT CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20, marginBottom: 32
        }}>
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'white', borderRadius: 16, padding: 24,
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', gap: 16
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: card.bg, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                  {card.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>

          {/* RECENT DEALS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'white', borderRadius: 20, padding: 28,
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
                Recent Deals
              </h2>
              <button
                onClick={() => navigate('/deals')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none',
                  color: '#2563eb', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer'
                }}>
                View all <ArrowRight size={14} />
              </button>
            </div>

            {data?.recentDeals?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                <Handshake size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>No deals yet</p>
              </div>
            ) : (
              data?.recentDeals?.map((deal) => {
                const s = getStatusStyle(deal.status)
                return (
                  <div
                    key={deal.id}
                    onClick={() => navigate(`/deals/${deal.id}`)}
                    style={{
                      padding: '14px 0', borderBottom: '1px solid #f8fafc',
                      cursor: 'pointer', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center'
                    }}>
                    <div>
                      <div style={{
                        fontSize: 14, fontWeight: 600,
                        color: '#1e293b', marginBottom: 4
                      }}>
                        {deal.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {isInfluencer ? deal.brandName : deal.influencerName}
                        {' · '}₹{deal.budgetAmount?.toLocaleString()}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 999,
                      fontSize: 11, fontWeight: 600,
                      background: s.bg, color: s.color
                    }}>
                      {deal.status}
                    </span>
                  </div>
                )
              })
            )}
          </motion.div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* RATING CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                borderRadius: 20, padding: 24, color: 'white'
              }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
                Your Rating
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8
              }}>
                <Star size={28} fill="white" color="white" />
                <span style={{ fontSize: 40, fontWeight: 800 }}>
                  {data?.averageRating ?? '—'}
                </span>
                <span style={{ fontSize: 16, opacity: 0.7 }}>/5</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Based on completed deals
              </div>
            </motion.div>

            {/* RECENT REVIEWS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'white', borderRadius: 20, padding: 24,
                border: '1px solid #f1f5f9', flex: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
              <h2 style={{
                fontSize: 17, fontWeight: 700,
                color: '#0f172a', marginBottom: 16
              }}>
                Recent Reviews
              </h2>

              {data?.recentReviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
                  <Star size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                  <p style={{ fontSize: 13 }}>No reviews yet</p>
                </div>
              ) : (
                data?.recentReviews?.map((review) => (
                  <div key={review.id} style={{
                    padding: '12px 0', borderBottom: '1px solid #f8fafc'
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: 4
                    }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600, color: '#1e293b'
                      }}>
                        {review.reviewerName}
                      </span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star} size={12}
                            fill={star <= review.rating ? '#f59e0b' : 'none'}
                            color={star <= review.rating ? '#f59e0b' : '#e2e8f0'}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: 24 }}>
          <h2 style={{
            fontSize: 17, fontWeight: 700,
            color: '#0f172a', marginBottom: 16
          }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            {isInfluencer ? (
              <>
                <ActionButton
                  label="View My Deals"
                  onClick={() => navigate('/deals')}
                  primary />
                <ActionButton
                  label="Update Profile"
                  onClick={() => navigate('/profile')} />
              </>
            ) : (
              <>
                <ActionButton
                  label="Find Influencers"
                  onClick={() => navigate('/search')}
                  primary />
                <ActionButton
                  label="My Deals"
                  onClick={() => navigate('/deals')} />
                <ActionButton
                  label="Update Profile"
                  onClick={() => navigate('/profile')} />
              </>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function ActionButton({ label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        background: primary
          ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
          : 'white',
        color: primary ? 'white' : '#475569',
        border: primary ? 'none' : '1px solid #e2e8f0',
        borderRadius: 12, fontWeight: 600, fontSize: 14,
        cursor: 'pointer',
        boxShadow: primary ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
      }}>
      {label}
    </button>
  )
}