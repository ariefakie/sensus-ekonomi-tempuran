import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Activity, BarChart3, Users, Map, AlertTriangle,
  TrendingUp, ArrowRight, Zap, BarChart2, Smartphone
} from 'lucide-react'

function useCountUp(target, duration = 2000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

function TrustStat({ end, label, suffix = '' }) {
  const val = useCountUp(end)
  return (
    <div className="landing-trust-item">
      <div className="landing-trust-val">{val.toLocaleString('id-ID')}{suffix}</div>
      <div className="landing-trust-label">{label}</div>
    </div>
  )
}

const features = [
  { icon: TrendingUp, color: '#FF7043', bg: 'rgba(255,112,67,0.12)', title: 'Progress Real-time', desc: 'Capaian setiap SLS langsung terpantau dengan progress bar interaktif.', large: true },
  { icon: Users, color: '#26C6DA', bg: 'rgba(38,198,218,0.12)', title: 'Monitoring Petugas', desc: 'Kinerja PPL & PML per individu.' },
  { icon: AlertTriangle, color: '#FFA726', bg: 'rgba(255,167,38,0.12)', title: 'Deteksi Anomali', desc: '15 rule validasi otomatis.' },
  { icon: BarChart3, color: '#66BB6A', bg: 'rgba(102,187,106,0.12)', title: 'Analisis Kualitas', desc: 'BKU, Keluarga, ART per SLS.' },
  { icon: Map, color: '#7E57C2', bg: 'rgba(126,87,194,0.12)', title: '251 SLS Terpetakan', desc: 'Detail wilayah kerja lengkap.', large: true },
  { icon: Smartphone, color: '#EF5350', bg: 'rgba(239,83,80,0.12)', title: 'Mobile Friendly', desc: 'Nyaman dibuka dari HP.' },
]

export default function LandingPage() {
  return (
    <div className="landing-v4">
      <header className="landing-topbar">
        <Link to="/" className="landing-brand">
          <div className="landing-brand-mark"><BarChart2 size={18} /></div>
          SE2026 Tempuran
        </Link>
        <Link to="/dashboard" className="btn btn-primary btn-sm">
          Masuk <ArrowRight size={14} />
        </Link>
      </header>

      <section className="landing-hero-v4">
        <div className="landing-hero-text animate-fade-in">
          <div className="landing-badge" style={{ marginBottom: 20 }}>
            <Activity size={14} /> BPS Kab. Karawang · 2026
          </div>
          <h1>
            Pantau <em>Sensus Ekonomi</em> Kecamatan Tempuran
          </h1>
          <p>
            Platform monitoring real-time untuk progres pendataan, kualitas data,
            dan anomali — dioptimalkan untuk HP, tablet, dan desktop.
          </p>
          <div className="landing-cta-row">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <BarChart3 size={18} /> Buka Dashboard
            </Link>
            <Link to="/sls" className="btn btn-outline btn-lg">
              <Map size={18} /> Lihat SLS
            </Link>
          </div>
        </div>

        <div className="landing-hero-visual animate-fade-in animate-delay-1">
          <div className="landing-phone-mock">
            <div className="landing-phone-notch" />
            <div className="landing-phone-stat">
              <div>
                <div className="landing-phone-stat-val">45.9%</div>
                <div className="landing-phone-stat-label">Progress Submit</div>
              </div>
            </div>
            <div className="landing-phone-stat">
              <div>
                <div className="landing-phone-stat-val">251</div>
                <div className="landing-phone-stat-label">Total SLS</div>
              </div>
            </div>
            <div className="landing-phone-stat">
              <div>
                <div className="landing-phone-stat-val">46</div>
                <div className="landing-phone-stat-label">PPL Aktif</div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,112,67,0.1)', borderRadius: 10, fontSize: '0.72rem', color: 'var(--primary-light)', textAlign: 'center', fontWeight: 600 }}>
              Live Monitoring · Kec. Tempuran
            </div>
          </div>
        </div>
      </section>

      <section className="landing-trust-strip">
        <TrustStat end={46} label="PPL Aktif" />
        <TrustStat end={6} label="PML" />
        <TrustStat end={251} label="Total SLS" />
        <TrustStat end={32478} label="Target" />
        <TrustStat end={14917} label="Submit" />
        <TrustStat end={45.9} label="Progress" suffix="%" />
      </section>

      <section className="landing-bento-section">
        <div className="landing-bento-header">
          <div className="landing-section-eyebrow">Fitur Lengkap</div>
          <h2>Semua dalam Satu Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
            Terintegrasi dari 4 sumber data Excel untuk monitoring komprehensif.
          </p>
        </div>
        <div className="landing-bento-grid">
          {features.map((f, i) => (
            <div key={i} className={`landing-bento-item ${f.large ? 'landing-bento-item--large' : ''} animate-fade-in`} style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="landing-bento-icon" style={{ background: f.bg }}>
                <f.icon size={22} color={f.color} strokeWidth={2} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-final-cta">
        <div className="landing-final-cta-box">
          <h2 style={{ marginBottom: 12 }}>Siap Mulai?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
            Buka dashboard dari HP atau komputer. Pantau progres pendataan kapan saja.
          </p>
          <div className="landing-cta-row">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <Zap size={18} /> Masuk Dashboard
            </Link>
            <Link to="/anomali" className="btn btn-outline btn-lg">
              <AlertTriangle size={18} /> Cek Anomali
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <div className="landing-brand-mark" style={{ width: 28, height: 28 }}><BarChart2 size={14} /></div>
          SE2026 Monitoring · Kec. Tempuran
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BPS Kabupaten Karawang · Sensus Ekonomi 2026</p>
      </footer>
    </div>
  )
}
