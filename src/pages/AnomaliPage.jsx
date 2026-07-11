import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Search, Filter, X, ChevronDown } from 'lucide-react'
import { getAnomaliUsaha, getAnomaliKeluarga, getProgresCapaian } from '../services/api'
import {
  LoadingSpinner, TableScrollHint
} from '../components/UI'
import { HeroBanner, BentoStat, AnomalyCard, MobileCardList, DesktopTable } from '../components/DataViews'
import { Info } from 'lucide-react'
import { RULES_USAHA_DETAILED as RULES_USAHA, RULES_KELUARGA_DETAILED as RULES_KEL, isAnomal } from '../lib/constants'

function countAnomali(row, rules) {
  return rules.filter(r => isAnomal(row[r.key])).length
}

// ── Tab Usaha ──────────────────────────────────────────────────────────────────
function AnomalyTable({ data, rules, colNama, emptyIcon, progresData }) {
  const [search,     setSearch]     = useState('')
  const [filterPML,  setFilterPML]  = useState('all')
  const [filterPPL,  setFilterPPL]  = useState('all')
  const [filterDesa, setFilterDesa] = useState('all')
  const [filterRule, setFilterRule] = useState('all')

  const pmlList = [...new Set(progresData.map(d => d.nm_pml).filter(Boolean))].sort()

  const allowedPPL = filterPML === 'all' ? progresData : progresData.filter(d => d.nm_pml === filterPML)
  const pplList = [...new Set(allowedPPL.map(d => d.nm_ppl).filter(Boolean))].sort()

  const allowedDesa = filterPPL === 'all' ? allowedPPL : allowedPPL.filter(d => d.nm_ppl === filterPPL)
  const desaList = [...new Set(allowedDesa.map(d => d.nmdesa).filter(Boolean))].sort()

  const getPMLForPPL = (pplName) => {
    const found = progresData.find(p => p.nm_ppl === pplName)
    return found ? found.nm_pml : ''
  }

  const filtered = data.filter(d => {
    const s = search.trim().toLowerCase()
    const nama = (d[colNama] || '')
    const matchSearch =
      s === '' ||
      nama.toLowerCase().includes(s) ||
      (d.nm_ppl  && d.nm_ppl.toLowerCase().includes(s)) ||
      (d.kelurahan && d.kelurahan.toLowerCase().includes(s)) ||
      (d.kode_sls && d.kode_sls.toLowerCase().includes(s))

    const pmlOfRow = getPMLForPPL(d.nm_ppl)
    const matchPML  = filterPML  === 'all' || pmlOfRow === filterPML
    const matchPPL  = filterPPL  === 'all' || d.nm_ppl === filterPPL
    const matchDesa = filterDesa === 'all' || (d.kelurahan && d.kelurahan.toUpperCase().includes(filterDesa.toUpperCase()))
    
    // Include all Anomalies (which now includes 'Belum Selesai') when a specific rule is filtered
    const matchRule = filterRule === 'all' || isAnomal(d[filterRule])
    
    return matchSearch && matchPML && matchPPL && matchDesa && matchRule
  })

  const hasFilter = search !== '' || filterPML !== 'all' || filterPPL !== 'all' || filterDesa !== 'all' || filterRule !== 'all'
  const resetFilters = () => { setSearch(''); setFilterPML('all'); setFilterPPL('all'); setFilterDesa('all'); setFilterRule('all') }

  // Quick stats
  const totalAnomali = filtered.reduce((s, d) => s + countAnomali(d, rules), 0)
  const withMultiple = filtered.filter(d => countAnomali(d, rules) > 1).length

  return (
    <div>
      {/* Stats row */}
      <div className="bento-grid" style={{ marginBottom: 16 }}>
        <BentoStat icon={AlertTriangle} value={filtered.length} label="Entri Anomali" sub={`dari ${data.length}`} accent="warning" />
        <BentoStat icon={AlertTriangle} value={totalAnomali} label="Total Flag" accent="danger" />
        <BentoStat icon={AlertTriangle} value={withMultiple} label="Multi-Rule" accent="primary" />
      </div>

      {/* Info Rules Legend */}
      <details className="rule-legend" style={{ marginBottom: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
        <summary style={{ padding: '12px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
          <Info size={18} />
          Klik Disini untuk Melihat Petunjuk & Arti Kode Rule Anomali {colNama === 'nm_usaha' ? 'USAHA (R1 - R8)' : 'KELUARGA (R1 - R7)'}
        </summary>
        <div className="table-wrapper" style={{ margin: '0 16px 16px' }}>
          <table className="table" style={{ background: 'var(--bg-primary)', borderRadius: 'var(--r-md)' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Kode Rule</th>
                <th style={{ width: '30%' }}>Deskripsi Anomali</th>
                <th>Penjelasan</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.key}>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>Rule {r.label.replace('R', '')} ({r.label})</td>
                  <td style={{ fontWeight: 500 }}>{r.desc}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-search" style={{ flex: '1 1 180px' }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Pencarian bebas…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <X size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
        </div>

        <div className="filter-select" style={{ minWidth: 140 }}>
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

        <div className="filter-select" style={{ minWidth: 140 }}>
          <Filter size={13} color="var(--text-muted)" />
          <select value={filterPPL} onChange={e => {
            setFilterPPL(e.target.value)
            setFilterDesa('all')
          }}>
            <option value="all">— PPL —</option>
            {pplList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="filter-select" style={{ minWidth: 140 }}>
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
          <select value={filterRule} onChange={e => setFilterRule(e.target.value)}>
            <option value="all">— Semua Rule —</option>
            {rules.map(r => <option key={r.key} value={r.key}>{r.label} - {r.desc.substring(0,20)}...</option>)}
          </select>
        </div>

        {hasFilter && <button className="btn-reset" onClick={resetFilters}><X size={12} /> Reset</button>}
        <div className="filter-count"><strong>{filtered.length}</strong> / {data.length}</div>
      </div>

      {/* Table */}
      <div className="panel" style={{ padding: 0 }}>
        <MobileCardList>
          {filtered.map((d, i) => (
            <AnomalyCard key={d.id || i} d={d} colNama={colNama} rules={rules} flagCount={countAnomali(d, rules)} />
          ))}
        </MobileCardList>
        <DesktopTable>
          <TableScrollHint />
          <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>PPL</th>
                <th className="hide-mobile">Desa</th>
                <th className="hide-mobile">Kode SLS</th>
                {rules.map(r => <th key={r.key} className="hide-mobile" style={{ textAlign: 'center' }} title={r.desc}>{r.label}</th>)}
                <th style={{ textAlign: 'center' }}>Flags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={rules.length + 6}>
                    <div className="empty-state" style={{ padding: 32 }}>
                      <div className="empty-state-icon">{emptyIcon}</div>
                      <h4>Tidak ada anomali ditemukan</h4>
                      {hasFilter && (
                        <button className="btn-reset" onClick={resetFilters} style={{ marginTop: 8 }}>
                          <X size={12} /> Reset Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filtered.map((d, i) => {
                const flagCount = countAnomali(d, rules)
                return (
                  <tr key={d.id || i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d[colNama] || '-'}
                    </td>
                    <td style={{ fontSize: '0.78rem', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.nm_ppl}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 120 }} className="hide-mobile">
                      {d.kelurahan}
                    </td>
                    <td className="hide-mobile">
                      <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {d.kode_sls}
                      </span>
                    </td>
                    {rules.map(r => {
                      const val = d[r.key];
                      const isAnom = isAnomal(val);
                      
                      return (
                        <td key={r.key} className="hide-mobile" style={{ textAlign: 'center', fontSize: '0.75rem' }}>
                          {isAnom ? (
                            <span style={{ 
                              background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', 
                              padding: '2px 6px', borderRadius: '4px', fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap' 
                            }}>
                              Ada Anomali
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                      )
                    })}
                    <td style={{ textAlign: 'center' }}>
                      {flagCount > 0 ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 24, height: 24, borderRadius: '50%',
                          background: flagCount > 2 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                          color: flagCount > 2 ? 'var(--danger-light)' : 'var(--warning-light)',
                          fontWeight: 800, fontSize: '0.8rem'
                        }}>
                          {flagCount}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>0</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        </DesktopTable>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AnomaliPage() {
  const [activeTab, setActiveTab] = useState('usaha')

  const { data: anomUsaha,  isLoading: l1 } = useQuery({ queryKey: ['anom_usaha_all'],  queryFn: () => getAnomaliUsaha() })
  const { data: anomKel,    isLoading: l2 } = useQuery({ queryKey: ['anom_kel_all'],    queryFn: () => getAnomaliKeluarga() })
  const { data: progres,    isLoading: l3 } = useQuery({ queryKey: ['progres'],         queryFn: getProgresCapaian })

  if (l1 || l2 || l3) return <LoadingSpinner text="Memuat data anomali..." />

  const usaha    = anomUsaha || []
  const keluarga = anomKel   || []
  const progData = progres   || []

  return (
    <div className="page-content animate-fade-in">
      <HeroBanner
        eyebrow="Temuan Anomali"
        title="Monitoring Anomali"
        description="Temuan anomali usaha (8 rule) dan keluarga (7 rule) berdasarkan validasi sistem"
      />

      {/* Tab */}
      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'usaha' ? 'active' : ''}`}
          onClick={() => setActiveTab('usaha')}
        >
          🏪 Anomali Usaha
          <span style={{
            marginLeft: 4,
            padding: '1px 7px',
            borderRadius: 'var(--r-full)',
            background: activeTab === 'usaha' ? 'rgba(255,255,255,0.2)' : 'rgba(245,158,11,0.15)',
            color: activeTab === 'usaha' ? '#fff' : 'var(--warning-light)',
            fontSize: '0.7rem', fontWeight: 700
          }}>
            {usaha.length}
          </span>
        </button>
        <button
          className={`tab-item ${activeTab === 'keluarga' ? 'active' : ''}`}
          onClick={() => setActiveTab('keluarga')}
        >
          🏠 Anomali Keluarga
          <span style={{
            marginLeft: 4,
            padding: '1px 7px',
            borderRadius: 'var(--r-full)',
            background: activeTab === 'keluarga' ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.15)',
            color: activeTab === 'keluarga' ? '#fff' : 'var(--danger-light)',
            fontSize: '0.7rem', fontWeight: 700
          }}>
            {keluarga.length}
          </span>
        </button>
      </div>

      {activeTab === 'usaha' && (
        <AnomalyTable
          data={usaha}
          rules={RULES_USAHA}
          colNama="nm_usaha"
          emptyIcon="🏪"
          progresData={progData}
        />
      )}
      {activeTab === 'keluarga' && (
        <AnomalyTable
          data={keluarga}
          rules={RULES_KEL}
          colNama="nm_keluarga"
          emptyIcon="🏠"
          progresData={progData}
        />
      )}
    </div>
  )
}
