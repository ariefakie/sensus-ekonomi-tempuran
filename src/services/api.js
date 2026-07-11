import { supabase } from '../lib/supabase'

// ─── Progres Capaian ────────────────────────────────────────────────────────
export async function getProgresCapaian() {
  const { data, error } = await supabase
    .from('progres_capaian')
    .select('*')
    .order('idsls')
  if (error) throw error
  return data
}

export async function getProgresCapaianByPPL(nm_ppl) {
  const { data, error } = await supabase
    .from('progres_capaian')
    .select('*')
    .eq('nm_ppl', nm_ppl)
  if (error) throw error
  return data
}

export async function getStatistikUmum() {
  const { data, error } = await supabase
    .from('progres_capaian')
    .select('target_fasih, target_simpul, progres_didata, submit, draft')
  if (error) throw error

  const totals = data.reduce((acc, row) => {
    acc.target_fasih += row.target_fasih || 0
    acc.target_simpul += row.target_simpul || 0
    acc.submit += row.submit || 0
    acc.draft += row.draft || 0
    acc.progres_didata += row.progres_didata || 0
    return acc
  }, { target_fasih: 0, target_simpul: 0, submit: 0, draft: 0, progres_didata: 0 })

  totals.sls_total = data.length
  totals.sls_selesai = data.filter(r => (r.persen_submit || 0) >= 100).length
  totals.sls_sebagian = data.filter(r => (r.persen_submit || 0) > 0 && (r.persen_submit || 0) < 100).length
  totals.sls_belum = data.filter(r => (r.persen_submit || 0) === 0).length
  totals.persen_submit = totals.target_simpul > 0 ? ((totals.submit / totals.target_simpul) * 100).toFixed(1) : 0

  return totals
}

// ─── Petugas (Rekap PPL) ────────────────────────────────────────────────────
export async function getRekapPPL() {
  const { data, error } = await supabase
    .from('rekap_ppl')
    .select('*')
    .order('nm_ppl')
  if (error) throw error
  return data
}

export async function getRekapPML() {
  const { data, error } = await supabase
    .from('rekap_pml')
    .select('*')
    .order('nm_pml')
  if (error) throw error
  return data
}

// ─── Alokasi Tugas ──────────────────────────────────────────────────────────
export async function getAlokasiTugas(filters = {}) {
  let query = supabase
    .from('alokasi_tugas')
    .select('*')

  if (filters.nm_ppl) query = query.eq('nm_ppl', filters.nm_ppl)
  if (filters.nm_pml) query = query.eq('nm_pml', filters.nm_pml)
  if (filters.kddesa) query = query.eq('kddesa', filters.kddesa)

  const { data, error } = await query.order('idsls')
  if (error) throw error
  return data
}

// ─── Kualitas ───────────────────────────────────────────────────────────────
export async function getKualitasUsaha(filters = {}) {
  let query = supabase
    .from('kualitas_usaha')
    .select('*')

  if (filters.kddesa) query = query.eq('kddesa', filters.kddesa)
  if (filters.kdsls) query = query.eq('kdsls', filters.kdsls)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getKualitasKeluarga(filters = {}) {
  let query = supabase
    .from('kualitas_keluarga')
    .select('*')

  if (filters.kddesa) query = query.eq('kddesa', filters.kddesa)
  if (filters.kdsls) query = query.eq('kdsls', filters.kdsls)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getKualitasART(filters = {}) {
  let query = supabase
    .from('kualitas_art')
    .select('*')

  if (filters.kddesa) query = query.eq('kddesa', filters.kddesa)
  if (filters.kdsls) query = query.eq('kdsls', filters.kdsls)

  const { data, error } = await query
  if (error) throw error
  return data
}

// ─── Anomali ────────────────────────────────────────────────────────────────
export async function getAnomaliUsaha(filters = {}) {
  let query = supabase
    .from('anomali_usaha')
    .select('*')

  if (filters.nm_ppl) query = query.ilike('nm_ppl', `%${filters.nm_ppl}%`)
  if (filters.kddesa) query = query.eq('kddesa', filters.kddesa)
  if (filters.rule) query = query.neq(filters.rule, 'Tidak Ada Anomali').neq(filters.rule, 'Belum Selesai')

  const { data, error } = await query.order('tanggal_update', { ascending: false })
  if (error) throw error
  return data
}

export async function getAnomaliKeluarga(filters = {}) {
  let query = supabase
    .from('anomali_keluarga')
    .select('*')

  if (filters.nm_ppl) query = query.ilike('nm_ppl', `%${filters.nm_ppl}%`)
  if (filters.kddesa) query = query.eq('kddesa', filters.kddesa)

  const { data, error } = await query.order('tanggal_update', { ascending: false })
  if (error) throw error
  return data
}

export async function getStatistikAnomali() {
  const [usaha, keluarga] = await Promise.all([
    getAnomaliUsaha(),
    getAnomaliKeluarga()
  ])

  const RULES_USAHA = ['rule_1', 'rule_2', 'rule_3', 'rule_4', 'rule_5', 'rule_6', 'rule_7', 'rule_8']
  const RULES_KELUARGA = ['r1_cerai', 'r2_kk_muda', 'r3_disabilitas', 'r4_luas_lantai', 'r5_selisih_pendapatan', 'r6_listrik', 'r7_anggota_ekstrem']

  const countAnomalyUsaha = RULES_USAHA.reduce((acc, rule) => {
    acc[rule] = usaha.filter(r => r[rule] && r[rule] !== 'Tidak Ada Anomali' && r[rule] !== 'Belum Selesai').length
    return acc
  }, {})

  const countAnomalyKeluarga = RULES_KELUARGA.reduce((acc, rule) => {
    acc[rule] = keluarga.filter(r => r[rule] && r[rule] !== 'Tidak Ada Anomali' && r[rule] !== 'Belum Selesai').length
    return acc
  }, {})

  const belumSelesaiUsaha = usaha.filter(r => RULES_USAHA.some(rule => r[rule] === 'Belum Selesai')).length
  const belumSelesaiKeluarga = keluarga.filter(r => RULES_KELUARGA.some(rule => r[rule] === 'Belum Selesai')).length

  return {
    total_usaha: usaha.length,
    total_keluarga: keluarga.length,
    belum_selesai_usaha: belumSelesaiUsaha,
    belum_selesai_keluarga: belumSelesaiKeluarga,
    rules_usaha: countAnomalyUsaha,
    rules_keluarga: countAnomalyKeluarga
  }
}

// ─── SLS Detail ─────────────────────────────────────────────────────────────
export async function getSLSDetail(idsls) {
  const [progres, kual_usaha, kual_kel, kual_art, anom_usaha, anom_kel] = await Promise.all([
    supabase.from('progres_capaian').select('*').eq('idsls', idsls).single(),
    supabase.from('kualitas_usaha').select('*').filter('kddesa', 'eq', idsls.substring(7, 10)).filter('kdsls', 'eq', idsls.substring(10, 14)),
    supabase.from('kualitas_keluarga').select('*').filter('kddesa', 'eq', idsls.substring(7, 10)).filter('kdsls', 'eq', idsls.substring(10, 14)),
    supabase.from('kualitas_art').select('*').filter('kddesa', 'eq', idsls.substring(7, 10)).filter('kdsls', 'eq', idsls.substring(10, 14)),
    supabase.from('anomali_usaha').select('*').eq('kddesa', idsls.substring(7, 10)).eq('kdsls', idsls.substring(10, 14)),
    supabase.from('anomali_keluarga').select('*').eq('kddesa', idsls.substring(7, 10)).eq('kdsls', idsls.substring(10, 14)),
  ])

  return {
    progres: progres.data,
    kualitas_usaha: kual_usaha.data || [],
    kualitas_keluarga: kual_kel.data || [],
    kualitas_art: kual_art.data || [],
    anomali_usaha: anom_usaha.data || [],
    anomali_keluarga: anom_kel.data || []
  }
}
