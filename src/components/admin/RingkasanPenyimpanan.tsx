import Link from "next/link";
import type { Payload } from "payload";
import { bacaMetrik } from "./PenyimpananAdmin";
import { bacaStorageR2 } from "@/lib/storage-r2";
import { formatWaktu } from "@/lib/metrik-penyimpanan";
import BarPenyimpanan from "./BarPenyimpanan";
import TombolMuatUlang from "./TombolMuatUlang";

export default async function RingkasanPenyimpanan({ payload }: { payload: Payload }) {
  const [database, r2] = await Promise.all([bacaMetrik(payload), bacaStorageR2()]);
  return <section className="persama-dashboard-storage">
    <div className="persama-dashboard-section-head"><div><h2>Penyimpanan</h2><p>Pemakaian saat ini, bukan total tagihan.</p></div><Link href="/admin/penyimpanan">Lihat detail penyimpanan <span aria-hidden="true">↗</span></Link></div>
    <div className="persama-storage-bars">
      <BarPenyimpanan id="dashboard-database" judul="Database · Supabase" terpakai={database?.database ?? null} kapasitas={500_000_000} catatan="Acuan Free 500 MB; kuota organisasi dapat mencakup proyek lain." />
      <BarPenyimpanan id="dashboard-r2" judul="Media · Cloudflare R2" terpakai={r2?.byte ?? null} kapasitas={10_000_000_000} catatan="Acuan 10 GB-month per akun; bukan batas bucket. Tidak mencakup bucket lain, rata-rata bulanan, atau biaya operasi." />
    </div>
    <div className="persama-dashboard-storage-footer"><p>Database: {database ? `${formatWaktu(database.waktu)} WITA` : "belum tersedia"}<br />R2: {r2 ? `${formatWaktu(new Date(r2.waktu))} WITA` : "belum tersedia"}</p><TombolMuatUlang /></div>
  </section>;
}
