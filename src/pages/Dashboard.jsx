import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Map, Users, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { LoadingSpinner, ProgressBar, Badge, CustomTooltip } from '../components/UI'
import {
  HeroBanner, BentoStat, ProgressRing, StatusPill,
  RankList, DesaCard, MobileCardList, DesktopTable
} from '../components/DataViews'
import { formatNumber, getProgressBadge, getProgressColor } from '../lib/utils'
import { getProgresCapaian, getRekapPPL, getAnomaliUsaha, getAnomaliKeluarga } from '../services/api'

export default function Dashboard() {
  const { data: progres, isLoading: l1 } = useQuery({ queryKey: ['progres'], queryFn: getProgresCapaian })
  const { data: pplData, isLoading: l2 } = useQuery({ queryKey: ['rekap_ppl'], queryFn: getRekapPPL })
  const { data: anomUsaha, isLoading: l3 } = useQuery({ queryKey: ['anom_usaha_all'], queryFn: () => getAnomaliUsaha() })
  const { data: anomKel, isLoading: l4 } = useQuery({ queryKey: ['anom_kel_all'], queryFn: () => getAnomaliKeluarga() })

  if (l1 || l2 || l3 || l4) return <LoadingSpinner text="Memuat dashboard..." />

  const slsData = (progres || []).map(d => ({
    ...d,
    persen: (d.target_simpul || 0) > 0
      ? parseFloat(((d.submit / d.target_simpul) * 100).toFixed(1)) : 0
  }))

  const totalSLS = slsData.length
  const selesai = slsData.filter(d => d.persen >= 100).length
  const sebagian = slsData.filter(d => d.persen > 0 && d.persen < 100).length
  const belum = slsData.filter(d => d.persen === 0).length
  const totalTarget = slsData.reduce((s, d) => s + (d.target_simpul || 0), 0)
  const totalSubmit = slsData.reduce((s, d) => s + (d.submit || 0), 0)
  const pctGlobal = totalTarget > 0 ? parseFloat(((totalSubmit / totalTarget) * 100).toFixed(1)) : 0
  const totalPPL = (pplData || []).length
  const totalAnoUsaha = (anomUsaha || []).length
  const totalAnoKel = (anomKel || []).length

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
    target: v.target, submit: v.submit, count: v.count,
    persen: v.target > 0 ? parseFloat(((v.submit / v.target) * 100).toFixed(1)) : 0
  })).sort((a, b) => b.persen - a.persen)

  const pplProcessed = (pplData || []).map(p => ({
    ...p,
    persen: (p.target_simpul || 0) > 0
      ? parseFloat(((p.submit / p.target_simpul) * 100).toFixed(1)) : 0
  })).sort((a, b) => b.persen - a.persen)

  const top5PPL = pplProcessed.slice(0, 5)
  const bot5PPL = [...pplProcessed].sort((a, b) => a.persen - b.persen).slice(0, 5)

  const latestAnom = [
    ...(anomUsaha || []).slice(0, 3).map(a => ({ ...a, jenis: 'Usaha', nama: a.nm_usaha })),
    ...(anomKel || []).slice(0, 3).map(a => ({ ...a, jenis: 'Keluarga', nama: a.nm_keluarga })),
  ].slice(0, 5)

  return (
    <div className="page-content animate-fade-in">
      <HeroBanner
        eyebrow="Sensus Ekonomi 2026"
        title="Dashboard Monitoring"
        description={`Kec. Tempuran · ${totalSLS} SLS · ${formatNumber(totalSubmit)} dari ${formatNumber(totalTarget)} submit`}
      >
        <ProgressRing pct={pctGlobal} />
      </HeroBanner>

      <div className="bento-grid">
        <BentoStat icon={Map} value={totalSLS} label="Total SLS" sub={`${selesai} selesai`} accent="primary" />
        <BentoStat icon={Users} value={totalPPL} label="Petugas PPL" sub="6 PML" accent="accent" />
        <BentoStat icon={AlertTriangle} value={formatNumber(totalAnoUsaha)} label="Anomali Usaha" accent="warning" />
        <BentoStat icon={AlertTriangle} value={formatNumber(totalAnoKel)} label="Anomali Keluarga" accent="danger" />
      </div>

      <div className="panel">
        <div className="status-pill-row" style={{ marginBottom: 20 }}>
          <StatusPill icon="✅" label="SLS Selesai (100%)" value={selesai} variant="success" />
          <StatusPill icon="⏳" label="SLS Sebagian" value={sebagian} variant="warning" />
          <StatusPill icon="❌" label="SLS Belum Mulai" value={belum} variant="danger" />
        </div>
        <ProgressBar value={totalSubmit} max={totalTarget} color={getProgressColor(pctGlobal)} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title"><span className="panel-title-icon"><Map size={16} /></span> Progress per Desa</div>
            <p className="panel-subtitle">Urutan capaian tertinggi</p>
          </div>
          <Link to="/sls" className="btn btn-outline btn-sm">Lihat Semua <ArrowRight size={13} /></Link>
        </div>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={perDesa.slice(0, 10)} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
              <XAxis dataKey="desa" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="submit" name="Submit" fill="#FF7043" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="rgba(255,112,67,0.15)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <MobileCardList>
          {perDesa.map((d, i) => (
            <DesaCard key={i} index={i} desa={d.fullDesa} target={d.target} submit={d.submit} count={d.count} persen={d.persen} />
          ))}
        </MobileCardList>

        <DesktopTable>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Desa</th><th>SLS</th><th>Target</th><th>Submit</th><th>Progress</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {perDesa.map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{i + 1}. </span>{d.fullDesa}</td>
                    <td>{d.count}</td>
                    <td>{formatNumber(d.target)}</td>
                    <td style={{ color: 'var(--success-light)', fontWeight: 600 }}>{formatNumber(d.submit)}</td>
                    <td style={{ minWidth: 140 }}><ProgressBar value={d.submit} max={d.target} color={getProgressColor(d.persen)} /></td>
                    <td><Badge type={getProgressBadge(d.persen).type}>{d.persen}%</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DesktopTable>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><span className="panel-title-icon"><TrendingUp size={16} /></span> Top 5 PPL</div>
          </div>
          <RankList items={top5PPL} variant="top" />
        </div>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><span className="panel-title-icon"><AlertTriangle size={16} /></span> Perlu Perhatian</div>
          </div>
          <RankList items={bot5PPL} variant="bottom" />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title"><span className="panel-title-icon"><AlertTriangle size={16} /></span> Anomali Terbaru</div>
            <p className="panel-subtitle">5 entri terakhir</p>
          </div>
          <Link to="/anomali" className="btn btn-outline btn-sm">Lihat Semua <ArrowRight size={13} /></Link>
        </div>

        {latestAnom.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}>
            <div style={{ fontSize: '1.5rem' }}>🎉</div>
            <h4>Tidak ada anomali!</h4>
          </div>
        ) : (
          <>
            <MobileCardList>
              {latestAnom.map((a, i) => (
                <div key={i} className="data-card">
                  <div className="data-card-header">
                    <div className="data-card-icon-wrap anomaly"><AlertTriangle size={16} /></div>
                    <div className="data-card-title-block">
                      <div className="data-card-title">{a.nama || '-'}</div>
                      <div className="data-card-subtitle">{a.nm_ppl} · {a.kelurahan}</div>
                    </div>
                    <Badge type={a.jenis === 'Usaha' ? 'warning' : 'danger'}>{a.jenis}</Badge>
                  </div>
                  <div className="data-card-footer"><span>SLS: {a.kode_sls}</span></div>
                </div>
              ))}
            </MobileCardList>
            <DesktopTable>
              <div className="table-wrapper">
                <table className="table">
                  <thead><tr><th>Jenis</th><th>Nama</th><th>PPL</th><th>Desa</th><th>SLS</th></tr></thead>
                  <tbody>
                    {latestAnom.map((a, i) => (
                      <tr key={i}>
                        <td><Badge type={a.jenis === 'Usaha' ? 'warning' : 'danger'}>{a.jenis}</Badge></td>
                        <td style={{ fontWeight: 600 }}>{a.nama || '-'}</td>
                        <td>{a.nm_ppl}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{a.kelurahan}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{a.kode_sls}</td>
                      </tr>
                    ))}
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
