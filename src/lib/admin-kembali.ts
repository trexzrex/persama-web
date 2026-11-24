export function indukAdmin(url: string): string {
  const { pathname, searchParams } = new URL(url, "https://admin.local");
  if (pathname === "/admin/collections/divisi" && searchParams.has("kelompok")) {
    return `/admin/collections/divisi?periode=${encodeURIComponent(searchParams.get("periode") || "")}`;
  }
  if (pathname === "/admin/collections/divisi" && searchParams.has("periode")) return "/admin/collections/divisi";
  const parts = pathname.split("/").filter(Boolean);
  if (parts[1] === "collections" && parts.length > 3) return `/admin/collections/${parts[2]}`;
  return "/admin";
}

export function catatHalaman(riwayat: string[], url: string, kembali = false): string[] {
  if (riwayat.at(-1) === url) return riwayat;
  const index = kembali ? riwayat.lastIndexOf(url) : -1;
  return index >= 0 ? riwayat.slice(0, index + 1) : [...riwayat, url].slice(-100);
}
