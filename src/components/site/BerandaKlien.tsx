"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import carouselStyles from "./beranda-carousel.module.css";
import styles from "./site.module.css";
import { KeadaanKosong } from "./ui";

export type EventBeranda = {
  id: number;
  slug: string;
  judul: string;
  tanggal: string;
  lokasi: string;
  status: "akan-datang" | "berlangsung" | "selesai";
  posterUrl: string | null;
  posterAlt: string;
  contoh: boolean;
};

export type EkskulBeranda = {
  id: number;
  nama: string;
  deskripsi: string;
  gambarUrl: string | null;
  gambarAlt: string;
};

function labelStatus(status: EventBeranda["status"]) {
  if (status === "berlangsung") return "Berlangsung";
  if (status === "selesai") return "Selesai";
  return "Akan datang";
}

function pakaiGerak() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CarouselEvent({ events }: { events: EventBeranda[] }) {
  const jalurRef = useRef<HTMLDivElement | null>(null);
  const [aktif, setAktif] = useState(() => Math.floor(events.length / 2));
  const [bisaGeser, setBisaGeser] = useState(false);

  const keKartu = useCallback(
    (indeks: number, halus = true) => {
      const jalur = jalurRef.current;
      const kartu = jalur?.children[indeks] as HTMLElement | undefined;
      if (!jalur || !kartu) return;
      const awal = (jalur.children[0] as HTMLElement).offsetLeft;
      const tujuan = kartu.offsetLeft - awal;
      const maks = jalur.scrollWidth - jalur.clientWidth;
      jalur.scrollTo({
        left: tujuan > maks + 4 ? 0 : Math.min(tujuan, maks),
        behavior: halus && pakaiGerak() ? "smooth" : "auto",
      });
    },
    [],
  );

  useEffect(() => {
    keKartu(Math.floor(events.length / 2), false);
  }, [events.length, keKartu]);

  const berikut = useCallback(() => {
    if (!events.length) return;
    keKartu((aktif + 1) % events.length);
  }, [aktif, events.length, keKartu]);

  const sebelumnya = useCallback(() => {
    if (!events.length) return;
    keKartu((aktif - 1 + events.length) % events.length);
  }, [aktif, events.length, keKartu]);

  useEffect(() => {
    const jalur = jalurRef.current;
    if (!jalur) return;

    const ukur = () => setBisaGeser(jalur.scrollWidth > jalur.clientWidth + 4);
    ukur();
    const pengamat = new ResizeObserver(ukur);
    pengamat.observe(jalur);
    return () => pengamat.disconnect();
  }, [events.length]);

  useEffect(() => {
    const jalur = jalurRef.current;
    if (!jalur) return;

    const saatGeser = () => {
      const awal = (jalur.children[0] as HTMLElement).offsetLeft;
      let terdekat = 0;
      let beda = Number.POSITIVE_INFINITY;
      Array.from(jalur.children).forEach((anak, indeks) => {
        const selisih = Math.abs(
          (anak as HTMLElement).offsetLeft - awal - jalur.scrollLeft,
        );
        if (selisih < beda) {
          beda = selisih;
          terdekat = indeks;
        }
      });
      setAktif(terdekat);
    };
    jalur.addEventListener("scroll", saatGeser, { passive: true });
    return () => jalur.removeEventListener("scroll", saatGeser);
  }, [events.length]);

  if (events.length === 0) {
    return (
      <KeadaanKosong
        judul="Belum ada event yang dipublikasikan"
        teks="Kabar kegiatan PERSAMA akan tampil di sini setelah admin menerbitkannya."
        aksiHref="/event"
        aksiLabel="Lihat semua event"
        jenis="event"
      />
    );
  }

  return (
    <div className={styles.eventCarousel}>
      <div className={styles.eventTrack} ref={jalurRef}>
        {events.map((event, indeks) => (
          <article className={styles.eventCard} key={event.id}>
            <div
              className={`${styles.eventPoster} ${
                indeks % 2 === 0 ? styles.eventPosterHammam : styles.eventPosterTropis
              }`}
            >
              {event.posterUrl ? (
                <Image
                  src={event.posterUrl}
                  alt={event.posterAlt}
                  fill
                  sizes="(max-width: 767px) 320px, (max-width: 1439px) 216px, 400px"
                  className={styles.eventPosterGambar}
                />
              ) : (
                <div className={styles.eventPosterSeni}>
                  <span className={styles.eventPosterKicker}>PERSAMA</span>
                  <strong>{event.judul.toUpperCase()}</strong>
                  <span>{event.lokasi || "SMK-SMAK Makassar"}</span>
                </div>
              )}
              <div className={styles.eventBadges}>
                {event.contoh || !event.posterUrl ? (
                  <span className={styles.badgeContoh}>Contoh</span>
                ) : null}
                <span className={styles.badgeStatus}>
                  {labelStatus(event.status)}
                </span>
              </div>
            </div>
            <div className={styles.eventBody}>
              <h3 className={styles.eventJudul}>
                <Link href={`/event/${event.slug}`}>{event.judul}</Link>
              </h3>
              <p className={styles.eventMeta}>
                {event.tanggal}
                {event.lokasi ? ` · ${event.lokasi}` : ""}
              </p>
              <Link className={styles.eventTombol} href={`/event/${event.slug}`}>
                Lihat Detail →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {events.length > 1 && bisaGeser ? (
        <>
          <button
            type="button"
            className={`${styles.eventPanah} ${styles.eventPanahKiri}`}
            onClick={sebelumnya}
            aria-label="Event sebelumnya"
            disabled={!bisaGeser}
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.eventPanah} ${styles.eventPanahKanan}`}
            onClick={berikut}
            aria-label="Event berikutnya"
            disabled={!bisaGeser}
          >
            ›
          </button>

          <div
            className={`${styles.eventDots} ${carouselStyles.barisPenanda}`}
            role="group"
            aria-label="Pilih event"
          >
            {events.map((event, indeks) => (
              <button
                key={event.id}
                type="button"
                className={carouselStyles.penanda}
                aria-label={`Event ${indeks + 1}: ${event.judul}`}
                aria-current={indeks === aktif ? "true" : undefined}
                onClick={() => keKartu(indeks)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function TumpukEkskul({ items }: { items: EkskulBeranda[] }) {
  const [aktif, setAktif] = useState(0);
  const reduced = useReducedMotion();
  const tombolDepanRef = useRef<HTMLButtonElement>(null);
  const pindahFokusRef = useRef(false);

  const pilih = useCallback((indeks: number) => {
    if (!items.length || indeks === aktif) return;
    setAktif(indeks);
  }, [aktif, items.length]);

  const berikut = useCallback(() => {
    if (!items.length) return;
    pilih((aktif + 1) % items.length);
  }, [aktif, items.length, pilih]);

  useLayoutEffect(() => {
    if (!pindahFokusRef.current) return;
    pindahFokusRef.current = false;
    tombolDepanRef.current?.focus({ preventScroll: true });
  }, [aktif]);

  if (items.length === 0) {
    return (
      <KeadaanKosong
        judul="Data ekstrakurikuler sedang disiapkan"
        teks="Daftar kegiatan akan tampil di sini setelah admin mengisinya."
        aksiHref="/ekstrakurikuler"
        aksiLabel="Lihat halaman ekstrakurikuler"
        jenis="ekskul"
      />
    );
  }

  const urutan = items
    .map((_, indeks) => ({
      indeks,
      offset: (indeks - aktif + items.length) % items.length,
    }))
    .sort((kiri, kanan) => kanan.offset - kiri.offset);

  return (
    <div className={styles.tumpuk}>
      <div className={styles.tumpukPanggung}>
        {urutan.map(({ indeks, offset }) => {
          const data = items[indeks];
          const depan = offset === 0;
          const tampak = offset <= 2;
          return (
            <m.div
              key={data.id}
              className={styles.tumpukLapisan}
              style={{ zIndex: items.length - offset }}
              animate={{
                opacity: tampak ? (depan ? 1 : offset === 1 ? 0.8 : 0.62) : 0,
                y: reduced ? 0 : offset * -16,
                scale: reduced ? 1 : 1 - offset * 0.028,
              }}
              transition={{
                duration: reduced ? 0 : 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden={!depan}
              inert={depan ? undefined : true}
              onClick={depan ? berikut : undefined}
              data-depan={depan ? "ya" : "tidak"}
            >
              <div className={styles.tumpukKartu}>
                <div className={styles.tumpukFoto}>
                  {data.gambarUrl && offset <= 2 ? (
                    <Image
                      src={data.gambarUrl}
                      alt={depan ? data.gambarAlt : ""}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1439px) 280px, 420px"
                      className={styles.tumpukFotoGambar}
                    />
                  ) : (
                    <div className={styles.tumpukFotoSeni}>
                      <strong>FOTO EKSTRAKURIKULER</strong>
                      <span>Dokumentasi Resmi Kegiatan Kesiswaan</span>
                    </div>
                  )}
                  <div className={styles.tumpukLencana}>
                    {!data.gambarUrl ? (
                      <span className={styles.badgeContoh}>Contoh</span>
                    ) : null}
                    <span className={styles.eventBadgeKategori}>
                      Ekstrakurikuler
                    </span>
                  </div>
                </div>

                <div className={styles.tumpukIsi}>
                  <h3 className={styles.tumpukJudul}>{data.nama}</h3>
                  <p className={styles.tumpukTeks}>
                    {data.deskripsi ||
                      "Deskripsi kegiatan akan dilengkapi oleh admin PERSAMA."}
                  </p>
                  <Link
                    className={styles.textLink}
                    href="/ekstrakurikuler"
                    style={{ marginTop: 16, alignSelf: "flex-start" }}
                    tabIndex={depan ? undefined : -1}
                    onClick={(event) => event.stopPropagation()}
                  >
                    Lihat ekstrakurikuler →
                  </Link>
                  <div className={styles.tumpukGaris} />
                  <div className={styles.tumpukKaki}>
                    <span className={styles.tumpukIndeks}>
                      Kartu {indeks + 1} dari {items.length} kegiatan
                    </span>
                    <button
                      type="button"
                      className={styles.tumpukTombol}
                      ref={depan ? tombolDepanRef : undefined}
                      tabIndex={depan ? undefined : -1}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (items.length < 2) return;
                        // Kartu lama menjadi inert: pertahankan fokus pada kontrol berikutnya.
                        pindahFokusRef.current =
                          document.activeElement === event.currentTarget;
                        berikut();
                      }}
                    >
                      Ketuk / Naik ⤿
                    </button>
                  </div>
                </div>
              </div>
            </m.div>
          );
        })}
      </div>

      <div
        className={`${styles.ekskulDots} ${carouselStyles.barisPenanda}`}
        role="group"
        aria-label="Pilih ekstrakurikuler"
      >
        {items.map((data, indeks) => (
          <button
            key={data.id}
            type="button"
            className={carouselStyles.penanda}
            aria-label={`Ekstrakurikuler ${indeks + 1}: ${data.nama}`}
            aria-current={indeks === aktif ? "true" : undefined}
            onClick={() => pilih(indeks)}
          />
        ))}
      </div>

      {items.length > 1 ? (
        <p className={`${styles.eventHint} ${styles.ekskulHint}`}>
          Ketuk kartu untuk melihat kegiatan berikutnya.
        </p>
      ) : null}
    </div>
  );
}
