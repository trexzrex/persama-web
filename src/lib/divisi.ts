import type { Pengurus } from "./types";

export function idDivisiPengurus(pengurus: Pengurus) {
  const nilai = pengurus.divisi;
  if (!nilai) return null;
  return typeof nilai === "object" ? nilai.id : nilai;
}

export function ringkasanDivisi(pengurus: Pengurus[], divisiId: number) {
  const anggota = pengurus.filter((orang) => idDivisiPengurus(orang) === divisiId);
  return {
    koordinator:
      anggota.find((orang) => orang.kelompok === "koordinator_divisi") ?? null,
    jumlahAnggota: anggota.filter((orang) => orang.kelompok === "anggota_divisi")
      .length,
  };
}
