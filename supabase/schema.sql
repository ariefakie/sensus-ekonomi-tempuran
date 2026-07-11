-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE SQL SCHEMA
-- Monitoring Sensus Ekonomi 2026 — Kecamatan Tempuran
-- Run this in: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. REKAP PPL ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rekap_ppl (
  id             SERIAL PRIMARY KEY,
  nm_ppl         TEXT NOT NULL,
  nm_pml         TEXT,
  email_ppl      TEXT,
  target_simpul  INTEGER DEFAULT 0,
  submit         INTEGER DEFAULT 0,
  draft          INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. REKAP PML ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rekap_pml (
  id      SERIAL PRIMARY KEY,
  nm_pml  TEXT NOT NULL,
  nm_ppl  TEXT NOT NULL
);

-- ─── 3. ALOKASI TUGAS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alokasi_tugas (
  id          SERIAL PRIMARY KEY,
  idsls       TEXT,
  email_pml   TEXT,
  email_ppl   TEXT,
  kdprov      TEXT,
  kdkab       TEXT,
  kdkec       TEXT,
  kddesa      TEXT,
  kdsls       TEXT,
  kdsubsls    TEXT,
  nmkab       TEXT,
  nmkec       TEXT,
  nmdes       TEXT,
  nmsls       TEXT,
  nmsubsls    TEXT,
  nm_pml      TEXT,
  nm_ppl      TEXT,
  jml_umkm    INTEGER,
  target_fasih INTEGER
);

-- ─── 4. PROGRES CAPAIAN ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS progres_capaian (
  id              SERIAL PRIMARY KEY,
  idsls           TEXT,
  kdprov          TEXT,
  kdkab           TEXT,
  kdkec           TEXT,
  kddesa          TEXT,
  kdsubsls        TEXT,
  email_ppl       TEXT,
  nm_ppl          TEXT,
  nm_pml          TEXT,
  email_pml       TEXT,
  nmsls           TEXT,
  nmkec           TEXT,
  nmdesa          TEXT,
  relasi_sls      TEXT,
  target_fasih    INTEGER DEFAULT 0,
  target_simpul   INTEGER DEFAULT 0,
  progres_didata  INTEGER DEFAULT 0,
  persen_didata   FLOAT   DEFAULT 0,
  draft           INTEGER DEFAULT 0,
  persen_draft    FLOAT   DEFAULT 0,
  submit          INTEGER DEFAULT 0,
  persen_submit   FLOAT   DEFAULT 0
);

-- ─── 5. KUALITAS USAHA ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kualitas_usaha (
  id                      SERIAL PRIMARY KEY,
  no                      INTEGER,
  kdkab                   TEXT,
  kdkec                   TEXT,
  kddesa                  TEXT,
  kdsls                   TEXT,
  wilayah                 TEXT,
  kecamatan               TEXT,
  kelurahan               TEXT,
  sls_rt                  TEXT,
  jml_prelist_usaha       INTEGER DEFAULT 0,
  bku_ditemukan           INTEGER DEFAULT 0,
  persen_bku_ditemukan    FLOAT   DEFAULT 0,
  bku_tutup               INTEGER DEFAULT 0,
  persen_bku_tutup        FLOAT   DEFAULT 0,
  bku_ganda               INTEGER DEFAULT 0,
  persen_bku_ganda        FLOAT   DEFAULT 0,
  bku_tidak_ditemukan     INTEGER DEFAULT 0,
  persen_bku_hilang       FLOAT   DEFAULT 0,
  bku_baru                INTEGER DEFAULT 0,
  persen_bku_baru         FLOAT   DEFAULT 0,
  total_usaha_bku         INTEGER DEFAULT 0,
  usaha_keluarga_didata   INTEGER DEFAULT 0,
  jumlah_usaha_total      INTEGER DEFAULT 0,
  persen_usaha_total      FLOAT   DEFAULT 0,
  jml_prelist_ub          INTEGER DEFAULT 0,
  jml_ub_didata           INTEGER DEFAULT 0,
  persen_ub_didata        FLOAT   DEFAULT 0,
  jml_prelist_umkm        INTEGER DEFAULT 0,
  jml_umkm_didata         INTEGER DEFAULT 0,
  persen_umkm_didata      FLOAT   DEFAULT 0,
  total_usaha_didata      INTEGER DEFAULT 0,
  persen_total_skala      FLOAT   DEFAULT 0
);

-- ─── 6. KUALITAS KELUARGA ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kualitas_keluarga (
  id                       SERIAL PRIMARY KEY,
  no                       INTEGER,
  kdkab                    TEXT,
  kdkec                    TEXT,
  kddesa                   TEXT,
  kdsls                    TEXT,
  wilayah                  TEXT,
  kecamatan                TEXT,
  kelurahan                TEXT,
  sls_rt                   TEXT,
  prelist_awal             INTEGER DEFAULT 0,
  ditemukan                INTEGER DEFAULT 0,
  persen_ditemukan         FLOAT   DEFAULT 0,
  keluarga_baru            INTEGER DEFAULT 0,
  persen_keluarga_baru     FLOAT   DEFAULT 0,
  meninggal                INTEGER DEFAULT 0,
  persen_meninggal         FLOAT   DEFAULT 0,
  tidak_eligible           INTEGER DEFAULT 0,
  persen_tidak_eligible    FLOAT   DEFAULT 0,
  tidak_dapat_ditemui      INTEGER DEFAULT 0,
  persen_tidak_dapat_ditemui FLOAT DEFAULT 0,
  tidak_ditemukan          INTEGER DEFAULT 0,
  persen_tidak_ditemukan   FLOAT   DEFAULT 0,
  keluarga_khusus          INTEGER DEFAULT 0,
  persen_keluarga_khusus   FLOAT   DEFAULT 0,
  total_hasil              INTEGER DEFAULT 0,
  persen_capaian           FLOAT   DEFAULT 0
);

-- ─── 7. KUALITAS ART ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kualitas_art (
  id                      SERIAL PRIMARY KEY,
  no                      INTEGER,
  kdkab                   TEXT,
  kdkec                   TEXT,
  kddesa                  TEXT,
  kdsls                   TEXT,
  wilayah                 TEXT,
  kecamatan               TEXT,
  kelurahan               TEXT,
  sls_rt                  TEXT,
  tinggal_bersama         INTEGER DEFAULT 0,
  persen_tinggal_bersama  FLOAT   DEFAULT 0,
  art_baru                INTEGER DEFAULT 0,
  persen_art_baru         FLOAT   DEFAULT 0,
  meninggal               INTEGER DEFAULT 0,
  persen_meninggal        FLOAT   DEFAULT 0,
  pindah_dn               INTEGER DEFAULT 0,
  persen_pindah_dn        FLOAT   DEFAULT 0,
  pindah_ln               INTEGER DEFAULT 0,
  persen_pindah_ln        FLOAT   DEFAULT 0,
  tidak_ditemukan         INTEGER DEFAULT 0,
  persen_tidak_ditemukan  FLOAT   DEFAULT 0,
  art_khusus              INTEGER DEFAULT 0,
  persen_art_khusus       FLOAT   DEFAULT 0,
  total_art               INTEGER DEFAULT 0,
  persen_total_art        FLOAT   DEFAULT 0
);

-- ─── 8. ANOMALI USAHA ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anomali_usaha (
  id               SERIAL PRIMARY KEY,
  kdkab            TEXT,
  kdkec            TEXT,
  kddesa           TEXT,
  kdsls            TEXT,
  kdsubsls         TEXT,
  kabupaten        TEXT,
  kecamatan        TEXT,
  kelurahan        TEXT,
  kode_sls         TEXT,
  nm_usaha         TEXT,
  nm_ppl           TEXT,
  email_ppl        TEXT,
  nohp_ppl         TEXT,
  link_fasih       TEXT,
  rule_1           TEXT,
  rule_2           TEXT,
  rule_3           TEXT,
  rule_4           TEXT,
  rule_5           TEXT,
  rule_6           TEXT,
  rule_7           TEXT,
  rule_8           TEXT,
  tanggal_update   TIMESTAMPTZ
);

-- ─── 9. ANOMALI KELUARGA ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anomali_keluarga (
  id                      SERIAL PRIMARY KEY,
  kdkab                   TEXT,
  kdkec                   TEXT,
  kddesa                  TEXT,
  kdsls                   TEXT,
  kdsubsls                TEXT,
  kabupaten               TEXT,
  kecamatan               TEXT,
  kelurahan               TEXT,
  kode_sls                TEXT,
  nm_keluarga             TEXT,
  nm_ppl                  TEXT,
  email_ppl               TEXT,
  nohp_ppl                TEXT,
  link_fasih              TEXT,
  r1_cerai                TEXT,
  r2_kk_muda              TEXT,
  r3_disabilitas          TEXT,
  r4_luas_lantai          TEXT,
  r5_selisih_pendapatan   TEXT,
  r6_listrik              TEXT,
  r7_anggota_ekstrem      TEXT,
  tanggal_update          TIMESTAMPTZ
);

-- ─── Enable Row Level Security (RLS) — PUBLIC READ ─────────────────────────
ALTER TABLE rekap_ppl        ENABLE ROW LEVEL SECURITY;
ALTER TABLE rekap_pml        ENABLE ROW LEVEL SECURITY;
ALTER TABLE alokasi_tugas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE progres_capaian  ENABLE ROW LEVEL SECURITY;
ALTER TABLE kualitas_usaha   ENABLE ROW LEVEL SECURITY;
ALTER TABLE kualitas_keluarga ENABLE ROW LEVEL SECURITY;
ALTER TABLE kualitas_art     ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomali_usaha    ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomali_keluarga ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "public_read_rekap_ppl"        ON rekap_ppl        FOR SELECT USING (true);
CREATE POLICY "public_read_rekap_pml"        ON rekap_pml        FOR SELECT USING (true);
CREATE POLICY "public_read_alokasi_tugas"    ON alokasi_tugas    FOR SELECT USING (true);
CREATE POLICY "public_read_progres_capaian"  ON progres_capaian  FOR SELECT USING (true);
CREATE POLICY "public_read_kualitas_usaha"   ON kualitas_usaha   FOR SELECT USING (true);
CREATE POLICY "public_read_kualitas_keluarga" ON kualitas_keluarga FOR SELECT USING (true);
CREATE POLICY "public_read_kualitas_art"     ON kualitas_art     FOR SELECT USING (true);
CREATE POLICY "public_read_anomali_usaha"    ON anomali_usaha    FOR SELECT USING (true);
CREATE POLICY "public_read_anomali_keluarga" ON anomali_keluarga FOR SELECT USING (true);

-- ─── Indexes ─────────────────────────────────────────────────────────────── 
CREATE INDEX IF NOT EXISTS idx_progres_idsls   ON progres_capaian  (idsls);
CREATE INDEX IF NOT EXISTS idx_progres_nm_ppl  ON progres_capaian  (nm_ppl);
CREATE INDEX IF NOT EXISTS idx_progres_nm_pml  ON progres_capaian  (nm_pml);
CREATE INDEX IF NOT EXISTS idx_kual_usaha_kddesa ON kualitas_usaha (kddesa);
CREATE INDEX IF NOT EXISTS idx_kual_kel_kddesa ON kualitas_keluarga (kddesa);
CREATE INDEX IF NOT EXISTS idx_anom_usaha_ppl  ON anomali_usaha    (nm_ppl);
CREATE INDEX IF NOT EXISTS idx_anom_usaha_desa ON anomali_usaha    (kddesa);
CREATE INDEX IF NOT EXISTS idx_anom_kel_ppl    ON anomali_keluarga (nm_ppl);
CREATE INDEX IF NOT EXISTS idx_anom_kel_desa   ON anomali_keluarga (kddesa);
