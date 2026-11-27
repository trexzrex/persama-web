import { sql } from "@payloadcms/db-postgres";
import { ValidationError, type CollectionConfig, type Where } from "payload";

import { adminSaja, siapaSaja } from "../access";
import { idRelasi, KELOMPOK_BAGAN, kelompokBagan } from "../lib/bagan-pembina";

const kelompok = [
  { label: "Penanggung jawab", value: "penanggung_jawab" },
  { label: "Pembina", value: "pembina" },
  { label: "Pengarah", value: "pengarah" },
  { label: "Pengurus inti", value: "pengurus_inti" },
  { label: "Koordinator divisi", value: "koordinator_divisi" },
  { label: "Anggota divisi", value: "anggota_divisi" },
];

export const Pengurus: CollectionConfig = {
  slug: "pengurus",
  labels: {
    singular: "Pengurus",
    plural: "Pengurus",
  },
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "jabatan", "kelompok", "divisi", "periode"],
    group: "Kepengurusan",
    description:
      "Satu tabel untuk semua orang pada struktur kepengurusan. Tidak ada kolom kelas.",
  },
  access: {
    read: siapaSaja,
    create: adminSaja,
    update: adminSaja,
    delete: adminSaja,
  },
  defaultSort: "urutan",
  hooks: {
    beforeOperation: [async ({ operation, req }) => {
      if (operation !== "create" && operation !== "update") return;
      const transaction = await req.transactionID;
      const db = transaction == null ? undefined : req.payload.db.sessions?.[transaction]?.db;
      if (!db || typeof db !== "object" || !("execute" in db) || typeof db.execute !== "function") {
        throw new Error("Perubahan Pengurus memerlukan transaksi PostgreSQL.");
      }
      // Take the lock before Payload reads the previous document, not after validation.
      await db.execute(sql`SELECT pg_advisory_xact_lock(17019, 1)`);
    }],
    beforeChange: [async ({ data, originalDoc, req }) => {
      const kini = { ...originalDoc, ...data };
      const id = idRelasi(originalDoc?.id);
      const periode = idRelasi(kini.periode);
      const induk = idRelasi(kini.indukBagan);
      const tolak = (message: string) => {
        throw new ValidationError({ errors: [{ path: "indukBagan", message }] });
      };

      if (induk !== undefined) {
        if (!periode || !kelompokBagan(kini.kelompok)) {
          tolak("Induk hanya berlaku untuk penanggung jawab, pengarah, dan pembina dalam satu periode.");
        }
        const dilihat = new Set(id === undefined ? [] : [id]);
        let berikut: number | undefined = induk;
        while (berikut !== undefined) {
          if (dilihat.has(berikut)) tolak("Induk tidak boleh membuat hubungan melingkar di bagan.");
          dilihat.add(berikut);
          const parent = await req.payload.findByID({ collection: "pengurus", id: berikut, depth: 0, disableErrors: true, req });
          if (!parent || idRelasi(parent.periode) !== periode || !kelompokBagan(parent.kelompok)) {
            tolak("Pilih induk dari penanggung jawab, pengarah, atau pembina pada periode yang sama.");
          }
          berikut = idRelasi(parent?.indukBagan);
        }
      }

      if (id !== undefined && (periode !== idRelasi(originalDoc.periode) || !kelompokBagan(kini.kelompok))) {
        const anak = await req.payload.find({ collection: "pengurus", where: { indukBagan: { equals: id } }, depth: 0, limit: 1, req });
        if (anak.docs.length) tolak("Lepas atau pindahkan cabang yang terhubung sebelum mengubah kelompok atau periode.");
      }
      return data;
    }],
  },
  fields: [
    {
      name: "nama",
      type: "text",
      label: "Nama",
      admin: {
        description:
          "Tulis persis seperti sumber, termasuk gelar dan tanda baca. Boleh dikosongkan bila jabatan memang tanpa nama pribadi.",
      },
    },
    {
      name: "foto",
      type: "upload",
      relationTo: "media",
      label: "Foto",
      admin: {
        description:
          "Foto potret. Syarat: rasio 4:5 atau 3:4, minimal 800 × 1000 piksel (ideal 1200 × 1500), JPG/PNG/WebP maksimal 2 MB, subjek dari pinggang ke atas dengan ruang kepala sekitar 10%, latar terang dan pencahayaan rata. Bila kosong, situs memakai placeholder netral.",
      },
    },
    {
      name: "motto",
      type: "textarea",
      label: "Motto",
      maxLength: 500,
      admin: { description: "Motto pribadi yang tampil bersama foto anggota pada halaman INTI atau divisi. Boleh dikosongkan." },
    },
    {
      name: "jabatan",
      type: "text",
      label: "Jabatan",
      required: true,
      admin: {
        description:
          "Teks bebas, termasuk jabatan tanpa nama, contoh: Kepala Sub. Bagian Tata Usaha.",
      },
    },
    {
      name: "kelompok",
      type: "select",
      label: "Kelompok",
      required: true,
      options: kelompok,
    },
    {
      name: "divisi",
      type: "relationship",
      relationTo: "divisi",
      label: "Divisi",
      admin: {
        description:
          "Kosongkan untuk pengurus inti, penanggung jawab, pengarah, dan pembina umum.",
      },
    },
    {
      name: "periode",
      type: "relationship",
      relationTo: "periode",
      label: "Periode",
      required: true,
    },
    {
      name: "indukBagan",
      type: "relationship",
      relationTo: "pengurus",
      label: "Induk di bagan",
      maxDepth: 0,
      filterOptions: ({ id, siblingData }) => {
        const periode = idRelasi(siblingData && typeof siblingData === "object" && "periode" in siblingData ? siblingData.periode : undefined);
        if (!periode) return false;
        const diri = idRelasi(id);
        const and: Where[] = [{ periode: { equals: periode } }, { kelompok: { in: [...KELOMPOK_BAGAN] } }];
        if (diri !== undefined) and.push({ id: { not_equals: diri } });
        return { and };
      },
      admin: {
        condition: (data) => kelompokBagan(data.kelompok),
        allowCreate: false,
        allowEdit: false,
        description: "Pilih orang yang langsung menaungi jabatan ini di /tentang. Kosongkan untuk posisi mandiri. Untuk jabatan tanpa nama, cocokkan ID dengan daftar Pengurus.",
      },
    },
    {
      name: "urutan",
      type: "number",
      label: "Urutan tampil",
      defaultValue: 0,
      admin: {
        description:
          "Dipakai untuk mengatur urutan dalam kelompok dan divisi. Angka kecil tampil lebih dulu.",
      },
    },
  ],
};
