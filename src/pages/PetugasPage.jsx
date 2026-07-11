import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, Search, Filter, X, ChevronDown, TrendingUp, ArrowRight } from 'lucide-react'
import { getRekapPPL, getProgresCapaian } from '../services/api'
import {
  LoadingSpinner, ProgressBar, Badge, TableScrollHint
} from '../components/UI'
import { HeroBanner, BentoStat, PMLCard, PetugasCard, MobileCardList, DesktopTable } from '../components/DataViews'
import { formatNumber, getProgressBadge, getProgressColor } from '../lib/utils'

export default function PetugasPage() {
  const [search,    setSearch]    = useState('')
  const [filterPML, setFilterPML] = useState('all')
  const [filterPPL, setFilterPPL] = useState('all')
  const [filterDesa, setFilterDesa] = useState('all')
  const [sortBy,    setSortBy]    = useState('persen_desc')

  const { data: pplData, isLoading: l1 } = useQuery({ queryKey: ['rekap_ppl'],  queryFn: getRekapPPL })
  const { data: progres, isLoading: l2 } = useQuery({ queryKey: ['progres'],    queryFn: getProgresCapaian })

  if (l1 || l2) return <LoadingSpinner text="Memuat data petugas..." />

  // ── Processed ───────────────────────────────────────────────────────────────
  const data = (pplData || []).map(p => ({
    ...p,
    persen: (p.target_simpul || 0) > 0
      ? parseFloat(((p.submit / p.target_simpul) * 100).toFixed(1))
      : 0
  }))

  const progData = progres || []
  const pmlList = [...new Set(progData.map(d => d.nm_pml).filter(Boolean))].sort()

  const allowedPPL = filterPML === 'all' ? progData : progData.filter(d => d.nm_pml === filterPML)
  const pplList = [...new Set(allowedPPL.map(d => d.nm_ppl).filter(Boolean))].sort()

  const allowedDesa = filterPPL === 'all' ? allowedPPL : allowedPPL.filter(d => d.nm_ppl === filterPPL)
  const desaList = [...new Set(allowedDesa.map(d => d.nmdesa).filter(Boolean))].sort()

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = data
    .filter(p => {
      const s = search.trim().toLowerCase()
      const matchSearch =
        s === '' ||
        (p.nm_ppl && p.nm_ppl.toLowerCase().includes(s)) ||
        (p.nm_pml && p.nm_pml.toLowerCase().includes(s))
      const matchPML = filterPML === 'all' || p.nm_pml === filterPML
      const matchPPL = filterPPL === 'all' || p.nm_ppl === filterPPL

      // Untuk Desa, kita cari apakah PPL ini menangani wilayah tersebut
      let matchDesa = filterDesa === 'all'

      if (!matchDesa) {
        const assigned = progData.filter(d => d.nm_ppl === p.nm_ppl)
        if (filterDesa !== 'all') {
          matchDesa = assigned.some(d => d.nmdesa === filterDesa)
        }
      }

      return matchSearch && matchPML && matchPPL && matchDesa
    })
    .sort((a, b) => {
      if (sortBy === 'persen_desc') return b.persen - a.persen
      if (sortBy === 'persen_asc')  return a.persen - b.persen
      if (sortBy === 'submit_desc') return (b.submit || 0) - (a.submit || 0)
      if (sortBy === 'target_desc') return (b.target_simpul || 0) - (a.target_simpul || 0)
      return 0
    })

  // ── Stats ───────────────────────────────────────────────────────────────────
  const avgPersen = filtered.length
    ? (filtered.reduce((s, p) => s + p.persen, 0) / filtered.length).toFixed(1)
    : 0
  const topPersen = filtered.length
    ? Math.max(...filtered.map(p => p.persen)).toFixed(1)
    : 0

  // ── Per PML cards ────────────────────────────────────────────────────────────
  const pmlUnique = [...new Set(data.map(p => p.nm_pml).filter(Boolean))].sort()
  const perPML = pmlUnique.map(pml => {
    const group  = data.filter(p => p.nm_pml === pml)
    const target = group.reduce((s, p) => s + (p.target_simpul || 0), 0)
    const submit = group.reduce((s, p) => s + (p.submit || 0), 0)
    return {
      fullName: pml,
      target, submit,
      persen: target > 0 ? parseFloat(((submit / target) * 100).toFixed(1)) : 0,
      ppl_count: group.length
    }
  }).sort((a, b) => b.persen - a.persen)

  const hasFilter = search !== '' || filterPML !== 'all' || filterPPL !== 'all' || filterDesa !== 'all'
  const resetFilters = () => { setSearch(''); setFilterPML('all'); setFilterPPL('all'); setFilterDesa('all') }

  return (
    <div className="page-content animate-fade-in">
      <HeroBanner
        eyebrow="Manajemen Petugas"
        title="Data PPL & PML"
        description={`Monitoring kinerja ${data.length} PPL di bawah ${pmlUnique.length} PML`}
      />

      <div className="bento-grid">
        <BentoStat icon={Users} value={filtered.length} label="PPL Tampil" sub={`dari ${data.length}`} accent="primary" />
        <BentoStat icon={Users} value={pmlUnique.length} label="Total PML" accent="accent" />
        <BentoStat icon={TrendingUp} value={`${avgPersen}%`} label="Rata-rata" accent="warning" />
        <BentoStat icon={TrendingUp} value={`${topPersen}%`} label="Tertinggi" accent="success" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title"><span className="panel-title-icon"><TrendingUp size={16} /></span> Progress per PML</div>
            <p className="panel-subtitle">Klik kartu untuk memfilter daftar PPL</p>
          </div>
        </div>
        <div className="pml-grid">
          {perPML.map((pml, i) => (
            <PMLCard
              key={i}
              pml={pml}
              active={filterPML === pml.fullName}
              onClick={() => setFilterPML(filterPML === pml.fullName ? 'all' : pml.fullName)}
            />
          ))}
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-search" style={{ flex: '1 1 200px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Pencarian bebas…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <X size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }}
              onClick={() => setSearch('')} />
          )}
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterPML} onChange={e => {
            setFilterPML(e.target.value)
            setFilterPPL('all')
            setFilterDesa('all')
          }}>
            <option value="all">— PML —</option>
            {pmlList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterPPL} onChange={e => {
            setFilterPPL(e.target.value)
            setFilterDesa('all')
          }}>
            <option value="all">— PPL —</option>
            {pplList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterDesa} onChange={e => {
            setFilterDesa(e.target.value)
          }}>
            <option value="all">— Desa —</option>
            {desaList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <ChevronDown size={13} color="var(--text-muted)" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="persen_desc">Progress ↓ Tinggi</option>
            <option value="persen_asc">Progress ↑ Rendah</option>
            <option value="submit_desc">Submit Terbanyak</option>
            <option value="target_desc">Target Terbesar</option>
          </select>
        </div>

        {hasFilter && <button className="btn-reset" onClick={resetFilters}><X size={12} /> Reset</button>}

        <div className="filter-count">
          <strong>{filtered.length}</strong> / {data.length} PPL
        </div>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: 32 }}>
            <div className="empty-state-icon">👤</div>
            <h4>Tidak ada petugas ditemukan</h4>
            {hasFilter && <button className="btn-reset" onClick={resetFilters} style={{ marginTop: 8 }}><X size={12} /> Reset</button>}
          </div>
        ) : (
          <>
            <MobileCardList>
              {filtered.map((p, i) => <PetugasCard key={p.id || i} p={p} index={i} />)}
            </MobileCardList>
            <DesktopTable>
              <TableScrollHint />
              <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama PPL</th>
                <th>PML</th>
                <th style={{ textAlign: 'right' }}>Target</th>
                <th style={{ textAlign: 'right' }}>Submit</th>
                <th style={{ textAlign: 'right' }}>Draft</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const badge = getProgressBadge(p.persen)
                return (
                  <tr key={p.id || i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.nm_ppl}</div>
                      {p.email_ppl && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.email_ppl}</div>
                      )}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.78rem',
                        padding: '3px 8px',
                        borderRadius: 'var(--r-full)',
                        background: 'var(--primary-glow)',
                        color: 'var(--primary-light)',
                        border: '1px solid rgba(255,112,67,0.2)'
                      }}>
                        {p.nm_pml}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(p.target_simpul)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--success-light)', fontWeight: 600 }}>
                      {formatNumber(p.submit)}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--warning-light)' }}>
                      {formatNumber(p.draft) || 0}
                    </td>
                    <td style={{ minWidth: 150 }}>
                      <ProgressBar value={p.submit || 0} max={p.target_simpul || 1} color={getProgressColor(p.persen)} />
                    </td>
                    <td><Badge type={badge.type}>{badge.label}</Badge></td>
                    <td>
                      <Link
                        to={`/sls?ppl=${encodeURIComponent(p.nm_ppl)}`}
                        className="btn btn-outline btn-sm"
                      >
                        SLS <ArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
            </DesktopTable>
          </>
        )}
      </div>
    </div>
  )
}
