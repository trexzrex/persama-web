import Link from "next/link";
import type { ServerProps } from "payload";

const RINGKASAN = [
  { slug: "event", label: "Event", keterangan: "Agenda dan dokumentasi" },
  { slug: "tabloid", label: "E-Tabloid", keterangan: "Publikasi digital" },
  { slug: "pengurus", label: "Pengurus", keterangan: "Struktur kepengurusan" },
  { slug: "media", label: "Media", keterangan: "Foto dan berkas" },
] as const;

export default async function RingkasanAdmin({ payload, user }: ServerProps) {
  if (!user) return null;
  const jumlah = await Promise.all(RINGKASAN.map(async (item) => {
    try {
      const hasil = await payload.count({ collection: item.slug, overrideAccess: false, user });
      return hasil.totalDocs;
    } catch {
      return null;
    }
  }));
  return (
    <section className="persama-admin-overview" aria-labelledby="persama-admin-title">
      <div className="persama-admin-welcome">
        <div><p className="persama-admin-eyebrow">Ruang kelola PERSAMA</p>
          <h1 id="persama-admin-title">Selamat datang kembali.</h1>
          <p>Mulai dari kabar terbaru, lalu pastikan informasi organisasi tetap terawat.</p>
        </div>
        <Link href="/" className="persama-admin-outline" target="_blank">Lihat situs ↗</Link>
      </div>
      <div className="persama-admin-stats">
        {RINGKASAN.map((item, i) => <Link key={item.slug} href={`/admin/collections/${item.slug}`} className="persama-admin-stat">
          <span>{item.label}</span><strong>{jumlah[i] ?? "—"}</strong><small>{item.keterangan}</small>
        </Link>)}
      </div>
      <div className="persama-admin-quick">
        <div><h2>Mulai berkarya</h2><p>Pilih pekerjaan yang ingin Anda lakukan.</p></div>
        <div className="persama-admin-actions">
          <Link href="/admin/collections/event/create">Tambah event</Link>
          <Link href="/admin/collections/tabloid/create">Tambah e-tabloid</Link>
          <Link href="/admin/collections/media/create">Unggah media</Link>
        </div>
      </div>
    </section>
  );
}
