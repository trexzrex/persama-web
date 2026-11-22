import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { GaleriEvent } from "@/components/site/GaleriEvent";
import { BadgeStatus, Gambar } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { ambilEventBySlug, teksAltMedia } from "@/lib/content";
import { formatRentangTanggal, statusEvent } from "@/lib/format";
import type { Divisi } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await ambilEventBySlug(slug);
  if (!event) return { title: "Event tidak ditemukan" };
  return {
    title: event.judul,
    description:
      [event.lokasi, formatRentangTanggal(event.tanggalMulai, event.tanggalSelesai)]
        .filter(Boolean)
        .join(" · ") || `Event PERSAMA: ${event.judul}.`,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await ambilEventBySlug(slug);
  if (!event) notFound();

  const status = statusEvent(event);
  const galeri = (event.galeri ?? []).filter((item) => item.foto);
  const divisi = (event.divisiPenyelenggara ?? []).filter(
    (item): item is Divisi => typeof item === "object" && item !== null,
  );

  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Remah roti">
        <Link href="/event">Event</Link>
        <span aria-hidden="true">/</span>
        <span>{event.judul}</span>
      </nav>

      <div className={styles.detailHead}>
        <div>
          <div className={styles.detailMeta}>
            {event.contoh ? <span className={`${styles.badge} ${styles.badgeSoft}`}>Contoh</span> : null}
            <BadgeStatus status={status} />
            <span>{formatRentangTanggal(event.tanggalMulai, event.tanggalSelesai)}</span>
            {event.lokasi ? <span>{event.lokasi}</span> : null}
          </div>
          <h1 className={styles.detailTitle} style={{ marginTop: "var(--sp-12)" }}>
            {event.judul}
          </h1>
          {divisi.length > 0 ? (
            <p className={styles.small} style={{ marginTop: "var(--sp-12)" }}>
              Diselenggarakan oleh{" "}
              {divisi.map((item, indeks) => (
                <span key={item.id}>
                  {indeks > 0 ? ", " : ""}
                  <Link href={`/divisi/${item.slug}`}>{item.nama}</Link>
                </span>
              ))}
              .
            </p>
          ) : null}
        </div>
        <div className={styles.detailPoster}>
          <Gambar
            media={event.poster}
            alt={teksAltMedia(event.poster, `Poster ${event.judul}`)}
            ukuran="hero"
            isi={false}
            className={styles.photo}
            labelKosong="Foto menyusul"
            prioritas
          />
        </div>
      </div>

      {event.deskripsi ? (
        <section className={styles.section} aria-labelledby="judul-deskripsi">
          <h2 id="judul-deskripsi" className={styles.sectionTitle}>
            Tentang event
          </h2>
          <div className={styles.prose} style={{ marginTop: "var(--sp-16)" }}>
            <RichText data={event.deskripsi as Parameters<typeof RichText>[0]["data"]} />
          </div>
        </section>
      ) : null}

      {galeri.length > 0 ? (
        <section className={styles.section} aria-labelledby="judul-galeri">
          <h2 id="judul-galeri" className={styles.sectionTitle}>
            Galeri dokumentasi
          </h2>
          <p className={styles.small} style={{ marginBlock: "var(--sp-8) var(--sp-16)" }}>
            Ketuk foto untuk membuka ukuran penuh.
          </p>
          <GaleriEvent foto={galeri} judul={event.judul} />
        </section>
      ) : null}

      <Link className={styles.textLink} href="/event">
        ← Kembali ke daftar event
      </Link>
    </>
  );
}
