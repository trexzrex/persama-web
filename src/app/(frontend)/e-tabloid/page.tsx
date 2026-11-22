import type { Metadata } from "next";

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
    <>
      <p className={styles.eyebrow}>Publikasi</p>
      <h1 className={styles.title} style={{ maxWidth: "14ch" }}>
        E-Tabloid
      </h1>
      <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
        Kumpulan edisi tabloid digital PERSAMA, dari yang terbaru. Semua edisi
        bisa dibaca langsung di situs atau diunduh tanpa login.
      </p>

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
    </>
  );
}
