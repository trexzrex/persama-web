import type { Metadata } from "next";
import Link from "next/link";

import { HalamanPublik, PembukaHalaman } from "@/components/site/HalamanPublik";
import styles from "@/components/site/site.module.css";
import {
  ambilPengaturan,
  ambilPengurus,
  ambilPeriodeAktif,
} from "@/lib/content";

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
  const pengenalanResmi = pengaturan.pengenalan?.trim();
  const pengenalan = pengenalanResmi || "Profil organisasi belum tersedia.";

  return (
    <HalamanPublik jenis="tentang">
      <PembukaHalaman judul={`Tentang ${pengaturan.namaSitus?.trim() || "PERSAMA"}`} keterangan={periode?.nama ? `Kepengurusan periode ${periode.nama}` : undefined}>
        <p>Profil dan kepengurusan PERSAMA SMK-SMAK Makassar.</p>
      </PembukaHalaman>

      {pengenalan ? (
        <section className={styles.section} aria-labelledby="judul-pengertian">
          <h2 id="judul-pengertian" className={styles.sectionTitle}>
            Pengertian PERSAMA
          </h2>
          <div className={styles.prose} style={{ marginTop: "var(--sp-16)" }}>
            {pengenalan
              .split(/\n{2,}/)
              .filter((paragraf) => paragraf.trim())
              .map((paragraf, indeks) => (
                <p key={indeks}>{paragraf.trim()}</p>
              ))}
          </div>
        </section>
      ) : null}

      {pengaturan.visi?.trim() || misi.length > 0 ? (
        <section className={styles.section} aria-labelledby="judul-visi-misi">
          <h2 id="judul-visi-misi" className={styles.sectionTitle}>
            Visi dan misi
          </h2>
          <div className={styles.visiMisi} style={{ marginTop: "var(--sp-16)" }}>
            {pengaturan.visi?.trim() ? (
              <div className={styles.programItem}>
                <p className={styles.eyebrow}>Visi</p>
                <p>{pengaturan.visi}</p>
              </div>
            ) : null}
            {misi.length > 0 ? (
              <div className={styles.programItem}>
                <p className={styles.eyebrow}>Misi</p>
                <ul className={styles.checklist}>
                  {misi.map((item, indeks) => (
                    <li key={item.id ?? indeks}>{item.poin}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {pembina.length > 0 ? (
        <section className={styles.section} aria-labelledby="judul-pembina">
          <h2 id="judul-pembina" className={styles.sectionTitle}>
            Penanggung jawab dan pembina
          </h2>
          <div className={styles.roles}>
            {pembina.map((orang) => (
              <div className={styles.roleRow} key={orang.id}>
                <span className={styles.roleTitle}>{orang.jabatan}</span>
                {orang.nama?.trim() ? (
                  <span className={styles.roleName}>{orang.nama}</span>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <nav className={styles.sectionHead} aria-label="Kepengurusan PERSAMA">
        <Link className={styles.textLink} href="/inti-persama">Kenali INTI PERSAMA →</Link>
        <Link className={styles.textLink} href="/tentang/arsip">Arsip kepengurusan →</Link>
      </nav>

    </HalamanPublik>
  );
}
