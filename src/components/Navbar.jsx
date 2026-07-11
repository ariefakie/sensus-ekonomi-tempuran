import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Search, RefreshCw, ChevronRight, Menu, X } from 'lucide-react'

const pageTitles = {
  '/':          { label: 'Landing Page', crumb: 'Beranda' },
  '/dashboard': { label: 'Dashboard',   crumb: 'Ringkasan' },
  '/petugas':   { label: 'Petugas',     crumb: 'PPL & PML' },
  '/sls':       { label: 'SLS / Wilayah', crumb: 'Wilayah Kerja' },
  '/anomali':   { label: 'Anomali',     crumb: 'Temuan Anomali' },
  '/kualitas':  { label: 'Kualitas',    crumb: 'Kualitas Pendataan' },
}

export default function Navbar({ onRefresh, onMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [time, setTime]         = useState(new Date())
  const [search, setSearch]     = useState('')
  const [rotating, setRotating] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const page = pageTitles[location.pathname] || { label: 'Monitoring', crumb: '' }

  const handleRefresh = () => {
    setRotating(true)
    onRefresh()
    setTimeout(() => setRotating(false), 800)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const s = search.trim()
      navigate(`/sls?q=${encodeURIComponent(s)}`)
      setSearch('')
      setMobileSearch(false)
    }
  }

  return (
    <header className={`navbar ${mobileSearch ? 'search-active' : ''}`}>
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Buka menu">
        <Menu size={20} />
      </button>

      {!mobileSearch && (
        <div className="navbar-breadcrumb">
          <span className="hide-xs">SE 2026</span>
          <ChevronRight size={12} className="hide-xs" />
          <span className="hide-xs">Kec. Tempuran</span>
          <ChevronRight size={12} className="hide-xs" />
          <span className="current">{page.label}</span>
        </div>
      )}

      <div className={`navbar-mobile-search ${mobileSearch ? 'active' : ''}`}>
        <div className="navbar-search-inner">
          <Search size={14} color="var(--text-muted)" />
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
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Cari PPL, Desa, atau SLS… (Enter)"
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
              <Search size={14} />
            </button>

            <div className="live-badge" title="Data live">
              <div className="pulse-dot" />
              Live
            </div>

            <span className="navbar-time">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>

            <button
              className="icon-btn"
              onClick={handleRefresh}
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw size={14} style={{ transform: rotating ? 'rotate(360deg)' : 'rotate(0deg)', transition: 'transform 0.6s ease' }} />
            </button>
          </>
        ) : (
          <button
            className="icon-btn"
            onClick={() => setMobileSearch(false)}
            aria-label="Tutup pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </header>
  )
}
