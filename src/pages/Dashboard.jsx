import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Map, Users, AlertTriangle, TrendingUp, ArrowRight
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  LoadingSpinner, StatCard, ProgressBar, Badge, SectionHeader, CustomTooltip, TableScrollHint
} from '../components/UI'
import { formatNumber, getProgressBadge, getProgressColor } from '../lib/utils'
import {
  getProgresCapaian, getRekapPPL, getAnomaliUsaha, getAnomaliKeluarga
} from '../services/api'

// ─── Mini Donut ───────────────────────────────────────────────────────────────
function DonutChart({ pct }) {
  const data = [{ value: pct }, { value: 100 - pct }]
  const COLORS = ['#6366f1', 'rgba(255,255,255,0.05)']
  return (
    <PieChart width={140} height={140}>
      <Pie
        data={data}
        cx={65} cy={65}
        innerRadius={48} outerRadius={62}
        startAngle={90} endAngle={-270}
        dataKey="value" stroke="none"
      >
        {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
      </Pie>
    </PieChart>
  )
}

export default function Dashboard() {
  const { data: progres, isLoading: l1 } = useQuery({ queryKey: ['progres'], queryFn: getProgresCapaian })
  const { data: pplData, isLoading: l2 } = useQuery({ queryKey: ['rekap_ppl'], queryFn: getRekapPPL })
  const { data: anomUsaha, isLoading: l3 } = useQuery({ queryKey: ['anom_usaha_all'], queryFn: () => getAnomaliUsaha() })
  const { data: anomKel, isLoading: l4 } = useQuery({ queryKey: ['anom_kel_all'], queryFn: () => getAnomaliKeluarga() })

  if (l1 || l2 || l3 || l4) return <LoadingSpinner text="Memuat dashboard..." />

  const slsData = (progres || []).map(d => ({
    ...d,
    persen: (d.target_simpul || 0) > 0
      ? parseFloat(((d.submit / d.target_simpul) * 100).toFixed(1))
      : 0
  }))

  // ── Global stats ────────────────────────────────────────────────────────────
  const totalSLS     = slsData.length
  const selesai      = slsData.filter(d => d.persen >= 100).length
  const sebagian     = slsData.filter(d => d.persen > 0 && d.persen < 100).length
  const belum        = slsData.filter(d => d.persen === 0).length
  const totalTarget  = slsData.reduce((s, d) => s + (d.target_simpul || 0), 0)
  const totalSubmit  = slsData.reduce((s, d) => s + (d.submit || 0), 0)
  const pctGlobal    = totalTarget > 0 ? parseFloat(((totalSubmit / totalTarget) * 100).toFixed(1)) : 0

  const totalPPL     = (pplData || []).length
  const totalAnoUsaha = (anomUsaha || []).length
  const totalAnoKel   = (anomKel || []).length

  // ── Progress per Desa ────────────────────────────────────────────────────────
  const desaMap = {}
  slsData.forEach(d => {
    const desa = d.nmdesa || 'Tidak diketahui'
    if (!desaMap[desa]) desaMap[desa] = { target: 0, submit: 0, count: 0 }
    desaMap[desa].target += d.target_simpul || 0
    desaMap[desa].submit += d.submit || 0
    desaMap[desa].count += 1
  })
  const perDesa = Object.entries(desaMap).map(([desa, v]) => ({
    desa: desa.replace(/^\d+ - /, '').slice(0, 14),
    fullDesa: desa,
    target: v.target,
    submit: v.submit,
    count: v.count,
    persen: v.target > 0 ? parseFloat(((v.submit / v.target) * 100).toFixed(1)) : 0
  })).sort((a, b) => b.persen - a.persen)

  // ── Top & Bottom PPL ──────────────────────────────────────────────────────────
  const pplProcessed = (pplData || []).map(p => ({
    ...p,
    persen: (p.target_simpul || 0) > 0
      ? parseFloat(((p.submit / p.target_simpul) * 100).toFixed(1))
      : 0
  })).sort((a, b) => b.persen - a.persen)

  const top5PPL = pplProcessed.slice(0, 5)
  const bot5PPL = [...pplProcessed].sort((a, b) => a.persen - b.persen).slice(0, 5)

  // ── Anomali terbaru ───────────────────────────────────────────────────────────
  const latestAnom = [
    ...(anomUsaha || []).slice(0, 3).map(a => ({ ...a, jenis: 'Usaha', nama: a.nm_usaha })),
    ...(anomKel   || []).slice(0, 3).map(a => ({ ...a, jenis: 'Keluarga', nama: a.nm_keluarga })),
  ].slice(0, 5)

  return (
    <div className="page-content animate-fade-in">
      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-header-eyebrow">Sensus Ekonomi 2026</div>
        <h2>Dashboard Monitoring</h2>
        <p>Kecamatan Tempuran · Kabupaten Karawang · {totalSLS} SLS terpantau</p>
      </div>

      {/* ── Hero Progress Card ── */}
      <div className="card mb-6" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%)',
        border: '1px solid rgba(99,102,241,0.2)'
      }}>
        <div className="hero-progress-card">
          <div className="hero-progress-donut">
            <DonutChart pct={pctGlobal} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                {pctGlobal}%
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
                Submit
              </div>
            </div>
          </div>

          <div className="hero-progress-stats">
            <div style={{ fontWeight: 800, fontSize: 'clamp(1rem, 3vw, 1.35rem)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Progress Keseluruhan Kec. Tempuran
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
              {formatNumber(totalSubmit)} dari {formatNumber(totalTarget)} unit berhasil disubmit
            </div>
            <ProgressBar value={totalSubmit} max={totalTarget} color={getProgressColor(pctGlobal)} />
          </div>

          <div className="hero-progress-pills">
            {[
              { label: 'SLS Selesai (100%)', val: selesai, color: '#34d399', bg: 'rgba(16,185,129,0.1)', icon: '✅' },
              { label: 'SLS Sebagian',       val: sebagian, color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', icon: '⏳' },
              { label: 'SLS Belum Mulai',    val: belum,    color: '#f87171', bg: 'rgba(239,68,68,0.1)',  icon: '❌' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px', borderRadius: 'var(--r-md)',
                background: s.bg, border: `1px solid ${s.color}25`
              }}>
                <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                <span style={{ fontWeight: 800, color: s.color, fontSize: '1.1rem' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-stats">
        <StatCard icon={Map}          value={totalSLS}      label="Total SLS" color="primary" sub={`${selesai} selesai, ${belum} belum`} />
        <StatCard icon={Users}        value={totalPPL}      label="Petugas PPL" color="purple" sub="6 PML koordinator" />
        <StatCard icon={AlertTriangle} value={formatNumber(totalAnoUsaha)} label="Anomali Usaha" color="warning" sub="Perlu ditindaklanjuti" />
        <StatCard icon={AlertTriangle} value={formatNumber(totalAnoKel)} label="Anomali Keluarga" color="danger" sub="Perlu ditindaklanjuti" />
      </div>

      {/* ── Progress per Desa ── */}
      <div className="card mb-6">
        <SectionHeader
          title="Progress per Desa"
          icon={Map}
          subtitle="Submit / Target per desa, urut tertinggi"
        >
          <Link to="/sls" className="btn btn-outline btn-sm">
            Lihat Semua <ArrowRight size={13} />
          </Link>
        </SectionHeader>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={perDesa} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
            <XAxis dataKey="desa" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="submit" name="Submit"  fill="#6366f1" radius={[4,4,0,0]} />
            <Bar dataKey="target" name="Target"  fill="rgba(99,102,241,0.18)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Table summary */}
        <TableScrollHint />
        <div className="table-wrapper" style={{ marginTop: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Desa</th>
                <th className="hide-mobile">SLS</th>
                <th className="hide-mobile">Target</th>
                <th>Submit</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {perDesa.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, maxWidth: 180 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{i + 1}. </span>
                    {d.fullDesa}
                  </td>
                  <td className="hide-mobile">{d.count}</td>
                  <td className="hide-mobile">{formatNumber(d.target)}</td>
                  <td style={{ color: 'var(--success-light)', fontWeight: 600 }}>{formatNumber(d.submit)}</td>
                  <td style={{ minWidth: 140 }}>
                    <ProgressBar value={d.submit} max={d.target} color={getProgressColor(d.persen)} />
                  </td>
                  <td>
                    <Badge type={getProgressBadge(d.persen).type}>{d.persen}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Top & Bottom PPL ── */}
      <div className="grid-2 mb-6">
        {/* Top 5 */}
        <div className="card">
          <SectionHeader title="🏆 Top 5 PPL Teratas" icon={TrendingUp} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {top5PPL.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 'var(--r-full)',
                  background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                            : i === 1 ? 'linear-gradient(135deg,#94a3b8,#64748b)'
                            : 'rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800,
                  color: i < 2 ? '#fff' : 'var(--primary-light)',
                  flexShrink: 0
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nm_ppl}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.nm_pml}</div>
                </div>
                <Badge type={getProgressBadge(p.persen).type}>{p.persen}%</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 */}
        <div className="card">
          <SectionHeader title="⚠️ 5 PPL Perlu Perhatian" icon={AlertTriangle} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bot5PPL.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 'var(--r-full)',
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: 'var(--danger-light)',
                  flexShrink: 0
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nm_ppl}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.nm_pml}</div>
                </div>
                <Badge type="danger">{p.persen}%</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Anomali Terbaru ── */}
      <div className="card">
        <SectionHeader
          title="Anomali Terbaru"
          icon={AlertTriangle}
          subtitle="5 entri anomali terakhir"
        >
          <Link to="/anomali" className="btn btn-outline btn-sm">
            Lihat Semua <ArrowRight size={13} />
          </Link>
        </SectionHeader>
        {latestAnom.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}>
            <div style={{ fontSize: '1.5rem' }}>🎉</div>
            <h4>Tidak ada anomali!</h4>
          </div>
        ) : (
          <>
            <TableScrollHint />
            <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Nama</th>
                  <th>PPL</th>
                  <th>Desa</th>
                  <th>SLS</th>
                </tr>
              </thead>
              <tbody>
                {latestAnom.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <Badge type={a.jenis === 'Usaha' ? 'warning' : 'danger'}>{a.jenis}</Badge>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.nama || '-'}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{a.nm_ppl}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.kelurahan}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{a.kode_sls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
