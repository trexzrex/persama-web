import Link from "next/link";
import type { ServerProps } from "payload";
import { loadDashboard, SUMMARY, type DashboardItem } from "./dashboard-data";

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" });
function date(value?: string | null) {
  return value && !Number.isNaN(Date.parse(value)) ? dateFormat.format(new Date(value)) + " WITA" : "Tanggal belum tersedia";
}
function ContentList({ items, empty, drafts = false }: { items: DashboardItem[]; empty: string; drafts?: boolean }) {
  if (!items.length) return <p className="persama-work-empty">{empty}</p>;
  return <ul className="persama-work-list">{items.map(item => <li key={`${item.collection}-${item.id}`}>
    <div><strong>{item.title}</strong><p>{SUMMARY.find(s => s.slug === item.collection)?.label} · <time dateTime={item.updatedAt}>{date(item.updatedAt)}</time></p></div>
    <div className="persama-work-row-actions">{item.status && <span className="persama-work-status">{item.status === "draft" ? "Draf" : "Terbit"}</span>}<Link href={`/admin/collections/${item.collection}/${encodeURIComponent(item.id)}`} aria-label={`${drafts ? "Lanjutkan edit" : "Edit"} ${item.title}`}>{drafts ? "Lanjutkan edit" : "Edit"}</Link></div>
  </li>)}</ul>;
}

export default async function RingkasanAdmin({ payload, user }: ServerProps) {
  if (!user) return null;
  const data = await loadDashboard(payload, user);
  // Current collection create rules allow every authenticated admin (adminSaja).
  const empty = data.failed ? "Sebagian data gagal dimuat. Muat ulang halaman untuk mencoba kembali." : null;
  return <section className="persama-admin-overview" aria-labelledby="persama-admin-title">
    <div className="persama-admin-welcome"><div><p className="persama-admin-eyebrow">Ruang kelola PERSAMA</p><h1 id="persama-admin-title">Selamat datang kembali.</h1><p>Buat konten baru atau lanjutkan pekerjaan yang belum selesai.</p></div><Link href="/" className="persama-admin-outline" target="_blank" rel="noopener noreferrer">Lihat situs ↗</Link></div>
    <div className="persama-admin-actions persama-work-shortcuts" aria-label="Aksi cepat"><Link href="/admin/collections/event/create">Tambah event</Link><Link href="/admin/collections/tabloid/create">Tambah e-tabloid</Link><Link href="/admin/collections/media/create">Unggah media</Link></div>
    <div className="persama-admin-stats">{SUMMARY.map((item, i) => <Link key={item.slug} href={`/admin/collections/${item.slug}`} className="persama-admin-stat"><span>{item.label}</span><strong>{data.counts[i] ?? "—"}</strong><small>{data.counts[i] === null ? "Gagal memuat jumlah" : item.description}</small></Link>)}</div>
    {data.failed && <p className="persama-admin-storage-notice" role="status">Sebagian data gagal dimuat. Data lain tetap dapat digunakan. Muat ulang halaman untuk mencoba kembali.</p>}
    <div className="persama-work-grid"><div className="persama-work-main">
      <section className="persama-work-panel" aria-labelledby="recent-title"><header><h2 id="recent-title">Terakhir diperbarui</h2><p>Konten terbaru dari seluruh koleksi.</p></header><ContentList items={data.recent} empty={empty || "Belum ada konten. Mulai melalui aksi cepat di atas."} /></section>
      <section className="persama-work-panel" aria-labelledby="draft-title"><header><h2 id="draft-title">Draf belum terbit</h2><p>Event dan e-tabloid yang bisa dilanjutkan.</p></header><ContentList items={data.drafts} drafts empty={empty || "Tidak ada draf yang belum terbit."} /></section>
    </div><section className="persama-work-panel persama-work-agenda" aria-labelledby="agenda-title"><header><h2 id="agenda-title">Agenda terdekat</h2><p>Event terbit yang akan datang · WITA.</p></header>{data.agenda.length ? <ul className="persama-work-list">{data.agenda.map(item => <li key={item.id}><div><time dateTime={item.date || undefined}>{date(item.date)}</time><strong>{item.title}</strong><p>{item.location || "Lokasi belum diisi"}</p><Link href={`/admin/collections/event/${encodeURIComponent(item.id)}`} aria-label={`Edit event ${item.title}`}>Edit event</Link></div></li>)}</ul> : <p className="persama-work-empty">{empty || "Belum ada event mendatang yang diterbitkan."}</p>}</section></div>
  </section>;
}
