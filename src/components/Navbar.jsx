import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Search, RefreshCw, Menu, X } from 'lucide-react'
import { pageMeta } from '../lib/navigation'

export default function Navbar({ onRefresh, onMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [search, setSearch] = useState('')
  const [rotating, setRotating] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const meta = pageMeta[location.pathname] || { title: 'Monitoring', subtitle: '' }

  const handleRefresh = () => {
    setRotating(true)
    onRefresh()
    setTimeout(() => setRotating(false), 800)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/sls?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileSearch(false)
    }
  }

  return (
    <header className={`navbar ${mobileSearch ? 'search-active' : ''}`}>
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Buka menu">
        <Menu size={20} />
      </button>

      <div className="navbar-page-title">{meta.title}</div>

      {!mobileSearch && (
        <div className="navbar-breadcrumb">
          <span>SE 2026</span>
          <span className="current">{meta.title}</span>
        </div>
      )}

      <div className={`navbar-mobile-search ${mobileSearch ? 'active' : ''}`}>
        <div className="navbar-search-inner">
          <Search size={15} color="var(--text-muted)" />
          <input
            placeholder="Cari PPL, Desa, SLS…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus={mobileSearch}
          />
        </div>
      </div>

      <div className="navbar-search">
        <div className="navbar-search-inner">
          <Search size={15} color="var(--text-muted)" />
          <input
            placeholder="Cari PPL, Desa, atau SLS…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      <div className="navbar-right">
        {!mobileSearch ? (
          <>
            <button
              className="icon-btn navbar-search-toggle"
              onClick={() => setMobileSearch(true)}
              aria-label="Cari"
            >
              <Search size={15} />
            </button>

            <div className="live-badge" title="Data live">
              <div className="pulse-dot" />
              Live
            </div>

            <span className="navbar-time">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>

            <button className="icon-btn" onClick={handleRefresh} aria-label="Refresh data">
              <RefreshCw
                size={15}
                style={{
                  transform: rotating ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.6s ease',
                }}
              />
            </button>
          </>
        ) : (
          <button className="icon-btn" onClick={() => setMobileSearch(false)} aria-label="Tutup pencarian">
            <X size={15} />
          </button>
        )}
      </div>
    </header>
  )
}
