import type { Metadata } from "next";
import Link from "next/link";

import { EventPublik, HalamanPublik, PembukaHalaman } from "@/components/site/HalamanPublik";
import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { ambilEvent } from "@/lib/content";
import { statusEvent } from "@/lib/format";
import type { EventItem } from "@/lib/types";

const PER_HALAMAN = 9;

type Props = {
  searchParams: Promise<{ halaman?: string }>;
};

export const metadata: Metadata = {
  title: "Event",
  description:
    "Agenda dan dokumentasi kegiatan PERSAMA SMK-SMAK Makassar: yang akan datang dan yang sudah selesai.",
};

function urutEvent(events: EventItem[]): EventItem[] {
  const akanDatang = events
    .filter((event) => statusEvent(event) !== "selesai")
    .sort(
      (a, b) =>
        new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime(),
    );
  const selesai = events
    .filter((event) => statusEvent(event) === "selesai")
    .sort(
      (a, b) =>
        new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime(),
    );
  return [...akanDatang, ...selesai];
}

export default async function EventPage({ searchParams }: Props) {
  const { halaman: halamanParam } = await searchParams;
  const semua = urutEvent(await ambilEvent());
  const totalHalaman = Math.max(1, Math.ceil(semua.length / PER_HALAMAN));
  const diminta = Number(halamanParam);
  const halamanAktif =
    Number.isInteger(diminta) && diminta >= 1 && diminta <= totalHalaman
      ? diminta
      : 1;
  const mulai = (halamanAktif - 1) * PER_HALAMAN;
  const tampil = semua.slice(mulai, mulai + PER_HALAMAN);
  const akanDatang = tampil.filter(
    (event) => statusEvent(event) !== "selesai",
  );
  const selesai = tampil.filter((event) => statusEvent(event) === "selesai");
  const halaman = (nomor: number) =>
    nomor === 1 ? "/event" : `/event?halaman=${nomor}`;

  return (
    <HalamanPublik jenis="event">
      <PembukaHalaman judul="Event PERSAMA" keterangan={`${semua.length} kegiatan dalam arsip`}>
        <p>Agenda dan dokumentasi kegiatan PERSAMA SMK-SMAK Makassar.</p>
      </PembukaHalaman>

      {semua.length === 0 ? (
        <section className={styles.section} aria-label="Keadaan kosong">
          <KeadaanKosong
            judul="Belum ada event"
            teks="Event PERSAMA akan muncul di sini begitu panitia menambahkannya. Sementara itu, lihat divisi dan ekstrakurikuler dulu."
            aksiHref="/divisi"
            aksiLabel="Jelajahi divisi →"
            jenis="event"
          />
        </section>
      ) : (
        <>
          {akanDatang.length > 0 ? (
            <section className={styles.section} aria-labelledby="judul-akan-datang">
              <h2 id="judul-akan-datang" className={styles.sectionTitle}>
                Akan datang
              </h2>
              <div
                className={`${styles.grid} ${styles.grid3}`}
                style={{ marginTop: "var(--sp-16)" }}
              >
                {akanDatang.map((event) => (
                  <EventPublik key={event.id} event={event} />
                ))}
              </div>
            </section>
          ) : null}

          {selesai.length > 0 ? (
            <section className={styles.section} aria-labelledby="judul-selesai">
              <h2 id="judul-selesai" className={styles.sectionTitle}>
                Selesai
              </h2>
              <div
                className={`${styles.grid} ${styles.grid3}`}
                style={{ marginTop: "var(--sp-16)" }}
              >
                {selesai.map((event) => (
                  <EventPublik key={event.id} event={event} />
                ))}
              </div>
            </section>
          ) : null}

          {totalHalaman > 1 ? (
            <nav className={styles.pagination} aria-label="Halaman event">
              <Link
                className={`${styles.button} ${styles.buttonSecondary} ${halamanAktif === 1 ? styles.pageLinkNonaktif : ""}`}
                href={halaman(Math.max(1, halamanAktif - 1))}
                aria-disabled={halamanAktif === 1}
              >
                ← Sebelumnya
              </Link>
              <div className={styles.pageLinks}>
                {Array.from({ length: totalHalaman }, (_, indeks) => indeks + 1).map(
                  (nomor) => (
                    <Link
                      key={nomor}
                      className={`${styles.pageLink} ${nomor === halamanAktif ? styles.pageLinkAktif : ""}`}
                      href={halaman(nomor)}
                      aria-current={nomor === halamanAktif ? "page" : undefined}
                    >
                      {nomor}
                    </Link>
                  ),
                )}
              </div>
              <Link
                className={`${styles.button} ${styles.buttonSecondary} ${halamanAktif === totalHalaman ? styles.pageLinkNonaktif : ""}`}
                href={halaman(Math.min(totalHalaman, halamanAktif + 1))}
                aria-disabled={halamanAktif === totalHalaman}
              >
                Berikutnya →
              </Link>
            </nav>
          ) : null}

          <p className={styles.small} style={{ marginTop: "var(--sp-16)" }}>
            Menampilkan {mulai + 1}-{Math.min(mulai + PER_HALAMAN, semua.length)} dari{" "}
            {semua.length} event.
          </p>
        </>
      )}
    </HalamanPublik>
  );
}
