export function formatRupiah(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "Rp 0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  return "Rp " + Math.round(num).toLocaleString("id-ID");
}

export function formatPercent(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "0%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0%";
  return `${num.toFixed(1)}%`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
