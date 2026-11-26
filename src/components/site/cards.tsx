import type { Divisi, EventItem, Ekstrakurikuler, Pengurus, Tabloid } from "@/lib/types";
import { formatRentangTanggal, statusEvent, tahunPeriode } from "@/lib/format";
import { alamatMedia, teksAltMedia, ukuranBerkas, mediaObjek } from "@/lib/content";

import styles from "./site.module.css";
import { BadgeStatus, Gambar, KeadaanKosong } from "./ui";

import Link from "next/link";
import { TautanGerak } from "./motion/TautanGerak";

export function KartuEvent({ event }: { event: EventItem }) {
  const status = statusEvent(event);
  return (
    <article className={styles.listCard}>
      <Link className={styles.listCardLink} href={`/event/${event.slug}`}>
        <div className={`${styles.listMedia} ${styles.listMediaEvent}`}>
          {event.contoh ? (
            <div className={styles.cardBadges}>
              <span className={styles.badgeContoh}>Contoh</span>
            </div>
          ) : null}
          <div className={styles.listStatus}>
            <BadgeStatus status={status} />
          </div>
          <Gambar
            media={event.poster}
            alt={teksAltMedia(event.poster, `Poster ${event.judul}`)}
            className={styles.cardImage}
            labelKosong="Foto menyusul"
          />
        </div>
        <div className={styles.listBody}>
          <h3 className={styles.listTitle}>{event.judul}</h3>
          <p className={styles.listMeta}>
            {formatRentangTanggal(event.tanggalMulai, event.tanggalSelesai)}
            {event.lokasi?.trim() ? ` · ${event.lokasi.trim()}` : ""}
          </p>
          <span className={styles.listCta}>Lihat detail</span>
        </div>
      </Link>
    </article>
  );
}

export function KartuDivisi({
  divisi,
  koordinator,
  jumlahAnggota,
}: {
  divisi: Divisi;
  koordinator?: Pengurus | null;
  jumlahAnggota?: number;
}) {
  return (
    <article className={styles.divisiCard}>
      <TautanGerak className={styles.divisiCardLink} href={`/divisi/${divisi.slug}`}>
        <span className={styles.divisiCardKepala}>
          <span className={styles.divisiCardAvatar} aria-hidden="true">
            {inisialNama(koordinator?.nama || divisi.nama)}
          </span>
          <span className={styles.divisiCardOrang}>
            <span className={styles.divisiCardKoordinator}>
              {koordinator?.nama || "Koordinator belum diisi"}
            </span>
            <span className={styles.divisiCardPeran}>Koordinator</span>
          </span>
        </span>
        <span className={styles.divisiCardTitle}>{divisi.nama}</span>
        <span className={styles.divisiCardAnggota}>
          Anggota: {jumlahAnggota ?? 0} orang
        </span>
        <span className={styles.divisiCardGaris} aria-hidden="true" />
        <span className={styles.divisiCardLinkLabel}>Lihat detail →</span>
      </TautanGerak>
    </article>
  );
}

export function KartuTabloid({ tabloid }: { tabloid: Tabloid }) {
  const adaSampul = Boolean(alamatMedia(tabloid.sampul));
  const pdf = alamatMedia(tabloid.berkasPdf);
  const ukuran = ukuranBerkas(mediaObjek(tabloid.berkasPdf)?.filesize);
  return (
    <article className={styles.tabloidKartu}>
        <div className={styles.tabloidSampul}>
          {tabloid.contoh ? (
            <div className={styles.cardBadges}>
              <span className={styles.badgeContoh}>Contoh</span>
            </div>
          ) : null}
          {adaSampul ? (
            <Gambar
              media={tabloid.sampul}
              alt={teksAltMedia(tabloid.sampul, `Sampul ${tabloid.judul}`)}
              className={styles.cardImage}
              labelKosong="Foto menyusul"
            />
          ) : (
            <div className={styles.tabloidSampulSeni} aria-hidden="true">
              <span className={styles.tabloidMasthead}>PERSAMA</span>
              <strong className={styles.tabloidJudulKover}>E-TABLOID</strong>
            </div>
          )}
        </div>
        <div className={styles.tabloidIsi}>
          <h3 className={styles.tabloidJudul}>{tabloid.judul}</h3>
          <p className={styles.tabloidMeta}>
            Terbit {formatRentangTanggal(tabloid.tanggalTerbit)}
            {tabloid.edisi?.trim() ? ` · ${tabloid.edisi.trim()}` : ""}
          </p>
          <div className={styles.tabloidAksi}>
            <Link className={styles.tabloidTombolBaca} href={`/e-tabloid/${tabloid.slug}`}>
              Baca di Situs →
            </Link>
            {pdf ? (
              <a className={styles.tabloidTombolUnduh} href={pdf} download>
                Unduh PDF{ukuran ? ` (${ukuran})` : ""}
              </a>
            ) : (
              <span className={`${styles.tabloidTombolUnduh} ${styles.tabloidTombolMati}`} aria-disabled="true">
                Unduh PDF
              </span>
            )}
          </div>
        </div>
    </article>
  );
}

export function KartuEkskul({ ekskul }: { ekskul: Ekstrakurikuler }) {
  const adaGambar = Boolean(
    ekskul.gambarAtauLogo && typeof ekskul.gambarAtauLogo === "object" && ekskul.gambarAtauLogo.url,
  );
  return (
    <article className={`${styles.tumpukKartu} ${styles.ekskulDaftar}`}>
      <div className={styles.tumpukFoto}>
        {!adaGambar ? (
          <div className={styles.cardBadges}>
            <span className={styles.badgeContoh}>Contoh</span>
          </div>
        ) : null}
        {adaGambar ? (
          <Gambar
            media={ekskul.gambarAtauLogo}
            alt={teksAltMedia(ekskul.gambarAtauLogo, `Logo ${ekskul.nama}`)}
            className={styles.cardImage}
            labelKosong="Foto menyusul"
          />
        ) : (
          <div className={styles.ekskulCover}>
            <span className={styles.ekskulCoverLabel}>EKSTRAKURIKULER</span>
            <span className={styles.ekskulCoverSub}>
              Dokumentasi resmi kegiatan kesiswaan
            </span>
          </div>
        )}
      </div>
      <div className={styles.tumpukIsi}>
        <h2 className={styles.tumpukJudul}>{ekskul.nama}</h2>
        {ekskul.deskripsiSingkat ? (
          <p className={styles.ekskulDaftarTeks}>{ekskul.deskripsiSingkat}</p>
        ) : null}
      </div>
    </article>
  );
}

function inisialNama(nama: string) {
  const kata = nama.trim().split(/\s+/).filter(Boolean);
  if (kata.length === 0) return "";
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
}

export function KartuOrang({ orang }: { orang: Pengurus }) {
  const adaFoto = Boolean(
    orang.foto && typeof orang.foto === "object" && orang.foto.url,
  );
  return (
    <article className={styles.person}>
      <div className={styles.personAvatar}>
        {adaFoto ? (
          <Gambar
            media={orang.foto}
            alt={teksAltMedia(orang.foto, orang.nama ? `Foto ${orang.nama}` : orang.jabatan)}
            ukuran="thumbnail"
            className={styles.personPhotoImage}
            labelKosong="Foto menyusul"
          />
        ) : (
          <span className={styles.personInitials} aria-hidden="true">
            {inisialNama(orang.nama || orang.jabatan)}
          </span>
        )}
      </div>
      <div className={styles.personBody}>
        {orang.nama ? (
          <p className={styles.personName}>{orang.nama}</p>
        ) : null}
        <p className={styles.personRole}>{orang.jabatan}</p>
      </div>
      <span className={styles.personBadge}>
        {orang.kelompok === "pengurus_inti" ? "Pengurus inti" :
          orang.kelompok === "koordinator_divisi" ? "Koordinator divisi" : "Anggota divisi"}
      </span>
      {typeof orang.periode === "object" && orang.periode ? (
        <p className={styles.personPeriode}>Periode {tahunPeriode(orang.periode.nama)}</p>
      ) : null}
      <span className={styles.personGaris} aria-hidden="true" />
      <Link className={styles.personTautan} href={
        typeof orang.divisi === "object" && orang.divisi
          ? `/divisi/${orang.divisi.slug}` : "/inti-persama"
      }>Lihat struktur →</Link>
    </article>
  );
}

export function DaftarEvent({
  events,
  judul,
  teksKosong,
}: {
  events: EventItem[];
  judul: string;
  teksKosong: string;
}) {
  if (events.length === 0) {
    return (
      <KeadaanKosong
        judul={judul}
        teks={teksKosong}
        aksiHref="/event"
        aksiLabel="Lihat semua event"
        jenis="event"
      />
    );
  }
  return (
    <div className={`${styles.grid} ${styles.grid3}`}>
      {events.map((event) => (
        <KartuEvent key={event.id} event={event} />
      ))}
    </div>
  );
}
