import { BerandaTampilan } from "@/components/site/BerandaTampilan";
import type { EkskulBeranda, EventBeranda } from "@/components/site/BerandaKlien";
import {
  alamatMedia,
  ambilDivisi,
  ambilEkstrakurikuler,
  ambilEvent,
  ambilPengaturan,
  ambilPeriodeAktif,
  ambilTabloid,
  mediaObjek,
  teksAltMedia,
  ukuranBerkas,
} from "@/lib/content";
import { formatRentangTanggal, statusEvent } from "@/lib/format";
import type { EventItem, Tabloid } from "@/lib/types";

function eventUntukBeranda(events: EventItem[]): EventItem[] {
  const akanDatang = events
    .filter((event) => statusEvent(event) !== "selesai")
    .sort(
      (a, b) =>
        new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime(),
    );
  const selesai = events
    .filter((event) => statusEvent(event) === "selesai")
    .sort(
      (a, b) =>
        new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime(),
    );
  return [...akanDatang, ...selesai].slice(0, 6);
}

function tautanUnduh(tabloid: Tabloid) {
  const berkas = mediaObjek(tabloid.berkasPdf);
  if (!berkas?.url) return null;
  return {
    url: berkas.url,
    ukuran: ukuranBerkas(berkas.filesize),
  };
}

export default async function Home() {
  const [pengaturan, periode] = await Promise.all([
    ambilPengaturan(),
    ambilPeriodeAktif(),
  ]);
  const [divisi, events, tabloid, ekskul] = await Promise.all([
    ambilDivisi(periode?.id),
    ambilEvent(),
    ambilTabloid(),
    ambilEkstrakurikuler(),
  ]);

  const nama = pengaturan.namaSitus?.trim() || "PERSAMA";
  const namaLengkap =
    pengaturan.namaLengkap?.trim() || "Persatuan Siswa Analis Kimia";
  const sekolah = pengaturan.sekolah?.trim() || "SMK-SMAK Makassar";
  const tahun = periode?.nama?.trim() || "2026/2027";
  const fotoHero = alamatMedia(pengaturan.fotoHero);
  const visi = pengaturan.visi?.trim();
  const misi = (pengaturan.misi ?? []).filter((item) => item.poin?.trim());

  const kartuEvent: EventBeranda[] = eventUntukBeranda(events).map((event) => ({
    id: event.id,
    slug: event.slug,
    judul: event.judul,
    tanggal: formatRentangTanggal(event.tanggalMulai, event.tanggalSelesai),
    lokasi: event.lokasi?.trim() || "",
    status: statusEvent(event),
    posterUrl: alamatMedia(event.poster, "kartu") || alamatMedia(event.poster),
    posterAlt: teksAltMedia(event.poster, `Poster ${event.judul}`),
    contoh: Boolean(event.contoh),
  }));

  const kartuEkskul: EkskulBeranda[] = ekskul.slice(0, 4).map((item) => ({
    id: item.id,
    nama: item.nama,
    deskripsi: item.deskripsiSingkat?.trim() || "",
    gambarUrl:
      alamatMedia(item.gambarAtauLogo, "kartu") ||
      alamatMedia(item.gambarAtauLogo),
    gambarAlt: teksAltMedia(item.gambarAtauLogo, `Gambar ${item.nama}`),
  }));

  const tabloidUtama = tabloid[0] ?? null;
  const arsip = tabloid.slice(1, 4).map((item) => ({
    id: item.id,
    slug: item.slug,
    judul: item.judul,
    tanggalTerbit: item.tanggalTerbit,
    sampulUrl: alamatMedia(item.sampul, "thumbnail") || alamatMedia(item.sampul),
    contoh: Boolean(item.contoh),
  }));
  const unduhan = tabloidUtama ? tautanUnduh(tabloidUtama) : null;
  const sampulUtama = tabloidUtama
    ? alamatMedia(tabloidUtama.sampul, "kartu") || alamatMedia(tabloidUtama.sampul)
    : null;

  return (
    <BerandaTampilan
      nama={nama}
      namaLengkap={namaLengkap}
      sekolah={sekolah}
      tahun={tahun}
      fotoHero={fotoHero}
      visi={visi}
      misi={misi}
      events={kartuEvent}
      divisi={divisi.map((item) => ({
        id: item.id,
        slug: item.slug,
        nama: item.nama,
        fotoUrl: alamatMedia(item.fotoGrup),
        fotoAlt: teksAltMedia(item.fotoGrup, `Foto anggota divisi ${item.nama}`),
      }))}
      ekskul={kartuEkskul}
      tabloidUtama={tabloidUtama}
      arsip={arsip}
      unduhan={unduhan}
      sampulUtama={sampulUtama}
    />
  );
}
