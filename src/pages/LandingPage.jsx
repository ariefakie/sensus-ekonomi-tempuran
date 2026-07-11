import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Activity, BarChart3, Users, Map, AlertTriangle,
  TrendingUp, ArrowRight, Zap, BarChart2
} from 'lucide-react'

function useCountUp(target, duration = 2000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

function LandingStat({ end, label, suffix = '' }) {
  const val = useCountUp(end)
  return (
    <div>
      <div className="landing-stat-value text-gradient">
        {val.toLocaleString('id-ID')}{suffix}
      </div>
      <div className="landing-stat-label">{label}</div>
    </div>
  )
}

const features = [
  { icon: TrendingUp, color: '#4F8CFF', bg: 'rgba(79,140,255,0.12)', title: 'Progress Real-time', desc: 'Pantau capaian setiap SLS dengan progress bar dan persentase submit yang selalu diperbarui.' },
  { icon: Users, color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', title: 'Monitoring Petugas', desc: 'Kinerja PPL dan PML per individu, lengkap dengan ranking dan status capaian.' },
  { icon: AlertTriangle, color: '#FBBF24', bg: 'rgba(251,191,36,0.12)', title: 'Deteksi Anomali', desc: '8 rule anomali usaha dan 7 rule keluarga terdeteksi otomatis per petugas & desa.' },
  { icon: BarChart3, color: '#22C997', bg: 'rgba(34,201,151,0.12)', title: 'Analisis Kualitas', desc: 'Kualitas pendataan usaha, keluarga, dan ART per SLS dengan indikator lengkap.' },
  { icon: Map, color: '#2DD4BF', bg: 'rgba(45,212,191,0.12)', title: 'Per Wilayah SLS', desc: '251 SLS terpetakan dengan detail petugas, target, progres, dan status pendataan.' },
  { icon: Zap, color: '#F87171', bg: 'rgba(248,113,113,0.12)', title: 'Dashboard Cepat', desc: 'Statistik utama dalam sekali pandang — target, submit, dan SLS selesai.' },
]

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-brand">
          <div className="landing-nav-brand-icon">
            <BarChart2 size={16} />
          </div>
          SE2026 Tempuran
        </Link>
        <Link to="/dashboard" className="btn btn-primary btn-sm">
          Masuk Dashboard
        </Link>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="landing-hero-orb landing-hero-orb-1" />
          <div className="landing-hero-orb landing-hero-orb-2" />
        </div>

        <div className="landing-hero-inner">
          <div className="landing-badge animate-fade-in">
            <Activity size={14} />
            Sensus Ekonomi 2026 · BPS Kab. Karawang
          </div>

          <h1 className="landing-hero-title animate-fade-in">
            Monitoring{' '}
            <span className="text-gradient">Sensus Ekonomi</span>
            <br />
            Kecamatan Tempuran
          </h1>

          <p className="landing-hero-subtitle animate-fade-in animate-delay-1">
            Platform monitoring real-time progres pendataan lapangan, kualitas data,
            dan anomali untuk seluruh petugas PPL dan PML.
          </p>

          <div className="landing-cta-row animate-fade-in animate-delay-2">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <BarChart3 size={18} />
              Buka Dashboard
              <ArrowRight size={18} />
            </Link>
            <Link to="/petugas" className="btn btn-outline btn-lg">
              <Users size={18} />
              Lihat Petugas
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-stats-section">
        <div className="landing-stats-grid">
          <LandingStat end={46} label="PPL Aktif" />
          <LandingStat end={6} label="PML" />
          <LandingStat end={251} label="Total SLS" />
          <LandingStat end={32478} label="Target Keluarga" />
          <LandingStat end={14917} label="Sudah Submit" />
          <LandingStat end={45.9} label="Progress Submit" suffix="%" />
        </div>
      </section>

      <section className="landing-features-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <div className="landing-section-eyebrow">Fitur Lengkap</div>
            <h2>Semua yang Anda Butuhkan</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '12px auto 0', lineHeight: 1.7 }}>
              Dashboard terintegrasi dari 4 sumber data untuk monitoring komprehensif pendataan lapangan.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div key={i} className="landing-feature-card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="landing-feature-icon" style={{ background: f.bg }}>
                  <f.icon size={22} color={f.color} strokeWidth={2} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-cta-box">
          <h2 style={{ marginBottom: 12 }}>Siap Mulai Monitoring?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
            Akses dashboard untuk memantau progres pendataan, kualitas, dan anomali secara real-time — langsung dari HP Anda.
          </p>
          <div className="landing-cta-row">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <Activity size={18} />
              Masuk ke Dashboard
            </Link>
            <Link to="/anomali" className="btn btn-outline btn-lg">
              <AlertTriangle size={18} />
              Cek Anomali
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <div className="landing-nav-brand-icon">
            <BarChart2 size={14} />
          </div>
          SE2026 Monitoring · Kec. Tempuran
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          BPS Kabupaten Karawang · Sensus Ekonomi 2026
        </p>
      </footer>
    </div>
  )
}
