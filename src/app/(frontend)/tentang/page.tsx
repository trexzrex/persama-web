import type { Metadata } from "next";
import Link from "next/link";

import {
  ambilPengaturan,
  ambilPengurus,
  ambilPeriodeAktif,
} from "@/lib/content";
import styles from "./tentang.module.css";

export const metadata: Metadata = {
  title: "Tentang PERSAMA",
  description:
    "Profil organisasi, visi, misi, penanggung jawab, dan pembina PERSAMA SMK-SMAK Makassar.",
};

export default async function TentangPage() {
  const [pengaturan, periode] = await Promise.all([
    ambilPengaturan(),
    ambilPeriodeAktif(),
  ]);

  const pembina = await ambilPengurus(periode?.id, {
    kelompok: ["penanggung_jawab", "pembina", "pengarah"],
  });

  const misi = (pengaturan.misi ?? []).filter((item) => item.poin?.trim());
  const pengenalan = pengaturan.pengenalan?.trim();
  const visi = pengaturan.visi?.trim();
  const nama = pengaturan.namaSitus?.trim() || "PERSAMA";

  return (
    <div className={styles.catatan}>
      <header className={styles.pembuka}>
        <div className={styles.masthead}>
          <h1 className={styles.judul}><span>Tentang</span>{" "}{nama}</h1>
          <div className={styles.identitas}>
            <p className={styles.label}>Profil organisasi</p>
            <p className={styles.sekolah}>SMK-SMAK Makassar</p>
            {periode?.nama ? <p>Periode {periode.nama}</p> : null}
          </div>
        </div>
        {pengenalan ? (
          <div className={styles.pengenalan}>
            {pengenalan.split(/\n\s*\n/).map((paragraf, indeks) => (
              <p key={indeks}>{paragraf.trim()}</p>
            ))}
          </div>
        ) : null}
      </header>

      {visi || misi.length > 0 ? (
        <section className={styles.bagian} aria-labelledby="judul-visi-misi">
          <h2 id="judul-visi-misi">Visi dan misi</h2>
          <div className={visi && misi.length > 0 ? styles.arah : styles.arahTunggal}>
            {visi ? (
              <div className={styles.visi}>
                <h3 className={styles.label}>Visi</h3>
                <p>{visi}</p>
              </div>
            ) : null}
            {misi.length > 0 ? (
              <div className={styles.misi}>
                <h3 className={styles.label}>Misi</h3>
                <ol>
                  {misi.map((item, indeks) => <li key={item.id ?? indeks}>{item.poin?.trim()}</li>)}
                </ol>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {pembina.length > 0 ? (
        <section className={`${styles.bagian} ${styles.pembina}`} aria-labelledby="judul-pembina">
          <h2 id="judul-pembina">Penanggung jawab dan pembina</h2>
          <ul className={styles.daftarPembina} role="list">
            {pembina.map((orang) => (
              <li key={orang.id}>
                <span>{orang.jabatan}</span>
                {orang.nama?.trim() ? <strong>{orang.nama}</strong> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className={styles.lanjutan} aria-label="Kepengurusan PERSAMA">
        <p className={styles.label}>Kepengurusan PERSAMA</p>
        <div>
          <Link href="/inti-persama">Kenali INTI PERSAMA <span aria-hidden="true">→</span></Link>
          <Link href="/tentang/arsip">Arsip kepengurusan <span aria-hidden="true">→</span></Link>
        </div>
      </nav>
    </div>
  );
}
