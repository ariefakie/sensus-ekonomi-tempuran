import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  Map, Search, Filter, X, ChevronDown, ChevronUp,
  Activity, Building, AlertTriangle, CheckCircle, Users
} from 'lucide-react'
import { getProgresCapaian, getSLSDetail } from '../services/api'
import {
  LoadingSpinner, ProgressBar, Badge, StatCard
} from '../components/UI'
import { formatNumber, getProgressBadge, getProgressColor } from '../lib/utils'
import { RULES_USAHA, RULES_KELUARGA, isAnomal } from '../lib/constants'

// ─── Inline Detail Panel (rendered as <tr> inside table) ─────────────────────
function SLSDetailPanel({ sls, onClose, colSpan }) {
  const { data, isLoading } = useQuery({
    queryKey: ['sls_detail', sls.idsls],
    queryFn: () => getSLSDetail(sls.idsls)
  })

  const [activeTab, setActiveTab] = useState('kualitas') // 'kualitas' or 'anomali'

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Count active anomalies
  const anomaliUsaha = (data?.anomali_usaha || []).filter(a =>
    RULES_USAHA.some(r => isAnomal(a[r.key]))
  )
  const anomaliKeluarga = (data?.anomali_keluarga || []).filter(a =>
    RULES_KELUARGA.some(r => isAnomal(a[r.key]))
  )

  const persen = sls.target_simpul > 0
    ? Math.round((sls.submit / sls.target_simpul) * 100)
    : 0

  const chip = (label, val, color) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '5px 8px', borderRadius: 6,
      background: color ? `rgba(${color},0.06)` : 'var(--bg-card)',
      border: `1px solid ${color ? `rgba(${color},0.18)` : 'var(--border)'}`,
      fontSize: '0.72rem',
    }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{
        fontWeight: 800, fontSize: '0.85rem',
        color: color ? `rgb(${color})` : 'var(--text-primary)',
      }}>{val ?? '-'}</span>
    </div>
  )

  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0, borderBottom: '2px solid var(--primary)' }}>
        <div style={{
          background: 'linear-gradient(180deg, var(--bg-card-2) 0%, var(--bg-surface) 100%)',
          borderLeft: '3px solid var(--primary)',
          animation: 'expandDown 0.22s ease forwards',
        }}>

          {/* ── Top bar ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: 'var(--grad-primary)', borderRadius: 8,
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Map size={15} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {sls.nmsls}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
                  {sls.nmdesa} &nbsp;·&nbsp;
                  <span style={{ fontFamily: 'monospace' }}>{sls.idsls}</span> &nbsp;·&nbsp;
                  PPL: <strong style={{ color: 'var(--text-secondary)' }}>{sls.nm_ppl || '-'}</strong> &nbsp;·&nbsp;
                  PML: <strong style={{ color: 'var(--text-secondary)' }}>{sls.nm_pml || '-'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', background: 'var(--bg-card-2)', borderRadius: 8, padding: 4, border: '1px solid var(--border)' }}>
                <button 
                  onClick={() => setActiveTab('kualitas')}
                  style={{
                    padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: activeTab === 'kualitas' ? 'var(--bg-card)' : 'transparent',
                    color: activeTab === 'kualitas' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'kualitas' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                  📊 Kualitas Data
                </button>
                <button 
                  onClick={() => setActiveTab('anomali')}
                  style={{
                    padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: activeTab === 'anomali' ? 'var(--bg-card)' : 'transparent',
                    color: activeTab === 'anomali' ? 'var(--danger)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'anomali' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                  ⚠️ Anomali
                </button>
              </div>

              <button onClick={onClose} style={{
                background: 'var(--bg-card-2)', border: '1px solid var(--border)',
                borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5,
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                <X size={13} /> Tutup
              </button>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: 24 }}>
              <LoadingSpinner text="Memuat detail SLS..." />
            </div>
          ) : (
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {activeTab === 'kualitas' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {/* Progress Card */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', borderTop: '2px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                      <Activity size={13} /> Progress Pendataan
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
                      {chip('Target', data?.progres?.target_simpul ?? sls.target_simpul)}
                      {chip('Submit', data?.progres?.submit ?? sls.submit, '16,185,129')}
                      {chip('Draft', data?.progres?.draft ?? sls.draft, '245,158,11')}
                    </div>
                    <div style={{ background: 'var(--bg-card-2)', borderRadius: 6, padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ProgressBar value={sls.submit || 0} max={sls.target_simpul || 1} color={getProgressColor(persen)} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, marginLeft: 10, color: persen >= 100 ? 'var(--success)' : persen > 0 ? 'var(--warning)' : 'var(--danger)', flexShrink: 0 }}>
                        {persen}%
                      </span>
                    </div>
                  </div>

                  {/* Kualitas Usaha Card */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', borderTop: '2px solid var(--success)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>
                      <Building size={13} /> Kualitas BKU
                    </div>
                    {data?.kualitas_usaha?.length > 0 ? (() => {
                      const u = data.kualitas_usaha[0]
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {chip('Prelist', u.jml_prelist_usaha)}
                          {chip('Ditemukan', u.bku_ditemukan, '16,185,129')}
                          {chip('Baru', u.bku_baru, '99,102,241')}
                          {chip('Hilang', u.bku_tidak_ditemukan, '239,68,68')}
                          {chip('Tutup/Ganda', (u.bku_tutup || 0) + (u.bku_ganda || 0), '245,158,11')}
                        </div>
                      )
                    })() : <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: 4 }}>Belum ada data BKU.</div>}
                  </div>

                  {/* Kualitas Keluarga Card */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', borderTop: '2px solid #22d3ee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee' }}>
                      <Users size={13} /> Kualitas Keluarga
                    </div>
                    {data?.kualitas_keluarga?.length > 0 ? (() => {
                      const k = data.kualitas_keluarga[0]
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {chip('Prelist', k.prelist_awal)}
                          {chip('Ditemukan', k.ditemukan, '16,185,129')}
                          {chip('Baru', k.keluarga_baru, '99,102,241')}
                          {chip('Tdk Ditemukan', k.tidak_ditemukan, '239,68,68')}
                          {chip('Tdk Eligible', k.tidak_eligible, '245,158,11')}
                        </div>
                      )
                    })() : <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: 4 }}>Belum ada data Keluarga.</div>}
                  </div>

                  {/* Kualitas ART Card */}
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', borderTop: '2px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6' }}>
                      <Users size={13} /> Kualitas ART
                    </div>
                    {data?.kualitas_art?.length > 0 ? (() => {
                      const art = data.kualitas_art[0]
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {chip('Total ART', art.total_art, '139,92,246')}
                          {chip('Bersama KK', art.tinggal_bersama_kk, '16,185,129')}
                          {chip('ART Baru', art.art_baru, '59,130,246')}
                          {chip('Meninggal', art.meninggal, '245,158,11')}
                          {chip('Tdk Ditemukan', (art.pindah_dn || 0) + (art.pindah_ln || 0) + (art.tidak_ditemukan || 0), '239,68,68')}
                        </div>
                      )
                    })() : <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: 4 }}>Belum ada data ART.</div>}
                  </div>
                </div>
              )}

              {activeTab === 'anomali' && (
                <>
                  {/* Anomali Summary */}
                  {anomaliUsaha.length === 0 && anomaliKeluarga.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 8, background: 'var(--bg-card)', border: '1px dashed var(--success)', borderRadius: 12 }}>
                      <CheckCircle size={36} color="var(--success)" />
                      <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>Tidak ada anomali di SLS ini!</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Anomali Usaha</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Building size={14} color="var(--danger)" />
                            <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{anomaliUsaha.length} Kasus</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: anomaliUsaha.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {anomaliUsaha.length}
                        </span>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>Anomali Keluarga</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Users size={14} color="var(--danger)" />
                            <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{anomaliKeluarga.length} Kasus</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: anomaliKeluarga.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {anomaliKeluarga.length}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Anomali detail lists */}
                  {(anomaliUsaha.length > 0 || anomaliKeluarga.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: anomaliUsaha.length > 0 && anomaliKeluarga.length > 0 ? '1fr 1fr' : '1fr', gap: 12 }}>
                      {/* Anomali Usaha List */}
                      {anomaliUsaha.length > 0 && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.07)', borderBottom: '1px solid rgba(239,68,68,0.15)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Building size={13} /> Daftar Anomali Usaha
                          </div>
                          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                            {anomaliUsaha.map((a, i) => {
                              const active = RULES_USAHA.filter(r => isAnomal(a[r.key]))
                              return (
                                <div key={i} style={{ background: 'var(--bg-card-2)', borderRadius: 7, padding: '9px 11px', border: '1px solid var(--border)' }}>
                                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                                    {a.nm_usaha || a.nama_usaha || 'Tanpa Nama'}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {active.map(r => (
                                      <div key={r.key} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '4px 7px', borderRadius: 5, background: 'rgba(239,68,68,0.05)' }}>
                                        <AlertTriangle size={11} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 600 }}>{r.desc}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Anomali Keluarga List */}
                      {anomaliKeluarga.length > 0 && (
                        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.07)', borderBottom: '1px solid rgba(239,68,68,0.15)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 7 }}>
                            <Users size={13} /> Daftar Anomali Keluarga
                          </div>
                          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                            {anomaliKeluarga.map((a, i) => {
                              const active = RULES_KELUARGA.filter(r => isAnomal(a[r.key]))
                              return (
                                <div key={i} style={{ background: 'var(--bg-card-2)', borderRadius: 7, padding: '9px 11px', border: '1px solid var(--border)' }}>
                                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                                    {a.nm_keluarga || a.nama_keluarga || 'Tanpa Nama'}
                                  </div>
                                  <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: 6 }}>NKK: {a.nkk || '-'}</div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {active.map(r => (
                                      <div key={r.key} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '4px 7px', borderRadius: 5, background: 'rgba(239,68,68,0.05)' }}>
                                        <AlertTriangle size={11} color="var(--danger)" style={{ marginTop: 2, flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 600 }}>{r.desc}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SLSPage() {
  const [searchParams] = useSearchParams()

  const initQ   = searchParams.get('q')   || ''
  const initPPL = searchParams.get('ppl') || ''

  const [search,       setSearch]       = useState(initQ)
  const [filterPML,    setFilterPML]    = useState('all')
  const [filterPPL,    setFilterPPL]    = useState(initPPL)
  const [filterDesa,   setFilterDesa]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy,       setSortBy]       = useState('idsls')
  const [selectedSLS,  setSelectedSLS]  = useState(null)

  const { data: progres, isLoading } = useQuery({
    queryKey: ['progres'],
    queryFn: getProgresCapaian
  })

  if (isLoading) return <LoadingSpinner text="Memuat data SLS..." />

  const data = (progres || []).map(d => ({
    ...d,
    persen: (d.target_simpul || 0) > 0
      ? parseFloat(((d.submit / d.target_simpul) * 100).toFixed(1))
      : 0
  }))

  const pmlList     = [...new Set(data.map(d => d.nm_pml).filter(Boolean))].sort()
  const allowedPPL  = filterPML === 'all' ? data : data.filter(d => d.nm_pml === filterPML)
  const pplList     = [...new Set(allowedPPL.map(d => d.nm_ppl).filter(Boolean))].sort()
  const allowedDesa = (filterPPL === 'all' || filterPPL === '') ? allowedPPL : allowedPPL.filter(d => (d.nm_ppl || '').toLowerCase() === filterPPL.toLowerCase())
  const desaList    = [...new Set(allowedDesa.map(d => d.nmdesa).filter(Boolean))].sort()

  const filtered = data
    .filter(d => {
      const s = search.trim().toLowerCase()
      const matchSearch = s === '' ||
        (d.nmsls  && d.nmsls.toLowerCase().includes(s))  ||
        (d.nm_ppl && d.nm_ppl.toLowerCase().includes(s)) ||
        (d.nm_pml && d.nm_pml.toLowerCase().includes(s)) ||
        (d.nmdesa && d.nmdesa.toLowerCase().includes(s)) ||
        (d.idsls  && String(d.idsls).includes(search.trim()))
      const matchPML    = filterPML === 'all' || d.nm_pml === filterPML
      const matchPPL    = filterPPL === '' || filterPPL === 'all' || (d.nm_ppl || '').toLowerCase() === filterPPL.toLowerCase()
      const matchDesa   = filterDesa === 'all' || d.nmdesa === filterDesa
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'selesai'  && d.persen >= 100) ||
        (filterStatus === 'sebagian' && d.persen > 0 && d.persen < 100) ||
        (filterStatus === 'belum'    && d.persen === 0)
      return matchSearch && matchPML && matchPPL && matchDesa && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === 'idsls')       return String(a.idsls || '').localeCompare(String(b.idsls || ''))
      if (sortBy === 'persen_desc') return b.persen - a.persen
      if (sortBy === 'persen_asc')  return a.persen - b.persen
      if (sortBy === 'submit_desc') return (b.submit || 0) - (a.submit || 0)
      if (sortBy === 'target_desc') return (b.target_simpul || 0) - (a.target_simpul || 0)
      return 0
    })

  const selesai  = filtered.filter(d => d.persen >= 100).length
  const sebagian = filtered.filter(d => d.persen > 0 && d.persen < 100).length
  const belum    = filtered.filter(d => d.persen === 0).length

  const hasFilter = search !== '' || filterPML !== 'all' || (filterPPL !== '' && filterPPL !== 'all') || filterDesa !== 'all' || filterStatus !== 'all'
  const resetFilters = () => { setSearch(''); setFilterPML('all'); setFilterPPL('all'); setFilterDesa('all'); setFilterStatus('all') }

  const handleRowClick = (d) => {
    setSelectedSLS(prev => prev?.idsls === d.idsls ? null : d)
  }

  const statusChips = [
    { key: 'all',      label: 'Semua',    icon: '🗂️', activeClass: 'active'         },
    { key: 'selesai',  label: 'Selesai',  icon: '✅', activeClass: 'active-success' },
    { key: 'sebagian', label: 'Sebagian', icon: '⏳', activeClass: 'active-warning' },
    { key: 'belum',    label: 'Belum',    icon: '❌', activeClass: 'active-danger'  },
  ]

  const COL = 10

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <div className="page-header-eyebrow">Wilayah Kerja</div>
        <h2>Data SLS / Wilayah Tugas</h2>
        <p>Progres pendataan {data.length} SLS di {desaList.length} desa, Kecamatan Tempuran. <strong>Klik baris untuk melihat detail Kualitas &amp; Anomali.</strong></p>
      </div>

      <div className="grid-stats">
        <StatCard icon={Map} value={filtered.length}  label="SLS Tampil"   color="primary" sub={`dari ${data.length} total`} />
        <StatCard icon={Map} value={selesai}           label="Selesai 100%" color="success" />
        <StatCard icon={Map} value={sebagian}          label="Sedang Jalan" color="warning" />
        <StatCard icon={Map} value={belum}             label="Belum Mulai"  color="danger"  />
      </div>

      <div className="chip-group">
        {statusChips.map(s => (
          <button
            key={s.key}
            className={`chip ${filterStatus === s.key ? s.activeClass : ''}`}
            onClick={() => setFilterStatus(s.key)}
          >
            {s.icon} {s.label}
            {s.key === 'selesai'  && <span style={{ fontWeight: 800 }}> ({data.filter(d => d.persen >= 100).length})</span>}
            {s.key === 'sebagian' && <span style={{ fontWeight: 800 }}> ({data.filter(d => d.persen > 0 && d.persen < 100).length})</span>}
            {s.key === 'belum'    && <span style={{ fontWeight: 800 }}> ({data.filter(d => d.persen === 0).length})</span>}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-search" style={{ flex: '1 1 200px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Pencarian bebas…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <X size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterPML} onChange={e => { setFilterPML(e.target.value); setFilterPPL('all'); setFilterDesa('all') }}>
            <option value="all">— PML —</option>
            {pmlList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterPPL} onChange={e => { setFilterPPL(e.target.value); setFilterDesa('all') }}>
            <option value="all">— PPL —</option>
            {pplList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterDesa} onChange={e => setFilterDesa(e.target.value)}>
            <option value="all">— Desa —</option>
            {desaList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 150 }}>
          <ChevronDown size={13} color="var(--text-muted)" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="idsls">Urut Kode SLS</option>
            <option value="persen_desc">Progress ↓ Tinggi</option>
            <option value="persen_asc">Progress ↑ Rendah</option>
            <option value="submit_desc">Submit Terbanyak</option>
            <option value="target_desc">Target Terbesar</option>
          </select>
        </div>

        {hasFilter && (
          <button className="btn-reset" onClick={resetFilters}>
            <X size={12} /> Reset
          </button>
        )}
        <div className="filter-count">
          <strong>{filtered.length}</strong> / {data.length} SLS
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>ID SLS</th>
                <th>Nama SLS</th>
                <th>Desa</th>
                <th>PPL</th>
                <th>PML</th>
                <th style={{ textAlign: 'right' }}>Target</th>
                <th style={{ textAlign: 'right' }}>Submit</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={COL}>
                    <div className="empty-state" style={{ padding: 32 }}>
                      <div className="empty-state-icon">🔍</div>
                      <h4>Tidak ada SLS ditemukan</h4>
                      <p>Coba ubah atau reset filter pencarian</p>
                      {hasFilter && (
                        <button className="btn-reset" onClick={resetFilters} style={{ marginTop: 8 }}>
                          <X size={12} /> Reset Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filtered.map((d, i) => {
                const badge    = getProgressBadge(d.persen)
                const isOpen   = selectedSLS?.idsls === d.idsls
                return (
                  <React.Fragment key={d.idsls || i}>
                    <tr
                      key={d.idsls || i}
                      className="sls-row-clickable"
                      onClick={() => handleRowClick(d)}
                      style={{ background: isOpen ? 'rgba(99,102,241,0.06)' : '', borderLeft: isOpen ? '3px solid var(--primary)' : '3px solid transparent', transition: 'all 0.15s' }}
                    >
                      <td style={{ width: 28, textAlign: 'center', color: 'var(--text-muted)', padding: '0 4px' }}>
                        {isOpen
                          ? <ChevronUp size={14} color="var(--primary)" />
                          : <ChevronDown size={14} />
                        }
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {d.idsls}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', maxWidth: 200 }}>{d.nmsls}</div>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 140 }}>
                        {d.nmdesa}
                      </td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.nm_ppl}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.nm_pml}</td>
                      <td style={{ textAlign: 'right' }}>{formatNumber(d.target_simpul)}</td>
                      <td style={{ textAlign: 'right', color: 'var(--success-light)', fontWeight: 600 }}>
                        {formatNumber(d.submit)}
                      </td>
                      <td style={{ minWidth: 140 }}>
                        <ProgressBar value={d.submit || 0} max={d.target_simpul || 1} color={getProgressColor(d.persen)} />
                      </td>
                      <td>
                        <Badge type={badge.type}>{badge.label}</Badge>
                      </td>
                    </tr>

                    {isOpen && (
                      <SLSDetailPanel
                        key={`detail-${d.idsls}`}
                        sls={d}
                        onClose={() => setSelectedSLS(null)}
                        colSpan={COL}
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
