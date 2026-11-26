import config from "@payload-config";
import { getPayload } from "payload";
import type { Where } from "payload";
import { cache } from "react";

import type {
  Divisi,
  Ekstrakurikuler,
  EventItem,
  Media,
  MediaRel,
  PengaturanSitus,
  Pengurus,
  Periode,
  Tabloid,
} from "./types";

/** Klien Payload lokal, dipakai server component dan route handler. */
export const ambilPayload = cache(async () => getPayload({ config }));

export const PENGATURAN_AWAL: PengaturanSitus = {
  namaSitus: "PERSAMA",
  namaLengkap: "Persatuan Siswa Analis Kimia",
  sekolah: "SMK-SMAK Makassar",
};

async function aman<T>(
  label: string,
  fn: () => Promise<T>,
  cadangan: T,
): Promise<T> {
  const jumlahPercobaan = 3;

  for (let percobaan = 1; percobaan <= jumlahPercobaan; percobaan += 1) {
    try {
      return await fn();
    } catch (galat) {
      if (percobaan === jumlahPercobaan) {
        console.error(`[konten] gagal memuat ${label}:`, galat);
        return cadangan;
      }
      // Pooler Supabase kadang menolak sambungan sesaat; coba lagi sebentar.
      await new Promise((selesai) => setTimeout(selesai, 300 * percobaan));
    }
  }

  return cadangan;
}

export function mediaObjek(nilai: MediaRel): Media | null {
  if (!nilai || typeof nilai !== "object") return null;
  return nilai as Media;
}

export function alamatMedia(
  nilai: MediaRel,
  ukuran?: "thumbnail" | "kartu" | "hero",
): string | null {
  const media = mediaObjek(nilai);
  if (!media) return null;
  if (ukuran) {
    const versi = media.sizes?.[ukuran];
    if (versi?.url) return versi.url;
  }
  return media.url ?? null;
}

export function teksAltMedia(
  nilai: MediaRel,
  cadangan = "Foto PERSAMA",
): string {
  const media = mediaObjek(nilai);
  return (
    media?.teksAlternatif?.trim() ||
    media?.keterangan?.trim() ||
    cadangan
  );
}

export function ukuranBerkas(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export const ambilPengaturan = cache(async (): Promise<PengaturanSitus> => {
  const hasil = await aman(
    "pengaturan situs",
    async () => {
      const payload = await ambilPayload();
      return (await payload.findGlobal({
        overrideAccess: false,
        slug: "pengaturan-situs",
        depth: 1,
      })) as unknown as PengaturanSitus;
    },
    {},
  );

  return { ...PENGATURAN_AWAL, ...hasil };
});

export const ambilPeriodeAktif = cache(async (): Promise<Periode | null> => {
  return aman(
    "periode aktif",
    async () => {
      const payload = await ambilPayload();
      const aktif = await payload.find({
        overrideAccess: false,
        collection: "periode",
        where: { aktif: { equals: true } },
        limit: 1,
        depth: 1,
        sort: "-tahunMulai",
      });
      if (aktif.docs.length > 0) {
        return aktif.docs[0] as unknown as Periode;
      }
      const terbaru = await payload.find({
        overrideAccess: false,
        collection: "periode",
        limit: 1,
        depth: 1,
        sort: "-tahunMulai",
      });
      return (terbaru.docs[0] as unknown as Periode) ?? null;
    },
    null,
  );
});

export const ambilDaftarPeriode = cache(async (): Promise<Periode[]> => {
  return aman(
    "daftar periode",
    async () => {
      const payload = await ambilPayload();
      const hasil = await payload.find({
        overrideAccess: false,
        collection: "periode",
        limit: 50,
        depth: 0,
        sort: "-tahunMulai",
      });
      return hasil.docs as unknown as Periode[];
    },
    [],
  );
});

export const ambilPeriodeById = cache(
  async (id: number): Promise<Periode | null> => {
    return aman(
      "periode",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.findByID({
          overrideAccess: false,
          collection: "periode",
          id,
          depth: 0,
        });
        return (hasil as unknown as Periode) ?? null;
      },
      null,
    );
  },
);

export const ambilDivisi = cache(
  async (periodeId?: number | null): Promise<Divisi[]> => {
    if (!periodeId) return [];
    return aman(
      "divisi",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "divisi",
          where: { periode: { equals: periodeId } },
          limit: 50,
          depth: 1,
          sort: "urutan",
        });
        return hasil.docs as unknown as Divisi[];
      },
      [],
    );
  },
);

export const ambilDivisiBySlug = cache(
  async (slug: string): Promise<Divisi | null> => {
    return aman(
      "detail divisi",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "divisi",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        });
        return (hasil.docs[0] as unknown as Divisi) ?? null;
      },
      null,
    );
  },
);

export const ambilPengurus = cache(
  async (
    periodeId?: number | null,
    opsi?: { divisiId?: number; kelompok?: string[] },
  ): Promise<Pengurus[]> => {
    if (!periodeId) return [];
    return aman(
      "pengurus",
      async () => {
        const payload = await ambilPayload();
        const syarat: Where[] = [
          { periode: { equals: periodeId } },
        ];
        if (opsi?.divisiId) {
          syarat.push({ divisi: { equals: opsi.divisiId } });
        }
        if (opsi?.kelompok?.length) {
          syarat.push({ kelompok: { in: opsi.kelompok } });
        }
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "pengurus",
          where: { and: syarat },
          limit: 200,
          depth: 1,
          sort: "urutan",
        });
        return hasil.docs as unknown as Pengurus[];
      },
      [],
    );
  },
);

export const ambilEvent = cache(async (): Promise<EventItem[]> => {
  return aman(
    "event",
    async () => {
      const payload = await ambilPayload();
      const hasil = await payload.find({
        overrideAccess: false,
        collection: "event",
        limit: 200,
        depth: 1,
        sort: "-tanggalMulai",
      });
      return hasil.docs as unknown as EventItem[];
    },
    [],
  );
});

export const ambilEventBySlug = cache(
  async (slug: string): Promise<EventItem | null> => {
    return aman(
      "detail event",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "event",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        });
        return (hasil.docs[0] as unknown as EventItem) ?? null;
      },
      null,
    );
  },
);

export const ambilEventDivisi = cache(
  async (divisiId: number): Promise<EventItem[]> => {
    return aman(
      "event divisi",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "event",
          where: { divisiPenyelenggara: { in: [divisiId] } },
          limit: 6,
          depth: 1,
          sort: "-tanggalMulai",
        });
        return hasil.docs as unknown as EventItem[];
      },
      [],
    );
  },
);

export const ambilTabloid = cache(async (): Promise<Tabloid[]> => {
  return aman(
    "e-tabloid",
    async () => {
      const payload = await ambilPayload();
      const hasil = await payload.find({
        overrideAccess: false,
        collection: "tabloid",
        limit: 100,
        depth: 1,
        sort: "-tanggalTerbit",
      });
      return hasil.docs as unknown as Tabloid[];
    },
    [],
  );
});

export const ambilTabloidBySlug = cache(
  async (slug: string): Promise<Tabloid | null> => {
    return aman(
      "detail e-tabloid",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "tabloid",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1,
        });
        return (hasil.docs[0] as unknown as Tabloid) ?? null;
      },
      null,
    );
  },
);

export const ambilEkstrakurikuler = cache(
  async (): Promise<Ekstrakurikuler[]> => {
    return aman(
      "ekstrakurikuler",
      async () => {
        const payload = await ambilPayload();
        const hasil = await payload.find({
          overrideAccess: false,
          collection: "ekstrakurikuler",
          limit: 100,
          depth: 1,
          sort: "urutan",
        });
        return hasil.docs as unknown as Ekstrakurikuler[];
      },
      [],
    );
  },
);
