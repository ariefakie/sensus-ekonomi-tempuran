# 📊 Monitoring SE2026 — Kecamatan Tempuran

Platform web monitoring real-time untuk Sensus Ekonomi 2026, Kecamatan Tempuran, Kabupaten Karawang.

Built with **React.js + Vite + Supabase**.

---

## 🚀 Fitur

- **Dashboard** — Statistik utama, progress bar, chart distribusi anomali
- **Petugas** — Monitoring 46 PPL & 6 PML dengan progress per individu
- **SLS / Wilayah** — Tabel 251 SLS dengan filter status/desa/PPL
- **Anomali** — Usaha (8 rule) & Keluarga (7 rule) dengan link FASIH
- **Kualitas** — Analisis kualitas usaha, keluarga, dan ART per SLS

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/username/sensus-monitoring.git
cd sensus-monitoring
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka SQL Editor, paste & jalankan isi file [`supabase/schema.sql`](./supabase/schema.sql)
3. Salin URL dan Anon Key dari **Settings > API**

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Isi file `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Import Data (ETL)

```bash
pip install openpyxl supabase

# Set kredensial Supabase (Service Role Key untuk write)
set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
set SUPABASE_SERVICE_KEY=your_service_role_key

# Taruh file .xlsx di root folder (satu level di atas sensus-monitoring)
# Lalu jalankan:
python scripts/etl_import.py
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:5173

---

## 🌐 Deploy ke Vercel

### Via Vercel Dashboard

1. Push ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Klik **New Project** → Import dari GitHub
4. Tambahkan **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

---

## 📁 Struktur Project

```
sensus-monitoring/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # Navigasi sidebar
│   │   ├── Navbar.jsx       # Top navbar
│   │   └── UI.jsx           # Komponen reusable
│   ├── pages/
│   │   ├── LandingPage.jsx  # Halaman awal
│   │   ├── Dashboard.jsx    # Dashboard utama
│   │   ├── PetugasPage.jsx  # Data PPL & PML
│   │   ├── SLSPage.jsx      # Data SLS wilayah
│   │   ├── AnomaliPage.jsx  # Anomali usaha & keluarga
│   │   └── KualitasPage.jsx # Kualitas pendataan
│   ├── services/
│   │   └── api.js           # Semua query ke Supabase
│   ├── lib/
│   │   └── supabase.js      # Supabase client
│   ├── App.jsx              # Root + routing
│   ├── main.jsx
│   └── index.css            # Design system
├── supabase/
│   └── schema.sql           # SQL schema untuk Supabase
├── scripts/
│   └── etl_import.py        # Script ETL xlsx → Supabase
├── vercel.json              # Konfigurasi deploy Vercel
├── .env.example
└── package.json
```

---

## 📊 Sumber Data

| File | Sheet | Isi |
|---|---|---|
| `rekap_tempuran.xlsx` | alokasi_tugas | Alokasi SLS per PPL |
| `rekap_tempuran.xlsx` | progres_capaian | Progress submit per SLS |
| `rekap_tempuran.xlsx` | REKAP PPL | Rekap per PPL |
| `rekap_tempuran.xlsx` | rekap Data PML | Mapping PML → PPL |
| `kualitas_pendataan.xlsx` | kualitas_usaha | Kualitas BKU per SLS |
| `kualitas_pendataan.xlsx` | kualitas_keluarga | Kualitas keluarga per SLS |
| `kualitas_pendataan.xlsx` | kualitas_art | Kualitas ART per SLS |
| `anomali_usaha_tempuran.xlsx` | Anomali Usaha | 8 rule anomali usaha |
| `anomali_keluarga_tempuran.xlsx` | Anomali Keluarga | 7 rule anomali keluarga |

---

## 🛠 Tech Stack

- **Frontend**: React.js + Vite
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel

---

© 2026 BPS Kabupaten Karawang — Sensus Ekonomi 2026
