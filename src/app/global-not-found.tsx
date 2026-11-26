import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import Link from "next/link";

import styles from "@/components/site/site.module.css";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan · PERSAMA",
  description: "Halaman yang Anda cari tidak ditemukan di situs PERSAMA.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="id" className={`${poppins.variable} ${jakarta.variable}`}>
      <body>
        <div className={styles.page}>
          <main className={styles.main} id="utama" tabIndex={-1}>
            <div className={styles.notFound}>
              <p className={styles.kode}>404</p>
              <h1 className={styles.sectionTitle}>Halaman tidak ditemukan</h1>
              <p className={styles.lead}>
                Alamat yang Anda buka mungkin salah ketik, sudah dipindahkan,
                atau belum pernah ada. Silakan kembali ke beranda atau jelajahi
                bagian lain situs.
              </p>
              <div className={styles.heroActions}>
                <Link
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  href="/"
                >
                  Kembali ke beranda
                </Link>
                <Link
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  href="/divisi"
                >
                  Lihat divisi
                </Link>
              </div>
              <nav aria-label="Menu" className={styles.socialList}>
                <Link className={styles.socialLink} href="/tentang">
                  Tentang PERSAMA
                </Link>
                <Link className={styles.socialLink} href="/event">
                  Event
                </Link>
                <Link className={styles.socialLink} href="/e-tabloid">
                  E-Tabloid
                </Link>
                <Link className={styles.socialLink} href="/ekstrakurikuler">
                  Ekstrakurikuler
                </Link>
              </nav>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
