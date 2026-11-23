import type { Metadata } from "next";
import Link from "next/link";

import { HalamanPublik, PembukaHalaman, PengurusPublik } from "@/components/site/HalamanPublik";
import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import {
  ambilPengaturan,
  ambilPengurus,
  ambilPeriodeAktif,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Tentang PERSAMA",
  description:
    "Pengertian, visi, misi, penanggung jawab, pembina, dan pengurus inti PERSAMA SMK-SMAK Makassar.",
};

export default async function TentangPage() {
  const [pengaturan, periode] = await Promise.all([
    ambilPengaturan(),
    ambilPeriodeAktif(),
  ]);

  const [pembina, inti] = await Promise.all([
    ambilPengurus(periode?.id, {
      kelompok: ["penanggung_jawab", "pembina", "pengarah"],
    }),
    ambilPengurus(periode?.id, { kelompok: ["pengurus_inti"] }),
  ]);

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

      <section className={styles.section} aria-labelledby="judul-inti">
        <div className={styles.sectionHead}>
          <div>
            <h2 id="judul-inti" className={styles.sectionTitle}>
              Pengurus inti
            </h2>
            {periode?.nama ? (
              <p className={styles.small}>Periode {periode.nama}</p>
            ) : null}
          </div>
          <Link className={styles.textLink} href="/tentang/arsip">
            Arsip kepengurusan →
          </Link>
        </div>
        {inti.length > 0 ? (
          <div className={styles.people}>
            {inti.map((orang) => (
              <PengurusPublik key={orang.id} orang={orang} />
            ))}
          </div>
        ) : (
          <KeadaanKosong
            judul="Struktur pengurus belum diisi"
            teks="Admin dapat menambahkan pengurus inti untuk periode aktif lewat panel admin."
            aksiHref="/tentang/arsip"
            aksiLabel="Lihat arsip periode"
            jenis="umum"
          />
        )}
      </section>

    </HalamanPublik>
  );
}
