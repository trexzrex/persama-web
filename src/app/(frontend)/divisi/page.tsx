import type { Metadata } from "next";
import Link from "next/link";

import { KartuDivisi } from "@/components/site/cards";
import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { ambilDivisi, ambilPengurus, ambilPeriodeAktif } from "@/lib/content";
import { ringkasanDivisi } from "@/lib/divisi";

export const metadata: Metadata = {
  title: "Divisi",
  description:
    "Tujuh divisi PERSAMA SMK-SMAK Makassar: Humas, Diklat, Dana dan Usaha, Kerohanian Islam, Kerohanian Kristen, Seni dan Olahraga, Pemerhati Lingkungan.",
};

export default async function DivisiPage() {
  const periode = await ambilPeriodeAktif();
  const [divisi, pengurus] = await Promise.all([
    ambilDivisi(periode?.id),
    ambilPengurus(periode?.id),
  ]);

  return (
    <>
      <p className={styles.eyebrow}>Bidang</p>
      <h1 className={styles.title} style={{ maxWidth: "16ch" }}>
        Divisi PERSAMA
      </h1>
      <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
        Tujuh bidang yang menjalankan program kerja PERSAMA
        {periode?.nama ? ` pada periode ${periode.nama}` : ""}. Pilih satu untuk
        melihat tugas, koordinator, anggota, dan program kerjanya.
      </p>

      <section className={styles.section} aria-label="Daftar divisi">
        {divisi.length > 0 ? (
          <div className={`${styles.grid} ${styles.grid3}`}>
            {divisi.map((item) => {
              const ringkas = ringkasanDivisi(pengurus, item.id);
              return (
                <KartuDivisi
                  key={item.id}
                  divisi={item}
                  koordinator={ringkas.koordinator}
                  jumlahAnggota={ringkas.jumlahAnggota}
                />
              );
            })}
          </div>
        ) : (
          <KeadaanKosong
            judul="Data divisi belum tersedia"
            teks="Admin belum mengisi divisi untuk periode aktif. Setelah diisi, tujuh kartu divisi akan tampil di sini."
            aksiHref="/tentang"
            aksiLabel="Kenali PERSAMA"
            jenis="umum"
          />
        )}
      </section>

      <section className={styles.sectionTight} aria-label="Arsip kepengurusan">
        <div className={styles.callout}>
          <div>
            <p className={styles.calloutTitle}>Melihat periode sebelumnya?</p>
            <p className={styles.small}>
              Struktur pengurus inti dan divisi tiap periode disimpan di arsip.
            </p>
          </div>
          <Link className={`${styles.button} ${styles.buttonSecondary}`} href="/tentang/arsip">
            Buka arsip kepengurusan
          </Link>
        </div>
      </section>
    </>
  );
}
