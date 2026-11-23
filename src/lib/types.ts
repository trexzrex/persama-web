export interface UkuranMedia {
  url?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Media {
  id: number;
  url?: string | null;
  teksAlternatif?: string | null;
  keterangan?: string | null;
  kredit?: string | null;
  filename?: string | null;
  filesize?: number | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  sizes?: Record<string, UkuranMedia | undefined> | null;
}

export type MediaRel = Media | number | null | undefined;

export interface Periode {
  id: number;
  nama: string;
  tahunMulai: number;
  tahunSelesai: number;
  aktif?: boolean | null;
  fotoInti?: MediaRel;
  fotoPembina?: MediaRel;
  tugasInti?: PoinTugas[] | null;
  kegiatanInti?: string | null;
  programInti?: ProgramKerja[] | null;
  keterangan?: string | null;
}

export interface PoinTugas {
  id?: string | null;
  poin: string;
}

export interface ProgramKerja {
  id?: string | null;
  judul: string;
  keterangan?: string | null;
}

export interface Divisi {
  id: number;
  nama: string;
  slug: string;
  deskripsiSingkat?: string | null;
  kegiatan?: string | null;
  tugasTanggungJawab?: PoinTugas[] | null;
  fotoGrup?: MediaRel;
  programKerja?: ProgramKerja[] | null;
  periode?: Periode | number | null;
  urutan?: number | null;
}

export type KelompokPengurus =
  | "penanggung_jawab"
  | "pembina"
  | "pengarah"
  | "pengurus_inti"
  | "koordinator_divisi"
  | "anggota_divisi";

export interface Pengurus {
  id: number;
  nama?: string | null;
  foto?: MediaRel;
  motto?: string | null;
  jabatan: string;
  kelompok: KelompokPengurus;
  divisi?: Divisi | number | null;
  periode?: Periode | number | null;
  urutan?: number | null;
}

export interface FotoGaleri {
  id?: string | null;
  foto: MediaRel;
  keterangan?: string | null;
}

export interface EventItem {
  id: number;
  judul: string;
  slug: string;
  poster?: MediaRel;
  tanggalMulai: string;
  tanggalSelesai?: string | null;
  lokasi?: string | null;
  deskripsi?: unknown;
  galeri?: FotoGaleri[] | null;
  divisiPenyelenggara?: (Divisi | number)[] | null;
  contoh?: boolean | null;
  _status?: string | null;
}

export interface Tabloid {
  id: number;
  judul: string;
  slug: string;
  edisi?: string | null;
  tanggalTerbit: string;
  deskripsiSingkat?: string | null;
  sampul?: MediaRel;
  berkasPdf?: MediaRel;
  contoh?: boolean | null;
  _status?: string | null;
}

export interface Ekstrakurikuler {
  id: number;
  nama: string;
  deskripsiSingkat?: string | null;
  gambarAtauLogo?: MediaRel;
  urutan?: number | null;
}

export interface TautanSosial {
  id?: string | null;
  nama: string;
  url: string;
}

export interface PengaturanSitus {
  namaSitus?: string | null;
  namaLengkap?: string | null;
  sekolah?: string | null;
  slogan?: string | null;
  pengenalan?: string | null;
  visi?: string | null;
  misi?: { id?: string | null; poin: string }[] | null;
  email?: string | null;
  instagram?: string | null;
  mediaSosial?: TautanSosial[] | null;
  fotoHero?: MediaRel;
  logoPersama?: MediaRel;
  logoSekolah?: MediaRel;
  gambarPratinjau?: MediaRel;
  teksFooter?: string | null;
}
