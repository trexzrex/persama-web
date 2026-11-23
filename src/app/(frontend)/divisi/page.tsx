import type { Metadata } from "next";
import Link from "next/link";

import { HalamanPublik, PembukaHalaman } from "@/components/site/HalamanPublik";
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
    <HalamanPublik jenis="divisi">
      <PembukaHalaman label="Bidang organisasi" judul="Divisi PERSAMA" keterangan={periode?.nama ? `Periode ${periode.nama}` : undefined}>
        <p>Tujuh bidang, satu semangat kebersamaan. Kenali tugas, koordinator, anggota, dan program kerja setiap divisi PERSAMA.</p>
      </PembukaHalaman>

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
    </HalamanPublik>
  );
}
