import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PembacaPdf } from "@/components/site/PembacaPdf";
import { Gambar } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import {
  alamatMedia,
  ambilTabloidBySlug,
  mediaObjek,
  teksAltMedia,
  ukuranBerkas,
} from "@/lib/content";
import { formatTanggal } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tabloid = await ambilTabloidBySlug(slug);
  if (!tabloid) return { title: "E-Tabloid tidak ditemukan" };
  return {
    title: tabloid.judul,
    description:
      tabloid.deskripsiSingkat?.trim() ||
      `E-Tabloid ${tabloid.judul}${tabloid.edisi ? `, ${tabloid.edisi}` : ""}.`,
  };
}

export default async function TabloidReaderPage({ params }: Props) {
  const { slug } = await params;
  const tabloid = await ambilTabloidBySlug(slug);
  if (!tabloid) notFound();

  const berkas = mediaObjek(tabloid.berkasPdf);
  const urlPdf = alamatMedia(tabloid.berkasPdf);
  const ukuran = ukuranBerkas(berkas?.filesize);

  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Remah roti">
        <Link href="/e-tabloid">E-Tabloid</Link>
        <span aria-hidden="true">/</span>
        <span>{tabloid.judul}</span>
      </nav>

      <div className={styles.detailHead}>
        <div>
          <div className={styles.detailMeta}>
            {tabloid.contoh ? <span className={`${styles.badge} ${styles.badgeSoft}`}>Contoh</span> : null}
            {tabloid.edisi ? <span>{tabloid.edisi}</span> : null}
            <span>{formatTanggal(tabloid.tanggalTerbit)}</span>
            {ukuran ? <span>{ukuran}</span> : null}
          </div>
          <h1 className={styles.detailTitle} style={{ marginTop: "var(--sp-12)" }}>
            {tabloid.judul}
          </h1>
          {tabloid.deskripsiSingkat ? (
            <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
              {tabloid.deskripsiSingkat}
            </p>
          ) : null}
        </div>
        <div className={styles.detailPoster}>
          <Gambar
            media={tabloid.sampul}
            alt={teksAltMedia(tabloid.sampul, `Sampul ${tabloid.judul}`)}
            ukuran="hero"
            isi={false}
            className={styles.photo}
            labelKosong="Foto menyusul"
          />
        </div>
      </div>

      <section className={styles.section} aria-labelledby="judul-pembaca">
        <h2 id="judul-pembaca" className={styles.sectionTitle}>
          Baca di situs
        </h2>
        <div className={styles.reader} style={{ marginTop: "var(--sp-16)" }}>
          {urlPdf ? (
            <PembacaPdf url={urlPdf} judul={tabloid.judul} ukuran={ukuran} />
          ) : (
            <div className={styles.readerBox}>
              <div className={styles.readerFallback}>
                <p className={styles.emptyTitle}>Berkas PDF belum tersedia</p>
                <p className={styles.emptyText}>
                  Admin belum mengunggah berkas untuk edisi ini. Silakan kembali
                  lagi nanti.
                </p>
              </div>
            </div>
          )}

          <div className={styles.readerActions}>
            {urlPdf ? (
              <>
                <a
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  href={urlPdf}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unduh PDF{ukuran ? ` (${ukuran})` : ""}
                </a>
                <a
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  href={urlPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka di tab baru
                </a>
              </>
            ) : null}
          </div>
          <p className={styles.small}>
            Pembaca PDF dimuat hanya saat Anda memintanya agar kuota data lebih
            hemat. Bila pembaca tidak muncul, tombol unduh tetap bisa dipakai.
          </p>
        </div>
      </section>

      <Link className={styles.textLink} href="/e-tabloid">
        ← Kembali ke daftar e-tabloid
      </Link>
    </>
  );
}
