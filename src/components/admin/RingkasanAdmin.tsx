import Link from "next/link";
import type { ServerProps } from "payload";
import RingkasanPenyimpanan from "./RingkasanPenyimpanan";

const RINGKASAN = [
  { slug: "event", label: "Event", keterangan: "Agenda dan dokumentasi", ikon: "calendar" },
  { slug: "tabloid", label: "E-Tabloid", keterangan: "Publikasi digital", ikon: "book" },
  { slug: "pengurus", label: "Pengurus", keterangan: "Struktur kepengurusan", ikon: "users" },
  { slug: "media", label: "Media", keterangan: "Foto dan berkas", ikon: "image" },
] as const;
const AKSI = [
  { slug: "event", label: "Tambah event", keterangan: "Bagikan kegiatan terbaru" },
  { slug: "tabloid", label: "Tambah e-tabloid", keterangan: "Terbitkan publikasi digital" },
  { slug: "media", label: "Unggah media", keterangan: "Siapkan foto dan berkas" },
] as const;

function Ikon({ jenis }: { jenis: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {jenis === "calendar" ? <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" /></> : jenis === "book" ? <><path d="M12 5C9 3 5 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-6-1-9 1Zm0 0v15" /></> : jenis === "users" ? <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4" /></> : <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>}
  </svg>;
}

// Adaptasi pola kartu bertaut: Stats cards with links, ephraimduncan / 21st.dev.
// Tanpa grafik contoh, dependensi registry, atau data tren ilustratif.
export default async function RingkasanAdmin({ payload, user, permissions }: ServerProps) {
  if (!user) return null;
  const boleh = (slug: string, operasi: "read" | "create") => permissions?.collections?.[slug]?.[operasi] === true;
  const koleksi = RINGKASAN.filter((item) => boleh(item.slug, "read"));
  const [jumlah, hasilTerbaru, penyimpanan] = await Promise.all([
    Promise.all(koleksi.map(async (item) => {
      try { return (await payload.count({ collection: item.slug, overrideAccess: false, user })).totalDocs; }
      catch { return null; }
    })),
    Promise.all((["event", "tabloid"] as const).filter((slug) => boleh(slug, "read")).map(async (slug) => {
      try {
        const hasil = await payload.find({ collection: slug, sort: "-updatedAt", limit: 5, depth: 0, overrideAccess: false, user });
        return { gagal: false, docs: hasil.docs.map((doc) => ({ id: doc.id, judul: doc.judul || "Tanpa judul", waktu: doc.updatedAt, slug, label: slug === "event" ? "Event" : "E-Tabloid" })) };
      } catch { return { gagal: true, docs: [] }; }
    })),
    RingkasanPenyimpanan({ payload }),
  ]);
  const terbaru = hasilTerbaru.flatMap((hasil) => hasil.docs).sort((a, b) => Date.parse(b.waktu) - Date.parse(a.waktu)).slice(0, 5);
  const aksi = AKSI.filter((item) => boleh(item.slug, "create"));
  return <section className="persama-admin-overview" aria-labelledby="persama-admin-title">
    <header className="persama-admin-welcome">
      <div><h1 id="persama-admin-title">Dashboard</h1><p>Ruang kelola PERSAMA. Rawat cerita dan informasi organisasi.</p></div>
      <Link href="/" className="persama-admin-outline" target="_blank" rel="noopener noreferrer">Lihat situs <span aria-hidden="true">↗</span><span className="persama-admin-sr"> (tab baru)</span></Link>
    </header>
    <div className="persama-admin-stats">
      {koleksi.map((item, i) => <Link key={item.slug} href={`/admin/collections/${item.slug}`} className="persama-admin-stat">
        <span className="persama-stat-top"><span className="persama-stat-icon"><Ikon jenis={item.ikon} /></span><span aria-hidden="true">↗</span></span>
        <span>{item.label}</span><strong>{jumlah[i]?.toLocaleString("id-ID") ?? "—"}</strong><small>{jumlah[i] === null ? "Belum dapat dibaca; buka koleksi untuk mencoba lagi." : item.keterangan}</small>
      </Link>)}
    </div>
    <div className="persama-dashboard-work">
      <section className="persama-dashboard-recent">
        <div className="persama-dashboard-section-head"><h2>Konten terakhir diubah</h2><span>Event & e-tabloid</span></div>
        {hasilTerbaru.some((hasil) => hasil.gagal) ? <p className="persama-dashboard-empty">Sebagian konten belum dapat dibaca. Buka koleksi terkait atau muat ulang halaman.</p> : null}
        {terbaru.length ? <ul className="persama-recent-list" role="list">{terbaru.map((doc) => <li key={`${doc.slug}-${doc.id}`}>
          <Link href={`/admin/collections/${doc.slug}/${doc.id}`}><span className="persama-recent-type">{doc.label}</span><strong>{doc.judul}</strong><time dateTime={doc.waktu}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" }).format(new Date(doc.waktu))} WITA</time><span aria-hidden="true" className="persama-recent-arrow">↗</span></Link>
        </li>)}</ul> : !hasilTerbaru.some((hasil) => hasil.gagal) ? <p className="persama-dashboard-empty">Belum ada konten yang dapat ditampilkan. Mulai dari aksi cepat atau buka koleksi.</p> : null}
      </section>
      <section className="persama-admin-quick"><h2>Aksi cepat</h2><p>Mulai pekerjaan berikutnya.</p><div className="persama-admin-actions">{aksi.map((item) => <Link key={item.slug} href={`/admin/collections/${item.slug}/create`}><span className="persama-action-plus" aria-hidden="true">+</span><span>{item.label}<small>{item.keterangan}</small></span></Link>)}{!aksi.length ? <p>Tidak ada akses tambah konten untuk akun ini.</p> : null}</div></section>
    </div>
    {penyimpanan}
  </section>;
}
