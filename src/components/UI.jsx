import React, { memo } from 'react'

export function LoadingSpinner({ text = 'Memuat data...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  )
}

export const PageHeader = memo(function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="page-header animate-fade-in">
      {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
})

export const StatCard = memo(function StatCard({ icon: Icon, value, label, color = 'primary', sub }) {
  const colors = {
    primary: { icon: 'var(--primary-light)', bg: 'var(--primary-glow)', cls: 'stat-primary' },
    success: { icon: 'var(--success-light)', bg: 'rgba(34,201,151,0.12)', cls: 'stat-success' },
    warning: { icon: 'var(--warning-light)', bg: 'rgba(251,191,36,0.12)', cls: 'stat-warning' },
    danger:  { icon: 'var(--danger-light)',  bg: 'rgba(248,113,113,0.12)', cls: 'stat-danger' },
    purple:  { icon: '#C4B5FD', bg: 'rgba(167,139,250,0.12)', cls: 'stat-primary' },
    cyan:    { icon: '#5EEAD4', bg: 'rgba(45,212,191,0.12)', cls: 'stat-primary' },
    orange:  { icon: '#FDBA74', bg: 'rgba(251,146,60,0.12)', cls: 'stat-warning' },
  }
  const c = colors[color] || colors.primary

  return (
    <div className={`stat-card ${c.cls} animate-fade-in`}>
      <div className="stat-card-icon" style={{ background: c.bg }}>
        {Icon && <Icon size={20} color={c.icon} strokeWidth={2} />}
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
    </div>
  )
})

export const ProgressBar = memo(function ProgressBar({ value, max, color = 'primary', showPct = true }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const cls = {
    primary: 'progress-fill-primary',
    success: 'progress-fill-success',
    warning: 'progress-fill-warning',
    danger:  'progress-fill-danger',
  }[color] || 'progress-fill-primary'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-bar-container" style={{ flex: 1 }}>
        <div className={`progress-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      {showPct && (
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          minWidth: 38,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
        }}>
          {pct.toFixed(1)}%
        </span>
      )}
    </div>
  )
})

export const Badge = memo(function Badge({ type = 'neutral', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>
})

export const SectionHeader = memo(function SectionHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="section-header">
      <div>
        <div className="section-title">
          {Icon && (
            <div className="icon-wrapper">
              <Icon size={16} strokeWidth={2} />
            </div>
          )}
          {title}
        </div>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
})

export const EmptyState = memo(function EmptyState({ icon = '📭', title = 'Tidak ada data', message, onReset }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {onReset && (
        <button className="btn btn-outline btn-sm" onClick={onReset} style={{ marginTop: 8 }}>
          Reset Filter
        </button>
      )}
    </div>
  )
})

export const FilterBar = memo(function FilterBar({ children, count, total, label = 'data', onReset, hasFilter }) {
  return (
    <div className="filter-bar">
      {children}
      {hasFilter && (
        <button className="btn-reset" onClick={onReset}>✕ Reset</button>
      )}
      {count !== undefined && (
        <div className="filter-count">
          <strong>{count.toLocaleString('id-ID')}</strong>
          {total !== undefined && ` / ${total.toLocaleString('id-ID')}`} {label}
        </div>
      )}
    </div>
  )
})

export function TableScrollHint({ text = '← Geser untuk melihat kolom lain →' }) {
  return <div className="table-scroll-hint">{text}</div>
}

export const CustomTooltip = memo(function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card-hover)',
      border: '1px solid var(--border-sm)',
      borderRadius: 'var(--r-md)',
      padding: '12px 16px',
      fontSize: '0.8rem',
      boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, fontSize: '0.75rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
          {p.name}: {p.value?.toLocaleString('id-ID')}
        </p>
      ))}
    </div>
  )
})
