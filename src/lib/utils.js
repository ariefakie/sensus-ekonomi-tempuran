// ─── Helper Functions ──────────────────────────────────────────────────────────────

export function getProgressColor(pct) {
  if (pct >= 100) return 'success'
  if (pct >= 70)  return 'primary'
  if (pct >= 40)  return 'warning'
  return 'danger'
}

export function getProgressBadge(pct) {
  if (pct >= 100) return { type: 'success', label: 'Selesai' }
  if (pct >= 70)  return { type: 'info',    label: 'Hampir' }
  if (pct > 0)    return { type: 'warning', label: 'Berjalan' }
  return { type: 'danger', label: 'Belum' }
}

export function formatNumber(n) {
  if (n == null || n === '') return '-'
  return Number(n).toLocaleString('id-ID')
}

export function formatPct(n) {
  if (n == null) return '-'
  return `${Number(n).toFixed(1)}%`
}
