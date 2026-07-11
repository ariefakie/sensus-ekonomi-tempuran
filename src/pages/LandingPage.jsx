import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Activity, BarChart3, Users, Map, AlertTriangle,
  TrendingUp, ArrowRight, Zap
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

function AnimatedStat({ end, label, suffix = '' }) {
  const val = useCountUp(end)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(1.6rem, 5vw, 3rem)',
        fontWeight: 800,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        {val.toLocaleString('id-ID')}{suffix}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
    </div>
  )
}

const features = [
  {
    icon: TrendingUp,
    color: '#3b82f6',
    title: 'Progress Real-time',
    desc: 'Pantau capaian pendataan setiap SLS secara langsung dengan visualisasi progress bar dan persentase submit.'
  },
  {
    icon: Users,
    color: '#8b5cf6',
    title: 'Monitoring Petugas',
    desc: 'Lihat kinerja setiap PPL dan PML secara individual, dilengkapi ranking dan status capaian.'
  },
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    title: 'Deteksi Anomali',
    desc: 'Pantau anomali usaha (8 rule) dan anomali keluarga (7 rule) secara otomatis per petugas & desa.'
  },
  {
    icon: BarChart3,
    color: '#10b981',
    title: 'Analisis Kualitas',
    desc: 'Analisis mendalam kualitas pendataan usaha, keluarga, dan ART per SLS dengan indikator kualitas.'
  },
  {
    icon: Map,
    color: '#06b6d4',
    title: 'Per Wilayah SLS',
    desc: '251 SLS terpetakan dengan detail petugas, target, progres, dan link FASIH langsung.'
  },
  {
    icon: Zap,
    color: '#f43f5e',
    title: 'Dashboard Cepat',
    desc: 'Overview statistik utama dalam sekali pandang: total target, submit, dan SLS yang sudah selesai.'
  }
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section className="landing-hero">
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute', top: '10%', left: '15%',
            width: 'min(600px, 90vw)', height: 'min(600px, 90vw)',
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '10%',
            width: 'min(500px, 80vw)', height: 'min(500px, 80vw)',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="landing-hero-inner">
          <div className="landing-badge animate-fade-in">
            <Activity size={14} />
            Sensus Ekonomi 2026 — BPS Kab. Karawang
          </div>

          <h1 className="landing-hero-title animate-fade-in">
            Monitoring{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Sensus Ekonomi
            </span>
            <br />Kecamatan Tempuran
          </h1>

          <p className="landing-hero-subtitle animate-fade-in animate-delay-1">
            Platform monitoring real-time progres pendataan lapangan, kualitas data, dan anomali
            untuk seluruh petugas PPL dan PML di Kecamatan Tempuran, Kabupaten Karawang.
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

      {/* Stats */}
      <section className="landing-stats-section">
        <div className="landing-stats-grid">
          <AnimatedStat end={46}     label="Petugas PPL Aktif" />
          <AnimatedStat end={6}      label="Petugas PML" />
          <AnimatedStat end={251}    label="Total SLS / RT" />
          <AnimatedStat end={32478}  label="Target Keluarga" />
          <AnimatedStat end={14917}  label="Sudah Submit" />
          <AnimatedStat end={45.9}   label="Progress Submit" suffix="%" />
        </div>
      </section>

      {/* Features */}
      <section className="landing-features-section">
        <div className="landing-section-inner">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12
            }}>
              Fitur Lengkap
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
              Semua yang Anda Butuhkan
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              Dashboard terintegrasi dari 4 sumber data Excel untuk monitoring komprehensif pendataan lapangan.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${f.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>{f.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Siap Mulai Monitoring?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
            Akses dashboard untuk memantau seluruh progres pendataan, kualitas, dan anomali secara real-time.
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

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 12, flexWrap: 'wrap'
        }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--grad-primary)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            SE2026 Monitoring · Kec. Tempuran
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          BPS Kabupaten Karawang · Sensus Ekonomi 2026
        </p>
      </footer>
    </div>
  )
}
