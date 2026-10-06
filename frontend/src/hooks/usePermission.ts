import { UserRole } from "@/types/user";

/**
 * RBAC Permission Matrix untuk KedaiKas
 *
 * Digunakan di frontend untuk menyembunyikan/menampilkan
 * elemen UI berdasarkan role pengguna yang sedang login.
 *
 * Note: Backend juga memiliki enforcemet RBAC sendiri (deps.py).
 * Frontend RBAC hanya untuk UX — bukan pengganti security backend.
 */

export type Permission =
  | "view_dashboard"
  | "view_transaksi"
  | "create_transaksi"
  | "delete_transaksi"
  | "view_produk"
  | "create_produk"
  | "edit_produk"
  | "delete_produk"
  | "view_keuangan"
  | "create_pengeluaran"
  | "edit_pengeluaran"
  | "delete_pengeluaran"
  | "view_analisis"
  | "view_target"
  | "create_target"
  | "edit_target"
  | "view_cobadulu"
  | "view_laporan"
  | "view_pengaturan"
  | "edit_pengaturan"
  | "view_manajemen_pengguna"
  | "create_pengguna"
  | "edit_role_pengguna"
  | "delete_pengguna";

const PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    "view_dashboard",
    "view_transaksi",
    "create_transaksi",
    "delete_transaksi",
    "view_produk",
    "create_produk",
    "edit_produk",
    "delete_produk",
    "view_keuangan",
    "create_pengeluaran",
    "edit_pengeluaran",
    "delete_pengeluaran",
    "view_analisis",
    "view_target",
    "create_target",
    "edit_target",
    "view_cobadulu",
    "view_laporan",
    "view_pengaturan",
    "edit_pengaturan",
    "view_manajemen_pengguna",
    "create_pengguna",
    "edit_role_pengguna",
    "delete_pengguna",
  ],
  manager: [
    "view_dashboard",
    "view_transaksi",
    "create_transaksi",
    "view_produk",
    "create_produk",
    "edit_produk",
    "view_keuangan",
    "create_pengeluaran",
    "edit_pengeluaran",
    "view_analisis",
    "view_target",
    "view_cobadulu",
    "view_laporan",
    "view_pengaturan",
  ],
  kasir: [
    "view_transaksi",
    "create_transaksi",
    "view_produk",
  ],
};

/**
 * Cek apakah role tertentu memiliki permission.
 * Bisa digunakan tanpa hook (pure function).
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Cek apakah role memiliki salah satu dari beberapa permission.
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Cek apakah role memiliki semua permission.
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Dapatkan semua permission untuk role tertentu.
 */
export function getPermissions(role: UserRole): Permission[] {
  return PERMISSIONS[role] ?? [];
}
