import Link from "next/link";
import { Gambar } from "./ui";
import { teksAltMedia } from "@/lib/content";
import type { MediaRel, Pengurus, PoinTugas, ProgramKerja } from "@/lib/types";
import styles from "./profil-kelompok.module.css";

type Props = {
  nama: string;
  periode?: string;
  foto: MediaRel;
  tugas: PoinTugas[];
  anggota: Pengurus[];
  kegiatan?: string | null;
  program?: ProgramKerja[];
  berikutnya?: { nama: string; href: string; foto: MediaRel };
};

export function ProfilKelompok({ nama, periode, foto, tugas, anggota, kegiatan, program = [], berikutnya }: Props) {
  return <article className={styles.halaman}>
    <header className={styles.hero}>
      <div className={styles.fotoBersama}><Gambar media={foto} alt={teksAltMedia(foto, `Foto bersama ${nama}`)} ukuran="hero" className={styles.foto} prioritas labelKosong="Foto bersama belum tersedia" /></div>
      <div className={styles.judul}><h1>{nama}</h1>{periode && <p>Periode {periode}</p>}</div>
    </header>

    <section className={styles.uraian} aria-labelledby="judul-tugas">
      <h2 id="judul-tugas">Tugas Umum</h2>
      <div>{tugas.length ? <ul>{tugas.map((item, i) => <li key={item.id ?? i}>{item.poin}</li>)}</ul> : <p className={styles.kosong}>Tugas umum belum tersedia.</p>}</div>
    </section>

    <section className={styles.tim} aria-labelledby="judul-anggota">
      <h2 id="judul-anggota">Kenali pengurus kami.</h2>
      {anggota.length ? <div className={styles.anggota}>{anggota.map((orang) => <article className={styles.orang} key={orang.id}>
        <div className={styles.potret}><Gambar media={orang.foto} alt={teksAltMedia(orang.foto, orang.nama || orang.jabatan || "Pengurus PERSAMA")} className={styles.foto} labelKosong="Foto anggota belum tersedia" /></div>
        <div className={styles.identitas}><h3>{orang.nama?.trim() || "Nama belum diisi"}</h3><p className={styles.jabatan}>{orang.jabatan}</p>
          {orang.motto?.trim() ? <blockquote><span>Motto</span><p>“{orang.motto}”</p></blockquote> : null}
        </div>
      </article>)}</div> : <p className={styles.kosong}>Anggota periode ini belum diisi.</p>}
    </section>

    <section className={styles.pekerjaan} aria-labelledby="judul-kegiatan">
      <div className={styles.uraian}><h2 id="judul-kegiatan">What we do.</h2><div>{kegiatan?.trim() ? <p className={styles.paragraf}>{kegiatan}</p> : !program.length ? <p className={styles.kosong}>Uraian kegiatan belum tersedia.</p> : null}</div></div>
      {program.length > 0 && <ul className={styles.program}>{program.map((item, i) => <li key={item.id ?? i}><h3>{item.judul}</h3>{item.keterangan && <p>{item.keterangan}</p>}</li>)}</ul>}
    </section>

    {berikutnya ? <nav className={styles.lanjutan} aria-label="Divisi berikutnya">
      <div className={styles.fotoLanjutan}><Gambar media={berikutnya.foto} alt="" className={styles.foto} labelKosong="Foto bersama belum tersedia" /></div>
      <div className={styles.lanjutanIsi}><p>Selanjutnya</p><h2>{berikutnya.nama}</h2><Link href={berikutnya.href}>Kenali {berikutnya.nama} <span aria-hidden="true">→</span></Link></div>
    </nav> : null}
    <Link className={styles.kembali} href="/divisi">← Semua divisi</Link>
  </article>;
}
