import type { ReactNode } from "react";
import styles from "./halaman-publik.module.css";

export function HalamanPublik({ jenis, children }: {
  jenis: "divisi" | "event" | "tabloid" | "tentang";
  children: ReactNode;
}) {
  return <div className={`${styles.halaman} ${styles[jenis]}`}>{children}</div>;
}

export function PembukaHalaman({ label, judul, children, keterangan }: {
  label: string;
  judul: string;
  children?: ReactNode;
  keterangan?: string;
}) {
  return (
    <header className={styles.pembuka}>
      <div className={styles.pembukaIsi}>
        <p className={styles.label}>{label}</p>
        <h1>{judul}</h1>
        {children ? <div className={styles.pengantar}>{children}</div> : null}
        {keterangan ? <p className={styles.keterangan}>{keterangan}</p> : null}
      </div>
      <div className={styles.cap} aria-hidden="true"><span>PERSAMA</span><span>SMK-SMAK Makassar</span></div>
    </header>
  );
}
