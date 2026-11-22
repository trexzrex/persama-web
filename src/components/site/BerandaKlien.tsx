"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [jeda, setJeda] = useState(false);

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

  useEffect(() => {
    if (!bisaGeser || jeda || events.length < 2) return;
    if (!pakaiGerak()) return;

    const jam = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      berikut();
    }, 6000);
    return () => window.clearInterval(jam);
  }, [berikut, bisaGeser, jeda, events.length]);


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
    <div
      className={styles.eventCarousel}
      onPointerEnter={() => setJeda(true)}
      onPointerLeave={() => setJeda(false)}
      onFocusCapture={() => setJeda(true)}
      onBlurCapture={() => setJeda(false)}
      onTouchStart={() => setJeda(true)}
      onTouchEnd={() => setJeda(false)}
    >
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

          <div className={styles.eventDots} aria-label="Pilih event">
            {events.map((event, indeks) => (
              <button
                key={event.id}
                type="button"
                className={`${styles.dot} ${
                  indeks === aktif ? styles.dotAktif : ""
                }`}
                aria-label={`Event ${indeks + 1}: ${event.judul}`}
                aria-pressed={indeks === aktif}
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
  const [jeda, setJeda] = useState(false);
  const [fase, setFase] = useState<"diam" | "keluar" | "masuk">("diam");
  const tujuanRef = useRef(0);
  const bergerakRef = useRef(false);

  const pilih = useCallback((indeks: number) => {
    if (!items.length || indeks === aktif || bergerakRef.current) return;
    if (!pakaiGerak()) {
      setAktif(indeks);
      return;
    }
    tujuanRef.current = indeks;
    bergerakRef.current = true;
    setFase("keluar");
  }, [aktif, items.length]);

  const berikut = useCallback(() => {
    if (!items.length) return;
    pilih((aktif + 1) % items.length);
  }, [aktif, items.length, pilih]);

  useEffect(() => {
    if (jeda || items.length < 2) return;
    if (!pakaiGerak()) return;
    const jam = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      berikut();
    }, 6000);
    return () => window.clearInterval(jam);
  }, [berikut, jeda, items.length]);

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

  const item = items[aktif];

  return (
    <div
      className={styles.tumpuk}
      onPointerEnter={() => setJeda(true)}
      onPointerLeave={() => setJeda(false)}
      onFocusCapture={() => setJeda(true)}
      onBlurCapture={() => setJeda(false)}
    >
      <div className={styles.tumpukPanggung}>
        <div
          className={`${styles.tumpukKartu} ${fase === "keluar" ? styles.tumpukKeluar : fase === "masuk" ? styles.tumpukMasuk : ""}`}
          onClick={berikut}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget) return;
            if (fase === "keluar") {
              setAktif(tujuanRef.current);
              setFase("masuk");
            } else if (fase === "masuk") {
              bergerakRef.current = false;
              setFase("diam");
            }
          }}
          key={item.id}
        >
          <div className={styles.tumpukFoto}>
            {item.gambarUrl ? (
              <Image
                src={item.gambarUrl}
                alt={item.gambarAlt}
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
              {!item.gambarUrl ? (
                <span className={styles.badgeContoh}>Contoh</span>
              ) : null}
              <span className={styles.eventBadgeKategori}>Ekstrakurikuler</span>
            </div>
          </div>

          <div className={styles.tumpukIsi}>
            <h3 className={styles.tumpukJudul}>{item.nama}</h3>
            <p className={styles.tumpukTeks}>
              {item.deskripsi ||
                "Deskripsi kegiatan akan dilengkapi oleh admin PERSAMA."}
            </p>
            <Link
              className={styles.textLink}
              href="/ekstrakurikuler"
              style={{ marginTop: 16, alignSelf: "flex-start" }}
              onClick={(event) => event.stopPropagation()}
            >
              Lihat ekstrakurikuler →
            </Link>
            <div className={styles.tumpukGaris} />
            <div className={styles.tumpukKaki}>
              <span className={styles.tumpukIndeks}>
                Kartu {aktif + 1} dari {items.length} kegiatan
              </span>
              <button
                type="button"
                className={styles.tumpukTombol}
                onClick={(event) => {
                  event.stopPropagation();
                  berikut();
                }}
              >
                Ketuk / Naik ⤿
              </button>
            </div>
          </div>
        </div>

        <div className={styles.ekskulDots} aria-label="Pilih ekstrakurikuler">
          {items.map((data, indeks) => (
            <button
              key={data.id}
              type="button"
              className={`${styles.dot} ${indeks === aktif ? styles.dotAktif : ""}`}
              aria-label={`Ekstrakurikuler ${indeks + 1}: ${data.nama}`}
              aria-pressed={indeks === aktif}
              onClick={() => pilih(indeks)}
            />
          ))}
        </div>
      </div>

      <p className={`${styles.eventHint} ${styles.ekskulHint}`}>
        ⤿ Kartu berganti otomatis · Ketuk untuk menaikkan kartu berikutnya
      </p>
    </div>
  );
}
