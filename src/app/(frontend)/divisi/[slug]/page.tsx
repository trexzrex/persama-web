import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { KartuEvent, KartuOrang } from "@/components/site/cards";
import { Gambar } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import {
  ambilDivisiBySlug,
  ambilEventDivisi,
  ambilPengurus,
  teksAltMedia,
} from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const divisi = await ambilDivisiBySlug(slug);
  if (!divisi) return { title: "Divisi tidak ditemukan" };
  return {
    title: divisi.nama,
    description:
      divisi.deskripsiSingkat?.trim() ||
      `Profil divisi ${divisi.nama} PERSAMA SMK-SMAK Makassar.`,
  };
}

export default async function DivisiDetailPage({ params }: Props) {
  const { slug } = await params;
  const divisi = await ambilDivisiBySlug(slug);
  if (!divisi) notFound();

  const periodeId =
    divisi.periode && typeof divisi.periode === "object"
      ? divisi.periode.id
      : typeof divisi.periode === "number"
        ? divisi.periode
        : null;

  const [pengurus, eventTerkait] = await Promise.all([
    ambilPengurus(periodeId, { divisiId: divisi.id }),
    ambilEventDivisi(divisi.id),
  ]);

  const koordinator = pengurus.filter(
    (orang) => orang.kelompok === "koordinator_divisi",
  );
  const anggota = pengurus.filter((orang) => orang.kelompok === "anggota_divisi");
  const sisa = pengurus.filter(
    (orang) =>
      orang.kelompok !== "koordinator_divisi" &&
      orang.kelompok !== "anggota_divisi",
  );
  const tugas = (divisi.tugasTanggungJawab ?? []).filter((item) => item.poin?.trim());
  const program = (divisi.programKerja ?? []).filter((item) => item.judul?.trim());

  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Remah roti">
        <Link href="/divisi">Divisi</Link>
        <span aria-hidden="true">/</span>
        <span>{divisi.nama}</span>
      </nav>

      <div className={styles.detailHead}>
        <div>
          <p className={styles.eyebrow}>Divisi</p>
          <h1 className={styles.detailTitle}>{divisi.nama}</h1>
          {divisi.deskripsiSingkat ? (
            <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
              {divisi.deskripsiSingkat}
            </p>
          ) : null}
          {periodeId ? (
            <div className={styles.detailMeta}>
              <span>Periode {typeof divisi.periode === "object" && divisi.periode ? divisi.periode.nama : ""}</span>
            </div>
          ) : null}
        </div>
        <div className={styles.detailPoster}>
          <Gambar
            media={divisi.fotoGrup}
            alt={teksAltMedia(divisi.fotoGrup, `Foto grup ${divisi.nama}`)}
            ukuran="hero"
            isi={false}
            className={styles.photo}
            labelKosong="Foto menyusul"
          />
        </div>
      </div>

      <div className={styles.split}>
        {tugas.length > 0 ? (
          <section aria-labelledby="judul-tugas">
            <h2 id="judul-tugas" className={styles.groupTitle}>
              Tugas dan tanggung jawab
            </h2>
            <ul className={styles.checklist}>
              {tugas.map((item, indeks) => (
                <li key={item.id ?? indeks}>{item.poin}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {program.length > 0 ? (
          <section aria-labelledby="judul-program">
            <h2 id="judul-program" className={styles.groupTitle}>
              Program kerja
            </h2>
            <ul className={styles.programList}>
              {program.map((item, indeks) => (
                <li className={styles.programItem} key={item.id ?? indeks}>
                  <p className={styles.programTitle}>{item.judul}</p>
                  {item.keterangan ? (
                    <p className={styles.small}>{item.keterangan}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {koordinator.length > 0 || anggota.length > 0 || sisa.length > 0 ? (
        <section className={styles.section} aria-labelledby="judul-tim">
          <h2 id="judul-tim" className={styles.sectionTitle}>
            Koordinator dan anggota
          </h2>
          {koordinator.length > 0 ? (
            <>
              <h3 className={styles.groupTitle} style={{ marginTop: "var(--sp-16)" }}>
                Koordinator
              </h3>
              <div className={styles.people}>
                {koordinator.map((orang) => (
                  <KartuOrang key={orang.id} orang={orang} />
                ))}
              </div>
            </>
          ) : null}
          {anggota.length > 0 ? (
            <>
              <h3 className={styles.groupTitle} style={{ marginTop: "var(--sp-24)" }}>
                Anggota
              </h3>
              <div className={styles.people}>
                {anggota.map((orang) => (
                  <KartuOrang key={orang.id} orang={orang} />
                ))}
              </div>
            </>
          ) : null}
          {sisa.length > 0 ? (
            <div className={styles.people} style={{ marginTop: "var(--sp-16)" }}>
              {sisa.map((orang) => (
                <KartuOrang key={orang.id} orang={orang} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {eventTerkait.length > 0 ? (
        <section className={styles.section} aria-labelledby="judul-event-divisi">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="judul-event-divisi" className={styles.sectionTitle}>
                Event terkait
              </h2>
            </div>
            <Link className={styles.textLink} href="/event">
              Semua event →
            </Link>
          </div>
          <div className={`${styles.grid} ${styles.grid3}`}>
            {eventTerkait.map((event) => (
              <KartuEvent key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      <Link className={styles.textLink} href="/divisi">
        ← Kembali ke daftar divisi
      </Link>
    </>
  );
}
