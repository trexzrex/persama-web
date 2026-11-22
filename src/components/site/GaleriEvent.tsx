"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { FotoGaleri, Media, MediaRel } from "@/lib/types";

import styles from "./site.module.css";
import { FotoKosong, Gambar } from "./ui";

function sumberPenuh(media: MediaRel): string | null {
  if (!media || typeof media !== "object") return null;
  return media.sizes?.hero?.url ?? media.sizes?.kartu?.url ?? media.url ?? null;
}

function teksFoto(media: MediaRel, cadangan: string): string {
  if (media && typeof media === "object") {
    const teks = (media as Media).teksAlternatif?.trim();
    if (teks) return teks;
  }
  return cadangan;
}

/**
 * Galeri dokumentasi dengan penampil besar. Foto dibuka di lapisan dialog,
 * bisa digeser dengan tombol atau tombol panah, dan ditutup dengan Escape.
 */
export function GaleriEvent({
  foto,
  judul,
}: {
  foto: FotoGaleri[];
  judul: string;
}) {
  const [aktif, setAktif] = useState<number | null>(null);
  const tombolTutup = useRef<HTMLButtonElement>(null);
  const pemicu = useRef<(HTMLButtonElement | null)[]>([]);

  const tutup = useCallback(() => {
    setAktif((sebelum) => {
      if (sebelum !== null) pemicu.current[sebelum]?.focus();
      return null;
    });
  }, []);

  const geser = useCallback(
    (arah: number) => {
      setAktif((sebelum) =>
        sebelum === null
          ? null
          : (sebelum + arah + foto.length) % foto.length,
      );
    },
    [foto.length],
  );

  useEffect(() => {
    if (aktif === null) return;

    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    tombolTutup.current?.focus();

    function padaTombol(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        tutup();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        geser(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        geser(1);
      }
    }

    document.addEventListener("keydown", padaTombol);
    return () => {
      document.removeEventListener("keydown", padaTombol);
      document.body.style.overflow = sebelumnya;
    };
  }, [aktif, tutup, geser]);

  const sekarang = aktif === null ? null : foto[aktif];
  const sumber = sekarang ? sumberPenuh(sekarang.foto) : null;

  return (
    <>
      <div className={styles.gallery}>
        {foto.map((item, indeks) => (
          <figure className={styles.galleryItem} key={item.id ?? indeks}>
            <button
              ref={(el) => {
                pemicu.current[indeks] = el;
              }}
              type="button"
              className={styles.galleryButton}
              aria-label={`Buka foto ${indeks + 1} dari ${foto.length} ukuran penuh`}
              aria-haspopup="dialog"
              onClick={() => setAktif(indeks)}
            >
              <span className={styles.galleryMedia}>
                <Gambar
                  media={item.foto}
                  alt={teksFoto(item.foto, item.keterangan || `Foto dokumentasi ${judul}`)}
                  ukuran="kartu"
                  className={styles.galleryImage}
                  labelKosong="Foto menyusul"
                />
              </span>
            </button>
            {item.keterangan ? (
              <figcaption className={styles.galleryCaption}>
                {item.keterangan}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {sekarang ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${(aktif ?? 0) + 1} dari ${foto.length}`}
        >
          <div className={styles.lightboxBar}>
            <span className={styles.lightboxCount}>
              {(aktif ?? 0) + 1} / {foto.length}
            </span>
            <button
              ref={tombolTutup}
              type="button"
              className={styles.lightboxClose}
              onClick={tutup}
            >
              Tutup
            </button>
          </div>

          <div className={styles.lightboxFigure}>
            {sumber ? (
              <Image
                src={sumber}
                alt={teksFoto(sekarang.foto, `Foto dokumentasi ${judul}`)}
                fill
                sizes="100vw"
                className={styles.lightboxImage}
              />
            ) : (
              <FotoKosong label="Foto belum tersedia" />
            )}
          </div>

          <div className={styles.lightboxBottom}>
            <p className={styles.lightboxCaption}>
              {sekarang.keterangan?.trim() || judul}
            </p>
            {foto.length > 1 ? (
              <div className={styles.lightboxNav}>
                <button
                  type="button"
                  className={styles.lightboxButton}
                  onClick={() => geser(-1)}
                  aria-label="Foto sebelumnya"
                >
                  ←
                </button>
                <button
                  type="button"
                  className={styles.lightboxButton}
                  onClick={() => geser(1)}
                  aria-label="Foto berikutnya"
                >
                  →
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
