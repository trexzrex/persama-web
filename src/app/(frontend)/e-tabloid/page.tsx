import type { Metadata } from "next";

import { HalamanPublik, PembukaHalaman } from "@/components/site/HalamanPublik";
import { KartuTabloid } from "@/components/site/cards";
import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { ambilTabloid } from "@/lib/content";

export const metadata: Metadata = {
  title: "E-Tabloid",
  description:
    "Edisi tabloid digital PERSAMA SMK-SMAK Makassar. Baca di situs atau unduh berkas PDF tanpa login.",
};

export default async function TabloidPage() {
  const tabloid = await ambilTabloid();

  return (
    <HalamanPublik jenis="tabloid">
      <PembukaHalaman label="Ruang publikasi" judul="E-Tabloid PERSAMA" keterangan="Baca di situs atau unduh PDF · Tanpa login">
        <p>Cerita, gagasan, dan kabar dalam setiap edisi. Jelajahi terbitan digital PERSAMA, mulai dari edisi terbaru.</p>
      </PembukaHalaman>

      <section className={styles.section} aria-label="Daftar e-tabloid">
        {tabloid.length > 0 ? (
          <div className={styles.grid}>
            {tabloid.map((item) => (
              <KartuTabloid key={item.id} tabloid={item} />
            ))}
          </div>
        ) : (
          <KeadaanKosong
            judul="E-Tabloid belum terbit"
            teks="Edisi pertama akan tampil di sini setelah dipublikasikan, lengkap dengan tanggal terbit dan ukuran berkas."
            aksiHref="/"
            aksiLabel="Kembali ke beranda"
            jenis="tabloid"
          />
        )}
      </section>
    </HalamanPublik>
  );
}
