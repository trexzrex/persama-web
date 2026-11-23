import type { Pengurus } from "./types";

/** Pimpinan ditentukan dari kelompok/jabatan, bukan posisi pertama dalam daftar. */
export function susunanTim(anggota: Pengurus[]) {
  const pimpinan = anggota.filter((orang) =>
    orang.kelompok === "koordinator_divisi" ||
    (orang.kelompok === "pengurus_inti" && /^ketua(?:\s|$)/i.test(orang.jabatan.trim())),
  );
  const ids = new Set(pimpinan.map((orang) => orang.id));
  return { pimpinan, tim: anggota.filter((orang) => !ids.has(orang.id)) };
}
