import type { ReactNode } from "react";
import Link from "next/link";
import { alamatMedia, teksAltMedia } from "@/lib/content";
import { formatRentangTanggal, statusEvent } from "@/lib/format";
import type { Divisi, EventItem, Pengurus } from "@/lib/types";
import { Gambar } from "./ui";
import styles from "./halaman-publik.module.css";

export function HalamanPublik({ jenis, children }: {
  jenis: "divisi" | "event" | "tabloid" | "tentang";
  children: ReactNode;
}) {
  return <div className={`${styles.halaman} ${styles[jenis]}`}>{children}</div>;
}

export function PembukaHalaman({ judul, children, keterangan }: {
  judul: string;
  children?: ReactNode;
  keterangan?: string;
}) {
  return (
    <header className={styles.pembuka}>
      <h1>{judul}</h1>
      {children ? <div className={styles.pengantar}>{children}</div> : null}
      {keterangan ? <p className={styles.keterangan}>{keterangan}</p> : null}
    </header>
  );
}

export function DivisiPublik({ divisi, koordinator, jumlahAnggota }: {
  divisi: Divisi;
  koordinator?: Pengurus | null;
  jumlahAnggota: number;
}) {
  return (
    <article className={styles.divisiItem}>
      <Link className={styles.divisiTautan} href={`/divisi/${divisi.slug}`}>
        <div className={styles.divisiFoto}>
          <Gambar media={divisi.fotoGrup || koordinator?.foto} alt={teksAltMedia(divisi.fotoGrup || koordinator?.foto, divisi.nama)} className={styles.foto} labelKosong="Foto divisi belum tersedia" />
        </div>
        <div className={styles.divisiIsi}>
          <h2>{divisi.nama}</h2>
          {divisi.deskripsiSingkat?.trim() ? <p className={styles.deskripsi}>{divisi.deskripsiSingkat}</p> : null}
          <dl className={styles.divisiData}>
            <div><dt>Koordinator</dt><dd>{koordinator?.nama || "Belum diisi"}</dd></div>
            <div><dt>Anggota</dt><dd>{jumlahAnggota} orang</dd></div>
          </dl>
          <span className={styles.tautan}>Tentang divisi <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
}

export function EventPublik({ event }: { event: EventItem }) {
  const status = statusEvent(event);
  return (
    <article className={styles.eventItem}>
      <Link className={styles.eventTautan} href={`/event/${event.slug}`}>
        <div className={styles.eventFoto}>
          <Gambar media={event.poster} alt={teksAltMedia(event.poster, `Poster ${event.judul}`)} className={styles.foto} labelKosong="Dokumentasi belum tersedia" />
        </div>
        <div className={styles.eventIsi}>
          <p className={styles.eventTanggal}>{formatRentangTanggal(event.tanggalMulai, event.tanggalSelesai)}</p>
          <h3>{event.judul}</h3>
          {event.lokasi?.trim() ? <p className={styles.deskripsi}>{event.lokasi}</p> : null}
          <p className={styles.eventStatus}>{status === "selesai" ? "Kegiatan selesai" : status === "berlangsung" ? "Sedang berlangsung" : "Agenda mendatang"}{event.contoh ? " (contoh)" : ""}</p>
          <span className={styles.tautan}>Lihat kegiatan <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
}

export function PengurusPublik({ orang }: { orang: Pengurus }) {
  const adaFoto = Boolean(alamatMedia(orang.foto));
  return (
    <article className={styles.pengurus}>
      <div className={`${styles.pengurusFoto} ${!adaFoto ? styles.tanpaFoto : ""}`}>
        <Gambar media={orang.foto} alt={teksAltMedia(orang.foto, orang.nama ? `Foto ${orang.nama}` : orang.jabatan)} className={styles.foto} labelKosong="Foto belum tersedia" />
      </div>
      <h3>{orang.nama || "Nama belum diisi"}</h3>
      <p>{orang.jabatan}</p>
    </article>
  );
}
