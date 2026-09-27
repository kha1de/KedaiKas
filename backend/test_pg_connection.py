"""
test_pg_connection.py
---------------------
Script untuk memverifikasi koneksi FastAPI backend ke PostgreSQL.

Cara penggunaan:
  1. Pastikan .env sudah berisi DATABASE_URL yang benar
  2. Dari direktori backend/, jalankan:
       python test_pg_connection.py

Skrip ini TIDAK mengubah data apapun di database.
"""

import sys
import os

# ---------------------------------------------------------------------------
# 1. Baca .env
# ---------------------------------------------------------------------------
env_file = os.path.join(os.path.dirname(__file__), ".env")
env_vars: dict = {}
if os.path.exists(env_file):
    with open(env_file, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                env_vars[key.strip()] = val.strip().strip('"').strip("'")

db_url = env_vars.get("DATABASE_URL", "")
use_mock = env_vars.get("USE_MOCK_REPO", "true").lower() in ("true", "1", "yes")

import re

masked_url = re.sub(r':([^@/]+)@', ':***@', db_url)

print("=" * 60)
print("  PostgreSQL Connection Test — project_warung")
print("=" * 60)
print(f"  DATABASE_URL : {masked_url}")
print(f"  USE_MOCK_REPO: {use_mock}")
print()

# ---------------------------------------------------------------------------
# 2. Cek placeholder
# ---------------------------------------------------------------------------
if "YOUR_PASSWORD" in db_url:
    print("[STOP] DATABASE_URL masih menggunakan placeholder 'YOUR_PASSWORD'.")
    print()
    print("  Edit file backend/.env dan ganti YOUR_PASSWORD dengan")
    print("  password PostgreSQL Anda.")
    print()
    print("  Contoh tanpa password:")
    print('    DATABASE_URL="postgresql+psycopg://postgres@localhost:5432/project_warung"')
    print()
    print("  Contoh dengan password 'mypass':")
    print('    DATABASE_URL="postgresql+psycopg://postgres:mypass@localhost:5432/project_warung"')
    sys.exit(1)

if use_mock:
    print("[INFO] USE_MOCK_REPO=true — backend sedang dalam mode MockRepository.")
    print("       Set USE_MOCK_REPO=false di .env untuk menggunakan PostgreSQL.")
    print()

# ---------------------------------------------------------------------------
# 3. Cek driver psycopg tersedia
# ---------------------------------------------------------------------------
try:
    import psycopg  # noqa: F401
    print("[OK] Driver psycopg tersedia")
except ImportError:
    print("[GAGAL] Driver psycopg tidak ditemukan.")
    print("        Jalankan: python -m pip install 'psycopg[binary]>=3.1.0'")
    sys.exit(1)

# ---------------------------------------------------------------------------
# 4. Koneksi ke PostgreSQL
# ---------------------------------------------------------------------------
try:
    from sqlalchemy import create_engine, text

    engine = create_engine(db_url, pool_pre_ping=True, echo=False)

    TABLES = [
        "users",
        "products",
        "transactions",
        "transaction_details",
        "expenses",
        "targets",
        "price_references",
    ]

    EXPECTED = {
        "users": 3,
        "products": 4,
        "transactions": 4,
        "transaction_details": 4,
        "expenses": 4,
        "targets": 2,
        "price_references": 4,
    }

    with engine.connect() as conn:
        print("[OK] Koneksi PostgreSQL BERHASIL\n")
        print(f"  {'Tabel':<25} {'Baris Aktual':>14} {'Baris Diharapkan':>18} {'Status':>8}")
        print("  " + "-" * 68)

        all_ok = True
        for tbl in TABLES:
            result = conn.execute(text(f'SELECT COUNT(*) FROM "{tbl}"'))
            count = result.scalar()
            expected = EXPECTED.get(tbl, "?")
            status = "OK" if count == expected else "MISMATCH"
            if status != "OK":
                all_ok = False
            print(f"  {tbl:<25} {count:>14} {expected:>18} {status:>8}")

        print()
        if all_ok:
            print("[OK] Semua tabel berhasil dibaca dan jumlah baris sesuai.")
        else:
            print("[WARN] Beberapa tabel memiliki jumlah baris berbeda dari yang diharapkan.")

except Exception as e:
    print(f"\n[GAGAL] Koneksi atau query gagal:")
    print(f"  {e}")
    print()
    print("  Kemungkinan penyebab:")
    print("  - Password salah → periksa DATABASE_URL di .env")
    print("  - PostgreSQL belum berjalan → jalankan PostgreSQL service")
    print("  - Database 'project_warung' belum ada → buat database terlebih dahulu")
    sys.exit(1)

print()
print("=" * 60)
print("  Test selesai.")
print("=" * 60)
