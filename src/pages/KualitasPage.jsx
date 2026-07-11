import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, X, Package, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { getKualitasUsaha, getKualitasKeluarga, getKualitasART, getProgresCapaian } from '../services/api'
import { LoadingSpinner } from '../components/UI'
import { formatNumber } from '../lib/utils'

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n) { return n !== null && n !== undefined ? formatNumber(n) : '0' }
function pctFmt(n) { return n !== null && n !== undefined ? `${parseFloat(n).toFixed(2)}%` : '0.00%' }

function NumPct({ num, pct, numColor, pctColor }) {
  return (
    <td style={{ textAlign: 'center', padding: '6px 8px', whiteSpace: 'nowrap', minWidth: 70 }}>
      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: numColor || 'var(--text-primary)' }}>{fmt(num)}</div>
      <div style={{ fontSize: '0.7rem', color: pctColor || numColor || 'var(--text-muted)', marginTop: 1 }}>{pctFmt(pct)}</div>
    </td>
  )
}

function NumOnly({ num, color }) {
  return (
    <td style={{ textAlign: 'center', padding: '6px 8px' }}>
      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: color || 'var(--text-primary)' }}>{fmt(num)}</div>
    </td>
  )
}

// ── Filter Bar ─────────────────────────────────────────────────────────────────
function FilterBar({ search, setSearch, filterPML, setFilterPML, filterPPL, setFilterPPL,
  filterDesa, setFilterDesa, pmlList, pplList, desaList, hasFilter, resetFilters, total, shown }) {
  return (
    <div className="filter-bar">
      <div className="filter-search" style={{ flex: '1 1 200px' }}>
        <Search size={14} color="var(--text-muted)" />
        <input placeholder="Cari desa / SLS…" value={search} onChange={e => setSearch(e.target.value)} />
        {search && <X size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
      </div>
      <div className="filter-select">
        <Filter size={13} color="var(--text-muted)" />
        <select value={filterPML} onChange={e => { setFilterPML(e.target.value); setFilterPPL('all'); setFilterDesa('all') }}>
          <option value="all">— PML —</option>
          {pmlList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="filter-select">
        <Filter size={13} color="var(--text-muted)" />
        <select value={filterPPL} onChange={e => { setFilterPPL(e.target.value); setFilterDesa('all') }}>
          <option value="all">— PPL —</option>
          {pplList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="filter-select">
        <Filter size={13} color="var(--text-muted)" />
        <select value={filterDesa} onChange={e => setFilterDesa(e.target.value)}>
          <option value="all">— Desa —</option>
          {desaList.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      {hasFilter && <button className="btn-reset" onClick={resetFilters}><X size={12} /> Reset</button>}
      <div className="filter-count"><strong>{shown}</strong> / {total} SLS</div>
    </div>
  )
}

// ── Hook: filter + enriched data ───────────────────────────────────────────────
function useFilteredData(data, progresData) {
  const [search, setSearch] = useState('')
  const [filterPML, setFilterPML] = useState('all')
  const [filterPPL, setFilterPPL] = useState('all')
  const [filterDesa, setFilterDesa] = useState('all')

  const pmlList = [...new Set(progresData.map(d => d.nm_pml).filter(Boolean))].sort()
  const allowedPPL = filterPML === 'all' ? progresData : progresData.filter(d => d.nm_pml === filterPML)
  const pplList = [...new Set(allowedPPL.map(d => d.nm_ppl).filter(Boolean))].sort()
  const allowedDesa = filterPPL === 'all' ? allowedPPL : allowedPPL.filter(d => d.nm_ppl === filterPPL)
  const desaList = [...new Set(allowedDesa.map(d => d.nmdesa).filter(Boolean))].sort()

  const getProgresRow = (row) => {
    const byBoth = progresData.find(p => p.kddesa === row.kddesa && p.kdsls === row.kdsls)
    if (byBoth) return byBoth
    return progresData.find(p => p.kddesa === row.kddesa ||
      (row.kelurahan && p.nmdesa && row.kelurahan.includes(p.nmdesa))
    ) || null
  }

  const enriched = data.map(d => {
    const p = getProgresRow(d)
    return { ...d, _ppl: p?.nm_ppl || '', _pml: p?.nm_pml || '' }
  })

  const filtered = enriched.filter(d => {
    const s = search.trim().toLowerCase()
    const matchSearch = s === '' ||
      (d.kelurahan && d.kelurahan.toLowerCase().includes(s)) ||
      (d.sls_rt && String(d.sls_rt).toLowerCase().includes(s)) ||
      (d._ppl && d._ppl.toLowerCase().includes(s))
    const matchPML = filterPML === 'all' || d._pml === filterPML
    const matchPPL = filterPPL === 'all' || d._ppl === filterPPL
    const matchDesa = filterDesa === 'all' || (d.kelurahan && d.kelurahan.toUpperCase().includes(filterDesa.toUpperCase()))
    return matchSearch && matchPML && matchPPL && matchDesa
  })

  const hasFilter = search !== '' || filterPML !== 'all' || filterPPL !== 'all' || filterDesa !== 'all'
  const resetFilters = () => { setSearch(''); setFilterPML('all'); setFilterPPL('all'); setFilterDesa('all') }

  return { filtered, hasFilter, resetFilters, search, setSearch, filterPML, setFilterPML,
    filterPPL, setFilterPPL, filterDesa, setFilterDesa, pmlList, pplList, desaList }
}

// ── SLS Cell (kolom pertama) ───────────────────────────────────────────────────
function SLSCell({ d }) {
  return (
    <td style={{ 
      padding: '14px 16px', 
      minWidth: 220, 
      verticalAlign: 'middle',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-sm)'
    }}>
      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
        {d.sls_rt || '-'}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: 4, fontWeight: 700 }}>
        {d.kelurahan || '-'}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
        {d.kecamatan || '-'}
      </div>
    </td>
  )
}

// ── Tab 1: Kualitas Data USAHA ─────────────────────────────────────────────────
function TabUsaha({ data, progresData }) {
  const { filtered, hasFilter, resetFilters, ...filterProps } = useFilteredData(data, progresData)

  // Summary
  const totPrelist   = filtered.reduce((s, d) => s + (d.jml_prelist_usaha || 0), 0)
  const totDitemukan = filtered.reduce((s, d) => s + (d.bku_ditemukan || 0), 0)
  const totTutup     = filtered.reduce((s, d) => s + (d.bku_tutup || 0), 0)
  const totGanda     = filtered.reduce((s, d) => s + (d.bku_ganda || 0), 0)
  const totHilang    = filtered.reduce((s, d) => s + (d.bku_tidak_ditemukan || 0), 0)
  const totBaru      = filtered.reduce((s, d) => s + (d.bku_baru || 0), 0)
  const totKeluarga  = filtered.reduce((s, d) => s + (d.usaha_keluarga_didata || 0), 0)
  const totUsahaTotal= filtered.reduce((s, d) => s + (d.jumlah_usaha_total || 0), 0)
  const totPrelistUB = filtered.reduce((s, d) => s + (d.jml_prelist_ub || 0), 0)
  const totUBData    = filtered.reduce((s, d) => s + (d.jml_ub_didata || 0), 0)
  const totPrlistUMKM= filtered.reduce((s, d) => s + (d.jml_prelist_umkm || 0), 0)
  const totUMKMData  = filtered.reduce((s, d) => s + (d.jml_umkm_didata || 0), 0)

  const pct = (a, b) => b > 0 ? ((a / b) * 100).toFixed(2) : '0.00'

  return (
    <div>
      {/* Summary Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Prelist Usaha', value: totPrelist, color: 'var(--text-primary)', bg: 'rgba(99,102,241,0.08)' },
          { label: 'BKU Ditemukan', value: `${totDitemukan} (${pct(totDitemukan,totPrelist)}%)`, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'BKU Tutup', value: `${totTutup} (${pct(totTutup,totPrelist)}%)`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'BKU Ganda', value: `${totGanda} (${pct(totGanda,totPrelist)}%)`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          { label: 'BKU Hilang', value: `${totHilang} (${pct(totHilang,totPrelist)}%)`, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'BKU Baru', value: `${totBaru} (${pct(totBaru,totPrelist)}%)`, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
          { label: 'Usaha Keluarga', value: totKeluarga, color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
          { label: 'Total Usaha', value: `${totUsahaTotal} (${pct(totUsahaTotal,totPrelist)}%)`, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Prelist UMKM', value: totPrlistUMKM, color: 'var(--text-secondary)', bg: 'var(--bg-card-2)' },
          { label: 'UMKM Didata', value: `${totUMKMData} (${pct(totUMKMData,totPrlistUMKM)}%)`, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Prelist UB', value: totPrelistUB, color: 'var(--text-secondary)', bg: 'var(--bg-card-2)' },
          { label: 'UB Didata', value: `${totUBData} (${pct(totUBData,totPrelistUB)}%)`, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
        ].map(c => (
          <div key={c.label} style={{ 
            background: c.bg, 
            borderRadius: 'var(--r-md)', 
            padding: '14px 16px', 
            border: '1px solid var(--border-sm)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: c.color, lineHeight: 1.2 }}>{c.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <FilterBar {...filterProps} hasFilter={hasFilter} resetFilters={resetFilters} total={data.length} shown={filtered.length} />

      <div className="card" style={{ padding: 0, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="table-wrapper">
          <table className="table" style={{ fontSize: '0.8rem', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            {/* Row 1: Group headers */}
            <tr>
              <th rowSpan={2} style={{ 
                verticalAlign: 'middle', 
                minWidth: 220, 
                padding: '12px 16px',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>SLS / RT ▴</th>
              <th rowSpan={2} style={{ 
                textAlign: 'center', 
                verticalAlign: 'middle', 
                background: 'rgba(99,102,241,0.12)',
                padding: '12px 10px',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                color: '#6366f1'
              }}>
                JUMLAH<br/>PRELIST<br/>USAHA ▴
              </th>
              <th colSpan={6} style={{ 
                textAlign: 'center', 
                background: 'rgba(59,130,246,0.1)', 
                borderBottom: '2px solid var(--border)',
                padding: '12px 8px',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                color: '#3b82f6'
              }}>
                JUMLAH USAHA BKU MENURUT STATUS KEBERADAAN
              </th>
              <th rowSpan={2} style={{ 
                textAlign: 'center', 
                verticalAlign: 'middle', 
                background: 'rgba(6,182,212,0.12)', 
                color: '#06b6d4',
                padding: '12px 10px',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                USAHA DALAM<br/>KELUARGA<br/>DIDATA ▴
              </th>
              <th rowSpan={2} style={{ 
                textAlign: 'center', 
                verticalAlign: 'middle', 
                background: 'rgba(16,185,129,0.12)', 
                color: '#10b981',
                padding: '12px 10px',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                JUMLAH USAHA<br/>TOTAL<br/>(BKU + Keluarga) ▴
              </th>
              <th colSpan={5} style={{ 
                textAlign: 'center', 
                background: 'rgba(99,102,241,0.08)', 
                borderBottom: '2px solid var(--border)',
                padding: '12px 8px',
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                color: 'var(--primary-light)'
              }}>
                SKALA USAHA
              </th>
            </tr>
            {/* Row 2: Sub headers */}
            <tr>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(34,197,94,0.1)', 
                color: '#22c55e',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>DITEMUKAN ▴</th>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(245,158,11,0.1)', 
                color: '#f59e0b',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>TUTUP ▴</th>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(139,92,246,0.1)', 
                color: '#8b5cf6',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>GANDA ▴</th>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(239,68,68,0.12)', 
                color: '#ef4444',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>TIDAK<br/>DITEMUKAN ▴</th>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(59,130,246,0.1)', 
                color: '#3b82f6',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>BARU ▴</th>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(59,130,246,0.06)',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>TOTAL ▴</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>PRELIST UB ▴</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>UB DIDATA ▴</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>PRELIST UMKM<br/>(UM+UMK) ▴</th>
              <th style={{ 
                textAlign: 'center', 
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>UMKM<br/>DIDATA ▴</th>
              <th style={{ 
                textAlign: 'center', 
                background: 'rgba(99,102,241,0.1)', 
                color: 'var(--primary-light)',
                padding: '10px 8px',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}>TOTAL USAHA<br/>DIDATA ▴</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={17}>
                <div className="empty-state" style={{ padding: 48 }}>
                  <div className="empty-state-icon" style={{ fontSize: '3rem' }}>📦</div>
                  <h4 style={{ fontSize: '1rem', marginTop: 12 }}>Tidak ada data ditemukan</h4>
                  {hasFilter && <button className="btn-reset" onClick={resetFilters} style={{ marginTop: 12 }}><X size={12} /> Reset</button>}
                </div>
              </td></tr>
            ) : filtered.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-sm)' }}>
                <SLSCell d={d} />
                {/* Prelist */}
                <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(99,102,241,0.04)' }}>
                  {fmt(d.jml_prelist_usaha)}
                </td>
                {/* BKU Ditemukan */}
                <NumPct num={d.bku_ditemukan} pct={d.persen_bku_ditemukan} numColor="#22c55e" />
                {/* BKU Tutup */}
                <NumPct num={d.bku_tutup} pct={d.persen_bku_tutup} numColor="#f59e0b" />
                {/* BKU Ganda */}
                <NumPct num={d.bku_ganda} pct={d.persen_bku_ganda} numColor="#8b5cf6" />
                {/* BKU Tidak Ditemukan */}
                <td style={{ textAlign: 'center', padding: '6px 8px', background: (d.bku_tidak_ditemukan > 0) ? 'rgba(239,68,68,0.07)' : 'transparent' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444' }}>{fmt(d.bku_tidak_ditemukan)}</div>
                  <div style={{ fontSize: '0.7rem', color: '#f87171' }}>{pctFmt(d.persen_bku_hilang)}</div>
                </td>
                {/* BKU Baru */}
                <NumPct num={d.bku_baru} pct={d.persen_bku_baru} numColor="#3b82f6" />
                {/* Total BKU */}
                <NumOnly num={d.total_usaha_bku} />
                {/* Usaha Keluarga Didata */}
                <td style={{ textAlign: 'center', padding: '6px 8px', background: 'rgba(6,182,212,0.05)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#06b6d4' }}>{fmt(d.usaha_keluarga_didata)}</div>
                </td>
                {/* Jumlah Usaha Total */}
                <td style={{ textAlign: 'center', padding: '6px 8px', background: 'rgba(16,185,129,0.06)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>{fmt(d.jumlah_usaha_total)}</div>
                  <div style={{ fontSize: '0.7rem', color: '#34d399' }}>{pctFmt(d.persen_usaha_total)}</div>
                </td>
                {/* Prelist UB */}
                <NumOnly num={d.jml_prelist_ub} />
                {/* UB Didata */}
                <NumPct num={d.jml_ub_didata} pct={d.persen_ub_didata} numColor="#22c55e" />
                {/* Prelist UMKM */}
                <NumOnly num={d.jml_prelist_umkm} />
                {/* UMKM Didata */}
                <NumPct num={d.jml_umkm_didata} pct={d.persen_umkm_didata} numColor="#6366f1" />
                {/* Total Usaha Didata */}
                <td style={{ textAlign: 'center', padding: '6px 8px', background: 'rgba(99,102,241,0.06)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-light)' }}>{fmt(d.total_usaha_didata)}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pctFmt(d.persen_total_skala)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

// ── Tab 2: Kualitas Data KELUARGA ──────────────────────────────────────────────
function TabKeluarga({ data, progresData }) {
  const { filtered, hasFilter, resetFilters, ...filterProps } = useFilteredData(data, progresData)

  const totPrelist      = filtered.reduce((s, d) => s + (d.prelist_awal || 0), 0)
  const totDitemukan    = filtered.reduce((s, d) => s + (d.ditemukan || 0), 0)
  const totBaru         = filtered.reduce((s, d) => s + (d.keluarga_baru || 0), 0)
  const totMeninggal    = filtered.reduce((s, d) => s + (d.meninggal || 0), 0)
  const totTdkEligible  = filtered.reduce((s, d) => s + (d.tidak_eligible || 0), 0)
  const totTdkDitemui   = filtered.reduce((s, d) => s + (d.tidak_dapat_ditemui || 0), 0)
  const totTdkDitemukan = filtered.reduce((s, d) => s + (d.tidak_ditemukan || 0), 0)
  const totKhusus       = filtered.reduce((s, d) => s + (d.keluarga_khusus || 0), 0)
  const totHasil        = filtered.reduce((s, d) => s + (d.total_hasil || 0), 0)
  const pct = (a, b) => b > 0 ? ((a / b) * 100).toFixed(2) : '0.00'

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Prelist Awal', value: totPrelist, color: 'var(--text-primary)', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Ditemukan', value: `${totDitemukan} (${pct(totDitemukan,totPrelist)}%)`, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'Keluarga Baru', value: `${totBaru} (${pct(totBaru,totPrelist)}%)`, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
          { label: 'Meninggal', value: `${totMeninggal} (${pct(totMeninggal,totPrelist)}%)`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Tidak Eligible', value: totTdkEligible, color: 'var(--text-secondary)', bg: 'var(--bg-card-2)' },
          { label: 'Tidak Dapat Ditemui', value: totTdkDitemui, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          { label: 'Tidak Ditemukan', value: `${totTdkDitemukan} (${pct(totTdkDitemukan,totPrelist)}%)`, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Keluarga Khusus', value: totKhusus, color: 'var(--text-secondary)', bg: 'var(--bg-card-2)' },
          { label: 'Total Hasil', value: `${totHasil} (${pct(totHasil,totPrelist)}%)`, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        ].map(c => (
          <div key={c.label} style={{ 
            background: c.bg, 
            borderRadius: 'var(--r-md)', 
            padding: '14px 16px', 
            border: '1px solid var(--border-sm)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: c.color, lineHeight: 1.2 }}>{c.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <FilterBar {...filterProps} hasFilter={hasFilter} resetFilters={resetFilters} total={data.length} shown={filtered.length} />

      <div className="card" style={{ padding: 0, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="table-wrapper">
          <table className="table" style={{ fontSize: '0.8rem', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ 
                  verticalAlign: 'middle', 
                  minWidth: 220, 
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>SLS / RT ▴</th>
                <th rowSpan={2} style={{ 
                  textAlign: 'center', 
                  verticalAlign: 'middle', 
                  background: 'rgba(99,102,241,0.12)',
                  padding: '12px 10px',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  color: '#6366f1'
                }}>PRELIST AWAL ▴</th>
                <th colSpan={7} style={{ 
                  textAlign: 'center', 
                  background: 'rgba(59,130,246,0.1)', 
                  borderBottom: '2px solid var(--border)',
                  padding: '12px 8px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  color: '#3b82f6'
                }}>
                  STATUS KELUARGA
                </th>
                <th rowSpan={2} style={{ 
                  textAlign: 'center', 
                  verticalAlign: 'middle', 
                  background: 'rgba(16,185,129,0.12)', 
                  color: '#10b981',
                  padding: '12px 10px',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase'
                }}>
                  TOTAL HASIL ▴<br/>(% Capaian)
                </th>
              </tr>
              <tr>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(34,197,94,0.1)', 
                  color: '#22c55e',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>DITEMUKAN ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(59,130,246,0.1)', 
                  color: '#3b82f6',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>BARU ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(245,158,11,0.1)', 
                  color: '#f59e0b',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>MENINGGAL ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>TDK ELIGIBLE ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(139,92,246,0.1)', 
                  color: '#8b5cf6',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>TDK DAPAT<br/>DITEMUI ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(239,68,68,0.12)', 
                  color: '#ef4444',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>TDK DITEMUKAN ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>KEL. KHUSUS ▴</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <div className="empty-state" style={{ padding: 48 }}>
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}>🏠</div>
                    <h4 style={{ fontSize: '1rem', marginTop: 12 }}>Tidak ada data</h4>
                    {hasFilter && <button className="btn-reset" onClick={resetFilters} style={{ marginTop: 12 }}><X size={12} /> Reset</button>}
                  </div>
                </td></tr>
              ) : filtered.map((d, i) => {
                const capColor = (d.persen_capaian || 0) >= 80 ? '#22c55e' : (d.persen_capaian || 0) >= 50 ? '#f59e0b' : '#ef4444'
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-sm)' }}>
                    <SLSCell d={d} />
                    <td style={{ textAlign: 'center', fontWeight: 700, background: 'rgba(99,102,241,0.04)' }}>{fmt(d.prelist_awal)}</td>
                    <NumPct num={d.ditemukan} pct={d.persen_ditemukan} numColor="#22c55e" />
                    <NumPct num={d.keluarga_baru} pct={d.persen_keluarga_baru} numColor="#3b82f6" />
                    <NumPct num={d.meninggal} pct={d.persen_meninggal} numColor="#f59e0b" />
                    <NumPct num={d.tidak_eligible} pct={d.persen_tidak_eligible} />
                    <NumPct num={d.tidak_dapat_ditemui} pct={d.persen_tidak_dapat_ditemui} numColor="#8b5cf6" />
                    <td style={{ textAlign: 'center', padding: '6px 8px', background: (d.tidak_ditemukan > 0) ? 'rgba(239,68,68,0.07)' : 'transparent' }}>
                      <div style={{ fontWeight: 700, color: '#ef4444' }}>{fmt(d.tidak_ditemukan)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#f87171' }}>{pctFmt(d.persen_tidak_ditemukan)}</div>
                    </td>
                    <NumPct num={d.keluarga_khusus} pct={d.persen_keluarga_khusus} />
                    <td style={{ textAlign: 'center', padding: '6px 8px', background: 'rgba(16,185,129,0.06)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: capColor }}>{fmt(d.total_hasil)}</div>
                      <div style={{ fontSize: '0.7rem', color: capColor }}>{pctFmt(d.persen_capaian)}</div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Tab 3: Kualitas Data ART ───────────────────────────────────────────────────
function TabART({ data, progresData }) {
  const { filtered, hasFilter, resetFilters, ...filterProps } = useFilteredData(data, progresData)

  const totTinggal    = filtered.reduce((s, d) => s + (d.tinggal_bersama || 0), 0)
  const totBaru       = filtered.reduce((s, d) => s + (d.art_baru || 0), 0)
  const totMeninggal  = filtered.reduce((s, d) => s + (d.meninggal || 0), 0)
  const totPindahDN   = filtered.reduce((s, d) => s + (d.pindah_dn || 0), 0)
  const totPindahLN   = filtered.reduce((s, d) => s + (d.pindah_ln || 0), 0)
  const totTdkDitemukan = filtered.reduce((s, d) => s + (d.tidak_ditemukan || 0), 0)
  const totKhusus     = filtered.reduce((s, d) => s + (d.art_khusus || 0), 0)
  const totART        = filtered.reduce((s, d) => s + (d.total_art || 0), 0)
  const pct = (a, b) => b > 0 ? ((a / b) * 100).toFixed(2) : '0.00'

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Tinggal Bersama KK', value: `${totTinggal} (${pct(totTinggal,totART)}%)`, color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
          { label: 'ART Baru', value: `${totBaru} (${pct(totBaru,totART)}%)`, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
          { label: 'Meninggal', value: `${totMeninggal} (${pct(totMeninggal,totART)}%)`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Pindah DN', value: `${totPindahDN} (${pct(totPindahDN,totART)}%)`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          { label: 'Pindah LN', value: `${totPindahLN} (${pct(totPindahLN,totART)}%)`, color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
          { label: 'Tidak Ditemukan', value: `${totTdkDitemukan} (${pct(totTdkDitemukan,totART)}%)`, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'ART Khusus', value: totKhusus, color: 'var(--text-secondary)', bg: 'var(--bg-card-2)' },
          { label: 'Total ART', value: totART, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        ].map(c => (
          <div key={c.label} style={{ 
            background: c.bg, 
            borderRadius: 'var(--r-md)', 
            padding: '14px 16px', 
            border: '1px solid var(--border-sm)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: c.color, lineHeight: 1.2 }}>{c.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <FilterBar {...filterProps} hasFilter={hasFilter} resetFilters={resetFilters} total={data.length} shown={filtered.length} />

      <div className="card" style={{ padding: 0, borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div className="table-wrapper">
          <table className="table" style={{ fontSize: '0.8rem', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ 
                  verticalAlign: 'middle', 
                  minWidth: 220, 
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>SLS / RT ▴</th>
                <th colSpan={7} style={{ 
                  textAlign: 'center', 
                  background: 'rgba(59,130,246,0.1)', 
                  borderBottom: '2px solid var(--border)',
                  padding: '12px 8px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  color: '#3b82f6'
                }}>
                  STATUS ANGGOTA RUMAH TANGGA (ART)
                </th>
                <th rowSpan={2} style={{ 
                  textAlign: 'center', 
                  verticalAlign: 'middle', 
                  background: 'rgba(16,185,129,0.12)', 
                  color: '#10b981',
                  padding: '12px 10px',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase'
                }}>
                  TOTAL ART ▴<br/>(% Total)
                </th>
              </tr>
              <tr>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(34,197,94,0.1)', 
                  color: '#22c55e',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>TINGGAL<br/>BERSAMA ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(59,130,246,0.1)', 
                  color: '#3b82f6',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>ART BARU ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(245,158,11,0.1)', 
                  color: '#f59e0b',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>MENINGGAL ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(139,92,246,0.1)', 
                  color: '#8b5cf6',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>PINDAH DN ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(168,85,247,0.1)', 
                  color: '#a855f7',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>PINDAH LN ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  background: 'rgba(239,68,68,0.12)', 
                  color: '#ef4444',
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>TDK DITEMUKAN ▴</th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '10px 8px',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}>ART KHUSUS ▴</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="empty-state" style={{ padding: 48 }}>
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}>👥</div>
                    <h4 style={{ fontSize: '1rem', marginTop: 12 }}>Tidak ada data</h4>
                    {hasFilter && <button className="btn-reset" onClick={resetFilters} style={{ marginTop: 12 }}><X size={12} /> Reset</button>}
                  </div>
                </td></tr>
              ) : filtered.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-sm)' }}>
                  <SLSCell d={d} />
                  <NumPct num={d.tinggal_bersama} pct={d.persen_tinggal_bersama} numColor="#22c55e" />
                  <NumPct num={d.art_baru} pct={d.persen_art_baru} numColor="#3b82f6" />
                  <NumPct num={d.meninggal} pct={d.persen_meninggal} numColor="#f59e0b" />
                  <NumPct num={d.pindah_dn} pct={d.persen_pindah_dn} numColor="#8b5cf6" />
                  <NumPct num={d.pindah_ln} pct={d.persen_pindah_ln} numColor="#a855f7" />
                  <td style={{ textAlign: 'center', padding: '6px 8px', background: (d.tidak_ditemukan > 0) ? 'rgba(239,68,68,0.07)' : 'transparent' }}>
                    <div style={{ fontWeight: 700, color: '#ef4444' }}>{fmt(d.tidak_ditemukan)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#f87171' }}>{pctFmt(d.persen_tidak_ditemukan)}</div>
                  </td>
                  <NumPct num={d.art_khusus} pct={d.persen_art_khusus} />
                  <td style={{ textAlign: 'center', padding: '6px 8px', background: 'rgba(16,185,129,0.06)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>{fmt(d.total_art)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#34d399' }}>{pctFmt(d.persen_total_art)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function KualitasPage() {
  const [activeTab, setActiveTab] = useState('usaha')

  const { data: kUsaha,    isLoading: l1 } = useQuery({ queryKey: ['kual_usaha'],    queryFn: getKualitasUsaha })
  const { data: kKeluarga, isLoading: l2 } = useQuery({ queryKey: ['kual_keluarga'], queryFn: getKualitasKeluarga })
  const { data: kART,      isLoading: l3 } = useQuery({ queryKey: ['kual_art'],      queryFn: getKualitasART })
  const { data: progres,   isLoading: l4 } = useQuery({ queryKey: ['progres'],       queryFn: getProgresCapaian })

  if (l1 || l2 || l3 || l4) return <LoadingSpinner text="Memuat data kualitas pendataan..." />

  const dataUsaha    = kUsaha    || []
  const dataKeluarga = kKeluarga || []
  const dataART      = kART      || []
  const progData     = progres   || []

  // Global quick stats
  const totPrelistUsaha  = dataUsaha.reduce((s, d) => s + (d.jml_prelist_usaha || 0), 0)
  const totHilangBKU     = dataUsaha.reduce((s, d) => s + (d.bku_tidak_ditemukan || 0), 0)
  const totPrelistKel    = dataKeluarga.reduce((s, d) => s + (d.prelist_awal || 0), 0)
  const totHasilKel      = dataKeluarga.reduce((s, d) => s + (d.total_hasil || 0), 0)
  const totART           = dataART.reduce((s, d) => s + (d.total_art || 0), 0)
  const totPindahLN      = dataART.reduce((s, d) => s + (d.pindah_ln || 0), 0)
  const pct = (a, b) => b > 0 ? ((a / b) * 100).toFixed(1) : '0.0'

  const tabs = [
    { key: 'usaha',    label: '1. Kualitas Data Usaha',                count: dataUsaha.length },
    { key: 'keluarga', label: '2. Kualitas Data Keluarga',             count: dataKeluarga.length },
    { key: 'art',      label: '3. Kualitas Data Anggota Keluarga (ART)', count: dataART.length },
  ]

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <div className="page-header-eyebrow">Validasi Data</div>
        <h2>Kualitas Pendataan</h2>
        <p>Monitoring kelengkapan dan kualitas data per SLS — {dataUsaha.length} SLS terdaftar</p>
      </div>

      {/* Global summary cards */}
      <div className="grid-stats" style={{ marginBottom: 20 }}>
        <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-sm)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Package size={18} color="#6366f1" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KUALITAS USAHA</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>{formatNumber(totPrelistUsaha)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Prelist BKU</div>
          <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: 4, fontWeight: 600 }}>
            ⚠ Hilang: {formatNumber(totHilangBKU)} ({pct(totHilangBKU, totPrelistUsaha)}%)
          </div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-sm)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle size={18} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KUALITAS KELUARGA</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>{pct(totHasilKel, totPrelistKel)}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Capaian Hasil</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {formatNumber(totHasilKel)} dari {formatNumber(totPrelistKel)} prelist
          </div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-sm)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={18} color="#8b5cf6" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>KUALITAS ART</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#8b5cf6' }}>{formatNumber(totART)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Total ART Didata</div>
          <div style={{ fontSize: '0.78rem', color: '#a855f7', marginTop: 4, fontWeight: 600 }}>
            Pindah LN: {formatNumber(totPindahLN)} ({pct(totPindahLN, totART)}%)
          </div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <AlertCircle size={18} color="#ef4444" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PERLU TINDAK LANJUT</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444' }}>{formatNumber(totHilangBKU)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>BKU Tidak Ditemukan</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Pastikan petugas verifikasi ulang
          </div>
        </div>
      </div>

      {/* Tabs — persis seperti tampilan web asli */}
      <div className="tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span style={{
              marginLeft: 6, padding: '1px 7px', borderRadius: 'var(--r-full)',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.12)',
              color: activeTab === tab.key ? '#fff' : 'var(--primary-light)',
              fontSize: '0.7rem', fontWeight: 700
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'usaha'    && <TabUsaha    data={dataUsaha}    progresData={progData} />}
      {activeTab === 'keluarga' && <TabKeluarga data={dataKeluarga} progresData={progData} />}
      {activeTab === 'art'      && <TabART      data={dataART}      progresData={progData} />}
    </div>
  )
}
