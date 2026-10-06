"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, userManagementService } from "@/services/auth";
import {
  User,
  UserRole,
  UserCreateStaff,
  ROLE_LABELS,
  ROLE_COLORS,
} from "@/types/user";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function UserManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<UserCreateStaff>({
    nama: "",
    email: "",
    password: "",
    role: "kasir",
  });
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit role modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("kasir");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirm state
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (!stored || stored.role !== "owner") {
      router.replace("/dashboard");
      return;
    }
    setCurrentUser(stored);
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userManagementService.listUsers();
      setUsers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memuat daftar pengguna.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await userManagementService.createStaff(addForm);
      setShowAddModal(false);
      setAddForm({ nama: "", email: "", password: "", role: "kasir" });
      showSuccess(`Pengguna ${addForm.nama} berhasil ditambahkan.`);
      await fetchUsers();
    } catch (e: unknown) {
      setAddError(e instanceof Error ? e.message : "Gagal menambahkan pengguna.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await userManagementService.updateRole(editingUser.id, { role: editRole });
      setEditingUser(null);
      showSuccess(`Role ${editingUser.nama} berhasil diubah menjadi ${ROLE_LABELS[editRole]}.`);
      await fetchUsers();
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Gagal memperbarui role.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setDeleteLoading(true);
    try {
      const resp = await userManagementService.deleteUser(userId);
      setDeletingUserId(null);
      showSuccess(resp.message || "Pengguna berhasil dihapus.");
      await fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal menghapus pengguna.");
      setDeletingUserId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const roleOptions: UserRole[] = ["owner", "manager", "kasir"];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-primary-stitch" />
            Tim & Pengguna
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola anggota tim Kedai Berkah UMKM dan atur hak akses mereka.
          </p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddError(null); }}
          className="shrink-0 h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-error-container/40 border border-error/20 text-on-error-container text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RBAC Info Card */}
      <div className="mb-5 p-4 rounded-xl bg-surface-container border border-outline-variant/40">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary-stitch shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">Sistem Multi-User — Satu Usaha</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Semua pengguna berbagi data usaha yang sama. Role menentukan hak akses:
              <span className="ml-1 font-semibold text-amber-700">Owner</span> (akses penuh) ·
              <span className="ml-1 font-semibold text-blue-700">Manager</span> (operasional) ·
              <span className="ml-1 font-semibold text-emerald-700">Kasir</span> (transaksi & produk).
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-on-surface-variant text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat daftar pengguna...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-on-surface-variant">
            <Users className="h-8 w-8 opacity-30" />
            <p className="text-sm">Belum ada pengguna terdaftar.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container">
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pengguna</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Role</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {users.map((u) => {
                const isMe = u.id === currentUser?.id;
                const roleLabel = ROLE_LABELS[u.role as UserRole] ?? u.role;
                const roleBadgeClass = ROLE_COLORS[u.role as UserRole] ?? "bg-gray-100 text-gray-700 border-gray-200";
                return (
                  <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs font-mono shrink-0">
                          {u.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface flex items-center gap-1.5">
                            {u.nama}
                            {isMe && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                Saya
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-on-surface-variant sm:hidden">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-on-surface-variant hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadgeClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {roleLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isMe && (
                          <>
                            <button
                              onClick={() => { setEditingUser(u); setEditRole(u.role as UserRole); setEditError(null); }}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                              title="Ubah Role"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingUserId(u.id)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container/30 hover:text-error-stitch transition-colors"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── Add User Modal ─────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
              <h2 className="text-base font-bold text-on-surface">Tambah Pengguna Baru</h2>
              <button onClick={() => setShowAddModal(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-5 flex flex-col gap-4">
              {addError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/40 border border-error/20 text-on-error-container text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={addForm.nama}
                  onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })}
                  placeholder="Nama pengguna"
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Email</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="email@contoh.com"
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showAddPassword ? "text" : "password"}
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    placeholder="Minimal 4 karakter"
                    className="w-full h-10 pl-3 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowAddPassword(!showAddPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                    {showAddPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value as UserRole })}
                  className="h-10 px-3 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={addLoading} className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50">
                  {addLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Menyimpan...</span></> : "Tambah Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Edit Role Modal ─────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30">
              <h2 className="text-base font-bold text-on-surface">Ubah Role</h2>
              <button onClick={() => setEditingUser(null)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <p className="text-sm text-on-surface-variant">
                Mengubah role untuk <span className="font-semibold text-on-surface">{editingUser.nama}</span>
              </p>
              {editError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/40 border border-error/20 text-on-error-container text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((r) => {
                  const badgeClass = ROLE_COLORS[r];
                  const isSelected = editRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditRole(r)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-outline-variant/40 hover:bg-surface-container"
                      }`}
                    >
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {ROLE_LABELS[r]}
                      </span>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingUser(null)} className="flex-1 h-10 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button onClick={handleUpdateRole} disabled={editLoading} className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50">
                  {editLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Menyimpan...</span></> : "Simpan Role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─────────────────────────────────── */}
      {deletingUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container/50 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-error-stitch" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-on-surface">Hapus Pengguna?</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setDeletingUserId(null)} className="flex-1 h-10 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteUser(deletingUserId)}
                  disabled={deleteLoading}
                  className="flex-1 h-10 rounded-xl bg-error-stitch text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {deleteLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Menghapus...</span></> : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
