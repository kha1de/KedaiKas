# KedaiKas

Platform digital pendukung keputusan bagi pelaku usaha kecil (warung/UMKM) untuk membantu pencatatan transaksi, memahami kondisi keuangan, menganalisis performa usaha, menetapkan target, melakukan simulasi keputusan, dan mengambil keputusan berbasis data nyata.

Dikembangkan untuk memberikan solusi modern, terstruktur, dan mudah digunakan tanpa memerlukan latar belakang akuntansi atau teknologi yang rumit.

---

## Daftar Isi

- [Tujuan Project](#tujuan-project)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur Sistem](#arsitektur-sistem)
- [UI/UX & Design System](#uiux--design-system)
- [Struktur Project](#struktur-project)
- [Database & Schema](#database--schema)
- [Setup PostgreSQL](#setup-postgresql)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Cara Menjalankan Project](#cara-menjalankan-project)
- [API Endpoints](#api-endpoints)
- [Pengujian (Testing) & Build](#pengujian-testing--build)
- [Status Project](#status-project)
- [Catatan Keamanan & Developer](#catatan-keamanan--developer)

---

## Tujuan Project

Sebagian besar pelaku UMKM dan pemilik warung tradisional mengelola operasional secara manual dengan buku catatan fisik atau sekadar intuisi kasir. Hal ini sering menimbulkan ketidakpastian arus kas, ketidaktahuan margin produk sesungguhnya, hingga kesulitan menetapkan target bisnis.

KedaiKas hadir untuk menyelesaikan permasalahan tersebut melalui:

1. **Digitalisasi Kasir & Pencatatan Transaksi**: Menggantikan nota manual dengan sistem pencatatan penjualan dan detail item yang rapi.
2. **Visibilitas Keuangan & Arus Kas**: Memberikan transparansi atas omzet, HPP (Harga Pokok Penjualan), laba kotor, beban operasional, dan laba bersih.
3. **Analisis Margin & Benchmark Pasar**: Mendeteksi produk terlaris, produk minim margin, serta komparasi terhadap referensi rentang harga pasar sekitar.
4. **Simulasi Keputusan Bisnis (CobaDulu)**: Wadah *what-if scenario analysis* yang memungkinkan pemilik usaha bereksperimen mengubah harga jual, proyeksi volume, atau penyesuaian biaya tanpa memanipulasi data riil pembukuan.
5. **Monitoring Target Usaha**: Menetapkan target laba periodik dan memantau persentase capaian secara real-time.

---

## Fitur Utama

Aplikasi menyediakan 9 modul utama yang saling terintegrasi:

| Fitur / Halaman | Fungsi & Implementasi Aktual |
|---|---|
| **Dashboard** | Menampilkan kartu ringkasan eksekutif (Omzet, HPP, Laba Kotor, Pengeluaran, Laba Bersih, Margin Bersih), progress target aktif, chart visualisasi omzet & laba, kartu insight otomatis, serta aktivitas transaksi terkini. |
| **Transaksi** | Antarmuka kasir penjualan untuk mencatat pesanan pelanggan per transaksi, pemilihan produk dari katalog, perhitungan subtotal/total otomatis, dan riwayat transaksi lengkap beserta detail item. |
| **Produk** | Manajemen master produk UMKM: input nama produk, kategori, harga modal, harga jual, dan satuan (Pcs, Kg, Pouch, dsb.), dilengkapi kalkulasi margin otomatis dan status produk. |
| **Keuangan** | Pencatatan arus kas keluar / beban operasional warung (listrik, bahan baku, transportasi, sewa, perlengkapan) dengan tanggal, nominal, dan keterangan pengeluaran. |
| **Analisis & Insight** | Modul Business Intelligence untuk meninjau efisiensi margin produk, analisis perbandingan harga terhadap data harga pasar (`price_references`), serta peringatan otomatis terkait kondisi keuangan. |
| **Target Usaha** | Penetapan dan pemantauan target laba per periode tertentu (tanggal mulai hingga selesai), estimasi pencapaian harian yang dibutuhkan, serta evaluasi status target (tercapai atau dalam proses). |
| **CobaDulu (Simulator)** | Simulator keputusan strategis berbasis skenario non-mutatif. Pemilik usaha dapat mensimulasikan kenaikan/penurunan harga jual, perubahan kuantitas terjual, atau pengeluaran baru guna memproyeksikan laba bersih dan kelayakan target tanpa mengubah database. |
| **Laporan** | Penyajian rekapitulasi keuangan periodik dengan filter rentang tanggal, metrik total omzet, beban, laba, serta breakdown transaksi dan pengeluaran yang siap dicetak/diekspor. |
| **Authentication** | Sistem registrasi dan login aman menggunakan JWT (*JSON Web Token*) dengan isolasi data per akun pengguna (`user_id`). |

---

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router architecture)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS dengan custom design tokens
- **Visualisasi Grafik**: Recharts
- **Icon Library**: Lucide React

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ASGI Server**: Uvicorn
- **ORM & Data Layer**: SQLAlchemy 2.0
- **Database Driver**: `psycopg` (psycopg 3 / binary) untuk PostgreSQL
- **Autentikasi & Keamanan**: PyJWT, `passlib[bcrypt]`, `cryptography`
- **Validasi Data**: Pydantic v2 & Pydantic Settings
- **Testing**: Pytest, HTTPX

> **Catatan Driver Tambahan:** Kode repositori SQL menggunakan SQLAlchemy standar. Driver `pymysql` tetap tersedia di `requirements.txt` semata-mata sebagai opsi kompatibilitas bila dijalankan terhadap lingkungan MySQL/MariaDB warisan, namun koneksi primer saat ini diarahkan ke PostgreSQL.

### Database
- **Engine**: PostgreSQL
- **Nama Database**: `project_warung`
- **File Schema**: `database/postgresql_schema.sql`
- **File Seed**: `database/postgresql_seed.sql`

---

## Arsitektur Sistem

KedaiKas menerapkan arsitektur *clean layered architecture* yang memisahkan presentasi antarmuka, routing API, business logic, dan abstraksi penyimpanan data:

```
┌─────────────────────────────────────────────────────────┐
│                   Browser Client                        │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / JSON (REST API)
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Next.js Frontend (Port 3000)              │
│       App Router • TypeScript • Tailwind • Recharts     │
└────────────────────────────┬────────────────────────────┘
                             │ Bearer JWT / REST Calls
                             ▼
┌─────────────────────────────────────────────────────────┐
│               FastAPI Backend (Port 8000)               │
│             Uvicorn ASGI Server • API Router            │
└────────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ MockRepository ]                [ SqlRepository ]
   (In-Memory Mode,                  (SQLAlchemy 2.0)
    USE_MOCK_REPO=true)                       │
                                              ▼
                                     [ PostgreSQL Engine ]
                                     (Database: project_warung)
```

### Abstraksi Data: Repository Pattern
Backend mengimplementasikan *Dependency Injection* melalui `get_repository()`:
1. **`SqlRepository`**: Menggunakan SQLAlchemy ORM untuk berinteraksi langsung dengan database PostgreSQL (`project_warung`). Digunakan saat `USE_MOCK_REPO=false`.
2. **`MockRepository`**: Komponen in-memory mandiri yang telah diisi data awal (*pre-seeded*). Digunakan saat `USE_MOCK_REPO=true` atau sebagai *fallback* jika database PostgreSQL sedang tidak aktif, memungkinkan pengembangan frontend tanpa ketergantungan koneksi database eksternal.

---

## UI/UX & Design System

Antarmuka pengguna KedaiKas mengadopsi sistem desain modern yang dirancang melalui **Google Stitch** dan kemudian diimplementasikan secara presisi ke dalam struktur frontend Next.js:

- **Warm Cream Canvas** (`#FBF9F5`): Latar belakang bernuansa hangat dan nyaman di mata untuk operasional harian kasir/pemilik warung.
- **Forest Green Primary** (`#1B4332` / `#143D2B`): Mencerminkan stabilitas finansial, integritas, dan pertumbuhan usaha UMKM.
- **Sage Green Secondary** (`#40916C` / `#52796F`): Aksen penunjang untuk badge positif, highlight navigasi, dan elemen interaktif.
- **Terracotta Accent** (`#C85A32`): Menghidupkan identitas lokal UMKM pada badge kasir, button aksi, dan logo wordmark.
- **Modern Typography**: Menggunakan font *Plus Jakarta Sans* untuk kemudahan membaca angka nominal dan laporan.
- **Responsive Layout**: Sidebar navigasi terstruktur, header dinamis dengan avatar pemilik usaha, dan komponen kartu metrik yang adaptif dari desktop hingga mobile.

### Sumber Desain Stitch
Seluruh berkas spesifikasi dan aset hasil eksplorasi tersimpan pada direktori `.stitch/`:
- `.stitch/DESIGN.md`: Dokumentasi spesifikasi warna, tipografi, grid, dan komponen.
- `.stitch/*.png`: Screenshot visual tiap halaman antarmuka.
- `.stitch/*.html`: Mockup HTML murni hasil export dari Google Stitch.
- `.stitch/kedaikas_brand_logo.svg`: Vektor logo resmi KedaiKas.
- `.stitch/business_owner.png`: Foto profil owner terintegrasi.

*(Catatan: Direktori `.stitch/` berfungsi murni sebagai referensi desain dan aset statis; Stitch bukan runtime dependency aplikasi).*

---

## Struktur Project

```
umkm-decision-support/
├── README.md                           # Dokumentasi utama proyek
├── START PROJECT.bat                   # Batch script untuk menjalankan Frontend & Backend
├── docker-compose.yml                  # Konfigurasi container opsional
│
├── frontend/                           # Aplikasi Next.js (Client)
│   ├── public/                         # Aset publik statis (logo, business_owner, favicon)
│   ├── src/
│   │   ├── app/                        # Next.js App Router
│   │   │   ├── layout.tsx              # Root HTML & Metadata
│   │   │   ├── globals.css             # Konfigurasi CSS variables & custom utilities
│   │   │   ├── page.tsx                # Halaman landing / redirect
│   │   │   ├── login/                  # Halaman Login
│   │   │   ├── register/               # Halaman Pendaftaran Akun
│   │   │   └── dashboard/              # Halaman Proteksi Dashboard
│   │   │       ├── layout.tsx          # Layout Sidebar, Header, User Menu
│   │   │       ├── page.tsx            # Dashboard Ringkasan Finansial
│   │   │       ├── produk/             # Manajemen Master Produk & Margin
│   │   │       ├── transaksi/          # Input Kasir & Riwayat Penjualan
│   │   │       ├── keuangan/           # Arus Kas & Pencatatan Biaya
│   │   │       ├── analisis/           # Analisis Performa & Peringatan
│   │   │       ├── target/             # Penetapan & Progress Target Laba
│   │   │       ├── cobadulu/           # Simulator Keputusan Skenario Bisnis
│   │   │       └── laporan/            # Rekapitulasi Laporan Keuangan
│   │   ├── lib/                        # Utilitas pembantu (format Rupiah, persentase)
│   │   ├── services/                   # Client HTTP API (Axios/Fetch abstraction)
│   │   └── types/                      # Type definitions TypeScript
│   ├── tailwind.config.js              # Token warna Stitch, spacing, dan font family
│   ├── tsconfig.json                   # Konfigurasi TypeScript
│   └── package.json                    # Dependensi frontend
│
├── backend/                            # Aplikasi FastAPI (Server)
│   ├── app/
│   │   ├── main.py                     # Entrypoint aplikasi FastAPI, CORS, Global Handler
│   │   ├── api/
│   │   │   ├── router.py               # Agregator router endpoint
│   │   │   └── routes/                 # Modul route: auth, products, transactions, dll.
│   │   ├── core/                       # Konfigurasi Settings, Database connection, Security
│   │   ├── models/                     # Deklarasi SQLAlchemy Model
│   │   ├── schemas/                    # Pydantic Schemas untuk validasi input/output
│   │   ├── repositories/               # Pola repositori (Base, MockRepository, SqlRepository)
│   │   └── services/                   # Layanan logika bisnis dan kalkulasi keuangan
│   ├── tests/                          # Automated Unit & Integration Tests (Pytest)
│   ├── requirements.txt                # Dependensi Python backend
│   ├── pytest.ini                      # Konfigurasi Pytest
│   └── .env.example                    # Template konfigurasi environment backend
│
├── database/                           # Skrip Skema & Data Awal Database
│   ├── postgresql_schema.sql           # DDL Skema tabel PostgreSQL
│   ├── postgresql_seed.sql             # DML Data awal pengujian PostgreSQL
│   ├── project_warung.sql              # Dump awal database (referensi struktur)
│   ├── schema.sql                      # Skema kompatibilitas MySQL
│   └── seed.sql                        # Seed data kompatibilitas MySQL
│
├── .stitch/                            # Referensi Design System & Mockup Google Stitch
│   ├── DESIGN.md                       # Panduan gaya visual & token desain
│   ├── *.html                          # Mockup HTML tiap modul
│   └── *.png                           # Screenshot visual tiap layar
│
└── docs/                               # Dokumentasi Teknis
    ├── api/                            # Spesifikasi dan dokumentasi endpoint
    ├── erd/                            # Diagram Relasi Entitas
    ├── flowchart/                      # Diagram alur proses bisnis
    └── screenshots/                    # Tangkapan layar aplikasi
```

---

## Database & Schema

Database yang digunakan adalah **PostgreSQL** dengan nama basis data `project_warung`. Struktur tabel didefinisikan dalam `database/postgresql_schema.sql` dan diisi data pengujian melalui `database/postgresql_seed.sql`.

### Tabel-Tabel Utama:

| Nama Tabel | Deskripsi | Primary Key | Foreign Key |
|---|---|---|---|
| **`users`** | Menyimpan identitas akun pemilik usaha / pengguna sistem (nama, email unik, password hash, waktu pembuatan). | `id_user` | - |
| **`products`** | Katalog produk dagangan dengan harga modal (HPP), harga jual, kategori, dan satuan. | `id_produk` | `id_user` → `users.id_user` |
| **`transactions`** | Header transaksi kasir yang mencatat waktu penjualan dan akumulasi total belanja. | `id_transaksi` | `id_user` → `users.id_user` |
| **`transaction_details`** | Baris item produk dalam tiap transaksi penjualan (jumlah item, harga jual saat transaksi, dan subtotal). | `id_detail` | `id_transaksi` → `transactions.id_transaksi`, `id_produk` → `products.id_produk` |
| **`expenses`** | Data beban operasional dan arus kas keluar usaha (listrik, bahan baku, transportasi, dsb.). | `id_expenses` | `id_user` → `users.id_user` |
| **`targets`** | Penetapan target laba bersih usaha beserta rentang tanggal periode evaluasi. | `id_target` | `id_user` → `users.id_user` |
| **`price_references`** | Data tolok ukur (*benchmark*) harga pasar sekitar sebagai rujukan analisis penetapan harga jual. | `id_analisis` | Dilengkapi trigger otomatis `trg_price_references_updated_at` |

---

## Setup PostgreSQL

Langkah-langkah menyiapkan basis data PostgreSQL:

### 1. Buat Database
Pastikan layanan PostgreSQL (versi 14+) sedang berjalan di komputer lokal Anda, lalu buat database `project_warung`:

```bash
# Menggunakan utility createdb
createdb -U postgres project_warung

# Atau melalui shell psql
psql -U postgres -c "CREATE DATABASE project_warung;"
```

### 2. Eksekusi Skema dan Data Awal (Seed)
Jalankan file DDL skema dan data awal secara berurutan:

```bash
# 1. Terapkan DDL skema tabel & trigger
psql -U postgres -d project_warung -f database/postgresql_schema.sql

# 2. Masukkan data awal (seed data)
psql -U postgres -d project_warung -f database/postgresql_seed.sql
```

> **Tips:** Skrip `postgresql_seed.sql` telah mengonfigurasi `setval` pada *sequence* tabel SERIAL secara otomatis sehingga penambahan baris baru setelah seeding tidak akan mengalami tabrakan ID.

---

## Konfigurasi Environment

File konfigurasi backend terletak pada `backend/.env`. Salin template dari `.env.example`:

```bash
cd backend
copy .env.example .env
```

Isi dan sesuaikan variabel pada `backend/.env` sesuai konfigurasi sistem lokal:

```env
PROJECT_NAME="KedaiKas"
SECRET_KEY="ganti-dengan-kunci-rahasia-anda-minimal-32-karakter"

# Koneksi PostgreSQL via psycopg3 (psycopg):
DATABASE_URL="postgresql+psycopg://postgres:GANTI_PASSWORD@localhost:5432/project_warung"

# Mode Repositori:
# USE_MOCK_REPO=false  -> Terhubung langsung ke database PostgreSQL
# USE_MOCK_REPO=true   -> Berjalan in-memory tanpa database eksternal
USE_MOCK_REPO=false
```

> [!IMPORTANT]
> Jangan pernah memasukkan credential, password database asli, atau JWT secret key produksi ke dalam commit Git. File `.env` telah dikecualikan oleh `.gitignore`.

---

## Cara Menjalankan Project

### Prasyarat Sistem
- **Python**: 3.11 atau lebih tinggi
- **Node.js**: 18 atau lebih tinggi
- **PostgreSQL**: 14+ (opsional bila memilih `USE_MOCK_REPO=true`)

---

### Opsi A: Menggunakan Script Otomatis (Windows)
Di root direktori project, jalankan:
```cmd
"START PROJECT.bat"
```
Skrip ini akan secara otomatis membuka jendela terminal Backend FastAPI dan Frontend Next.js secara bersamaan, lalu membuka browser ke `http://localhost:3000`.

---

### Opsi B: Manual Step-by-Step

#### 1. Menjalankan Backend (FastAPI)
Buka terminal dan navigasi ke direktori `backend`:

```bash
cd backend

# Buat dan aktifkan virtual environment (opsional/rekomendasi)
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
# source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Salin konfigurasi environment jika belum
copy .env.example .env

# Jalankan server API
python -m uvicorn app.main:app --reload --port 8000
```

- Endpoint API Root: `http://localhost:8000`
- Dokumentasi Interaktif Swagger UI: `http://localhost:8000/docs`
- Dokumentasi Interaktif ReDoc: `http://localhost:8000/redoc`

#### 2. Menjalankan Frontend (Next.js)
Buka terminal kedua dan navigasi ke direktori `frontend`:

```bash
cd frontend

# Install package dependencies
npm install

# Jalankan development server
npm run dev
```

- Aplikasi Antarmuka: `http://localhost:3000`

---

## API Endpoints

Semua endpoint backend dikelompokkan di bawah prefix `/api`:

| Modul | Route Prefix | Method Utama | Deskripsi Operasi |
|---|---|---|---|
| **Authentication** | `/api/auth` | `POST /register`, `POST /login`, `GET /me` | Pendaftaran akun, login mendapatkan JWT, dan verifikasi profil token aktif. |
| **Products** | `/api/products` | `GET /`, `POST /`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}` | Mengambil seluruh katalog produk, menambah produk baru, edit HPP/harga jual, dan hapus produk. |
| **Transactions** | `/api/transactions` | `GET /`, `POST /`, `GET /{id}` | Mencatat transaksi kasir lengkap dengan item list serta melihat riwayat transaksi. |
| **Expenses** | `/api/expenses` | `GET /`, `POST /`, `DELETE /{id}` | Pencatatan pengeluaran operasional warung dan penghapusan data pengeluaran. |
| **Dashboard** | `/api/dashboard` | `GET /` | Agregasi data finansial (omzet, HPP, laba kotor, laba bersih, progress target). |
| **Analysis** | `/api/analysis` | `GET /products`, `GET /financial`, `GET /price-comparison`, `GET /insights` | Analisis margin produk, arus kas, komparasi harga pasar, dan rekomendasi otomatis. |
| **Targets** | `/api/targets` | `GET /`, `POST /`, `GET /current` | Pengelolaan data target laba dan pengambilan target yang sedang aktif. |
| **Simulation** | `/api/simulation` | `POST /` | Eksekusi simulasi keputusan bisnis *CobaDulu* (uji harga jual, biaya, dan target). |
| **Reports** | `/api/reports` | `GET /` | Rekapitulasi laporan ringkasan berkala dengan filter tanggal. |
| **System Health** | `/api/health` | `GET /` | Status kesehatan API dan mode repositori yang sedang aktif (`mock` / `sql`). |

---

## Pengujian (Testing) & Build

### 1. Backend Testing (Pytest)
Pengujian otomatis backend mencakup logika autentikasi, kalkulasi margin finansial, simulasi non-mutasi, dan kesesuaian repositori database.

Untuk menjalankan seluruh test suite:
```bash
cd backend
python -m pytest tests -v
```

Hasil verifikasi:
```text
tests/test_analysis.py::test_price_analysis PASSED
tests/test_analysis.py::test_product_analysis PASSED
tests/test_analysis.py::test_financial_analysis PASSED
tests/test_analysis.py::test_insights_and_warnings PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_auth.py::test_login_invalid_password PASSED
tests/test_auth.py::test_register_new_user PASSED
tests/test_auth.py::test_get_me_protected PASSED
tests/test_financial_calc.py::test_financial_calculation_logic PASSED
tests/test_financial_calc.py::test_target_progress_calculation PASSED
tests/test_financial_calc.py::test_dashboard_endpoint PASSED
tests/test_products.py::test_margin_calculation_formula PASSED
tests/test_products.py::test_list_products PASSED
tests/test_products.py::test_create_and_update_product PASSED
tests/test_simulation.py::test_cobadulu_simulation_non_mutating PASSED
tests/test_sql_repository.py::test_table_and_column_names_match_project_warung PASSED
tests/test_sql_repository.py::test_sql_repository_user_and_legacy_password PASSED
tests/test_sql_repository.py::test_sql_repository_crud_products_and_transactions PASSED
tests/test_sql_repository.py::test_sql_repository_expenses_targets_and_refs PASSED
tests/test_transactions.py::test_list_transactions PASSED
tests/test_transactions.py::test_create_transaction_calculation PASSED

======================= 21 passed in 2.45s =======================
```

### 2. Frontend Production Build
Untuk memverifikasi kompilasi TypeScript dan bundel produksi Next.js:

```bash
cd frontend
npm run build
```

Hasil verifikasi:
```text
✓ Compiled successfully
✓ Linting and checking validity of types passed
✓ Generating static pages (14/14)
✓ Finalizing page optimization completed (Exit code 0)
```

---

## Status Project

| Komponen | Status Implementasi | Catatan |
|---|---|---|
| **Backend (FastAPI)** | Selesai | Seluruh routing, business service, validasi schema, dan error handling berfungsi optimal. |
| **Frontend (Next.js)** | Selesai | 14 rute terkompilasi sukses, terhubung penuh dengan API backend. |
| **PostgreSQL Integration** | Selesai | Skema tabel, tipe data, foreign key cascade, dan trigger PostgreSQL telah aktif pada database `project_warung`. |
| **Authentication & Auth Guard**| Selesai | Berbasis JWT dengan auto-redirect proteksi halaman dashboard. |
| **UI/UX Stitch Migration** | Selesai | Seluruh halaman mengadopsi Design System Stitch (*warm cream canvas*, *forest green*, *sage*, *terracotta*, SVG brand logo, dan avatar owner). |
| **Backend Tests** | 21 / 21 Passed | Seluruh skenario pengujian unit dan integrasi lolos verifikasi. |
| **Production Build** | Selesai | `npm run build` berhasil tanpa error type checking. |

---

## Catatan Keamanan & Developer

1. **Pemetaan Kolom Database**:
   Struktur database fisik menggunakan konvensi penamaan `id_user`, `id_produk`, `id_transaksi`, `id_expenses`, dan `id_target`. Model SQLAlchemy di backend memetakan kolom-kolom ini secara bersih ke atribut Python (misal `id`, `user_id`) sehingga menjaga kebersihan antarmuka API.
2. **Penanganan Password Legacy**:
   Pada data bawaan seed warisan, terdapat kata sandi berbentuk teks plaintext contoh. Backend `app/core/security.py` dilengkapi logika verifikasi bertingkat (*hybrid verification*) yang dapat mengenali format hash bcrypt modern sekaligus plaintext warisan secara aman tanpa merusak akun lama. Untuk akun baru yang dibuat melalui pendaftaran, sistem selalu menerapkan hashing aman `bcrypt`.
3. **Penyimpanan Kredensial**:
   Hindari mencantumkan kredensial asli pada repository publik. Gunakan placeholder seperti `POSTGRES_PASSWORD` atau secret generator pada environment produksi.
