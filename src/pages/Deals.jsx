import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Handshake, Clock, CheckCircle,
  XCircle, TrendingUp, ChevronRight, X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['ALL', 'PENDING', 'NEGOTIATING', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED']

const STATUS_STYLE = {
  PENDING:     { bg: '#fff7ed', color: '#ea580c' },
  ACTIVE:      { bg: '#f0fdf4', color: '#16a34a' },
  COMPLETED:   { bg: '#eff6ff', color: '#2563eb' },
  REJECTED:    { bg: '#fff1f2', color: '#e11d48' },
  NEGOTIATING: { bg: '#f5f3ff', color: '#7c3aed' },
  CANCELLED:   { bg: '#f8fafc', color: '#64748b' },
}

export default function Deals() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isBrand = user?.role === 'BRAND'

  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { fetchDeals() }, [])

  const fetchDeals = async () => {
    try {
      const endpoint = isBrand ? '/api/deals/brand' : '/api/deals/influencer'
      const res = await api.get(endpoint)
      setDeals(res.data)
    } catch (err) {
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'ALL'
    ? deals
    : deals.filter(d => d.status === filter)

  if (loading) return <Spinner />

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 40px' }}>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 32
          }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              {isBrand ? 'My Deal Proposals' : 'My Deals'}
            </h1>
            <p style={{ color: '#64748b' }}>
              {deals.length} total deal{deals.length !== 1 ? 's' : ''}
            </p>
          </div>

          {isBrand && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: 'white', border: 'none', borderRadius: 12,
                fontWeight: 600, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
              }}>
              <Plus size={18} />
              New Deal
            </button>
          )}
        </motion.div>

        {/* STATUS FILTERS */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 28,
          flexWrap: 'wrap'
        }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 16px', borderRadius: 999,
                border: filter === s ? 'none' : '1px solid #e2e8f0',
                background: filter === s ? '#2563eb' : 'white',
                color: filter === s ? 'white' : '#64748b',
                fontWeight: filter === s ? 600 : 500,
                fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* DEALS LIST */}
        {filtered.length === 0 ? (
          <EmptyState isBrand={isBrand} onNew={() => setShowModal(true)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {filtered.map((deal, i) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/deals/${deal.id}`)}
                  style={{
                    background: 'white', borderRadius: 16,
                    padding: '20px 24px', cursor: 'pointer',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'box-shadow 0.2s'
                  }}
                  whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: STATUS_STYLE[deal.status]?.bg,
                      color: STATUS_STYLE[deal.status]?.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <StatusIcon status={deal.status} />
                    </div>

                    <div>
                      <div style={{
                        fontSize: 15, fontWeight: 700,
                        color: '#0f172a', marginBottom: 4
                      }}>
                        {deal.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8' }}>
                        {isBrand
                          ? `To: ${deal.influencerName}`
                          : `From: ${deal.brandName}`}
                        {' · '}
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>
                          ₹{deal.budgetAmount?.toLocaleString()}
                        </span>
                        {deal.platform && ` · ${deal.platform}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      padding: '5px 14px', borderRadius: 999,
                      fontSize: 12, fontWeight: 600,
                      background: STATUS_STYLE[deal.status]?.bg,
                      color: STATUS_STYLE[deal.status]?.color
                    }}>
                      {deal.status}
                    </span>
                    <ChevronRight size={18} color="#94a3b8" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* NEW DEAL MODAL */}
      {showModal && (
        <NewDealModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchDeals() }}
        />
      )}
    </div>
  )
}

// ── NEW DEAL MODAL ───────────────────────────────────────────
function NewDealModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    influencerId: '', title: '', description: '',
    budgetAmount: '', platform: 'YOUTUBE', deadline: '',
    deliverableTitles: ['']
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addDeliverable = () => {
    setForm({ ...form, deliverableTitles: [...form.deliverableTitles, ''] })
  }

  const updateDeliverable = (i, val) => {
    const updated = [...form.deliverableTitles]
    updated[i] = val
    setForm({ ...form, deliverableTitles: updated })
  }

  const removeDeliverable = (i) => {
    setForm({
      ...form,
      deliverableTitles: form.deliverableTitles.filter((_, idx) => idx !== i)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/deals', {
        ...form,
        influencerId: parseInt(form.influencerId),
        budgetAmount: parseFloat(form.budgetAmount),
        deliverableTitles: form.deliverableTitles.filter(d => d.trim())
      })
      toast.success('Deal proposal sent!')
      onCreated()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create deal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'white', borderRadius: 24,
          padding: 32, width: '100%', maxWidth: 540,
          maxHeight: '90vh', overflowY: 'auto'
        }}>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
            Send Deal Proposal
          </h2>
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 'none', borderRadius: 8,
            padding: 6, cursor: 'pointer', color: '#64748b'
          }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'influencerId', label: 'Influencer ID', type: 'number', placeholder: 'Enter influencer user ID' },
            { name: 'title', label: 'Deal Title', type: 'text', placeholder: 'e.g. Promote our new collection' },
            { name: 'budgetAmount', label: 'Budget (₹)', type: 'number', placeholder: 'e.g. 25000' },
            { name: 'deadline', label: 'Deadline', type: 'date', placeholder: '' },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 600,
                color: '#374151', marginBottom: 6
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '2px solid #e2e8f0', borderRadius: 10,
                  fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          ))}

          {/* DESCRIPTION */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: '#374151', marginBottom: 6
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you need..."
              rows={3}
              style={{
                width: '100%', padding: '11px 14px',
                border: '2px solid #e2e8f0', borderRadius: 10,
                fontSize: 14, outline: 'none', resize: 'vertical',
                boxSizing: 'border-box', fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* PLATFORM */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: '#374151', marginBottom: 6
            }}>
              Platform
            </label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              style={{
                width: '100%', padding: '11px 14px',
                border: '2px solid #e2e8f0', borderRadius: 10,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                background: 'white'
              }}>
              <option value="YOUTUBE">YouTube</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          {/* DELIVERABLES */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: 13, fontWeight: 600,
              color: '#374151', marginBottom: 8
            }}>
              Deliverables
            </label>
            {form.deliverableTitles.map((d, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, marginBottom: 8
              }}>
                <input
                  value={d}
                  onChange={(e) => updateDeliverable(i, e.target.value)}
                  placeholder={`Deliverable ${i + 1}`}
                  style={{
                    flex: 1, padding: '10px 14px',
                    border: '2px solid #e2e8f0', borderRadius: 10,
                    fontSize: 14, outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                {form.deliverableTitles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDeliverable(i)}
                    style={{
                      padding: '0 12px', background: '#fff1f2',
                      border: 'none', borderRadius: 10,
                      color: '#e11d48', cursor: 'pointer'
                    }}>
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDeliverable}
              style={{
                padding: '8px 16px', background: '#f8fafc',
                border: '1px dashed #cbd5e1', borderRadius: 10,
                color: '#64748b', fontSize: 13, cursor: 'pointer',
                fontWeight: 500
              }}>
              + Add deliverable
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}>
            {loading ? 'Sending...' : 'Send Proposal →'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// ── HELPERS ──────────────────────────────────────────────────
function StatusIcon({ status }) {
  const props = { size: 20 }
  switch (status) {
    case 'ACTIVE':    return <TrendingUp {...props} />
    case 'COMPLETED': return <CheckCircle {...props} />
    case 'REJECTED':  return <XCircle {...props} />
    case 'PENDING':
    default:          return <Clock {...props} />
  }
}

function EmptyState({ isBrand, onNew }) {
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: '60px 40px',
      textAlign: 'center', border: '1px solid #f1f5f9'
    }}>
      <Handshake size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
        No deals yet
      </h3>
      <p style={{ color: '#94a3b8', marginBottom: 24 }}>
        {isBrand
          ? 'Send your first deal proposal to an influencer'
          : 'Deals sent to you will appear here'}
      </p>
      {isBrand && (
        <button
          onClick={onNew}
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: 'white', border: 'none', borderRadius: 12,
            fontWeight: 600, cursor: 'pointer'
          }}>
          Send First Proposal
        </button>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      paddingTop: 64, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid #eff6ff', borderTopColor: '#2563eb',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}