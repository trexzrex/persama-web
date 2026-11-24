const UKURAN = ["B", "KB", "MB", "GB", "TB"] as const;

const angka = new Intl.NumberFormat("id-ID");
const angkaDesimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export function formatAngka(nilai: number): string {
  if (!Number.isFinite(nilai) || nilai < 0) return "—";
  return angka.format(nilai);
}

export function formatByte(nilai: number): string {
  if (!Number.isFinite(nilai) || nilai < 0) return "—";
  let sisa = nilai;
  let indeks = 0;
  while (sisa >= 1024 && indeks < UKURAN.length - 1) {
    sisa /= 1024;
    indeks += 1;
  }
  if (indeks === 0) return `${angka.format(Math.round(sisa))} ${UKURAN[indeks]}`;
  return `${angkaDesimal.format(sisa)} ${UKURAN[indeks]}`;
}

export function formatWaktu(tanggal: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Makassar",
  }).format(tanggal);
}
