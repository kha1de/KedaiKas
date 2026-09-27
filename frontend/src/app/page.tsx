"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/services/api";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-slate-500">Memuat KedaiKas...</div>
    </div>
  );
}
