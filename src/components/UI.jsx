import React, { memo } from 'react'

// ─── Loading Spinner ─────────────────────────────────────────────────────────
export function LoadingSpinner({ text = 'Memuat data...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = memo(function StatCard({ icon: Icon, value, label, color = 'primary', sub }) {
  const colors = {
    primary: { icon: 'var(--primary-light)', bg: 'var(--primary-glow)',         cls: 'stat-primary'  },
    success: { icon: 'var(--success-light)', bg: 'rgba(16,185,129,0.12)',       cls: 'stat-success'  },
    warning: { icon: 'var(--warning-light)', bg: 'rgba(245,158,11,0.12)',       cls: 'stat-warning'  },
    danger:  { icon: 'var(--danger-light)',  bg: 'rgba(239,68,68,0.12)',        cls: 'stat-danger'   },
    purple:  { icon: '#c4b5fd',              bg: 'rgba(139,92,246,0.12)',       cls: 'stat-primary'  },
    cyan:    { icon: '#67e8f9',              bg: 'rgba(34,211,238,0.12)',       cls: 'stat-primary'  },
    orange:  { icon: '#fdba74',              bg: 'rgba(249,115,22,0.12)',       cls: 'stat-warning'  },
  }
  const c = colors[color] || colors.primary

  return (
    <div className={`stat-card ${c.cls} animate-fade-in`}>
      <div className="stat-card-icon" style={{ background: c.bg }}>
        {Icon && <Icon size={20} color={c.icon} />}
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
    </div>
  )
})

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar = memo(function ProgressBar({ value, max, color = 'primary', showPct = true }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const cls = {
    primary: 'progress-fill-primary',
    success: 'progress-fill-success',
    warning: 'progress-fill-warning',
    danger:  'progress-fill-danger',
  }[color] || 'progress-fill-primary'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress-bar-container" style={{ flex: 1 }}>
        <div className={`progress-bar-fill ${cls}`} style={{ width: `${pct}%` }} />
      </div>
      {showPct && (
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
          {pct.toFixed(1)}%
        </span>
      )}
    </div>
  )
})

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = memo(function Badge({ type = 'neutral', children }) {
  return <span className={`badge badge-${type}`}>{children}</span>
})

// ─── Section Header ───────────────────────────────────────────────────────────
export const SectionHeader = memo(function SectionHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="section-header">
      <div>
        <div className="section-title">
          {Icon && (
            <div className="icon-wrapper">
              <Icon size={15} />
            </div>
          )}
          {title}
        </div>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
})

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = memo(function EmptyState({ icon = '📭', title = 'Tidak ada data', message, onReset }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {onReset && (
        <button onClick={onReset} style={{
          marginTop: 8, padding: '7px 16px', borderRadius: 'var(--r-md)',
          border: '1px solid var(--border-hover)', background: 'transparent',
          color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
        }}>
          Reset Filter
        </button>
      )}
    </div>
  )
})

// ─── Filter Bar ───────────────────────────────────────────────────────────────
// A ready-to-use filter container with search + dropdowns + count + reset
export const FilterBar = memo(function FilterBar({ children, count, total, label = 'data', onReset, hasFilter }) {
  return (
    <div className="filter-bar">
      {children}
      {hasFilter && (
        <button className="btn-reset" onClick={onReset}>
          ✕ Reset
        </button>
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

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────
export const CustomTooltip = memo(function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card-hover)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '10px 14px',
      fontSize: '0.8rem',
      boxShadow: 'var(--shadow-md)'
    }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value?.toLocaleString('id-ID')}
        </p>
      ))}
    </div>
  )
})
