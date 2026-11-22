"use client";

import { useState } from "react";

import styles from "./site.module.css";

/**
 * Pembaca PDF bertahap: berkas baru diunduh setelah pengunjung menekan
 * "Muat pembaca PDF", sehingga halaman tidak memakai kuota data lebih awal.
 * Tombol unduh tetap berada di luar komponen ini dan selalu tersedia.
 */
export function PembacaPdf({
  url,
  judul,
  ukuran,
}: {
  url: string;
  judul: string;
  ukuran?: string | null;
}) {
  const [dimuat, setDimuat] = useState(false);

  if (dimuat) {
    return (
      <div className={styles.readerBox}>
        <object
          data={url}
          type="application/pdf"
          className={styles.readerFrame}
          aria-label={`Pembaca PDF ${judul}`}
        >
          <div className={styles.readerFallback}>
            <p className={styles.emptyTitle}>
              Pembaca PDF tidak tersedia di perangkat ini
            </p>
            <p className={styles.emptyText}>
              Gunakan tombol unduh di bawah untuk membuka e-tabloid dengan
              aplikasi PDF pilihan Anda.
            </p>
            <a
              className={`${styles.button} ${styles.buttonPrimary}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka berkas PDF
            </a>
          </div>
        </object>
      </div>
    );
  }

  return (
    <div className={`${styles.readerBox} ${styles.readerIntro}`}>
      <p className={styles.emptyTitle}>Pembaca PDF</p>
      <p className={styles.emptyText}>
        Pembaca dimuat hanya saat diminta agar kuota data lebih hemat
        {ukuran ? ` (${ukuran})` : ""}.
      </p>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonPrimary}`}
        onClick={() => setDimuat(true)}
      >
        Muat pembaca PDF
      </button>
    </div>
  );
}
