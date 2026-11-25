import type { Payload, ServerProps } from "payload";

export const SUMMARY = [
  { slug: "event", label: "Event", description: "Agenda dan dokumentasi" },
  { slug: "tabloid", label: "E-Tabloid", description: "Publikasi digital" },
  { slug: "pengurus", label: "Pengurus", description: "Struktur kepengurusan" },
  { slug: "media", label: "Media", description: "Foto dan berkas" },
] as const;

type Collection = (typeof SUMMARY)[number]["slug"];
export type DashboardItem = {
  id: string | number;
  collection: Collection;
  title: string;
  updatedAt: string;
  status?: string | null;
  date?: string | null;
  location?: string | null;
};

export async function loadDashboard(payload: Payload, user: ServerProps["user"], now = new Date()) {
  let failed = false;
  const base = { overrideAccess: false as const, user, depth: 0, pagination: false as const };
  const countsPromise = Promise.all(SUMMARY.map(async ({ slug }) => {
    try { return (await payload.count({ collection: slug, overrideAccess: false, user })).totalDocs; }
    catch { failed = true; return null; }
  }));
  const lists = await Promise.all(SUMMARY.map(async ({ slug }) => {
    try {
      const select: Record<string, true> = slug === "pengurus" ? { nama: true, updatedAt: true } as const : slug === "media" ? { filename: true, alt: true, updatedAt: true } as const : { judul: true, updatedAt: true, _status: true } as const;
      const result = await payload.find({ ...base, collection: slug, sort: "-updatedAt", limit: 5, draft: true, select });
      return result.docs.map((doc): DashboardItem => ({
        id: doc.id, collection: slug,
        title: ("judul" in doc && doc.judul) || ("nama" in doc && doc.nama) || ("filename" in doc && doc.filename) || "Tanpa judul",
        updatedAt: doc.updatedAt,
        status: "_status" in doc ? doc._status : undefined,
      }));
    } catch { failed = true; return []; }
  }));
  const draftsPromise = Promise.all((["event", "tabloid"] as const).map(async (collection) => {
    try {
      const result = await payload.find({ ...base, collection, draft: true, where: { _status: { equals: "draft" } }, sort: "-updatedAt", limit: 5, select: { judul: true, updatedAt: true, _status: true } });
      return result.docs.map((doc): DashboardItem => ({ id: doc.id, collection, title: String(doc.judul || "Tanpa judul"), updatedAt: String(doc.updatedAt), status: typeof doc._status === "string" ? doc._status : undefined }));
    } catch { failed = true; return []; }
  }));
  const agendaPromise = (async () => {
    try {
      const result = await payload.find({ ...base, collection: "event", draft: false, where: { and: [{ _status: { equals: "published" } }, { tanggalMulai: { greater_than_equal: now.toISOString() } }] }, sort: "tanggalMulai", limit: 3, select: { judul: true, tanggalMulai: true, lokasi: true, updatedAt: true } });
      return result.docs.map((doc): DashboardItem => ({ id: doc.id, collection: "event", title: String(doc.judul || "Tanpa judul"), updatedAt: String(doc.updatedAt), date: typeof doc.tanggalMulai === "string" ? doc.tanggalMulai : null, location: typeof doc.lokasi === "string" ? doc.lokasi : null }));
    } catch { failed = true; return []; }
  })();
  const [counts, drafts, agenda] = await Promise.all([countsPromise, draftsPromise, agendaPromise]);
  const latest = (items: DashboardItem[]) => items.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 5);
  return { counts, recent: latest(lists.flat()), drafts: latest(drafts.flat()), agenda, failed };
}
