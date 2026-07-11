import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Map, AlertTriangle,
  BarChart3, Activity, Globe
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    desc: 'Ringkasan progres',
  },
  {
    label: 'Petugas',
    icon: Users,
    to: '/petugas',
    desc: '46 PPL · 6 PML',
  },
  {
    label: 'SLS / Wilayah',
    icon: Map,
    to: '/sls',
    desc: '251 SLS · 14 Desa',
  },
  {
    label: 'Anomali',
    icon: AlertTriangle,
    to: '/anomali',
    desc: 'Usaha & Keluarga',
  },
  {
    label: 'Kualitas',
    icon: BarChart3,
    to: '/kualitas',
    desc: 'BKU · Keluarga · ART',
  },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* Logo / Branding */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">📊</div>
        <div className="sidebar-logo-text">
          <div className="title">SE 2026 Tempuran</div>
          <span className="sub">BPS Kab. Karawang</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-group-label">Menu Utama</div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon className="si-icon" size={17} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {item.desc}
              </div>
            </div>
          </NavLink>
        ))}

        <div className="sidebar-group-label" style={{ marginTop: 12 }}>Umum</div>

        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Globe className="si-icon" size={17} />
          <div style={{ flex: 1 }}>
            <div style={{ lineHeight: 1.3 }}>Landing Page</div>
            <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: 1 }}>
              Halaman publik
            </div>
          </div>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-update">
          <Activity size={12} color="var(--success)" />
          <span>Kec. Tempuran · 2026</span>
        </div>
      </div>
    </aside>
  )
}
