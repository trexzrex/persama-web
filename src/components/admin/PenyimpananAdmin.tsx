import { DefaultTemplate } from "@payloadcms/next/templates";
import { SetStepNav } from "@payloadcms/ui";
import type { AdminViewServerProps, Payload } from "payload";

import { formatAngka, formatByte, formatWaktu } from "@/lib/metrik-penyimpanan";
import TombolMuatUlang from "./TombolMuatUlang";

const KOLEKSI = [
  { slug: "event", label: "Event" },
  { slug: "tabloid", label: "E-Tabloid" },
  { slug: "pengurus", label: "Pengurus" },
  { slug: "divisi", label: "Divisi" },
  { slug: "ekstrakurikuler", label: "Ekstrakurikuler" },
  { slug: "media", label: "Media" },
  { slug: "periode", label: "Periode" },
] as const;

type BarisTabel = { nama: string; byte: number };
type Metrik = {
  database: number;
  tabel: BarisTabel[];
  media: { jumlah: number; byte: number };
  waktu: Date;
};
type PoolSederhana = {
  query: (teks: string) => Promise<{ rows: Record<string, unknown>[] }>;
};

async function bacaMetrik(payload: Payload): Promise<Metrik | null> {
  const pool = (payload.db as unknown as { pool?: PoolSederhana }).pool;
  if (!pool) return null;
  try {
    const [database, tabel, media] = await Promise.all([
      pool.query("select pg_database_size(current_database()) as bytes"),
      pool.query(
        `select c.relname as nama, pg_total_relation_size(c.oid) as bytes
         from pg_class c
         join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'public' and c.relkind = 'r'
         order by pg_total_relation_size(c.oid) desc
         limit 8`,
      ),
      pool.query(
        `select count(*)::int as jumlah,
                coalesce(sum(filesize), 0)
                + coalesce(sum(sizes_thumbnail_filesize), 0)
                + coalesce(sum(sizes_kartu_filesize), 0)
                + coalesce(sum(sizes_hero_filesize), 0) as bytes
         from media`,
      ),
    ]);
    const byteDatabase = Number(database.rows[0]?.bytes);
    const barisMedia = media.rows[0];
    if (!Number.isFinite(byteDatabase) || !barisMedia) return null;
    return {
      database: byteDatabase,
      tabel: tabel.rows
        .map((baris) => ({ nama: String(baris.nama), byte: Number(baris.bytes) || 0 }))
        .filter((baris) => baris.byte > 0),
      media: {
        jumlah: Number(barisMedia.jumlah) || 0,
        byte: Number(barisMedia.bytes) || 0,
      },
      waktu: new Date(),
    };
  } catch (galat) {
    payload.logger.error(
      `Gagal membaca metrik penyimpanan: ${galat instanceof Error ? galat.message : "galat tidak dikenal"}`,
    );
    return null;
  }
}

export default async function PenyimpananAdmin(props: AdminViewServerProps) {
  const { i18n, initPageResult, locale, params, payload, permissions, searchParams, user } =
    props;
  if (!user) return null;
  const { req } = initPageResult;

  const [metrik, jumlah] = await Promise.all([
    bacaMetrik(payload),
    Promise.all(
      KOLEKSI.map(async (item) => {
        try {
          const hasil = await payload.count({
            collection: item.slug,
            overrideAccess: false,
            user,
          });
          return hasil.totalDocs;
        } catch {
          return null;
        }
      }),
    ),
  ]);

  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <SetStepNav nav={[{ label: "Penyimpanan" }]} />
      <div className="persama-admin-storage">
        <header className="persama-admin-storage-head">
          <div>
            <p className="persama-admin-eyebrow">Ruang kelola PERSAMA</p>
            <h1>Penyimpanan</h1>
            <p>
              Pantau ukuran database dan berkas media. Angka diperbarui setiap halaman dimuat.
            </p>
          </div>
          <TombolMuatUlang />
        </header>

        <section aria-labelledby="ringkasan-penyimpanan">
          <h2 id="ringkasan-penyimpanan" className="persama-admin-storage-judul">
            Ringkasan
          </h2>
          <div className="persama-admin-storage-kartu">
            <article>
              <span>Ukuran database</span>
              <strong>{metrik ? formatByte(metrik.database) : "—"}</strong>
              <small>Termasuk indeks dan data internal PostgreSQL.</small>
            </article>
            <article>
              <span>Berkas media</span>
              <strong>{metrik ? formatAngka(metrik.media.jumlah) : "—"}</strong>
              <small>Jumlah dokumen di koleksi Media.</small>
            </article>
            <article>
              <span>Ukuran media tercatat</span>
              <strong>{metrik ? formatByte(metrik.media.byte) : "—"}</strong>
              <small>Total byte berkas asli dan turunan untuk koleksi Media.</small>
            </article>
            <article>
              <span>Diperbarui</span>
              <strong className="persama-admin-storage-waktu">
                {metrik ? formatWaktu(metrik.waktu) : "—"}
              </strong>
              <small>Waktu server (WITA).</small>
            </article>
          </div>
          {!metrik ? (
            <p className="persama-admin-storage-notice" role="status">
              Metrik database belum bisa dibaca. Jumlah dokumen di bawah tetap tersedia.
            </p>
          ) : null}
        </section>

        <section aria-labelledby="tabel-penyimpanan">
          <h2 id="tabel-penyimpanan" className="persama-admin-storage-judul">
            Tabel terbesar
          </h2>
          <p className="persama-admin-storage-catatan">
            Delapan tabel dengan ukuran terbesar di skema publik.
          </p>
          <div
            className="persama-admin-table-wrap"
            role="region"
            aria-labelledby="tabel-penyimpanan"
            tabIndex={0}
          >
            <table className="persama-admin-table persama-admin-table--ukuran">
              <caption className="persama-admin-sr">Ukuran delapan tabel terbesar</caption>
              <thead>
                <tr>
                  <th scope="col">Tabel</th>
                  <th scope="col">Ukuran</th>
                </tr>
              </thead>
              <tbody>
                {metrik && metrik.tabel.length > 0 ? (
                  metrik.tabel.map((baris) => (
                    <tr key={baris.nama}>
                      <th scope="row">{baris.nama}</th>
                      <td>{formatByte(baris.byte)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>Belum ada data tabel yang bisa ditampilkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="dokumen-penyimpanan">
          <h2 id="dokumen-penyimpanan" className="persama-admin-storage-judul">
            Dokumen per koleksi
          </h2>
          <p className="persama-admin-storage-catatan">
            Jumlah dokumen yang tersimpan di setiap koleksi konten.
          </p>
          <div
            className="persama-admin-table-wrap"
            role="region"
            aria-labelledby="dokumen-penyimpanan"
            tabIndex={0}
          >
            <table className="persama-admin-table persama-admin-table--jumlah">
              <caption className="persama-admin-sr">Jumlah dokumen per koleksi</caption>
              <thead>
                <tr>
                  <th scope="col">Koleksi</th>
                  <th scope="col">Dokumen</th>
                </tr>
              </thead>
              <tbody>
                {KOLEKSI.map((item, indeks) => (
                  <tr key={item.slug}>
                    <th scope="row">{item.label}</th>
                    <td>{jumlah[indeks] === null ? "—" : formatAngka(jumlah[indeks] ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DefaultTemplate>
  );
}
