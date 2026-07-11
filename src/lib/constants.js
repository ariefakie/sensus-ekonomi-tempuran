// ─── Anomaly Rule Constants ──────────────────────────────────────────────────────

export const RULES_USAHA = [
  { key: 'rule_1', desc: 'Biaya Produksi Dominan' },
  { key: 'rule_2', desc: 'Keuntungan Usaha (Selisih Negatif)' },
  { key: 'rule_3', desc: 'Bukan badan usaha tetapi permodalan korporasi' },
  { key: 'rule_4', desc: 'Data Keuangan MBG' },
  { key: 'rule_5', desc: 'Konsistensi aset, pekerja, produksi' },
  { key: 'rule_6', desc: 'Usaha Menengah Besar tanpa internet' },
  { key: 'rule_7', desc: 'Usaha Menengah Besar tanpa laporan keuangan' },
  { key: 'rule_8', desc: 'Perbedaan KBLI Pendataan dan SBR' },
]

export const RULES_USAHA_DETAILED = [
  { key: 'rule_1', label: 'R1', desc: 'Biaya Produksi Dominan', detail: 'Kegiatan tidak memproduksi barang sendiri, namun komposisi pengeluaran pada biaya produksi dominan (>50%)' },
  { key: 'rule_2', label: 'R2', desc: 'Keuntungan Usaha', detail: 'Selisih pendapatan dan pengeluaran negatif' },
  { key: 'rule_3', label: 'R3', desc: 'Bukan badan usaha tetapi ada penyertaan modal korporasi', detail: "Anomali Status Badan Usaha 'Bukan Badan Usaha' dengan permodalan korporasi publik" },
  { key: 'rule_4', label: 'R4', desc: 'Data Keuangan MBG', detail: "Anomali 'Makan Bergizi Gratis (MBG)' dengan rasio nilai pendapatan dibagi pengeluaran" },
  { key: 'rule_5', label: 'R5', desc: 'Konsistensi aset, pekerja, produksi', detail: 'Anomali aset, Total nilai produksi/penjualan/pendapatan, dan Total pekerja' },
  { key: 'rule_6', label: 'R6', desc: 'Usaha Menengah Besar tanpa internet', detail: 'Pendapatan usaha menunjukkan skala unit usaha berkategori menengah dan besar, namun tidak menggunakan internet' },
  { key: 'rule_7', label: 'R7', desc: 'Usaha Menengah Besar tanpa laporan keuangan', detail: 'Pendapatan usaha menunjukkan skala unit usaha berkategori menengah dan besar, namun tidak memiliki laporan/catatan keuangan' },
  { key: 'rule_8', label: 'R8', desc: 'Perbedaan KBLI Pendataan dan SBR', detail: 'KBLI 2 digit hasil pendataan berbeda dengan KBLI 2 digit pada SBR, sehingga perlu dilakukan verifikasi kesesuaian klasifikasi usaha' },
]

export const RULES_KELUARGA = [
  { key: 'r1_cerai',              desc: 'Status Cerai / Belum Kawin' },
  { key: 'r2_kk_muda',            desc: 'KK < 10 Tahun' },
  { key: 'r3_disabilitas',        desc: 'Semua Disabilitas' },
  { key: 'r4_luas_lantai',        desc: 'Luas Lantai Ekstrem' },
  { key: 'r5_selisih_pendapatan', desc: 'Selisih Pendapatan Negatif' },
  { key: 'r6_listrik',            desc: 'Listrik Rendah & Mewah' },
  { key: 'r7_anggota_ekstrem',    desc: 'Anggota Keluarga Ekstrem' },
]

export const RULES_KELUARGA_DETAILED = [
  { key: 'r1_cerai',              label: 'R1', desc: 'Status Cerai / Belum Kawin', detail: 'Kepala Keluarga dan pasangannya berstatus cerai atau belum kawin' },
  { key: 'r2_kk_muda',           label: 'R2', desc: 'Kepala Keluarga < 10 Th', detail: 'Umur Kepala Keluarga < 10 tahun dan tinggal di rumah milik sendiri' },
  { key: 'r3_disabilitas',       label: 'R3', desc: 'Semua Disabilitas', detail: 'Semua anggota keluarga menyandang disabilitas (kecuali keluarga tunggal)' },
  { key: 'r4_luas_lantai',       label: 'R4', desc: 'Luas Lantai Ekstrem', detail: 'Luas lantai per kapita < 3 m2 atau > 200 m2' },
  { key: 'r5_selisih_pendapatan',label: 'R5', desc: 'Selisih Pendapatan Negatif', detail: 'Selisih pendapatan dan pengeluaran negatif' },
  { key: 'r6_listrik',           label: 'R6', desc: 'Listrik Rendah & Mewah', detail: 'Pengeluaran listrik < Rp100rb atau < 900 watt tetapi punya AC, dll' },
  { key: 'r7_anggota_ekstrem',   label: 'R7', desc: 'Anggota Keluarga Ekstrem', detail: 'Jumlah Anggota Keluarga > 10 orang' },
]

// Helper function to check if a value indicates an anomaly
export function isAnomal(val) {
  if (!val) return false
  const s = String(val).toLowerCase()
  return s !== '-' && !s.includes('tidak')
}
