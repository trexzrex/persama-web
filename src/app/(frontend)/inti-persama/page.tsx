import type { Metadata } from "next";
import { ProfilKelompok } from "@/components/site/ProfilKelompok";
import { ambilDivisi, ambilPengaturan, ambilPengurus, ambilPeriodeAktif } from "@/lib/content";

export const metadata: Metadata = {
  title: "INTI PERSAMA",
  description: "Foto bersama, tugas umum, anggota, dan kegiatan Pengurus Inti PERSAMA.",
};

export default async function IntiPersamaPage() {
  const periode = await ambilPeriodeAktif();
  const [anggota, divisi, pengaturan] = await Promise.all([
    ambilPengurus(periode?.id, { kelompok: ["pengurus_inti"] }),
    ambilDivisi(periode?.id),
    ambilPengaturan(),
  ]);
  const pertama = divisi[0];
  return <ProfilKelompok nama="INTI PERSAMA" periode={periode?.nama} foto={periode?.fotoInti}
    tugas={(periode?.tugasInti ?? []).filter(item => item.poin?.trim())}
    anggota={anggota} kegiatan={periode?.kegiatanInti}
    program={(periode?.programInti ?? []).filter(item => item.judul?.trim())}
    berikutnya={pertama ? { nama: pertama.nama, href: `/divisi/${pertama.slug}`, foto: pertama.fotoGrup } : undefined}
    ukuranFoto={pengaturan.ukuranFotoAnggota || "besar"}
  />;
}
