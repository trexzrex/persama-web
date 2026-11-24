import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfilKelompok } from "@/components/site/ProfilKelompok";
import { KartuEvent } from "@/components/site/cards";
import styles from "@/components/site/site.module.css";
import { ambilDivisi, ambilDivisiBySlug, ambilEventDivisi, ambilPengurus } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const divisi = await ambilDivisiBySlug(slug);
  return divisi ? { title: divisi.nama, description: divisi.deskripsiSingkat?.trim() || `Profil divisi ${divisi.nama} PERSAMA SMK-SMAK Makassar.` } : { title: "Divisi tidak ditemukan" };
}

export default async function DivisiDetailPage({ params }: Props) {
  const { slug } = await params;
  const divisi = await ambilDivisiBySlug(slug);
  if (!divisi) notFound();
  const periode = typeof divisi.periode === "object" ? divisi.periode : null;
  const periodeId = periode?.id ?? (typeof divisi.periode === "number" ? divisi.periode : null);
  const [anggota, daftar, events] = await Promise.all([
    ambilPengurus(periodeId, { divisiId: divisi.id, kelompok: ["koordinator_divisi", "anggota_divisi"] }),
    ambilDivisi(periodeId),
    ambilEventDivisi(divisi.id),
  ]);
  const indeks = daftar.findIndex(item => item.id === divisi.id);
  const berikut = indeks >= 0 ? daftar[indeks + 1] : undefined;
  return <>
    <ProfilKelompok nama={divisi.nama} periode={periode?.nama} foto={divisi.fotoGrup}
      tugas={(divisi.tugasTanggungJawab ?? []).filter(item => item.poin?.trim())}
      anggota={anggota} kegiatan={divisi.kegiatan}
      program={(divisi.programKerja ?? []).filter(item => item.judul?.trim())}
      berikutnya={berikut ? { nama: berikut.nama, href: `/divisi/${berikut.slug}`, foto: berikut.fotoGrup } : { nama: "Semua divisi PERSAMA", href: "/divisi", foto: null }}
    />
    {events.length > 0 && <section className={styles.section} aria-labelledby="judul-event-divisi"><h2 id="judul-event-divisi" className={styles.sectionTitle}>Event terkait</h2><div className={`${styles.grid} ${styles.grid3}`}>{events.map(event => <KartuEvent key={event.id} event={event} />)}</div></section>}
  </>;
}
