import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Search, RefreshCw, ChevronRight, Menu } from 'lucide-react'

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

  // Quick search: pressing Enter routes to /sls or /petugas with query
  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      const s = search.trim()
      // Detect if likely PPL/PML name or SLS
      navigate(`/sls?q=${encodeURIComponent(s)}`)
      setSearch('')
    }
  }

  return (
    <header className="navbar">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="navbar-breadcrumb">
        <span>SE 2026</span>
        <ChevronRight size={12} />
        <span>Kec. Tempuran</span>
        <ChevronRight size={12} />
        <span className="current">{page.label}</span>
      </div>

      {/* Global search */}
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

      {/* Right side */}
      <div className="navbar-right">
        <div className="live-badge">
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
          style={{ transition: 'transform 0.3s' }}
        >
          <RefreshCw size={14} style={{ transform: rotating ? 'rotate(360deg)' : 'rotate(0deg)', transition: 'transform 0.6s ease' }} />
        </button>
      </div>
    </header>
  )
}
