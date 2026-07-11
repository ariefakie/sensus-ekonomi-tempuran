import {
  LayoutDashboard, Users, Map, AlertTriangle, BarChart3
} from 'lucide-react'

export const navItems = [
  { label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard, to: '/dashboard', desc: 'Ringkasan progres' },
  { label: 'Petugas',   shortLabel: 'PPL',  icon: Users,           to: '/petugas',   desc: '46 PPL · 6 PML' },
  { label: 'SLS',       shortLabel: 'SLS',  icon: Map,             to: '/sls',       desc: '251 SLS · 14 Desa' },
  { label: 'Anomali',   shortLabel: 'Anom', icon: AlertTriangle,   to: '/anomali',   desc: 'Usaha & Keluarga' },
  { label: 'Kualitas',  shortLabel: 'Kual', icon: BarChart3,       to: '/kualitas',  desc: 'BKU · Keluarga · ART' },
]

export const pageMeta = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Ringkasan monitoring pendataan' },
  '/petugas':   { title: 'Petugas', subtitle: 'Kinerja PPL & PML' },
  '/sls':       { title: 'SLS / Wilayah', subtitle: 'Progres per wilayah kerja' },
  '/anomali':   { title: 'Anomali', subtitle: 'Temuan validasi data' },
  '/kualitas':  { title: 'Kualitas', subtitle: 'Kelengkapan pendataan' },
}
