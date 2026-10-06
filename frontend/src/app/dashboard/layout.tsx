"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAuthToken } from "@/services/api";
import { authService } from "@/services/auth";
import { User, UserRole, ROLE_LABELS, ROLE_COLORS } from "@/types/user";
import { hasPermission, Permission } from "@/hooks/usePermission";
import {
  LayoutDashboard,
  Receipt,
  Package,
  Wallet,
  TrendingUp,
  Target,
  Sparkles,
  FileText,
  Menu,
  X,
  LogOut,
  Users,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  requiredPermission: Permission;
}

const ALL_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiredPermission: "view_dashboard",
  },
  {
    label: "Transaksi",
    href: "/dashboard/transaksi",
    icon: Receipt,
    requiredPermission: "view_transaksi",
  },
  {
    label: "Produk",
    href: "/dashboard/produk",
    icon: Package,
    requiredPermission: "view_produk",
  },
  {
    label: "Keuangan",
    href: "/dashboard/keuangan",
    icon: Wallet,
    requiredPermission: "view_keuangan",
  },
  {
    label: "Analisis & Insight",
    href: "/dashboard/analisis",
    icon: TrendingUp,
    requiredPermission: "view_analisis",
  },
  {
    label: "Target Laba",
    href: "/dashboard/target",
    icon: Target,
    requiredPermission: "view_target",
  },
  {
    label: "CobaDulu (Simulasi)",
    href: "/dashboard/cobadulu",
    icon: Sparkles,
    badge: "Simulasi",
    requiredPermission: "view_cobadulu",
  },
  {
    label: "Laporan",
    href: "/dashboard/laporan",
    icon: FileText,
    requiredPermission: "view_laporan",
  },
  {
    label: "Tim & Pengguna",
    href: "/dashboard/pengguna",
    icon: Users,
    requiredPermission: "view_manajemen_pengguna",
  },
  {
    label: "Pengaturan Usaha",
    href: "/dashboard/pengaturan",
    icon: Settings,
    requiredPermission: "view_pengaturan",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const stored = authService.getStoredUser();
    setUser(stored);
    setChecked(true);

    if (stored?.role === "kasir" && pathname === "/dashboard") {
      router.replace("/dashboard/transaksi");
    }
  }, [router, pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    router.replace("/login");
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stitch-canvas">
        <div className="flex items-center gap-2 text-sm text-stitch-muted font-medium">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-stitch-primary border-t-transparent" />
          Memeriksa otentikasi...
        </div>
      </div>
    );
  }

  // Filter nav items berdasarkan role pengguna
  const userRole = (user?.role as UserRole) ?? "kasir";
  const navItems = ALL_NAV_ITEMS.filter((item) =>
    hasPermission(userRole, item.requiredPermission)
  );

  const roleLabel = ROLE_LABELS[userRole] ?? userRole;
  const roleBadgeClass =
    ROLE_COLORS[userRole] ?? "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="min-h-screen bg-stitch-canvas w-full">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between border-b border-stitch-border bg-stitch-surface/95 px-4 py-2.5 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image src="/kedaikas_brand_logo.svg" alt="KedaiKas Logo" width={120} height={32} className="h-8 w-auto" />
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-stitch-typography hover:bg-stitch-border/30 active:bg-stitch-border/50 transition-colors"
          aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stitch-typography/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation (Desktop Fixed + Mobile Drawer) */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0"
        } h-screen overflow-y-auto`}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Brand Header & Store Pill */}
          <div className="p-4 sm:p-5 flex flex-col gap-3 border-b border-surface-container flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src="/kedaikas_brand_logo.svg" alt="KedaiKas Logo" width={140} height={36} className="h-8 w-auto" />
              </div>
              {mobileMenuOpen && (
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden flex h-9 w-9 items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                  aria-label="Tutup Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Store Branch Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-secondary-stitch text-base">storefront</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface truncate">
                  Kedai Berkah UMKM
                </span>
                <span className="text-[10px] text-on-surface-variant truncate">Toko Aktif • POS Digital</span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <div className="p-3">
            <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Navigasi Usaha
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive
                        ? "bg-primary-container text-white font-semibold shadow-xs"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-on-surface-variant"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-tertiary-fixed text-tertiary-container"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card & Role Badge Footer */}
        <div className="p-3.5 border-t border-surface-container flex flex-col gap-2.5 bg-surface-container-lowest flex-shrink-0">
          {/* Role Badge */}
          <div className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${roleBadgeClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {roleLabel}
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs font-mono">
              {user?.nama ? user.nama.substring(0, 2).toUpperCase() : "KK"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-on-surface truncate">
                {user?.nama || "Pengguna"}
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono truncate">
                {user?.email || ""}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest py-2 px-3 text-xs font-semibold text-on-surface-variant hover:text-error-stitch hover:bg-error-container/20 transition-colors shadow-2xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-surface md:ml-64 min-h-screen">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex h-16 bg-surface/90 backdrop-blur-xl border-b border-surface-container sticky top-0 z-20 px-6 lg:px-8 items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
              <input
                type="text"
                placeholder="Cari transaksi, produk, atau data keuangan..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-1.5 focus:ring-primary-container border border-outline-variant/40 shadow-2xs"
              />
            </div>
            <div className="flex items-center bg-surface-container-lowest rounded-lg px-3 h-9 border border-outline-variant/40 text-on-surface-variant gap-1.5 cursor-pointer text-xs font-medium shrink-0">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              <span>
                {new Date().toLocaleDateString("id-ID", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasPermission(userRole, "create_transaksi") && (
              <Link
                href="/dashboard/transaksi"
                className="h-9 px-3.5 rounded-lg bg-bi-terracotta hover:bg-bi-terracotta-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Transaksi</span>
              </Link>
            )}

            <div className="flex items-center gap-2 pl-3 border-l border-surface-container">
              <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shadow-2xs font-mono">
                {user?.nama ? user.nama.substring(0, 2).toUpperCase() : "KK"}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  {user?.nama || "Pengguna"}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${roleBadgeClass}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 sm:px-8 py-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

