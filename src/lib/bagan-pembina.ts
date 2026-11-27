export const KELOMPOK_BAGAN = ["penanggung_jawab", "pengarah", "pembina"] as const;

export function kelompokBagan(nilai: unknown) {
  return KELOMPOK_BAGAN.some((kelompok) => kelompok === nilai);
}

export function idRelasi(nilai: unknown): number | undefined {
  const id = nilai && typeof nilai === "object" && "id" in nilai ? nilai.id : nilai;
  const angka = typeof id === "string" && /^\d+$/.test(id) ? Number(id) : id;
  return typeof angka === "number" && Number.isSafeInteger(angka) && angka > 0 ? angka : undefined;
}

export function indukMelingkar(anak: number, induk: number, relasi: ReadonlyMap<number, number>) {
  const dilihat = new Set([anak]);
  let kini: number | undefined = induk;
  while (kini !== undefined) {
    if (dilihat.has(kini)) return true;
    dilihat.add(kini);
    kini = relasi.get(kini);
  }
  return false;
}

type Entri = { id: number; indukBagan?: unknown; urutan?: number | null };
export type SimpulBagan<T> = { orang: T; anak: SimpulBagan<T>[] };

export function susunBaganPembina<T extends Entri>(orang: readonly T[]): SimpulBagan<T>[] {
  const urut = [...orang].sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0) || a.id - b.id);
  const simpul = new Map<number, SimpulBagan<T>>();
  const relasi = new Map<number, number>();
  const akar: SimpulBagan<T>[] = [];
  for (const anggota of urut) {
    simpul.set(anggota.id, { orang: anggota, anak: [] });
    const induk = idRelasi(anggota.indukBagan);
    if (induk !== undefined) relasi.set(anggota.id, induk);
  }
  for (const [id, node] of simpul) {
    const induk = relasi.get(id);
    const parent = induk !== undefined && !indukMelingkar(id, induk, relasi) ? simpul.get(induk) : undefined;
    if (parent) parent.anak.push(node);
    else akar.push(node);
  }
  return akar;
}
