import { NavLink } from 'react-router-dom'
import { navItems } from '../lib/navigation'

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi utama">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.shortLabel}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
