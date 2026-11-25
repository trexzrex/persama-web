import { formatAngka, hitungKuota } from "@/lib/metrik-penyimpanan";

export function formatByteDesimal(byte: number) {
  const unit = byte >= 1e9 ? "GB" : byte >= 1e6 ? "MB" : byte >= 1e3 ? "KB" : "B";
  const pembagi = unit === "GB" ? 1e9 : unit === "MB" ? 1e6 : unit === "KB" ? 1e3 : 1;
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(byte / pembagi)} ${unit}`;
}

export default function BarPenyimpanan({ id, judul, terpakai, kapasitas, catatan }: {
  id: string; judul: string; terpakai: number | null; kapasitas: number; catatan: string;
}) {
  const kuota = hitungKuota(terpakai, kapasitas);
  const persen = kuota ? new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(kuota.persen) : "—";
  return <article className="persama-storage-glass" data-warning={kuota ? kuota.persen >= 80 : false}>
    <div className="persama-storage-label"><h3 id={id}>{judul}</h3><strong>{kuota ? `${persen}%` : "—"}</strong></div>
    <p className="persama-storage-usage">{terpakai === null ? "Data belum tersedia" : formatByteDesimal(terpakai)} <span>/ {formatByteDesimal(kapasitas)}</span></p>
    {kuota ? <meter id={`${id}-meter`} min={0} max={kapasitas} value={Math.min(terpakai!, kapasitas)} low={kapasitas * .8} high={kapasitas * .9} optimum={0} aria-labelledby={id} aria-describedby={`${id}-note`} aria-valuetext={`${persen}% terpakai, ${formatByteDesimal(terpakai!)} dari ${formatByteDesimal(kapasitas)}`} /> : <div className="persama-storage-unavailable">Tidak dapat membaca sumber. Coba muat ulang.</div>}
    <p className="persama-storage-detail">{kuota ? `${kuota.status} · Sisa acuan ${formatByteDesimal(kuota.sisa)}` : "Pemakaian tidak dianggap nol saat sumber gagal dibaca."}</p>
    <p id={`${id}-note`} className="persama-storage-note">{catatan}</p>
    <span className="persama-admin-sr">Kapasitas acuan {formatAngka(kapasitas)} byte.</span>
  </article>;
}
