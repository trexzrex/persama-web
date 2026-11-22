import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { KartuDivisi, KartuOrang } from "@/components/site/cards";
import styles from "@/components/site/site.module.css";
import {
  ambilDivisi,
  ambilPengurus,
  ambilPeriodeById,
} from "@/lib/content";
import { ringkasanDivisi } from "@/lib/divisi";

type Props = {
  params: Promise<{ periode: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { periode } = await params;
  const id = Number(periode);
  if (!Number.isInteger(id)) return { title: "Arsip kepengurusan" };
  const data = await ambilPeriodeById(id);
  if (!data) return { title: "Arsip kepengurusan" };
  return {
    title: `Kepengurusan ${data.nama}`,
    description: `Struktur pengurus inti dan divisi PERSAMA periode ${data.nama}.`,
  };
}

export default async function ArsipPeriodePage({ params }: Props) {
  const { periode: kode } = await params;
  const id = Number(kode);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const periode = await ambilPeriodeById(id);
  if (!periode) notFound();

  const [inti, divisi, pengurus] = await Promise.all([
    ambilPengurus(periode.id, { kelompok: ["pengurus_inti"] }),
    ambilDivisi(periode.id),
    ambilPengurus(periode.id),
  ]);

  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Remah roti">
        <Link href="/tentang">Tentang PERSAMA</Link>
        <span aria-hidden="true">/</span>
        <Link href="/tentang/arsip">Arsip kepengurusan</Link>
      </nav>

      <p className={styles.eyebrow}>Arsip</p>
      <h1 className={styles.title} style={{ maxWidth: "20ch" }}>
        Kepengurusan {periode.nama}
      </h1>
      <div className={styles.detailMeta}>
        <span>
          {periode.tahunMulai}–{periode.tahunSelesai}
        </span>
        {periode.aktif ? (
          <span className={`${styles.badge} ${styles.badgeRuby}`}>
            Periode aktif
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeSoft}`}>Arsip</span>
        )}
      </div>
      {periode.keterangan ? (
        <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
          {periode.keterangan}
        </p>
      ) : null}

      <section className={styles.section} aria-labelledby="judul-inti-arsip">
        <h2 id="judul-inti-arsip" className={styles.sectionTitle}>
          Pengurus inti
        </h2>
        <div className={styles.people} style={{ marginTop: "var(--sp-16)" }}>
          {inti.length > 0 ? (
            inti.map((orang) => <KartuOrang key={orang.id} orang={orang} />)
          ) : (
            <p className={styles.small}>Data pengurus inti periode ini belum ada.</p>
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="judul-divisi-arsip">
        <h2 id="judul-divisi-arsip" className={styles.sectionTitle}>
          Divisi
        </h2>
        <div
          className={`${styles.grid} ${styles.grid3}`}
          style={{ marginTop: "var(--sp-16)" }}
        >
          {divisi.length > 0 ? (
            divisi.map((item) => {
              const ringkas = ringkasanDivisi(pengurus, item.id);
              return (
                <KartuDivisi
                  key={item.id}
                  divisi={item}
                  koordinator={ringkas.koordinator}
                  jumlahAnggota={ringkas.jumlahAnggota}
                />
              );
            })
          ) : (
            <p className={styles.small}>Data divisi periode ini belum ada.</p>
          )}
        </div>
      </section>

      <Link className={styles.textLink} href="/tentang/arsip">
        ← Kembali ke daftar periode
      </Link>
    </>
  );
}
