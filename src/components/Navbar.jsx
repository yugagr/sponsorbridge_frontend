import { useNavigate, useLocation } from 'react-router-dom'
import { Zap, LayoutDashboard, Handshake, Search, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/deals', label: 'Deals', icon: <Handshake size={18} /> },
    ...(user?.role === 'BRAND'
      ? [{ path: '/search', label: 'Find Influencers', icon: <Search size={18} /> }]
      : []),
    { path: '/profile', label: 'Profile', icon: <User size={18} /> },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'white', borderBottom: '1px solid #f1f5f9',
      padding: '0 40px', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>

      {/* LOGO */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
        }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Zap size={16} color="white" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
          SponsorBridge
        </span>
      </div>

      {/* NAV LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10, border: 'none',
              background: isActive(item.path) ? '#eff6ff' : 'transparent',
              color: isActive(item.path) ? '#2563eb' : '#64748b',
              fontWeight: isActive(item.path) ? 600 : 500,
              fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* USER + LOGOUT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 14px', background: '#f8fafc',
          borderRadius: 10, border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 700
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            border: '1px solid #fee2e2', background: '#fff5f5',
            color: '#ef4444', fontWeight: 500, fontSize: 14,
            cursor: 'pointer'
          }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  )
}