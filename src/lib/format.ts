const ZONA = "Asia/Makassar";

export function formatTanggal(nilai?: string | null): string {
  if (!nilai) return "Tanggal belum ditentukan";
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "Tanggal belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  }).format(tanggal);
}

export function formatRentangTanggal(
  mulai?: string | null,
  selesai?: string | null,
): string {
  if (!mulai) return "Tanggal belum ditentukan";
  if (!selesai) return formatTanggal(mulai);
  const awal = new Date(mulai);
  const akhir = new Date(selesai);
  if (Number.isNaN(awal.getTime()) || Number.isNaN(akhir.getTime())) {
    return formatTanggal(mulai);
  }
  const hariSama =
    formatTanggal(mulai) === formatTanggal(selesai);
  if (hariSama) return formatTanggal(mulai);
  return `${formatTanggal(mulai)} – ${formatTanggal(selesai)}`;
}

export type StatusEvent = "akan-datang" | "berlangsung" | "selesai";

export function statusEvent(event: {
  tanggalMulai: string;
  tanggalSelesai?: string | null;
}): StatusEvent {
  const mulai = new Date(event.tanggalMulai).getTime();
  const selesai = new Date(
    event.tanggalSelesai || event.tanggalMulai,
  ).getTime();
  const sekarang = Date.now();
  if (Number.isNaN(mulai) || Number.isNaN(selesai)) return "selesai";
  // Bandingkan per hari di zona WITA agar event hari ini tetap "berlangsung".
  const hariIni = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(new Date(sekarang))
      .replaceAll("-", ""),
  );
  const hariMulai = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(new Date(mulai))
      .replaceAll("-", ""),
  );
  const hariSelesai = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(new Date(selesai))
      .replaceAll("-", ""),
  );
  if (hariIni < hariMulai) return "akan-datang";
  if (hariIni > hariSelesai) return "selesai";
  return "berlangsung";
}

export const labelStatus: Record<StatusEvent, string> = {
  "akan-datang": "Akan datang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

/**
 * Samakan penulisan periode dengan desain: "2026–2027" atau "2026-2027"
 * menjadi "2026/2027".
 */
export function tahunPeriode(nilai?: string | null): string {
  if (!nilai?.trim()) return "2026/2027";
  return nilai
    .trim()
    .replace(/\s*[–—-]\s*/g, "/")
    .replace(/\s*\/\s*/g, "/");
}
