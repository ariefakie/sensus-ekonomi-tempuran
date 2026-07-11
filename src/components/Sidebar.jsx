import { NavLink } from 'react-router-dom'
import { Globe, BarChart2 } from 'lucide-react'
import { navItems } from '../lib/navigation'

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BarChart2 size={20} />
        </div>
        <div className="sidebar-logo-text">
          <div className="title">SE 2026 Tempuran</div>
          <span className="sub">BPS Kab. Karawang</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-group-label">Monitoring</div>

        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon className="si-icon" size={18} strokeWidth={2} />
            <div className="sidebar-item-text">
              <div className="sidebar-item-label">{item.label}</div>
              <div className="sidebar-item-desc">{item.desc}</div>
            </div>
          </NavLink>
        ))}

        <div className="sidebar-group-label">Umum</div>

        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Globe className="si-icon" size={18} strokeWidth={2} />
          <div className="sidebar-item-text">
            <div className="sidebar-item-label">Beranda</div>
            <div className="sidebar-item-desc">Halaman publik</div>
          </div>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-update">
          <span className="sidebar-status-dot" />
          <span>Kec. Tempuran · 2026</span>
        </div>
      </div>
    </aside>
  )
}
