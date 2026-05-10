import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, XCircle, MessageSquare,
  Upload, ThumbsUp, ThumbsDown, DollarSign,
  Calendar, Package, Star, Clock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  PENDING:     { bg: '#fff7ed', color: '#ea580c' },
  ACTIVE:      { bg: '#f0fdf4', color: '#16a34a' },
  COMPLETED:   { bg: '#eff6ff', color: '#2563eb' },
  REJECTED:    { bg: '#fff1f2', color: '#e11d48' },
  NEGOTIATING: { bg: '#f5f3ff', color: '#7c3aed' },
  CANCELLED:   { bg: '#f8fafc', color: '#64748b' },
}

const DELIVERABLE_STYLE = {
  PENDING:   { bg: '#fff7ed', color: '#ea580c' },
  SUBMITTED: { bg: '#f0f9ff', color: '#0284c7' },
  APPROVED:  { bg: '#f0fdf4', color: '#16a34a' },
  REJECTED:  { bg: '#fff1f2', color: '#e11d48' },
}

export default function DealDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [deal, setDeal] = useState(null)
  const [deliverables, setDeliverables] = useState([])
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [counterText, setCounterText] = useState('')
  const [showCounter, setShowCounter] = useState(false)
  const [submitLinks, setSubmitLinks] = useState({})

  const isBrand = user?.role === 'BRAND'
  const isInfluencer = user?.role === 'INFLUENCER'

  useEffect(() => { fetchAll() }, [id])

  const fetchAll = async () => {
    try {
      const dealRes = await api.get(`/api/deals/${id}`)
      setDeal(dealRes.data)
      const delRes = await api.get(`/api/deliverables/deal/${id}`)
      setDeliverables(delRes.data)
      try {
        const payRes = await api.get(`/api/payments/deal/${id}`)
        setPayment(payRes.data)
      } catch (_) {}
    } catch (err) {
      toast.error('Failed to load deal')
    } finally {
      setLoading(false)
    }
  }

  const acceptDeal = async () => {
    try {
      await api.put(`/api/deals/${id}/accept`)
      toast.success('Deal accepted!')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const rejectDeal = async () => {
    if (!window.confirm('Reject this deal?')) return
    try {
      await api.put(`/api/deals/${id}/reject`)
      toast.success('Deal rejected')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const sendCounter = async () => {
    if (!counterText.trim()) return
    try {
      await api.put(`/api/deals/${id}/counter`, null, { params: { offer: counterText } })
      toast.success('Counter offer sent!')
      setShowCounter(false)
      setCounterText('')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const cancelDeal = async () => {
    if (!window.confirm('Cancel this deal?')) return
    try {
      await api.put(`/api/deals/${id}/cancel`)
      toast.success('Deal cancelled')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const submitDeliverable = async (delId) => {
    const link = submitLinks[delId]
    if (!link?.trim()) { toast.error('Enter a link'); return }
    try {
      await api.put(`/api/deliverables/${delId}/submit`, null, { params: { link } })
      toast.success('Submitted!')
      setSubmitLinks({ ...submitLinks, [delId]: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const approveDeliverable = async (delId) => {
    try {
      await api.put(`/api/deliverables/${delId}/approve`)
      toast.success('Approved!')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const rejectDeliverable = async (delId) => {
    const reason = window.prompt('Reason:')
    if (!reason) return
    try {
      await api.put(`/api/deliverables/${delId}/reject`, null, { params: { reason } })
      toast.success('Rejected')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const releasePayment = async () => {
    if (!window.confirm('Release payment?')) return
    try {
      await api.put(`/api/payments/deal/${id}/release`)
      toast.success('Payment released!')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  if (loading) return (
    <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #eff6ff', borderTopColor: '#2563eb', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!deal) return null

  const statusStyle = STATUS_STYLE[deal.status] || STATUS_STYLE.PENDING

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px' }}>

        <button onClick={() => navigate('/deals')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#64748b', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
          <ArrowLeft size={16} /> Back to Deals
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{deal.title}</h1>
              <p style={{ color: '#64748b', fontSize: 15 }}>
                {isBrand ? `Influencer: ${deal.influencerName}` : `Brand: ${deal.brandName}`}
              </p>
            </div>
            <span style={{ padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color }}>
              {deal.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { icon: <DollarSign size={16} />, label: 'Budget', value: `₹${deal.budgetAmount?.toLocaleString()}`, color: '#16a34a' },
              { icon: <Calendar size={16} />, label: 'Deadline', value: deal.deadline || 'Not set', color: '#ea580c' },
              { icon: <Package size={16} />, label: 'Platform', value: deal.platform || 'Not set', color: '#2563eb' },
            ].map((info) => (
              <div key={info.label} style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: info.color, marginBottom: 4, fontSize: 12, fontWeight: 600 }}>
                  {info.icon} {info.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{info.value}</div>
              </div>
            ))}
          </div>

          {deal.description && (
            <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{deal.description}</p>
            </div>
          )}

          {deal.counterOffer && (
            <div style={{ padding: '14px 16px', background: '#f5f3ff', borderRadius: 12, border: '1px solid #ede9fe', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', marginBottom: 4 }}>Counter Offer from Influencer</div>
              <p style={{ fontSize: 14, color: '#4c1d95' }}>{deal.counterOffer}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {isInfluencer && deal.status === 'PENDING' && (
              <>
                <ActionBtn label="Accept Deal" icon={<CheckCircle size={16} />} onClick={acceptDeal} primary color="#16a34a" />
                <ActionBtn label="Counter Offer" icon={<MessageSquare size={16} />} onClick={() => setShowCounter(!showCounter)} color="#7c3aed" />
                <ActionBtn label="Reject" icon={<XCircle size={16} />} onClick={rejectDeal} color="#e11d48" />
              </>
            )}
            {isInfluencer && deal.status === 'NEGOTIATING' && (
              <ActionBtn label="Accept Deal" icon={<CheckCircle size={16} />} onClick={acceptDeal} primary color="#16a34a" />
            )}
            {isBrand && ['PENDING', 'NEGOTIATING', 'ACTIVE'].includes(deal.status) && (
              <ActionBtn label="Cancel Deal" icon={<XCircle size={16} />} onClick={cancelDeal} color="#e11d48" />
            )}
            {isBrand && deal.status === 'COMPLETED' && payment?.status === 'PENDING' && (
              <ActionBtn label={`Release ₹${deal.budgetAmount?.toLocaleString()}`} icon={<DollarSign size={16} />} onClick={releasePayment} primary color="#16a34a" />
            )}
            {payment?.status === 'RELEASED' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#f0fdf4', borderRadius: 10, color: '#16a34a', fontSize: 14, fontWeight: 600 }}>
                <CheckCircle size={16} /> Payment Released
              </div>
            )}
          </div>

          {showCounter && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16 }}>
              <textarea
                value={counterText}
                onChange={e => setCounterText(e.target.value)}
                placeholder="Describe your counter offer..."
                rows={3}
                style={{ width: '100%', padding: '12px 14px', border: '2px solid #ede9fe', borderRadius: 12, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }}
              />
              <button onClick={sendCounter} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                Send Counter Offer
              </button>
            </motion.div>
          )}
        </motion.div>
        {deliverables.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>
              Deliverables ({deliverables.filter(d => d.status === 'APPROVED').length}/{deliverables.length} approved)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {deliverables.map((del) => {
                const ds = DELIVERABLE_STYLE[del.status] || DELIVERABLE_STYLE.PENDING
                return (
                  <div key={del.id} style={{ padding: '16px 18px', borderRadius: 14, border: `1px solid ${ds.color}22`, background: ds.bg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{del.title}</div>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: ds.bg, color: ds.color, flexShrink: 0 }}>
                        {del.status}
                      </span>
                    </div>

                    {del.submissionLink && (
                      <a href={del.submissionLink} target="_blank" rel="noreferrer"
                        style={{ display: 'inline-block', fontSize: 12, color: '#2563eb', marginBottom: 8, wordBreak: 'break-all' }}>
                        View submission
                      </a>
                    )}

                    {isInfluencer && deal.status === 'ACTIVE' && (del.status === 'PENDING' || del.status === 'REJECTED') && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <input
                          value={submitLinks[del.id] || ''}
                          onChange={e => setSubmitLinks({ ...submitLinks, [del.id]: e.target.value })}
                          placeholder="Paste your content link here..."
                          style={{ flex: 1, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
                        />
                        <button onClick={() => submitDeliverable(del.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '9px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          <Upload size={14} /> Submit
                        </button>
                      </div>
                    )}

                    {isBrand && del.status === 'SUBMITTED' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={() => approveDeliverable(del.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          <ThumbsUp size={14} /> Approve
                        </button>
                        <button onClick={() => rejectDeliverable(del.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          <ThumbsDown size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {deal.status === 'COMPLETED' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Leave a Review</h2>
            <ReviewForm
              dealId={parseInt(id)}
              revieweeId={isBrand ? deal.influencerId : deal.brandId}
              onDone={fetchAll}
            />
          </motion.div>
        )}

      </div>
    </div>
  )
}

function ReviewForm({ dealId, revieweeId, onDone }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const labels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']

  const submit = async () => {
    if (rating === 0) { toast.error('Please select a rating'); return }
    setLoading(true)
    try {
      await api.post('/api/reviews', { dealId, revieweeId, rating, comment })
      toast.success('Review submitted!')
      setSubmitted(true)
      onDone()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '20px 0', color: '#16a34a', fontWeight: 600 }}>
      <CheckCircle size={32} style={{ margin: '0 auto 8px' }} />
      Review submitted!
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={32}
            fill={(hovered || rating) >= star ? '#f59e0b' : 'none'}
            color={(hovered || rating) >= star ? '#f59e0b' : '#e2e8f0'}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
          />
        ))}
        {rating > 0 && (
          <span style={{ fontSize: 14, color: '#64748b', marginLeft: 4 }}>
            {labels[rating - 1]}
          </span>
        )}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience (optional)..."
        rows={3}
        style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }}
        onFocus={e => e.target.style.borderColor = '#2563eb'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
      <button onClick={submit} disabled={loading}
        style={{ padding: '11px 24px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}

function ActionBtn({ label, icon, onClick, primary, color }) {
  return (
    <button onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: primary ? color : 'white', color: primary ? 'white' : color, border: `1.5px solid ${color}44`, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
      {icon} {label}
    </button>
  )
}