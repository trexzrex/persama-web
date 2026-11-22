import Image from "next/image";
import Link from "next/link";

import {
  CarouselEvent,
  TumpukEkskul,
  type EkskulBeranda,
  type EventBeranda,
} from "@/components/site/BerandaKlien";
import { KeadaanKosong } from "@/components/site/ui";
import styles from "@/components/site/site.module.css";
import { formatRentangTanggal } from "@/lib/format";
import type { Tabloid } from "@/lib/types";

const ZONA = "Asia/Makassar";

export type ArsipBeranda = {
  id: number;
  slug: string;
  judul: string;
  tanggalTerbit: string;
  sampulUrl: string | null;
  contoh: boolean;
};

export type BerandaData = {
  nama: string;
  namaLengkap: string;
  sekolah: string;
  tahun: string;
  logo: string;
  visi?: string | null;
  misi: { id?: string | null; poin: string }[];
  events: EventBeranda[];
  divisi: { id: number; slug: string; nama: string }[];
  ekskul: EkskulBeranda[];
  tabloidUtama: Tabloid | null;
  arsip: ArsipBeranda[];
  unduhan: { url: string; ukuran: string | null } | null;
  sampulUtama: string | null;
};

function bulanPanjang(nilai?: string | null) {
  if (!nilai) return "EDISI TERBARU";
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "EDISI TERBARU";
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  })
    .format(tanggal)
    .toUpperCase();
}

function bulanPendek(nilai?: string | null) {
  if (!nilai) return "Edisi";
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "Edisi";
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
    timeZone: ZONA,
  }).format(tanggal);
}

function bulanLengkap(nilai?: string | null) {
  if (!nilai) return "Edisi terbaru";
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "Edisi terbaru";
  const teks = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  }).format(tanggal);
  return teks.charAt(0).toUpperCase() + teks.slice(1);
}

export function BerandaTampilan({
  nama,
  namaLengkap,
  sekolah,
  tahun,
  logo,
  visi,
  misi,
  events,
  divisi,
  ekskul,
  tabloidUtama,
  arsip,
  unduhan,
  sampulUtama,
}: BerandaData) {
  const adaArsipTanpaSampul = arsip.some((item) => !item.sampulUrl);

  return (
    <div className={styles.beranda}>
      <section className={styles.hero} aria-labelledby="judul-beranda">
        <div className={styles.heroPola} aria-hidden="true" />
        <div className={`${styles.heroOrnamen} ${styles.heroOrnamenSatu}`} aria-hidden="true" />
        <div className={`${styles.heroOrnamen} ${styles.heroOrnamenDua}`} aria-hidden="true" />

        <div className={styles.heroCopy}>
          <p className={styles.heroWelcome}>Welcome</p>
          <h1 id="judul-beranda" className={styles.heroTitle}>
            {nama}
          </h1>
          <p className={styles.heroSub}>
            {namaLengkap}
            <br />
            {sekolah} · {tahun}
          </p>
          <Link className={styles.heroCta} href="/tentang">
            Kenali PERSAMA →
          </Link>
        </div>

        <div className={styles.heroPotret}>
          <span className={styles.heroCincinLuar} aria-hidden="true" />
          <span className={styles.heroCincinDalam} aria-hidden="true" />
          <span className={styles.heroAvatar}>
            <Image
              src={logo}
              alt={`Logo ${nama}`}
              width={120}
              height={120}
              sizes="(max-width: 767px) 120px, (max-width: 1439px) 136px, 216px"
              className={styles.heroAvatarGambar}
              priority
            />
          </span>
        </div>

        <div className={styles.heroDome} aria-hidden="true" />
      </section>

      {visi || misi.length > 0 ? (
        <section
          className={`${styles.bagian} ${styles.bagianGelap} ${styles.bagianVisi}`}
          aria-labelledby="judul-visi"
        >
          <h2 id="judul-visi" className={styles.bagianJudul}>
            Visi &amp; Misi
          </h2>

          {visi ? (
            <div className={styles.visiPanel}>
              <p className={styles.visiLabel}>Visi</p>
              <p className={styles.visiTeks}>{visi}</p>
            </div>
          ) : null}

          {misi.length > 0 ? (
            <>
              <div className={styles.visiGaris} aria-hidden="true" />
              <p className={styles.misiLabel}>Misi</p>
              <ol className={styles.misiList}>
                {misi.map((item, indeks) => (
                  <li className={styles.misiItem} key={item.id ?? indeks}>
                    <span className={styles.misiNomor} aria-hidden="true">
                      {String(indeks + 1).padStart(2, "0")}
                    </span>
                    <p className={styles.misiTeks}>{item.poin}</p>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </section>
      ) : null}

      <section
        className={`${styles.bagian} ${styles.bagianTerang} ${styles.bagianEvent}`}
        aria-labelledby="judul-event"
      >
        <h2 id="judul-event" className={styles.bagianJudul}>
          Event
        </h2>
        <CarouselEvent events={events} />
      </section>

      <section
        className={`${styles.bagian} ${styles.bagianAlt} ${styles.bagianDivisi}`}
        aria-labelledby="judul-divisi"
      >
        <h2 id="judul-divisi" className={styles.bagianJudul}>
          Divisi
        </h2>

        <div className={styles.divisiGrid}>
          <Link
            className={`${styles.divisiKartu} ${styles.divisiInti}`}
            href="/tentang#judul-inti"
          >
            <span className={styles.divisiNama}>INTI</span>
            <span className={styles.divisiAksen} aria-hidden="true" />
          </Link>
          {divisi.map((item, indeks) => (
            <Link
              className={styles.divisiKartu}
              href={`/divisi/${item.slug}`}
              key={item.id}
            >
              <span className={styles.divisiNama}>{item.nama}</span>
              <span
                className={`${styles.divisiAksen} ${
                  indeks % 2 === 0 ? "" : styles.divisiAksenRubi
                }`}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {divisi.length === 0 ? (
          <div className={styles.divisiKosong}>
            <KeadaanKosong
              judul="Data divisi sedang disiapkan"
              teks="Daftar divisi akan tampil di sini setelah admin mengisinya untuk periode aktif."
              aksiHref="/tentang"
              aksiLabel="Kenali PERSAMA lebih dulu"
              jenis="umum"
            />
          </div>
        ) : null}
      </section>

      {tabloidUtama ? (
        <section
          className={`${styles.bagian} ${styles.bagianGelap} ${styles.bagianTabloid}`}
          aria-labelledby="judul-tabloid"
        >
          <h2 id="judul-tabloid" className={styles.bagianJudul}>
            E-Tabloid
          </h2>

          <article className={styles.tabloidKartu}>
            <div className={styles.tabloidSampul}>
              {sampulUtama ? (
                <Image
                  src={sampulUtama}
                  alt={`Sampul ${tabloidUtama.judul}`}
                  fill
                  sizes="(max-width: 767px) 160px, (max-width: 1439px) 260px, 300px"
                  className={styles.tabloidSampulGambar}
                />
              ) : (
                <div className={styles.tabloidSampulSeni}>
                  <span className={styles.tabloidBadge}>Contoh</span>
                  <span className={styles.tabloidMasthead}>PERSAMA</span>
                  <strong className={styles.tabloidJudulKover}>E-TABLOID</strong>
                  <span className={styles.tabloidBulan}>
                    {bulanPanjang(tabloidUtama.tanggalTerbit)}
                  </span>
                  <span className={styles.tabloidAksen} aria-hidden="true" />
                  <span className={styles.tabloidTopik}>
                    {tabloidUtama.deskripsiSingkat?.trim() ||
                      tabloidUtama.edisi?.trim() ||
                      "Kabar terbaru PERSAMA"}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.tabloidIsi}>
              <h3 className={styles.tabloidJudul}>{tabloidUtama.judul}</h3>
              <p className={styles.tabloidMeta}>
                Terbit {formatRentangTanggal(tabloidUtama.tanggalTerbit)}
                {tabloidUtama.edisi?.trim()
                  ? ` · ${tabloidUtama.edisi.trim()}`
                  : ""}
              </p>
              <div className={styles.tabloidAksi}>
                <Link
                  className={styles.tabloidTombolBaca}
                  href={`/e-tabloid/${tabloidUtama.slug}`}
                >
                  Baca di Situs →
                </Link>
                {unduhan ? (
                  <a
                    className={styles.tabloidTombolUnduh}
                    href={unduhan.url}
                    download
                  >
                    Unduh PDF{unduhan.ukuran ? ` (${unduhan.ukuran})` : ""}
                  </a>
                ) : (
                  <span
                    className={`${styles.tabloidTombolUnduh} ${styles.tabloidTombolMati}`}
                    aria-disabled="true"
                  >
                    Unduh PDF
                  </span>
                )}
              </div>
            </div>
          </article>

          {arsip.length > 0 ? (
            <div className={styles.arsipBlok}>
              <div className={styles.arsipHead}>
                <p className={styles.arsipLabel}>Edisi sebelumnya</p>
                {adaArsipTanpaSampul || arsip.some((item) => item.contoh) ? (
                  <span className={styles.arsipBadge}>Contoh</span>
                ) : null}
              </div>
              <div className={styles.arsipGrid}>
                {arsip.map((item) => (
                  <Link
                    className={styles.arsipKartu}
                    href={`/e-tabloid/${item.slug}`}
                    key={item.id}
                  >
                    <span className={styles.arsipSampul}>
                      {item.sampulUrl ? (
                        <Image
                          src={item.sampulUrl}
                          alt={`Sampul ${item.judul}`}
                          fill
                          sizes="56px"
                          className={styles.arsipSampulGambar}
                        />
                      ) : (
                        <span className={styles.arsipSampulSeni}>
                          <span>PERSAMA</span>
                          <strong>E-TABLOID</strong>
                        </span>
                      )}
                    </span>
                    <span className={styles.arsipIsi}>
                      <span
                        className={`${styles.arsipBulan} ${styles.arsipBulanPendek}`}
                      >
                        {bulanPendek(item.tanggalTerbit)}
                      </span>
                      <span
                        className={`${styles.arsipBulan} ${styles.arsipBulanPanjang}`}
                      >
                        {bulanLengkap(item.tanggalTerbit)}
                      </span>
                      <span className={styles.arsipJudul}>{item.judul}</span>
                      <span className={styles.arsipBaca}>
                        <span className={styles.arsipBacaPendek}>Baca →</span>
                        <span className={styles.arsipBacaPanjang}>
                          Baca edisi →
                        </span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <section
          className={`${styles.bagian} ${styles.bagianGelap} ${styles.bagianTabloid}`}
          aria-labelledby="judul-tabloid"
        >
          <h2 id="judul-tabloid" className={styles.bagianJudul}>
            E-Tabloid
          </h2>
          <KeadaanKosong
            judul="Belum ada edisi terbit"
            teks="E-Tabloid periode ini akan tampil di sini setelah admin menerbitkan edisi pertamanya."
            aksiHref="/e-tabloid"
            aksiLabel="Lihat semua edisi"
            jenis="tabloid"
          />
        </section>
      )}

      {ekskul.length > 0 ? (
        <section
          className={`${styles.bagian} ${styles.bagianTerang} ${styles.bagianEkskul}`}
          aria-labelledby="judul-ekskul"
        >
          <h2 id="judul-ekskul" className={styles.bagianJudul}>
            Ekstrakurikuler
          </h2>
          <TumpukEkskul items={ekskul} />
        </section>
      ) : null}
    </div>
  );
}
