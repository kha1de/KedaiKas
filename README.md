# KedaiKas

Platform digital pendukung keputusan (*decision-support system*) berbasis data transaksi dan keuangan nyata untuk usaha mikro, kecil, dan menengah (warung/UMKM).

KedaiKas dirancang untuk menjembatani kesenjangan antara sekadar mencatat transaksi harian dan memahami langkah strategis yang perlu diambil berikutnya—membantu pemilik usaha bergerak dari pencatatan administratif menuju pengambilan keputusan bisnis yang rasional, terukur, dan berbasis data.

---

## Daftar Isi

- [Latar Belakang & Filosofi](#latar-belakang--filosofi)
- [Konsep Inti: Decision-Support Framework](#konsep-inti-decision-support-framework)
- [Alur Pengguna (User Flow)](#alur-pengguna-user-flow)
- [Fitur & Modul Sistem](#fitur--modul-sistem)
- [Arsitektur Role-Based Access Control (RBAC)](#arsitektur-role-based-access-control-rbac)
- [Akun Demo & Identitas Pengguna](#akun-demo--identitas-pengguna)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Basis Data & Pemodelan Relasional](#basis-data--pemodelan-relasional)
- [Dataset Demo Pengujian](#dataset-demo-pengujian)
- [Struktur Direktori Repositori](#struktur-direktori-repositori)
- [Panduan Instalasi & Menjalankan Lokal](#panduan-instalasi--menjalankan-lokal)
- [Penyiapan Database PostgreSQL](#penyiapan-database-postgresql)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Daftar Endpoint API (REST API)](#daftar-endpoint-api-rest-api)
- [Autentikasi & Keamanan Data](#autentikasi--keamanan-data)
- [Pengujian (Testing) & Validasi Build](#pengujian-testing--validasi-build)
- [Desain Antarmuka & UX](#desain-antarmuka--ux)
- [Keunggulan Teknis (Technical Highlights)](#keunggulan-teknis-technical-highlights)
- [Status Project Saat Ini](#status-project-saat-ini)
- [Konteks Asal Project](#konteks-asal-project)

---

## Latar Belakang & Filosofi

Sebagian besar pelaku UMKM dan warung tradisional mengelola operasional secara informal: mencatat kas masuk di buku fisik atau sekadar mengandalkan intuisi kasir harian. Kondisi ini melahirkan beberapa permasalahan mendasar:

1. **Ilusi Arus Kas**: Omzet penjualan yang terlihat besar sering disalahartikan sebagai laba bersih, padahal modal belanja bahan baku (HPP) dan beban operasional belum diperhitungkan secara presisi.
2. **Ketiadaan Visibilitas Margin**: Pemilik warung kerap tidak mengetahui produk mana yang menghasilkan keuntungan riil versus produk yang hanya memakan volume perputaran barang dengan margin minim.
3. **Ketidakpastian Penetapan Harga**: Harga jual sering kali dipatok berdasarkan kebiasaan tanpa komparasi sistematis terhadap dinamika harga pasar sekitar.
4. **Resiko Perubahan Tanpa Prediksi**: Mengubah harga jual atau menambah biaya operasional sering dilakukan tanpa perkiraan dampak terhadap pencapaian laba.

KedaiKas dibangun untuk memecahkan kesenjangan tersebut:

> **Bukan sekadar mencatat transaksi, melainkan memahami apa yang harus dilakukan berikutnya.**

### Batasan Sistem (Apa yang Bukan KedaiKas)
Untuk menjaga fokus nilai tambah pada *decision support*, KedaiKas secara tegas **bukanlah**:
- Sekadar aplikasi kasir / POS konvensional
- Sekadar buku kas digital sederhana
- Sekadar kalkulator keuntungan statis
- Bot percakapan (AI chatbot)
- Marketplace / toko online *e-commerce*
- Gerbang pembayaran (*payment gateway*)
- Sistem otomasi perangkat keras / IoT

Nilai utama KedaiKas bertumpu pada **mesin analitik, agregasi metrik, dan simulasi skenario bisnis (*what-if analysis*)** yang bertumpu pada data riil usaha.

---

## Konsep Inti: Decision-Support Framework

KedaiKas mengoperasionalkan rantai nilai analitik bisnis melalui kerangka kerja terpadu:

$$\text{DATA} \longrightarrow \text{PEMAHAMAN} \longrightarrow \text{INSIGHT} \longrightarrow \text{TINDAKAN} \longrightarrow \text{SIMULASI} \longrightarrow \text{KEPUTUSAN} \longrightarrow \text{EVALUASI}$$

```mermaid
flowchart LR
    A[1. DATA<br/>Transaksi & Biaya] --> B[2. PEMAHAMAN<br/>HPP, Margin & Arus Kas]
    B --> C[3. INSIGHT<br/>Peringatan & Anomali]
    C --> D[4. TINDAKAN<br/>Penetapan Target]
    D --> E[5. SIMULASI<br/>CobaDulu What-If]
    E --> F[6. KEPUTUSAN<br/>Eksekusi Nyata]
    F --> G[7. EVALUASI<br/>Laporan Berkala]
    G -. Feedback Loop .-> A
```

---

## Alur Pengguna (User Flow)

Siklus pemanfaatan KedaiKas dalam ritme operasional pemilik usaha:

| Tahap | Aktivitas Pengguna | Hasil dalam Sistem |
|---|---|---|
| **1. CATAT** | Mencatat transaksi penjualan kasir dan merekam pengeluaran operasional toko. | Tersimpan dalam basis data usaha bersama (`id_usaha = 1`), dengan identitas kasir pencatat terekam otomatis (`id_user`). |
| **2. PAHAMI** | Membuka Dashboard eksekutif untuk melihat ringkasan omzet, HPP, laba kotor, beban operasional, laba bersih, dan tren berkala. | Transparansi kondisi riil kesehatan finansial usaha. |
| **3. DAPATKAN INSIGHT** | Memeriksa modul Analisis untuk meninjau efisiensi harga jual terhadap pasar, memetakan produk laris bermargin tipis, dan menerima peringatan lonjakan beban. | Identifikasi risiko dan peluang bisnis secara otomatis tanpa rumus manual. |
| **4. TENTUKAN TARGET** | Memasang sasaran laba bersih nominal untuk periode tertentu (misal: target bulanan). | Sistem menghitung *gap* capaian dan estimasi laba harian yang dibutuhkan. |
| **5. COBADULU** | Memasukkan eksperimen harga jual baru, perkiraan volume penjualan, dan perubahan biaya di modul simulator. | Sistem memproyeksikan laba baru dan mengevaluasi ketercapaian target di memori tanpa memanipulasi data riil. |
| **6. AMBIL KEPUTUSAN** | Memilih skenario terbaik yang dinilai aman dan berpotensi meningkatkan margin, lalu menerapkannya pada operasional nyata. | Penerapan harga katalog baru atau penyesuaian anggaran operasional. |
| **7. EVALUASI** | Membuka modul Laporan dengan filter tanggal untuk membandingkan realisasi performa terhadap proyeksi masa lalu. | Rekapitulasi evaluasi yang dapat dicetak atau disimpan sebagai PDF. |

---

## Fitur & Modul Sistem

Sistem menyediakan 7 modul fungsional utama yang saling terhubung:

### 1. Dashboard Eksekutif
- **Metrik Utama Bisnis**: Kartu ringkasan Omzet, HPP (*Harga Pokok Penjualan*), Laba Kotor, Pengeluaran Operasional, Laba Bersih, dan Margin Bersih.
- **Visualisasi Tren Penjualan & Laba**: Grafik batang interaktif dengan agregasi periodik:
  - **Harian**: Agregasi data transaksi 7 hari operasional terakhir.
  - **Mingguan**: Agregasi transaksi 6 minggu operasional terakhir.
  - **Bulanan**: Agregasi transaksi hingga 12 bulan terakhir.
  - *Catatan Implementasi*: Nilai chart dihitung secara dinamis dari pengelompokan (*bucket grouping*) data transaksi nyata di database, bukan nilai tiruan statis (*mock static values*).
- **Deteksi Puncak Penjualan**: Kalkulasi otomatis periode dengan performa omzet tertinggi beserta perbandingannya terhadap rata-rata periode lain.
- **Monitoring Target Aktif**: Indikator persentase capaian target laba berjalan, sisa gap laba nominal, dan estimasi laba harian yang dibutuhkan.
- **Widget Peringatan & Transaksi Terkini**: Menampilkan peringatan risiko terbaru dan daftar 5 transaksi penjualan terakhir.

### 2. Transaksi Penjualan (Kasir)
- **Pencatatan Penjualan Cepat**: Pemilihan produk langsung dari katalog master warung.
- **Kalkulasi Otomatis**: Perhitungan kuantitas, harga satuan, subtotal per item, dan total transaksi penjualan.
- **Detail Transaksi**: Setiap transaksi tersimpan bersama rincian item produk (`transaction_details`), kuantitas, dan harga jual saat transaksi berlangsung.
- **Riwayat Penjualan**: Rekapitulasi transaksi historis lengkap dengan pencarian dan filter urutan waktu.

### 3. Manajemen Produk
- **Master Data Produk**: Penambahan, pembaruan, dan penghapusan produk dagangan.
- **Struktur Finansial Produk**: Setiap produk wajib memiliki Harga Modal (HPP), Harga Jual, Kategori, dan Satuan penjualan (Pcs, Kg, Botol, Pouch, Pack, dll.).
- **Kalkulasi Margin Otomatis**: Sistem langsung mengalkulasikan persentase margin keuntungan produk:
  $$\text{Margin (\%)} = \frac{\text{Harga Jual} - \text{Harga Modal}}{\text{Harga Jual}} \times 100\%$$
- *Catatan Implementasi*: Sesuai skema database saat ini, modul produk memfokuskan pencatatan pada nilai keekonomian produk (HPP, harga jual, margin, performa penjualan); pelacakan stok kuantitas gudang (*inventory level*) belum menjadi entitas mandiri.

### 4. Manajemen Keuangan & Pengeluaran
- **Pencatatan Arus Kas Keluar**: Dokumentasi beban operasional warung non-HPP (seperti bayar listrik, sewa tempat, bensin transportasi kulakan, kemasan plastik, dan pemeliharaan alat).
- **Kategorisasi Biaya**: Pengelompokan pengeluaran (Operasional, Sewa, Transportasi, Perlengkapan, dll.) beserta tanggal dan catatan keterangan.
- **Visibilitas Beban Riil**: Data pengeluaran menjadi faktor pengurang langsung terhadap Laba Kotor untuk menghasilkan Laba Bersih usaha yang sesungguhnya.

### 5. Analisis & Insight (Core Differentiator)
Modul analitik analitis yang membedakan KedaiKas dari sekadar aplikasi kasir:
- **Analisis Referensi Harga Pasar (`/api/analysis/price-comparison`)**:
  Membandingkan harga jual warung terhadap data acuan pasar (`price_references`):
  - *Di bawah referensi*: Mengidentifikasi peluang menaikkan harga guna memulihkan margin tanpa melampaui harga pasar.
  - *Dalam rentang wajar*: Mengonfirmasi stabilitas daya saing produk.
  - *Di atas referensi*: Memberikan catatan untuk menjaga keunggulan mutu dan layanan.
- **Analisis Kinerja Produk (`/api/analysis/products`)**:
  Mengelompokkan performa penjualan produk secara otomatis:
  1. *Produk Terlaris* (berdasarkan volume unit terjual).
  2. *Produk Omzet Tertinggi* (berdasarkan akumulasi nilai transaksi).
  3. *Produk Margin Tertinggi* (persentase keuntungan terbesar).
  4. *Produk Laris tapi Margin Rendah*: Mendeteksi produk yang memiliki perputaran tinggi namun menyumbang laba tipis per porsi—titik kritis yang sering luput dari perhatian pemilik UMKM.
- **Analisis Komparasi Finansial (`/api/analysis/financial`)**:
  Menghitung persentase perubahan (*growth rate*) antara periode 7 hari terkini terhadap 7 hari sebelumnya untuk metrik omzet, laba bersih, dan pengeluaran.
- **Mesin Insight & Peringatan Otomatis (`/api/analysis/insights`)**:
  Mengevaluasi kondisi usaha melalui aturan logika deterministik (*rule-based business intelligence*):
  - Deteksi lonjakan pengeluaran operasional (>20% peningkatan).
  - Peringatan penurunan laba saat omzet naik (*profit compression* akibat kenaikan HPP/biaya).
  - Peringatan margin tipis pada produk bervolume tinggi.
  - Notifikasi pencapaian pertumbuhan positif.
  - *Catatan*: Insight diproses melalui logika perhitungan analitik terstruktur pada backend Python, bukan chatbot atau generasi teks generatif.

### 6. Target Usaha & Simulator CobaDulu
Menghubungkan penetapan sasaran finansial dengan simulasi skenario bisnis:

- **Target Laba**:
  - Menetapkan sasaran laba bersih dalam rentang tanggal tertentu (`periode_mulai` s.d. `periode_selesai`).
  - Menampilkan evaluasi pencapaian, sisa nominal gap, dan laju laba harian yang dibutuhkan untuk mencapai target.

- **Simulator CobaDulu (`/api/simulation`)**:
  - Wadah analisis skenario *what-if* yang dieksekusi **murni di dalam memori** tanpa memanipulasi atau merusak data pembukuan asli di database.
  - **Variabel yang Dapat Diuji**:
    - Penyesuaian harga jual produk tertentu.
    - Penyesuaian harga modal (HPP) produk.
    - Proyeksi perubahan volume penjualan (kuantitas unit terjual).
    - Proyeksi beban pengeluaran operasional baru.
    - Sasaran target laba alternatif.
  - **Output Simulasi**:
    - Komparasi metrik saat ini vs proyeksi skenario (Omzet, HPP, Laba Kotor, Pengeluaran, Laba Bersih, Margin).
    - Selisih nominal (*variance difference*) tiap komponen finansial.
    - Evaluasi apakah skenario yang diuji **berpotensi** menutup gap target laba atau menghasilkan surplus.
  - *Terminologi Sistem*: KedaiKas menggunakan terminologi kehati-hatian (*proyeksi*, *estimasi*, *berpotensi*, *simulasi*) dan tidak menjamin kepastian hasil bisnis nyata.

### 7. Laporan Bisnis
- **Rekapitulasi Finansial Periodik**: Filter berdasarkan rentang tanggal fleksibel serta jalan pintas filter "Bulan Ini".
- **Ringkasan Angka Utama**: Total transaksi, akumulasi omzet, HPP, laba kotor, total beban operasional, laba bersih, dan margin bersih periode terpilih.
- **Rincian Kontribusi Produk**: Tabel peringkat produk berdasarkan omzet, kuantitas terjual, total laba kotor yang disumbangkan, dan margin masing-masing dalam periode terkait.
- **Ekspor Dokumen**: Tersedia tombol cetak langsung (*print view*) yang dioptimalkan untuk browser print-to-PDF.

### 8. Manajemen Tim & Pengguna (Owner-Only)
- **Sentralisasi Staf Toko**: Antarmuka bagi pemilik untuk mengelola anggota tim dalam satu entitas usaha (`Kedai Berkah UMKM`).
- **Registrasi Staf Baru**: Menambahkan pengguna baru dengan penetapan peran awal (`Manager` atau `Kasir`).
- **Pembaruan Peran (Role Delegation)**: Mengubah wewenang anggota tim secara dinamis.
- **Penghapusan Akses**: Menghapus staf yang sudah tidak bertugas dengan proteksi *self-deletion prevention* (Owner tidak dapat menghapus akunnya sendiri).
- **Proteksi Otorisasi**: Modul ini terkunci penuh (`HTTP 403 Forbidden` di backend, proteksi navigasi di frontend) untuk role Manager dan Kasir.

### 9. Pengaturan Usaha (Store Settings)
- **Profil Entitas Usaha**: Menampilkan informasi toko aktif (`Kedai Berkah UMKM`), alamat fisik toko, dan metadata cabang.
- **Wewenang Pembaruan**: Seluruh staf (Owner, Manager, Kasir) dapat membaca profil toko, namun pengeditan profil hanya dapat dilakukan oleh `Owner`.

---

## Arsitektur Role-Based Access Control (RBAC)

KedaiKas mengimplementasikan model **Multi-User Single-Business**: seluruh pengguna demo dan staf operasional tergabung dalam **SATU USAHA YANG SAMA** (`id_usaha = 1`, *Kedai Berkah UMKM*). Sistem membedakan kewenangan operasional berdasarkan tingkatan peran (*role*):

```
SATU USAHA (Kedai Berkah UMKM)
├── 1. OWNER (Darin Hilmi Azzahra)
│      └── Akses Penuh: Kelola Pengguna, Pengaturan Usaha, Finansial Lengkap, Hapus Data
├── 2. MANAGER (Daffa Berlliano)
│      └── Akses Operasional: Dashboard Eksekutif, Katalog Produk, Transaksi, Analisis BI, CobaDulu, Laporan
└── 3. KASIR (Ahmad Khairul Fatih)
       └── Akses POS Kasir: Transaksi Penjualan, Riwayat Transaksi, Katalog Produk & Harga
```

### Matriks Kewenangan (Permission Matrix)

| Modul / Tindakan | Owner | Manager | Kasir | Penegakan Backend | Penegakan Frontend |
|---|:---:|:---:|:---:|---|---|
| **Dashboard Eksekutif** (`/dashboard`) | ✅ Ya | ✅ Ya | ❌ Tidak | `HTTP 403` via `require_manager` | Sembunyi di Sidebar; redirect ke `/dashboard/transaksi` |
| **Transaksi - Entri POS** (`POST /api/transactions`) | ✅ Ya | ✅ Ya | ✅ Ya | `require_any_staff` (user_id kasir dicatat) | Tombol Transaksi Cepat aktif |
| **Transaksi - Riwayat & Detail** (`GET /api/transactions`) | ✅ Ya | ✅ Ya | ✅ Ya | `require_any_staff` (scoped `id_usaha`) | Menu Transaksi aktif |
| **Transaksi - Hapus Transaksi** (`DELETE /api/transactions/{id}`) | ✅ Ya | ❌ Tidak | ❌ Tidak | `HTTP 403` via `require_owner` | Tombol Hapus tidak dirender |
| **Produk - Lihat Katalog** (`GET /api/products`) | ✅ Ya | ✅ Ya | ✅ Ya | `require_any_staff` (scoped `id_usaha`) | Menu Produk aktif |
| **Produk - Tambah / Edit** (`POST/PUT /api/products`) | ✅ Ya | ✅ Ya | ❌ Tidak | `HTTP 403` via `require_manager` | Tombol Tambah/Edit disembunyikan |
| **Produk - Hapus Produk** (`DELETE /api/products/{id}`) | ✅ Ya | ❌ Tidak | ❌ Tidak | `HTTP 403` via `require_owner` | Tombol Hapus disembunyikan |
| **Keuangan / Beban Operasional** (`/api/expenses`) | ✅ Ya | ✅ Ya | ❌ Tidak | `HTTP 403` via `require_manager` | Menu Keuangan disembunyikan |
| **Analisis BI & Insights** (`/api/analysis/*`) | ✅ Ya | ✅ Ya | ❌ Tidak | `HTTP 403` via `require_manager` | Menu Analisis disembunyikan |
| **Target Laba** (`/api/targets/*`) | ✅ Ya | ✅ Ya (View) | ❌ Tidak | `HTTP 403` via `require_manager` | Menu Target disembunyikan |
| **Target Laba - Buat Target Baru** (`POST /api/targets`) | ✅ Ya | ❌ Tidak | ❌ Tidak | `HTTP 403` via `require_owner` | Tombol Tambah Target disembunyikan |
| **CobaDulu Simulator** (`POST /api/simulation`) | ✅ Ya | ✅ Ya | ❌ Tidak | `HTTP 403` via `require_manager` | Menu CobaDulu disembunyikan |
| **Laporan Usaha** (`/api/reports`) | ✅ Ya | ✅ Ya | ❌ Tidak | `HTTP 403` via `require_manager` | Menu Laporan disembunyikan |
| **Manajemen Pengguna** (`/api/users/*`) | ✅ Ya | ❌ Tidak | ❌ Tidak | `HTTP 403` via `require_owner` | Menu Pengguna disembunyikan; Route guard |
| **Pengaturan Usaha - Lihat** (`GET /api/settings`) | ✅ Ya | ✅ Ya | ✅ Ya | `require_any_staff` | Menu Pengaturan aktif |
| **Pengaturan Usaha - Edit** (`PUT /api/settings`) | ✅ Ya | ❌ Tidak | ❌ Tidak | `HTTP 403` via `require_owner` | Tombol Edit disembunyikan |

---

## Akun Demo & Identitas Pengguna

Aplikasi dilengkapi 3 akun demo resmi yang telah terkonfigurasi pada basis data `project_warung` dan modul `MockRepository`:

| Peran (Role) | Nama Lengkap | Alamat Email | Password | Status Usaha |
|---|---|---|---|---|
| **Owner** | **Darin Hilmi Azzahra** | `dar.hilmi@gmail.com` | `123` | Usaha Utama (`Kedai Berkah UMKM`) |
| **Manager** | **Daffa Berlliano** | `daf.berlliano@gmail.com` | `123` | Usaha Utama (`Kedai Berkah UMKM`) |
| **Kasir** | **Ahmad Khairul Fatih** | `ah.khairul@gmail.com` | `123` | Usaha Utama (`Kedai Berkah UMKM`) |

> [!TIP]
> Pada halaman login (`/login`), tersedia tombol **Pilih Akun Demo Cepat** (1-klik) untuk beralih identitas demo secara instan tanpa perlu mengetik ulang kredensial.

---

## Arsitektur Sistem

KedaiKas mengadopsi arsitektur berlapis (*Clean Layered Architecture*) dengan pemisahan tanggung jawab (*separation of concerns*) yang tegas:

```mermaid
graph TD
    User([Pengguna / Pemilik Warung])
    
    subgraph ClientTier ["Frontend Tier (Client - Port 3000)"]
        UI[Next.js 15 App Router + React 19]
        Tailwind[Tailwind CSS Custom Design Tokens]
        RechartsComp[Recharts Visualization Components]
        ClientService[Frontend API Services / HTTP Client]
    end
    
    subgraph ServerTier ["Backend Tier (API Server - Port 8000)"]
        Router[FastAPI Route Handlers /api/*]
        AuthGuard[JWT Auth Bearer & Password Security]
        
        subgraph LogicLayer ["Service / Business Logic Layer"]
            DashboardSvc[DashboardService]
            AnalysisSvc[AnalysisService]
            InsightSvc[InsightService]
            SimSvc[SimulationService CobaDulu]
            ReportSvc[ReportService]
            ProductSvc[ProductService]
            TxSvc[TransactionService]
            ExpSvc[ExpenseService]
            TargetSvc[TargetService]
        end
        
        subgraph CoreCalculators ["Business Utilities"]
            Calc[Calculator Module: Metrics, Margins, Target Gap]
        end
        
        subgraph DataAccessLayer ["Repository Abstraction Layer"]
            RepoFactory[get_repository Dependency Injection]
            SqlRepo[SqlRepository - SQLAlchemy 2.0]
            MockRepo[MockRepository - In-Memory Fallback]
        end
    end
    
    subgraph StorageTier ["Database Tier (Port 5432)"]
        PG[(PostgreSQL 14+ Database: project_warung)]
    end

    User --> UI
    UI --> RechartsComp
    UI --> ClientService
    ClientService -->|REST API Calls + Bearer JWT| Router
    Router --> AuthGuard
    Router --> LogicLayer
    LogicLayer --> CoreCalculators
    LogicLayer --> RepoFactory
    RepoFactory -->|USE_MOCK_REPO=false| SqlRepo
    RepoFactory -.->|USE_MOCK_REPO=true| MockRepo
    SqlRepo -->|psycopg binary driver| PG
```

### Pemisahan Tanggung Jawab
- **Frontend (Next.js / TypeScript)**:
  Fokus murni pada interaksi antarmuka pengguna, format tampilan mata uang lokal (Rupiah), penyajian grafik visual, dan penanganan status navigasi terproteksi.
- **Backend (FastAPI / Python)**:
  Memusatkan seluruh aturan bisnis (*business rules*), kalkulasi HPP dan laba, validasi schema Pydantic, algoritma deteksi anomali/insight, agregasi periodik, serta komputasi simulasi *what-if*.
- **Repository Layer**:
  Mengisolasi logika manipulasi database. `SqlRepository` mengeksekusi kueri relasional ke PostgreSQL via SQLAlchemy 2.0, sementara `MockRepository` menyediakan opsi berjalan in-memory tanpa dependensi database aktif untuk pengujian lokal terisolasi.
- **Database (PostgreSQL)**:
  Menjamin integritas data relasional, constraint integritas referensial (*foreign key cascade*), serta audit timestamp otomatis melalui trigger.

---

## Teknologi yang Digunakan

### Frontend
| Teknologi | Versi | Peran dalam Sistem |
|---|---|---|
| **Next.js** | 15.1.7 (App Router) | Framework aplikasi React dengan server/client component rendering dan rute terstruktur |
| **TypeScript** | 5.7.3 | Jaminan type-safety pada kontrak data, parameter props, dan respons API |
| **React & React DOM** | 19.0.0 | Pustaka dasar komponen antarmuka pengguna |
| **Tailwind CSS** | 3.4.17 | Styling antarmuka berbasis utility dengan integrasi token desain Google Stitch |
| **Recharts** | 2.15.1 | Pustaka visualisasi grafik batang dan tren telemetri finansial |
| **Lucide React** | 0.475.0 | Ikonografi modern dan konsisten di seluruh modul |

### Backend
| Teknologi | Versi | Peran dalam Sistem |
|---|---|---|
| **FastAPI** | >= 0.110.0 | Framework backend performa tinggi dengan dokumentasi OpenAPI otomatis (Swagger/ReDoc) |
| **Uvicorn** | >= 0.28.0 | ASGI web server untuk menjalankan aplikasi FastAPI |
| **Python** | 3.11+ / 3.13 | Bahasa pemrograman backend untuk kalkulasi finansial presisi (`Decimal`) |
| **SQLAlchemy** | >= 2.0.28 | Object-Relational Mapper (ORM) modern dan abstraction layer kueri SQL |
| **Pydantic & Settings** | >= 2.6.0 | Validasi skema input/output data request dan parsing konfigurasi `.env` |
| **psycopg (psycopg 3 binary)** | >= 3.1.0 | Driver native berkinerja tinggi untuk konektivitas PostgreSQL |
| **PyJWT & Passlib / Bcrypt**| >= 2.8.0 | Penerbitan dan validasi token JWT serta enkripsi hash password satu arah |
| **Pytest & HTTPX** | >= 8.0.0 | Framework pengujian unit dan integrasi endpoint |

### Database
- **Engine Utama**: PostgreSQL (versi 14 hingga 18 didukung)
- **Nama Basis Data**: `project_warung`
- **Aset Skrip**:
  - `database/postgresql_schema.sql` (DDL skema tabel, indeks, dan trigger)
  - `database/postgresql_seed.sql` (DML data awal pengujian)
  - `database/seed_ahmad_demo.sql` (DML data historis demo lengkap)
  - *Catatan Aset Warisan*: Berkas `database/project_warung.sql`, `database/schema.sql`, dan `database/seed.sql` merupakan berkas referensi/fallback dari lingkungan MariaDB/MySQL terdahulu. Sistem utama saat ini diarahkan dan diuji pada PostgreSQL.

---

## Basis Data & Pemodelan Relasional

Skema relasional PostgreSQL KedaiKas dibangun di atas 8 entitas utama yang mendukung arsitektur **Multi-User Single-Business** dengan relasi integritas referensial:

```mermaid
erDiagram
    businesses ||--o{ users : "menaungi (id_usaha)"
    businesses ||--o{ products : "memiliki (id_usaha)"
    businesses ||--o{ transactions : "memiliki (id_usaha)"
    businesses ||--o{ expenses : "memiliki (id_usaha)"
    businesses ||--o{ targets : "memiliki (id_usaha)"
    users ||--o{ transactions : "mencatat sebagai kasir (id_user)"
    transactions ||--|{ transaction_details : "berisi item (id_transaksi)"
    products ||--o{ transaction_details : "direferensikan (id_produk)"
    
    businesses {
        int id_usaha PK
        string nama_usaha
        string alamat
        timestamp created_at
    }

    users {
        int id_user PK
        int id_usaha FK
        string nama
        string email UK
        string pass
        string role
        timestamp created_at
    }

    products {
        int id_produk PK
        int id_usaha FK
        int id_user FK
        string nama_produk
        string kategori
        decimal harga_modal
        decimal harga_jual
        string satuan
        timestamp created_at
    }

    transactions {
        int id_transaksi PK
        int id_usaha FK
        int id_user FK
        timestamp tanggal
        decimal total
        timestamp created_at
    }

    transaction_details {
        int id_detail PK
        int id_transaksi FK
        int id_produk FK
        int jumlah
        decimal harga_jual
        decimal subtotal
    }

    expenses {
        int id_expenses PK
        int id_usaha FK
        int id_user FK
        string kategori
        decimal nominal
        date tanggal
        string keterangan
        timestamp created_at
    }

    targets {
        int id_target PK
        int id_usaha FK
        int id_user FK
        decimal target_laba
        date periode_mulai
        date periode_selesai
        timestamp created_at
    }

    price_references {
        int id_analisis PK
        string nama_produk
        string kategori
        decimal harga_min
        decimal harga_max
        string satuan
        string sumber
        timestamp updated_at
    }
```

### Rincian Tabel:
1. **`businesses`**: Entitas profil badan usaha toko UMKM (`id_usaha = 1`, *Kedai Berkah UMKM*). Kolom: `id_usaha` (PK, Serial), `nama_usaha`, `alamat`, `created_at`.
2. **`users`**: Akun anggota tim/pengguna yang bernaung di bawah usaha. Kolom: `id_user` (PK, Serial), `id_usaha` (FK ke `businesses.id_usaha`), `nama`, `email` (Unique), `pass`, `role` (`owner` / `manager` / `kasir`), `created_at`.
3. **`products`**: Katalog master produk scoped ke usaha. Kolom: `id_produk` (PK, Serial), `id_usaha` (FK ke `businesses.id_usaha`), `id_user` (FK ke `users.id_user`), `nama_produk`, `kategori`, `harga_modal`, `harga_jual`, `satuan`, `created_at`.
4. **`transactions`**: Header transaksi penjualan usaha. Kolom: `id_transaksi` (PK, Serial), `id_usaha` (FK ke `businesses.id_usaha`), `id_user` (FK ke `users.id_user` sebagai kasir pencatat), `tanggal`, `total`, `created_at`.
5. **`transaction_details`**: Rincian item produk dalam tiap transaksi. Kolom: `id_detail` (PK, Serial), `id_transaksi` (FK ke `transactions.id_transaksi`), `id_produk` (FK ke `products.id_produk`), `jumlah`, `harga_jual`, `subtotal`.
6. **`expenses`**: Pengeluaran operasional warung scoped ke usaha. Kolom: `id_expenses` (PK, Serial), `id_usaha` (FK ke `businesses.id_usaha`), `id_user` (FK), `kategori`, `nominal`, `tanggal`, `keterangan`, `created_at`.
7. **`targets`**: Target laba bersih berkala scoped ke usaha. Kolom: `id_target` (PK, Serial), `id_usaha` (FK ke `businesses.id_usaha`), `id_user` (FK), `target_laba`, `periode_mulai`, `periode_selesai`, `created_at`.
8. **`price_references`**: Tolok ukur (*benchmark*) rentang harga pasar sekitar untuk modul analisis harga. Kolom: `id_analisis` (PK, Serial), `nama_produk`, `kategori`, `harga_min`, `harga_max`, `satuan`, `sumber`, `updated_at`.

---

## Dataset Demo Pengujian

Untuk mempermudah eksplorasi lokal dan pengujian modul analitik tanpa input manual berulang, repositori menyediakan berkas migrasi dan dataset terintegrasi:

### 1. Migrasi Multi-User RBAC (`database/migration_rbac_multiusers.sql`)
- Skrip migrasi **non-destruktif (zero data loss)** yang menyematkan tabel `businesses`, menambahkan kolom `id_usaha` & `role`, memetakan seluruh relasi foreign key, serta menetapkan hak akses peran demo secara aman.

### 2. Base Seed (`database/postgresql_seed.sql`)
- 1 entitas usaha utama (`Kedai Berkah UMKM`, `id_usaha = 1`)
- 3 akun demo terhubung ke usaha utama:
  - **Darin Hilmi Azzahra** (`role = 'owner'`, `dar.hilmi@gmail.com`)
  - **Daffa Berlliano** (`role = 'manager'`, `daf.berlliano@gmail.com`)
  - **Ahmad Khairul Fatih** (`role = 'kasir'`, `ah.khairul@gmail.com`)
- 4 produk dasar, 12 transaksi penjualan, 22 rincian item transaksi, 4 beban operasional, 2 target laba, dan 11 referensi harga pasar.

### 3. Enriched Historical Demo Dataset (`database/seed_ahmad_demo.sql`)
Dataset historis komprehensif yang telah dimigrasikan ke dalam lingkup `id_usaha = 1` (*Kedai Berkah UMKM*):
- **35 produk aktif** di bawah usaha utama mencakup 6 kategori UMKM (*Makanan Ringan*, *Makanan*, *Minuman*, *Sembako*, *Rumah Tangga*, dan *Perlengkapan*).
- **58 transaksi penjualan historis** yang terdistribusi realistis sepanjang rentang waktu **Juli, Agustus, hingga September 2026** (direkam dengan catatan ID kasir).
- **250+ baris item detail transaksi** yang mencerminkan basket size pelanggan warung sesungguhnya.
- **24 catatan pengeluaran operasional** (listrik toko, sewa kios, bensin transportasi, kemasan belanja, galon air, dsb.) sepanjang Juli–September 2026.
- **4 target laba periodik bulanan**.
- *Karakteristik Skrip*: Bersifat **idempoten** (`ON CONFLICT DO NOTHING`) dengan sinkronisasi sequence serial otomatis (`setval`).

Dataset ini bertujuan agar grafik telemetri Dashboard (Harian, Mingguan, Bulanan), mesin insight, komparasi finansial 7 hari, dan simulator CobaDulu dapat langsung didemonstrasikan dengan data yang hidup dan masuk akal.

---

## Struktur Direktori Repositori

```text
KedaiKas/
├── README.md                           # Dokumentasi komprehensif repositori proyek
├── START PROJECT.bat                   # Batch script otomatis untuk menjalankan backend & frontend (Windows)
├── docker-compose.yml                  # Konfigurasi container service opsional
├── download_stitch.py                  # Skrip utilitas pengunduh aset desain
│
├── frontend/                           # Aplikasi Web Client (Next.js 15 + TypeScript)
│   ├── public/                         # Aset publik statis (logo brand SVG, avatar, favicon)
│   ├── src/
│   │   ├── app/                        # Direktori rute Next.js App Router (16 rute terkompilasi)
│   │   │   ├── layout.tsx              # Root HTML layout, font setup, dan metadata aplikasi
│   │   │   ├── globals.css             # Utility Tailwind dan variabel warna CSS custom
│   │   │   ├── page.tsx                # Halaman landing / proteksi pengalihan
│   │   │   ├── login/page.tsx          # Halaman autentikasi masuk (dengan Quick Demo Account 1-klik)
│   │   │   ├── register/page.tsx       # Halaman pendaftaran akun baru
│   │   │   └── dashboard/              # Halaman antarmuka terproteksi
│   │   │       ├── layout.tsx          # Layout bersama dashboard (Sidebar navigasi dinamis RBAC, Header, User Menu)
│   │   │       ├── page.tsx            # Dashboard Eksekutif (Metrik, Chart Recharts, Insight, Target)
│   │   │       ├── transaksi/page.tsx  # Kasir penjualan dan riwayat transaksi
│   │   │       ├── produk/page.tsx     # Manajemen katalog produk dan kalkulasi margin
│   │   │       ├── keuangan/page.tsx   # Pencatatan biaya operasional dan arus kas keluar
│   │   │       ├── analisis/page.tsx   # Modul BI: Benchmark harga pasar, performa produk, margin tipis
│   │   │       ├── target/page.tsx     # Penetapan target laba dan pemantauan gap capaian
│   │   │       ├── cobadulu/page.tsx   # Simulator keputusan skenario bisnis (what-if analysis)
│   │   │       ├── laporan/page.tsx    # Rekapitulasi laporan periodik dan view Cetak/PDF
│   │   │       ├── pengguna/page.tsx   # Manajemen Pengguna & Delegasi Role Staf (Owner-Only)
│   │   │       └── pengaturan/page.tsx # Profil Usaha & Pengaturan Toko (Owner-Editable)
│   │   ├── hooks/                      # Custom hooks (usePermission RBAC permission matrix)
│   │   ├── lib/                        # Utilitas format mata uang Rupiah, tanggal, dan persentase
│   │   ├── services/                   # Abstraksi klien HTTP API (auth, dashboard, transaksi, analisis, users, dll.)
│   │   └── types/                      # Deklarasi antarmuka dan tipe data TypeScript (User, UserRole, Business, dll.)
│   ├── tailwind.config.js              # Konfigurasi token warna Stitch, radius, dan tipografi
│   ├── tsconfig.json                   # Konfigurasi compiler TypeScript
│   ├── .env.local.example              # Template variabel lingkungan frontend
│   └── package.json                    # Dependensi frontend dan skrip build
│
├── backend/                            # Aplikasi REST API Server (FastAPI + Python)
│   ├── app/
│   │   ├── main.py                     # Entry point FastAPI, CORS middleware, global exception handler
│   │   ├── api/
│   │   │   ├── router.py               # Agregator rute modular di bawah prefix /api
│   │   │   ├── deps.py                 # Dependencies otentikasi JWT & otorisasi RBAC (require_owner, require_manager)
│   │   │   └── routes/                 # Modul endpoint: auth, products, transactions, analysis, users, settings, dll.
│   │   ├── core/                       # Pengaturan konfigurasi Settings, database connection, dan security
│   │   ├── models/                     # Deklarasi model relasional SQLAlchemy 2.0 (Business, User, Product, Tx, dll.)
│   │   ├── schemas/                    # Skema Pydantic v2 untuk validasi request dan respons JSON
│   │   ├── repositories/               # Abstraksi data layer (SqlRepository dan MockRepository dengan isolasi business_id)
│   │   ├── services/                   # Layanan logika bisnis murni, analisis, user_service, kalkulator, dan simulasi
│   │   └── utils/                      # Fungsi pembantu: kalkulator keuangan, margin, dan formatter
│   ├── tests/                          # Automated unit dan integration tests (Pytest - 26 test cases)
│   │   ├── test_rbac.py                # Pengujian komprehensif RBAC 403 authorization & multi-user data sharing
│   │   └── ...                         # Pengujian fungsional lainnya
│   ├── requirements.txt                # Dependensi pustaka Python
│   ├── pytest.ini                      # Konfigurasi eksekusi pengujian Pytest
│   └── .env.example                    # Template variabel lingkungan backend
│
├── database/                           # Skrip skema DDL dan data pengujian DML
│   ├── migration_rbac_multiusers.sql   # Skrip migrasi non-destruktif Multi-User Single-Business RBAC
│   ├── postgresql_schema.sql           # Skema tabel, foreign key, dan trigger PostgreSQL
│   ├── postgresql_seed.sql             # Data awal dasar (base seed) dengan profil usaha & 3 akun demo
│   ├── seed_ahmad_demo.sql             # Dataset pengujian demo historis (35 produk, transaksi Juli–Sept 2026)
│   ├── project_warung.sql              # Dump referensi/warisan MariaDB terdahulu
│   ├── schema.sql                      # Skema kompatibilitas MySQL terdahulu
│   └── seed.sql                        # Seed data kompatibilitas MySQL terdahulu
│
├── .stitch/                            # Referensi sistem desain dan aset Google Stitch
│   ├── DESIGN.md                       # Dokumentasi spesifikasi warna, tipografi, dan gaya antarmuka
│   ├── *.html                          # Mockup HTML hasil rancangan antarmuka
│   └── *.png                           # Screenshot visual tiap layar
│
└── docs/                               # Dokumentasi pendukung proyek (API, ERD, Flowchart)
```

---

## Panduan Instalasi & Menjalankan Lokal

Panduan berikut mengasumsikan lingkungan pengembangan pada sistem operasi **Windows**.

### Prasyarat Sistem
- **Python**: Versi 3.11 atau lebih baru terpasang di PATH
- **Node.js**: Versi 18 atau 20+ LTS terpasang di PATH
- **PostgreSQL**: Layanan PostgreSQL 14+ berjalan lokal (default port: `5432`)
- **Git**: Terpasang untuk kloning repositori

---

### Langkah 1: Kloning Repositori
Buka PowerShell atau Command Prompt:
```bash
git clone https://github.com/kha1de/KedaiKas.git
cd KedaiKas
```

---

### Langkah 2: Setup Database PostgreSQL

1. Pastikan server PostgreSQL aktif di komputer Anda.
2. Buat database baru bernama `project_warung`:
   ```bash
   createdb -U postgres project_warung
   ```
   *(Atau buat melalui pgAdmin / shell `psql`)*

3. Terapkan berkas skema dan data benih secara berurutan:
   ```bash
   # 1. Eksekusi skema tabel, indeks, dan trigger
   psql -U postgres -d project_warung -f database/postgresql_schema.sql

   # 2. Eksekusi data dasar (Base Seed)
   psql -U postgres -d project_warung -f database/postgresql_seed.sql

   # 3. (Sangat Direkomendasikan) Eksekusi data demo historis Ahmad Khairul
   psql -U postgres -d project_warung -f database/seed_ahmad_demo.sql
   ```

---

### Langkah 3: Setup Backend (FastAPI)

1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   ```

2. Buat virtual environment Python dan aktifkan:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Pasang seluruh dependensi pustaka:
   ```bash
   pip install -r requirements.txt
   ```

4. Buat file konfigurasi `.env` dari template:
   ```bash
   copy .env.example .env
   ```

5. Buka `backend/.env` dan sesuaikan kredensial koneksi database:
   ```env
   PROJECT_NAME="KedaiKas"
   SECRET_KEY="ganti-dengan-string-rahasia-minimal-32-karakter-acak"
   
   # Format URL koneksi PostgreSQL via psycopg:
   DATABASE_URL="postgresql+psycopg://postgres:<PASSWORD_POSTGRES_ANDA>@localhost:5432/project_warung"
   
   # Atur ke false untuk menggunakan koneksi PostgreSQL nyata:
   USE_MOCK_REPO=false
   ```

6. Jalankan server FastAPI backend:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   - API Backend aktif pada: `http://localhost:8000`
   - Dokumentasi Interaktif Swagger UI: `http://localhost:8000/docs`
   - Dokumentasi Interaktif ReDoc: `http://localhost:8000/redoc`

---

### Langkah 4: Setup Frontend (Next.js)

Buka terminal kedua (PowerShell terpisah) dari root repositori:

1. Masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Buat file konfigurasi `.env.local` dari template:
   ```bash
   copy .env.local.example .env.local
   ```
   *Pastikan isinya mengarah ke API Backend:*
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. Pasang paket dependensi Node:
   ```bash
   npm install
   ```

4. Jalankan development server Next.js:
   ```bash
   npm run dev
   ```
   *(Pada sistem Windows yang membatasi eksekusi PowerShell script, gunakan `npm.cmd run dev`)*

5. Buka browser dan akses aplikasi:
   ```text
   http://localhost:3000
   ```

> [!NOTE]
> Proyek membutuhkan backend (port 8000) dan frontend (port 3000) berjalan secara simultan di dua terminal berbeda agar sistem dapat bertukar data melalui REST API.

---

### Opsi Praktis: Menjalankan Sekaligus via Batch Script
Pada sistem Windows, Anda dapat menjalankan backend dan frontend sekaligus hanya dengan mengklik ganda file root:
```cmd
"START PROJECT.bat"
```
Skrip ini akan secara otomatis membuka jendela terminal Backend FastAPI, jendela terminal Frontend Next.js, dan meluncurkan browser ke `http://localhost:3000`.

---

## Konfigurasi Environment

### Backend (`backend/.env`)
| Variabel | Tipe | Contoh / Keterangan |
|---|---|---|
| `PROJECT_NAME` | String | Nama aplikasi (`KedaiKas`) |
| `SECRET_KEY` | String | Kunci rahasia hashing token JWT (gunakan minimal 32 karakter unik) |
| `DATABASE_URL` | String | Format: `postgresql+psycopg://<user>:<password>@<host>:<port>/<dbname>` |
| `USE_MOCK_REPO` | Boolean | `false` untuk database PostgreSQL aktif; `true` untuk mode in-memory mandiri |

### Frontend (`frontend/.env.local`)
| Variabel | Tipe | Contoh / Keterangan |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | String | URL basis endpoint API backend: `http://localhost:8000/api` |

> [!IMPORTANT]
> Jangan pernah melakukan commit file `.env` atau `.env.local` yang memuat password atau JWT secret asli ke repositori publik. Seluruh berkas konfigurasi lokal tersebut telah dikecualikan oleh `.gitignore`.

---

## Daftar Endpoint API (REST API)

Seluruh endpoint layanan dikelompokkan di bawah prefix `/api`:

| Modul | Method | URL Endpoint | Izin Akses (*RBAC*) | Deskripsi Operasi |
|---|---|---|---|---|
| **System** | `GET` | `/` | Publik | Status ketersediaan server dan mode repositori yang aktif |
| **System** | `GET` | `/api/health` | Publik | Health check probe status server (`mock` / `sql`) |
| **Auth** | `POST` | `/api/auth/register` | Publik | Pendaftaran akun baru pemilik warung |
| **Auth** | `POST` | `/api/auth/login` | Publik | Autentikasi akun dan penerbitan Bearer JWT Token |
| **Auth** | `GET` | `/api/auth/me` | Semua Staf | Mengambil data profil pengguna aktif dari token JWT |
| **Dashboard** | `GET` | `/api/dashboard` | Owner, Manager | Agregasi metrik eksekutif (omzet, HPP, laba bersih, progress target) |
| **Products** | `GET` | `/api/products` | Semua Staf | Mendapatkan seluruh katalog produk usaha (`id_usaha`) |
| **Products** | `POST` | `/api/products` | Owner, Manager | Menambahkan produk baru ke katalog usaha |
| **Products** | `GET` | `/api/products/{id}` | Semua Staf | Mengambil data satu produk spesifik |
| **Products** | `PUT` | `/api/products/{id}` | Owner, Manager | Memperbarui data produk atau penyesuaian harga jual |
| **Products** | `DELETE` | `/api/products/{id}` | **Owner Only** | Menghapus produk dari katalog usaha |
| **Transactions** | `GET` | `/api/transactions` | Semua Staf | Mengambil riwayat transaksi penjualan usaha beserta rincian item |
| **Transactions** | `POST` | `/api/transactions` | Semua Staf | Mencatat transaksi kasir (identitas kasir dicatat otomatis via `id_user`) |
| **Transactions** | `GET` | `/api/transactions/{id}`| Semua Staf | Mengambil satu nota transaksi spesifik beserta rincian item |
| **Transactions** | `DELETE` | `/api/transactions/{id}`| **Owner Only** | Menghapus nota transaksi penjualan dari sistem |
| **Expenses** | `GET` | `/api/expenses` | Owner, Manager | Mengambil daftar pengeluaran operasional usaha |
| **Expenses** | `POST` | `/api/expenses` | Owner, Manager | Mencatat beban operasional baru toko |
| **Expenses** | `PUT` | `/api/expenses/{id}` | Owner, Manager | Memperbarui catatan beban operasional |
| **Expenses** | `DELETE` | `/api/expenses/{id}` | **Owner Only** | Menghapus baris pencatatan beban operasional |
| **Analysis** | `GET` | `/api/analysis/price` | Owner, Manager | Komparasi harga jual produk terhadap rentang referensi pasar |
| **Analysis** | `GET` | `/api/analysis/products` | Owner, Manager | Analisis produk terlaris, omzet tertinggi, margin tinggi, dan margin tipis |
| **Analysis** | `GET` | `/api/analysis/finance` | Owner, Manager | Komparasi tren pertumbuhan finansial 7 hari terkini vs 7 hari lalu |
| **Analysis** | `GET` | `/api/analysis/insights` | Owner, Manager | Peringatan dini, deteksi lonjakan biaya, dan insight bisnis |
| **Targets** | `GET` | `/api/targets` | Owner, Manager | Mengambil riwayat penetapan target laba usaha |
| **Targets** | `GET` | `/api/targets/progress` | Owner, Manager | Monitoring capaian target aktif dan perhitungan sisa gap harian |
| **Targets** | `POST` | `/api/targets` | **Owner Only** | Menetapkan target laba bersih nominal dan periode baru |
| **Targets** | `PUT` | `/api/targets/{id}` | **Owner Only** | Memperbarui target laba usaha |
| **Simulation** | `POST` | `/api/simulation` | Owner, Manager | Menjalankan simulasi skenario bisnis *CobaDulu* (non-mutatif di memori) |
| **Reports** | `GET` | `/api/reports` | Owner, Manager | Rekapitulasi laporan performa usaha dengan filter tanggal mulai/selesai |
| **Users** | `GET` | `/api/users` | **Owner Only** | Mengambil seluruh daftar staf yang tergabung dalam usaha |
| **Users** | `POST` | `/api/users` | **Owner Only** | Mendaftarkan staf baru ke dalam usaha (`Manager` / `Kasir`) |
| **Users** | `PUT` | `/api/users/{id}/role` | **Owner Only** | Memperbarui peran staf operasional |
| **Users** | `DELETE` | `/api/users/{id}` | **Owner Only** | Menghapus akun staf dari sistem usaha |
| **Settings** | `GET` | `/api/settings` | Semua Staf | Mengambil informasi profil toko usaha aktif |
| **Settings** | `PUT` | `/api/settings` | **Owner Only** | Memperbarui nama dan alamat toko usaha |

---

## Autentikasi & Keamanan Data

- **Token-Based Authentication**: Menggunakan standar industri **JSON Web Token (JWT)** dengan algoritma enkripsi tanda tangan digital `HS256`, memuat klaim subjek pengguna (`sub`), peran (`role`), dan identitas usaha (`id_usaha`).
- **Isolasi Data Berbasis Usaha (Single-Business Data Scoping)**:
  Seluruh data operasional (produk, transaksi, rincian nota, beban pengeluaran, target) terikat ketat dengan `id_usaha = 1` (*Kedai Berkah UMKM*). Pengguna dalam satu usaha berbagi data operasional yang sama secara konsisten.
- **Backend Role-Based Authorization (RBAC 403 Forbidden)**:
  Penegakan hak akses dilakukan secara independen di lapisan backend FastAPI menggunakan dependency generator `require_roles(['owner', ...])`. Setiap request yang melanggar batas kewenangan peran langsung ditolak dengan status kode `HTTP 403 Forbidden`.
- **Frontend Role-Based UX & Route Guard**:
  Di lapisan klien Next.js, navigasi sidebar dan elemen interaktif disesuaikan dengan peran pengguna melalui matrix `usePermission`. Rute terlarang (seperti akses kasir ke dashboard eksekutif) dialihkan secara otomatis ke rute yang berhak (`/dashboard/transaksi`).
- **Keamanan Password**:
  Password akun baru di-hash satu arah menggunakan algoritma `bcrypt` dengan salt dinamis. Modul `backend/app/core/security.py` dilengkapi logika verifikasi bertingkat untuk mendukung kompatibilitas akun demo tanpa mengurangi standar keamanan registrasi akun baru.

---

## Pengujian (Testing) & Validasi Build

### 1. Pengujian Otomatis Backend (Pytest)
Repositori backend menyertakan berkas pengujian otomatis menggunakan **Pytest** untuk memvalidasi seluruh lapisan sistem:
- **Cakupan Pengujian (26 Test Cases - 100% Pass Rate)**:
  - `test_rbac.py` (5 test scenarios): Verifikasi login 3 akun demo resmi, penegakan restriksi Kasir (`HTTP 403 Forbidden`), batas wewenang Manager, kewenangan penuh Owner, dan alur kolaborasi data multi-user (kasir membuat transaksi -> manager & owner melihat -> owner menghapus).
  - `test_financial_calc.py` (3 tests): Formulasi metrik finansial, HPP, margin kotor/bersih, dan kalkulasi progres target laba.
  - `test_simulation.py` (1 test): Verifikasi bahwa simulator *CobaDulu* murni memproyeksikan skenario di memori tanpa memutasi (*non-mutating*) data asli.
  - `test_analysis.py` (4 tests): Algoritma komparasi benchmark pasar, deteksi produk margin tipis, dan pembentukan peringatan (*insights*).
  - `test_products.py` (3 tests): Kalkulasi margin dinamis dan operasional CRUD katalog produk.
  - `test_transactions.py` (2 tests): Perhitungan otomatis subtotal transaksi dan integritas rincian nota.
  - `test_sql_repository.py` (4 tests): Pemetaan kolom SQLAlchemy dan isolasi `business_id` pada repositori relasional.
  - `test_auth.py` (4 tests): Alur login JWT, proteksi endpoint, dan registrasi staf.

Untuk menjalankan pengujian backend:
```bash
cd backend
python -m pytest tests -v
```

Hasil eksekusi:
```text
======================== 26 passed in 4.28s ========================
```
*Catatan: Seluruh 26 pengujian berhasil lolos baik pada mode database PostgreSQL (`USE_MOCK_REPO=false`) maupun mode fallback in-memory (`USE_MOCK_REPO=true`).*

### 2. Validasi Build Frontend (Next.js)
Kompilasi TypeScript dan bundel produksi Next.js divalidasi dengan menjalankan:
```bash
cd frontend
npm run build
```
*(atau `npm.cmd run build` pada lingkungan PowerShell)*

Hasil kompilasi produksi:
```text
   ▲ Next.js 15.5.25
 ✓ Compiled successfully in 4.7s
   Linting and checking validity of types ...
 ✓ Generating static pages (16/16)
   Finalizing page optimization ...
Route (app)                                 Size  First Load JS
┌ ○ /                                    1.13 kB         104 kB
├ ○ /_not-found                            991 B         104 kB
├ ○ /dashboard                           8.79 kB         115 kB
├ ○ /dashboard/analisis                  4.31 kB         107 kB
├ ○ /dashboard/cobadulu                  4.61 kB         107 kB
├ ○ /dashboard/keuangan                  6.18 kB         109 kB
├ ○ /dashboard/laporan                   3.78 kB         106 kB
├ ○ /dashboard/pengaturan                4.62 kB         107 kB
├ ○ /dashboard/pengguna                   5.9 kB         109 kB
├ ○ /dashboard/produk                    6.28 kB         109 kB
├ ○ /dashboard/target                    4.41 kB         107 kB
├ ○ /dashboard/transaksi                 6.04 kB         109 kB
├ ○ /login                               7.48 kB         113 kB
└ ○ /register                            2.38 kB         108 kB
```
Seluruh 16 rute halaman terkompilasi bersih tanpa peringatan atau kesalahan tipe TypeScript.

---

## Desain Antarmuka & UX

Antarmuka KedaiKas dirancang dengan filosofi **Warm SaaS & Local-Commerce**:
- **Pendekatan Aksesibel**: Menghindari istilah akuntansi rumit (seperti debit/kredit, jurnal penutup) dan menggantinya dengan terminologi yang ramah dan langsung dipahami oleh pemilik warung (Omzet, Modal Beli/HPP, Pengeluaran Toko, Laba Bersih).
- **Hierarki Visual Berbasis Data**: Informasi disajikan dalam kartu ringkasan eksekutif yang menonjolkan angka nominal penting, dilengkapi indikator persentase perubahan dan status visual.
- **Palet Warna Karakteristik UMKM**:
  - *Warm Cream Canvas* (`#FBF9F5`): Latar belakang nyaman untuk penggunaan kasir berjam-jam.
  - *Forest Green Primary* (`#1B4332`): Menunjukkan stabilitas finansial, keteguhan, dan pertumbuhan usaha.
  - *Sage Green Secondary* (`#40916C`): Aksen penunjang untuk badge positif dan navigasi aktif.
  - *Terracotta Accent* (`#C85A32`): Sentuhan identitas lokal pada elemen aksi dan identitas visual.
- **Tipografi Terstruktur**: Menggunakan font sans-serif modern (*Plus Jakarta Sans*) untuk keterbacaan angka nominal yang tinggi.
- **Referensi Desain**: Spesifikasi rancangan antarmuka awal dieksplorasi melalui **Google Stitch** yang tersimpan pada direktori `.stitch/` sebagai dokumentasi referensi desain.

---

## Keunggulan Teknis (Technical Highlights)

Proyek ini mendemonstrasikan penerapan praktik rekayasa perangkat lunak modern:

1. **Clean Separation of Concerns**: Pemisahan tegas antara antarmuka reaktif (Next.js) dan mesin pemrosesan bisnis (FastAPI).
2. **RESTful Architecture & Typed Contracts**: Kontrak pertukaran data yang ketat menggunakan skema Pydantic v2 di backend dan TypeScript interface di frontend.
3. **Multi-User Single-Business RBAC**: Pengelolaan hak akses berbasis peran (Owner, Manager, Kasir) dengan otorisasi ganda di backend (`HTTP 403`) dan frontend (matriks izin & route guard).
4. **Service-Oriented Business Logic**: Logika kalkulasi bisnis, analisis perbandingan, dan skenario simulasi dipisahkan ke dalam *service layer* mandiri, bukan ditumpuk di dalam route handler.
5. **Repository Pattern with Fallback**: Abstraksi data layer yang memungkinkan pengalihan instan antara PostgreSQL nyata (`SqlRepository`) dan mode in-memory terisolasi (`MockRepository`) melalui environment variable.
6. **Relational Integrity in PostgreSQL**: Pemanfaatan *foreign key constraints* dengan aksi `CASCADE`, pembuatan indeks pada kolom foreign key untuk kecepatan query, serta trigger fungsi otomatis untuk pembaruan timestamp.
7. **Stateless JWT Security with Role Claims**: Sistem autentikasi stateless dengan token JWT yang memuat identitas peran dan id usaha pengguna.
8. **Pure In-Memory Simulation Engine**: Mesin CobaDulu menjamin simulasi *what-if* berjalan cepat dan aman tanpa meninggalkan residu atau mengubah data pembukuan asli toko.
9. **Dynamic Transaction-Derived Telemetry**: Visualisasi data chart tidak mengandalkan angka tiruan, melainkan dikompilasi secara dinamis dari agregasi tanggal dan subtotal transaksi aktual.

---

## Status Project Saat Ini

KedaiKas saat ini berada pada tahap **functional local development & portfolio project**:
- Seluruh arsitektur frontend (Next.js 15) dan backend (FastAPI) telah terintegrasi secara penuh.
- Arsitektur **Multi-User Single-Business RBAC** telah terverifikasi penuh di seluruh modul sistem.
- Integrasi basis data PostgreSQL telah aktif dengan skema relasional, data awal (base seed), dan dataset demo pengujian terkayakan (Juli–September 2026).
- 9 modul fungsional (Dashboard, Transaksi, Produk, Keuangan, Analisis & Insight, Target Laba, Simulator CobaDulu, Laporan, dan Tim & Pengguna) telah selesai diimplementasikan.
- Rangkaian pengujian unit backend (26 test cases) dan kompilasi build produksi frontend (16 rute statis) berhasil lolos 100%.

> [!NOTE]
> Project ini dikembangkan dan dikelola sebagai lingkungan pengembangan lokal (*local development / portfolio showcase*). Repositori ini tidak mengklaim deployment cloud aktif berskala enterprise, infrastruktur terdistribusi, atau integrasi model AI/ML generatif.

---

## Konteks Asal Project

KedaiKas pada awalnya dikembangkan sebagai proyek kompetisi pengembangan perangkat lunak (*software development competition*) yang mengangkat tema:

> **"Ekosistem Digital untuk Masa Depan Indonesia yang Inklusif dan Berkelanjutan"**

Tema tersebut diterjemahkan ke dalam solusi nyata: memberdayakan ekosistem usaha warung dan UMKM tradisional Indonesia melalui digitalisasi pencatatan yang inklusif, mudah diakses, dan memberikan kapasitas analitik mandiri agar usaha kecil dapat tumbuh secara berkelanjutan.

---

## Lisensi & Kontributor

- **Pengembang**: Ahmad Khairul Fatih, Daffa Berlliano, Darin Hilmi Azzahra (Tim Pengembang KedaiKas)
- **Lisensi**: Proyek ini bersifat terbuka untuk tujuan pembelajaran, portofolio rekayasa perangkat lunak, dan pengembangan ekosistem digital UMKM.
