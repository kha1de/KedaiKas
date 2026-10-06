"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/services/auth";
import { apiClient } from "@/services/api";
import { User, UserRole } from "@/types/user";
import { hasPermission } from "@/hooks/usePermission";
import {
  Settings,
  Store,
  MapPin,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldOff,
} from "lucide-react";

interface BusinessData {
  id: number;
  nama_usaha: string;
  alamat?: string;
  created_at?: string;
}

export default function PengaturanPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nama_usaha: "", alamat: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const stored = authService.getStoredUser();
    setCurrentUser(stored);
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<BusinessData>("/settings");
      setBusiness(data);
      setEditForm({ nama_usaha: data.nama_usaha, alamat: data.alamat ?? "" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal memuat data usaha.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const updated = await apiClient<BusinessData>("/settings", {
        method: "PUT",
        body: JSON.stringify({
          nama_usaha: editForm.nama_usaha || undefined,
          alamat: editForm.alamat || undefined,
        }),
      });
      setBusiness(updated);
      setIsEditing(false);
      setSuccessMsg("Pengaturan usaha berhasil disimpan.");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Gagal menyimpan perubahan.");
    } finally {
      setEditLoading(false);
    }
  };

  const userRole = (currentUser?.role as UserRole) ?? "kasir";
  const canEdit = hasPermission(userRole, "edit_pengaturan");

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-primary-stitch" />
            Pengaturan Usaha
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Informasi dan konfigurasi profil Kedai Berkah UMKM.
          </p>
        </div>
        {canEdit && !isEditing && business && (
          <button
            onClick={() => { setIsEditing(true); setEditError(null); }}
            className="shrink-0 h-10 px-4 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface-variant flex items-center gap-2 hover:bg-surface-container transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        )}
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

      {/* Read-only warning for non-owner */}
      {!canEdit && (
        <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface-variant text-sm">
          <ShieldOff className="h-4 w-4 shrink-0" />
          <span>Anda hanya dapat melihat data ini. Hanya Owner yang dapat mengubah pengaturan usaha.</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-on-surface-variant text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat data usaha...
        </div>
      ) : (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm overflow-hidden">
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              <h2 className="text-sm font-semibold text-on-surface">Edit Profil Usaha</h2>
              {editError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container/40 border border-error/20 text-on-error-container text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Nama Usaha</label>
                <input
                  type="text"
                  required
                  value={editForm.nama_usaha}
                  onChange={(e) => setEditForm({ ...editForm, nama_usaha: e.target.value })}
                  className="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Alamat Usaha</label>
                <textarea
                  rows={3}
                  value={editForm.alamat}
                  onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                  placeholder="Alamat lengkap usaha (opsional)"
                  className="px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none transition-all"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 h-10 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={editLoading} className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50">
                  {editLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Menyimpan...</span></> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {/* ID Usaha */}
              <div className="p-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <Store className="h-4.5 w-4.5 text-primary-stitch" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-on-surface-variant mb-0.5 font-medium">ID Usaha</div>
                  <div className="text-sm font-semibold text-on-surface font-mono">#{business?.id ?? "—"}</div>
                </div>
              </div>

              {/* Nama Usaha */}
              <div className="p-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <Store className="h-4.5 w-4.5 text-primary-stitch" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-on-surface-variant mb-0.5 font-medium">Nama Usaha</div>
                  <div className="text-sm font-semibold text-on-surface">{business?.nama_usaha ?? "—"}</div>
                </div>
              </div>

              {/* Alamat */}
              <div className="p-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <MapPin className="h-4.5 w-4.5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-on-surface-variant mb-0.5 font-medium">Alamat</div>
                  <div className="text-sm text-on-surface">{business?.alamat ?? "Belum diatur"}</div>
                </div>
              </div>

              {/* Terdaftar sejak */}
              {business?.created_at && (
                <div className="p-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                    <Settings className="h-4.5 w-4.5 text-on-surface-variant" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-on-surface-variant mb-0.5 font-medium">Terdaftar Sejak</div>
                    <div className="text-sm text-on-surface">
                      {new Date(business.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
