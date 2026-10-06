-- ============================================================
-- MIGRATION: RBAC Multi-User Single-Business (KedaiKas)
-- Aman & Non-Destruktif (Zero Data Loss)
-- ============================================================

BEGIN;

-- 1. Buat tabel businesses jika belum ada
CREATE TABLE IF NOT EXISTS "businesses" (
    "id_usaha"    SERIAL          NOT NULL,
    "nama_usaha"  VARCHAR(150)    NOT NULL,
    "alamat"      TEXT            DEFAULT NULL,
    "created_at"  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id_usaha")
);

-- 2. Insert data usaha utama (Kedai Berkah UMKM) dengan id_usaha = 1
INSERT INTO "businesses" ("id_usaha", "nama_usaha", "alamat")
OVERRIDING SYSTEM VALUE
VALUES (1, 'Kedai Berkah UMKM', 'Jl. Merdeka No. 45, Jakarta')
ON CONFLICT ("id_usaha") DO NOTHING;

-- 3. Tambahkan kolom id_usaha dan role pada tabel users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id_usaha'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "id_usaha" INTEGER DEFAULT 1;
        ALTER TABLE "users" ADD CONSTRAINT "fk_users_id_usaha" 
            FOREIGN KEY ("id_usaha") REFERENCES "businesses" ("id_usaha") ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE "users" ADD COLUMN "role" VARCHAR(20) NOT NULL DEFAULT 'kasir';
    END IF;
END $$;

-- 4. Tambahkan kolom id_usaha pada tabel products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'id_usaha'
    ) THEN
        ALTER TABLE "products" ADD COLUMN "id_usaha" INTEGER DEFAULT 1;
        ALTER TABLE "products" ADD CONSTRAINT "fk_products_id_usaha" 
            FOREIGN KEY ("id_usaha") REFERENCES "businesses" ("id_usaha") ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS "idx_products_id_usaha" ON "products" ("id_usaha");
    END IF;
END $$;

-- 5. Tambahkan kolom id_usaha pada tabel transactions (pertahankan id_user sebagai pencatat)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'id_usaha'
    ) THEN
        ALTER TABLE "transactions" ADD COLUMN "id_usaha" INTEGER DEFAULT 1;
        ALTER TABLE "transactions" ADD CONSTRAINT "fk_transactions_id_usaha" 
            FOREIGN KEY ("id_usaha") REFERENCES "businesses" ("id_usaha") ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS "idx_transactions_id_usaha" ON "transactions" ("id_usaha");
    END IF;
END $$;

-- 6. Tambahkan kolom id_usaha pada tabel expenses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'expenses' AND column_name = 'id_usaha'
    ) THEN
        ALTER TABLE "expenses" ADD COLUMN "id_usaha" INTEGER DEFAULT 1;
        ALTER TABLE "expenses" ADD CONSTRAINT "fk_expenses_id_usaha" 
            FOREIGN KEY ("id_usaha") REFERENCES "businesses" ("id_usaha") ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS "idx_expenses_id_usaha" ON "expenses" ("id_usaha");
    END IF;
END $$;

-- 7. Tambahkan kolom id_usaha pada tabel targets
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'targets' AND column_name = 'id_usaha'
    ) THEN
        ALTER TABLE "targets" ADD COLUMN "id_usaha" INTEGER DEFAULT 1;
        ALTER TABLE "targets" ADD CONSTRAINT "fk_targets_id_usaha" 
            FOREIGN KEY ("id_usaha") REFERENCES "businesses" ("id_usaha") ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS "idx_targets_id_usaha" ON "targets" ("id_usaha");
    END IF;
END $$;

-- 8. Migrasi Data & Penetapan Role Demo
-- Pastikan seluruh data yang ada terhubung ke Usaha 1 (Kedai Berkah UMKM)
UPDATE "users" SET "id_usaha" = 1 WHERE "id_usaha" IS NULL;
UPDATE "products" SET "id_usaha" = 1 WHERE "id_usaha" IS NULL;
UPDATE "transactions" SET "id_usaha" = 1 WHERE "id_usaha" IS NULL;
UPDATE "expenses" SET "id_usaha" = 1 WHERE "id_usaha" IS NULL;
UPDATE "targets" SET "id_usaha" = 1 WHERE "id_usaha" IS NULL;

-- Tetapkan Role & Identitas untuk 3 Akun Demo
-- 1. Ahmad Khairul Fatih -> KASIR
UPDATE "users" 
SET "nama" = 'Ahmad Khairul Fatih', "id_usaha" = 1, "role" = 'kasir' 
WHERE "email" = 'ah.khairul@gmail.com' OR "id_user" = 1;

-- 2. Daffa Berlliano -> MANAGER
UPDATE "users" 
SET "nama" = 'Daffa Berlliano', "id_usaha" = 1, "role" = 'manager' 
WHERE "email" = 'daf.berlliano@gmail.com' OR "id_user" = 2;

-- 3. Darin Hilmi Azzahra -> OWNER
UPDATE "users" 
SET "nama" = 'Darin Hilmi Azzahra', "id_usaha" = 1, "role" = 'owner' 
WHERE "email" = 'dar.hilmi@gmail.com' OR "id_user" = 3;

-- Sync serial sequence untuk businesses
SELECT setval(pg_get_serial_sequence('"businesses"', 'id_usaha'), COALESCE((SELECT MAX("id_usaha") FROM "businesses"), 1));

COMMIT;
