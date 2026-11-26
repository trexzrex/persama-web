import Link from "next/link";
import { Gambar } from "./ui";
import { teksAltMedia } from "@/lib/content";
import type { MediaRel, Pengurus, PoinTugas, ProgramKerja } from "@/lib/types";
import { GerakProfil } from "./motion/GerakProfil";
import { susunanTim } from "@/lib/susunan-tim";
import styles from "./profil-kelompok.module.css";

function ProfilOrang({ orang, utama = false }: { orang: Pengurus; utama?: boolean }) {
  return <article className={utama ? styles.pimpinan : styles.orang} data-profil={utama ? "pimpinan" : "anggota"}>
    <div className={styles.potret}><Gambar media={orang.foto} ukuran="asli" alt={teksAltMedia(orang.foto, orang.nama || orang.jabatan || "Pengurus PERSAMA")} className={styles.foto} labelKosong="Foto anggota belum tersedia" /></div>
    <div className={styles.identitas}>
      {utama && <p className={styles.jabatan} data-jabatan>{orang.jabatan}</p>}
      <h3>{orang.nama?.trim() || "Nama belum diisi"}</h3>
      {!utama && <p className={styles.jabatan} data-jabatan>{orang.jabatan}</p>}
      <blockquote className={styles.motto}><span>Motto</span><p>{orang.motto?.trim() ? `“${orang.motto.trim()}”` : "Motto belum diisi"}</p></blockquote>
    </div>
  </article>;
}

type Props = {
  nama: string;
  periode?: string;
  foto: MediaRel;
  tugas: PoinTugas[];
  anggota: Pengurus[];
  kegiatan?: string | null;
  program?: ProgramKerja[];
  berikutnya?: { nama: string; href: string; foto: MediaRel };
  ukuranFoto?: "sedang" | "besar" | "sangat-besar";
};

export function ProfilKelompok({ nama, periode, foto, tugas, anggota, kegiatan, program = [], berikutnya, ukuranFoto }: Props) {
  const { pimpinan, tim } = susunanTim(anggota);
  return <GerakProfil ukuranFoto={ukuranFoto || "besar"}>
    <header className={styles.hero}>
      <div className={styles.fotoBersama}><Gambar media={foto} alt={teksAltMedia(foto, `Foto bersama ${nama}`)} ukuran="hero" className={styles.foto} prioritas labelKosong="Foto bersama belum tersedia" /></div>
      <div className={styles.judul}><h1>{nama}</h1>{periode && <p>Periode {periode}</p>}</div>
    </header>

    <section className={styles.uraian} aria-labelledby="judul-tugas">
      <h2 id="judul-tugas">Tugas Umum</h2>
      <div>{tugas.length ? <ul>{tugas.map((item, i) => <li key={item.id ?? i}>{item.poin}</li>)}</ul> : <p className={styles.kosong}>Tugas umum belum tersedia.</p>}</div>
    </section>

    {pimpinan.length > 0 && <section className={styles.pemimpin} aria-label="Ketua atau koordinator">
      {pimpinan.map(orang => <ProfilOrang key={orang.id} orang={orang} utama />)}
    </section>}

    <section className={styles.tim} aria-labelledby="judul-anggota">
      <div className={styles.timJudul}><h2 id="judul-anggota">Anggota Tim</h2><p>{tim.length ? `${tim.length} pengurus mendampingi ${pimpinan[0]?.jabatan?.toLowerCase() || "kepengurusan"} ${nama}.` : "Anggota tim periode ini belum diisi."}</p></div>
      {tim.length > 0 && <div className={styles.anggota}>{tim.map(orang => <ProfilOrang key={orang.id} orang={orang} />)}</div>}
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
  </GerakProfil>;
}
