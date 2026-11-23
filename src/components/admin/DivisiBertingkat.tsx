import Link from "next/link";
import type { ListViewServerProps, Where } from "payload";

const ROOT = "/admin/collections/divisi";
const parameter = (nilai: unknown) => typeof nilai === "string" ? nilai : "";

export default async function DivisiBertingkat({ payload, user, searchParams, hasCreatePermission }: ListViewServerProps) {
  if (!user) return null;
  const periodeID = parameter(searchParams?.periode);
  const kelompokID = parameter(searchParams?.kelompok);
  const periode = await payload.find({ collection: "periode", pagination: false, depth: 0, sort: "-tahunMulai", overrideAccess: false, user });
  const dipilih = periode.docs.find((item) => String(item.id) === periodeID);
  const url = (kelompok?: string) => `${ROOT}?${new URLSearchParams({ periode: periodeID, ...(kelompok ? { kelompok } : {}) })}`;
  const tombolTambah = (kelompok: string) => {
    const params = new URLSearchParams({ periode: periodeID });
    if (kelompok === "inti") params.set("kelompok", "pengurus_inti");
    else if (kelompok === "pembina") params.set("kelompok", "pembina");
    else { params.set("divisi", kelompok); params.set("kelompok", "anggota_divisi"); }
    return `/admin/collections/pengurus/create?${params}`;
  };
  const divisi = dipilih ? await payload.find({ collection: "divisi", where: { periode: { equals: dipilih.id } }, pagination: false, sort: "urutan", depth: 0, overrideAccess: false, user }) : null;
  const pilihan = [
    { id: "inti", nama: "Pengurus Inti", deskripsi: "Ketua, wakil, sekretaris, dan bendahara" },
    ...(divisi?.docs.map((item) => ({ id: String(item.id), nama: item.nama, deskripsi: item.deskripsiSingkat || "Koordinator dan anggota divisi" })) ?? []),
    { id: "pembina", nama: "Pembina", deskripsi: "Pembina, penanggung jawab, dan pengarah" },
  ];
  const kelompok = pilihan.find((item) => item.id === kelompokID);
  const tautanFoto = (id: string) => ["inti", "pembina"].includes(id) ? `/admin/collections/periode/${dipilih?.id}` : `${ROOT}/${id}`;
  const labelFoto = (id: string) => id === "inti" ? "Edit foto Pengurus Inti" : id === "pembina" ? "Edit foto Pembina" : "Edit informasi dan foto divisi";
  let anggota = null;
  if (dipilih && kelompok) {
    const filter: Where = kelompokID === "inti" ? { kelompok: { equals: "pengurus_inti" } } : kelompokID === "pembina" ? { kelompok: { in: ["pembina", "penanggung_jawab", "pengarah"] } } : { divisi: { equals: kelompokID }, kelompok: { in: ["koordinator_divisi", "anggota_divisi"] } };
    anggota = await payload.find({ collection: "pengurus", where: { and: [{ periode: { equals: dipilih.id } }, filter] }, pagination: false, depth: 0, sort: "urutan", overrideAccess: false, user });
  }
  return <div className="persama-admin-divisi">
    <nav aria-label="Jejak navigasi divisi" className="persama-admin-breadcrumb"><Link href={ROOT}>Divisi</Link>{dipilih && <><span>/</span><Link href={url()}>{dipilih.nama}</Link></>}{dipilih && kelompok && <><span>/</span><span aria-current="page">{kelompok.nama}</span></>}</nav>
    <div className="persama-admin-divisi-heading"><div><p className="persama-admin-eyebrow">Kepengurusan PERSAMA</p><h1>{!dipilih ? "Pilih periode" : kelompok ? kelompok.nama : `Struktur ${dipilih.nama}`}</h1><p>{!dipilih ? "Pilih periode untuk melihat divisi dan susunan anggotanya." : kelompok ? `Rincian anggota periode ${dipilih.nama}.` : "Pilih pengurus inti, divisi, atau pembina untuk melihat anggotanya."}</p></div>
      {!dipilih && <Link className="persama-admin-outline" href="/admin/collections/periode">Kelola periode</Link>}
    </div>
    {periodeID && !dipilih && <p role="status">Periode tidak ditemukan. Silakan pilih periode yang tersedia.</p>}
    {!dipilih ? <div className="persama-admin-choice-grid">{periode.docs.map((item) => <Link key={item.id} className="persama-admin-choice" href={`${ROOT}?periode=${item.id}`}><span>{item.aktif ? "Periode aktif" : "Arsip periode"}</span><h2>{item.nama}</h2><p>Lihat struktur kepengurusan →</p></Link>)}{!periode.docs.length && <p>Belum ada periode. Tambahkan periode kepengurusan terlebih dahulu.</p>}</div> : !kelompok ? <>
      {kelompokID && <p role="status">Kelompok tidak ditemukan dalam periode ini.</p>}
      <div className="persama-admin-choice-grid">{pilihan.map((item) => <article key={item.id} className="persama-admin-choice"><h2>{item.nama}</h2><p>{item.deskripsi}</p><div className="persama-admin-actions"><Link href={url(item.id)}>Lihat anggota →</Link><Link href={tautanFoto(item.id)}>{labelFoto(item.id)}</Link></div></article>)}</div>
      {!divisi?.docs.length && <p>Divisi periode ini belum diisi. Pengurus inti dan pembina tetap dapat dikelola.</p>}
      {hasCreatePermission && <Link className="persama-admin-site-link" href={`${ROOT}/create?periode=${dipilih.id}`}>Tambah divisi untuk periode ini</Link>}
    </> : <>
      <div className="persama-admin-actions"><Link href={tombolTambah(kelompokID)}>Tambah anggota</Link><Link href={tautanFoto(kelompokID)}>{labelFoto(kelompokID)}</Link><Link href={url()}>Kembali ke struktur periode</Link></div>
      <div className="persama-admin-member-list">{anggota?.docs.map((orang) => <article key={orang.id} className="persama-admin-member"><div><h2>{orang.nama || "Nama belum diisi"}</h2><p>{orang.jabatan}</p><small>{orang.kelompok === "koordinator_divisi" ? "Koordinator divisi" : orang.kelompok === "anggota_divisi" ? "Anggota divisi" : orang.kelompok === "penanggung_jawab" ? "Penanggung jawab" : orang.kelompok === "pengarah" ? "Pengarah" : orang.kelompok === "pengurus_inti" ? "Pengurus inti" : "Pembina"}</small></div><Link href={`/admin/collections/pengurus/${orang.id}`}>Edit anggota →</Link></article>)}{!anggota?.docs.length && <p role="status">Belum ada anggota pada kelompok ini untuk periode yang dipilih.</p>}</div>
    </>}
  </div>;
}
