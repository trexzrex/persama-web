import Link from "next/link";

import styles from "@/components/site/site.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <p className={styles.kode}>404</p>
      <h1 className={styles.sectionTitle}>Halaman tidak ditemukan</h1>
      <p className={styles.lead}>
        Alamat yang Anda buka mungkin salah ketik, sudah dipindahkan, atau belum
        pernah ada. Silakan kembali ke beranda atau jelajahi bagian lain situs.
      </p>
      <div className={styles.heroActions}>
        <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/">
          Kembali ke beranda
        </Link>
        <Link className={`${styles.button} ${styles.buttonSecondary}`} href="/divisi">
          Lihat divisi
        </Link>
      </div>
    </div>
  );
}
