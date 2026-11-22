"use client";

import Link from "next/link";

import styles from "@/components/site/site.module.css";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.notFound}>
      <p className={styles.kode}>!</p>
      <h1 className={styles.sectionTitle}>Halaman gagal dimuat</h1>
      <p className={styles.lead}>
        Ada gangguan saat mengambil konten. Coba muat ulang halaman ini. Bila
        masih gagal, kembali ke beranda atau hubungi pengurus PERSAMA.
      </p>
      <div className={styles.heroActions}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={() => reset()}
          type="button"
        >
          Coba lagi
        </button>
        <Link className={`${styles.button} ${styles.buttonSecondary}`} href="/">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
