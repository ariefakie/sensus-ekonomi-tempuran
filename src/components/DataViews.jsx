import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, User, AlertTriangle } from 'lucide-react'
import { Badge, ProgressBar } from './UI'
import { formatNumber, getProgressBadge, getProgressColor } from '../lib/utils'
import { isAnomal } from '../lib/constants'

export const HeroBanner = memo(function HeroBanner({ eyebrow, title, description, children }) {
  return (
    <div className="hero-banner animate-fade-in">
      <div className="hero-banner-glow" />
      <div className="hero-banner-content">
        {eyebrow && <div className="hero-banner-eyebrow">{eyebrow}</div>}
        <h1 className="hero-banner-title">{title}</h1>
        {description && <p className="hero-banner-desc">{description}</p>}
      </div>
      {children && <div className="hero-banner-extra">{children}</div>}
    </div>
  )
})

export const BentoStat = memo(function BentoStat({ icon: Icon, value, label, sub, accent = 'primary', wide }) {
  return (
    <div className={`bento-stat bento-stat--${accent} ${wide ? 'bento-stat--wide' : ''}`}>
      <div className="bento-stat-icon">{Icon && <Icon size={22} strokeWidth={2} />}</div>
      <div className="bento-stat-value">{value}</div>
      <div className="bento-stat-label">{label}</div>
      {sub && <div className="bento-stat-sub">{sub}</div>}
    </div>
  )
})

export const ProgressRing = memo(function ProgressRing({ pct, size = 140, label = 'Submit' }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="progress-ring-center">
        <span className="progress-ring-pct">{pct}%</span>
        <span className="progress-ring-label">{label}</span>
      </div>
    </div>
  )
})

export const StatusPill = memo(function StatusPill({ icon, label, value, variant = 'default' }) {
  return (
    <div className={`status-pill status-pill--${variant}`}>
      <span className="status-pill-icon">{icon}</span>
      <span className="status-pill-label">{label}</span>
      <span className="status-pill-value">{value}</span>
    </div>
  )
})

export const RankList = memo(function RankList({ items, variant = 'top' }) {
  return (
    <div className="rank-list">
      {items.map((p, i) => (
        <div key={i} className={`rank-item rank-item--${variant}`}>
          <div className={`rank-badge rank-badge--${i}`}>{i + 1}</div>
          <div className="rank-info">
            <div className="rank-name">{p.nm_ppl}</div>
            <div className="rank-sub">{p.nm_pml}</div>
          </div>
          <Badge type={getProgressBadge(p.persen).type}>{p.persen}%</Badge>
        </div>
      ))}
    </div>
  )
})

export const DesaCard = memo(function DesaCard({ desa, index, target, submit, count, persen }) {
  const badge = getProgressBadge(persen)
  return (
    <div className="desa-card">
      <div className="desa-card-top">
        <span className="desa-card-rank">{index + 1}</span>
        <div className="desa-card-name">{desa}</div>
        <Badge type={badge.type}>{persen}%</Badge>
      </div>
      <ProgressBar value={submit} max={target} color={getProgressColor(persen)} />
      <div className="desa-card-meta">
        <span>{count} SLS</span>
        <span>{formatNumber(submit)} / {formatNumber(target)} submit</span>
      </div>
    </div>
  )
})

export const PMLCard = memo(function PMLCard({ pml, active, onClick }) {
  return (
    <button type="button" className={`pml-card ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="pml-card-top">
        <div className="pml-card-name">{pml.fullName}</div>
        <div className="pml-card-pct">{pml.persen}%</div>
      </div>
      <ProgressBar value={pml.submit} max={pml.target || 1} color={getProgressColor(pml.persen)} showPct={false} />
      <div className="pml-card-meta">{pml.ppl_count} PPL · {formatNumber(pml.submit)} submit</div>
    </button>
  )
})

export const PetugasCard = memo(function PetugasCard({ p, index }) {
  const badge = getProgressBadge(p.persen)
  return (
    <div className="data-card">
      <div className="data-card-header">
        <div className="data-card-avatar">{p.nm_ppl?.charAt(0) || '?'}</div>
        <div className="data-card-title-block">
          <div className="data-card-title">{p.nm_ppl}</div>
          <div className="data-card-subtitle"><User size={12} /> {p.nm_pml}</div>
        </div>
        <Badge type={badge.type}>{badge.label}</Badge>
      </div>
      <ProgressBar value={p.submit || 0} max={p.target_simpul || 1} color={getProgressColor(p.persen)} />
      <div className="data-card-footer">
        <span>#{index + 1}</span>
        <span>{formatNumber(p.submit)} / {formatNumber(p.target_simpul)}</span>
        <Link to={`/sls?ppl=${encodeURIComponent(p.nm_ppl)}`} className="data-card-link">
          Lihat SLS <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
})

export const SLSCard = memo(function SLSCard({ d, isOpen, onClick }) {
  const badge = getProgressBadge(d.persen)
  return (
    <button type="button" className={`data-card sls-card ${isOpen ? 'active' : ''}`} onClick={onClick}>
      <div className="data-card-header">
        <div className="data-card-icon-wrap"><MapPin size={16} /></div>
        <div className="data-card-title-block">
          <div className="data-card-title">{d.nmsls}</div>
          <div className="data-card-subtitle">{d.nmdesa} · {d.idsls}</div>
        </div>
        <Badge type={badge.type}>{badge.label}</Badge>
      </div>
      <ProgressBar value={d.submit || 0} max={d.target_simpul || 1} color={getProgressColor(d.persen)} />
      <div className="data-card-footer">
        <span><User size={12} /> {d.nm_ppl}</span>
        <span>{formatNumber(d.submit)}/{formatNumber(d.target_simpul)}</span>
        <ChevronRight size={16} className={isOpen ? 'rotated' : ''} />
      </div>
    </button>
  )
})

export const AnomalyCard = memo(function AnomalyCard({ d, colNama, rules, flagCount }) {
  const activeRules = rules.filter(r => isAnomal(d[r.key]))
  return (
    <div className="data-card anomaly-card">
      <div className="data-card-header">
        <div className="data-card-icon-wrap anomaly"><AlertTriangle size={16} /></div>
        <div className="data-card-title-block">
          <div className="data-card-title">{d[colNama] || '-'}</div>
          <div className="data-card-subtitle">{d.nm_ppl} · {d.kelurahan}</div>
        </div>
        <span className="anomaly-flag-count">{flagCount}</span>
      </div>
      {activeRules.length > 0 && (
        <div className="anomaly-rules">
          {activeRules.slice(0, 3).map(r => (
            <span key={r.key} className="anomaly-rule-tag">{r.label}</span>
          ))}
          {activeRules.length > 3 && <span className="anomaly-rule-tag">+{activeRules.length - 3}</span>}
        </div>
      )}
      <div className="data-card-footer">
        <span>SLS: {d.kode_sls}</span>
      </div>
    </div>
  )
})

export function MobileCardList({ children, className = '' }) {
  return <div className={`mobile-card-list ${className}`}>{children}</div>
}

export function DesktopTable({ children }) {
  return <div className="desktop-table">{children}</div>
}
