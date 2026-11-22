import type { Metadata } from "next";
import Link from "next/link";

import { KartuEkskul } from "@/components/site/cards";
import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { ambilEkstrakurikuler } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ekstrakurikuler",
  description:
    "Daftar ekstrakurikuler di SMK-SMAK Makassar yang dikelola PERSAMA. Kartu saja, tanpa pendaftaran.",
};

export default async function EkstrakurikulerPage() {
  const ekskul = await ambilEkstrakurikuler();

  return (
    <>
      <p className={styles.eyebrow}>Minat</p>
      <h1 className={styles.title} style={{ maxWidth: "18ch" }}>
        Ekstrakurikuler
      </h1>
      <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
        Kegiatan pengembangan minat di luar jam pelajaran. Halaman ini hanya
        menampilkan kartu; pendaftaran tidak dilakukan lewat situs.
      </p>

      <section className={styles.section} aria-label="Daftar ekstrakurikuler">
        {ekskul.length > 0 ? (
          <div className={styles.grid}>
            {ekskul.map((item) => (
              <KartuEkskul key={item.id} ekskul={item} />
            ))}
          </div>
        ) : (
          <KeadaanKosong
            judul="Data ekstrakurikuler belum diisi"
            teks="Admin dapat menambahkan ekstrakurikuler lewat panel. Kartunya akan muncul otomatis di sini."
            aksiHref="/divisi"
            aksiLabel="Jelajahi divisi →"
            jenis="ekskul"
          />
        )}
      </section>

      <div className={styles.callout}>
        <div>
          <p className={styles.calloutTitle}>Ingin tahu kegiatan lain?</p>
          <p className={styles.small}>
            Lihat agenda event PERSAMA atau jelajahi divisi yang menjalankan
            program kerja.
          </p>
        </div>
        <div className={styles.readerActions}>
          <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/event">
            Lihat event
          </Link>
          <Link className={`${styles.button} ${styles.buttonSecondary}`} href="/divisi">
            Lihat divisi
          </Link>
        </div>
      </div>
    </>
  );
}
