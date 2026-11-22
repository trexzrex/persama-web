import styles from "@/components/site/site.module.css";

export default function Loading() {
  return (
    <div className={styles.notFound} role="status" aria-live="polite">
      <p className={styles.kode} aria-hidden="true">
        …
      </p>
      <p className={styles.emptyTitle}>Memuat halaman</p>
      <p className={styles.lead}>
        Sebentar, kami sedang mengambil konten terbaru dari server.
      </p>
    </div>
  );
}
