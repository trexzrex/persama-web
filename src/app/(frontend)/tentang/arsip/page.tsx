import type { Metadata } from "next";
import Link from "next/link";

import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { ambilDaftarPeriode, ambilPeriodeAktif } from "@/lib/content";
import { tahunPeriode } from "@/lib/format";

export const metadata: Metadata = {
  title: "Arsip kepengurusan",
  description:
    "Daftar periode kepengurusan PERSAMA SMK-SMAK Makassar. Periode aktif ditandai.",
};

export default async function ArsipPage() {
  const [periode, aktif] = await Promise.all([
    ambilDaftarPeriode(),
    ambilPeriodeAktif(),
  ]);

  return (
    <>
      <p className={styles.eyebrow}>Arsip</p>
      <h1 className={styles.title} style={{ maxWidth: "18ch" }}>
        Arsip kepengurusan
      </h1>
      <p className={styles.lead} style={{ marginTop: "var(--sp-16)" }}>
        Setiap periode menyimpan struktur pengurus inti dan divisinya sendiri.
        Event dan e-tabloid lama tetap tersedia di halaman masing-masing.
      </p>

      <section className={styles.section} aria-label="Daftar periode">
        {periode.length > 0 ? (
          <div className={`${styles.grid} ${styles.grid2}`}>
            {periode.map((item) => (
              <article className={styles.divisiCard} key={item.id}>
                <Link
                  className={styles.cardLink}
                  href={`/tentang/arsip/${item.id}`}
                >
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      {item.aktif ? (
                        <span className={`${styles.badge} ${styles.badgeRuby}`}>
                          Aktif
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeSoft}`}>
                          Arsip
                        </span>
                      )}
                      <span>
                        {item.tahunMulai}–{item.tahunSelesai}
                      </span>
                    </div>
                    <h2 className={styles.listTitle}>{tahunPeriode(item.nama)}</h2>
                    {item.keterangan ? (
                      <p className={styles.cardText}>{item.keterangan}</p>
                    ) : null}
                    <span className={styles.cardFooter}>
                      Lihat kepengurusan →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <KeadaanKosong
            judul="Belum ada periode"
            teks="Admin dapat membuat periode kepengurusan pertama lewat panel admin. Setelah itu, arsip akan tampil di sini."
            aksiHref="/tentang"
            aksiLabel="Kembali ke Tentang PERSAMA"
            jenis="umum"
          />
        )}
      </section>

      {aktif ? (
        <p className={styles.small}>
          Periode bawaan saat ini: <strong>{aktif.nama}</strong>.
        </p>
      ) : null}
    </>
  );
}
