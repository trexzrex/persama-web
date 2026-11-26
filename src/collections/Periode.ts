import type { CollectionConfig } from "payload";

import { adminSaja, siapaSaja } from "../access";

export const Periode: CollectionConfig = {
  slug: "periode",
  labels: {
    singular: "Periode",
    plural: "Periode Kepengurusan",
  },
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "tahunMulai", "tahunSelesai", "aktif"],
    group: "Kepengurusan",
    description:
      "Satu periode aktif pada satu waktu. Menandai periode baru sebagai aktif otomatis mengarsipkan periode lama.",
  },
  access: {
    read: siapaSaja,
    create: adminSaja,
    update: adminSaja,
    delete: adminSaja,
  },
  defaultSort: "-tahunMulai",
  fields: [
    {
      name: "nama",
      type: "text",
      label: "Nama periode",
      required: true,
      admin: {
        description: "Tulis persis, contoh: 2026–2027.",
        components: {
          Cell: "@/components/admin/SelPeriode#default",
        },
      },
    },
    {
      name: "tahunMulai",
      type: "number",
      label: "Tahun mulai",
      required: true,
      min: 1900,
      max: 2200,
    },
    {
      name: "tahunSelesai",
      type: "number",
      label: "Tahun selesai",
      required: true,
      min: 1900,
      max: 2200,
    },
    {
      name: "aktif",
      type: "checkbox",
      label: "Periode aktif",
      defaultValue: false,
      admin: {
        description:
          "Hanya boleh satu. Bila dicentang, periode lain otomatis dinonaktifkan.",
      },
    },
    {
      name: "fotoInti",
      type: "upload",
      relationTo: "media",
      label: "Foto Pengurus Inti",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        description: "Unggah foto bersama Pengurus Inti periode ini, lalu simpan. Foto tampil pada kotak INTI di beranda. Disarankan horizontal 16:9.",
      },
    },
    {
      name: "fotoPembina",
      type: "upload",
      relationTo: "media",
      label: "Foto Pembina",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        description: "Unggah foto bersama Pembina periode ini, lalu simpan. Foto tersimpan khusus untuk periode ini.",
      },
    },
    {
      name: "tugasInti",
      type: "array",
      label: "Tugas Umum INTI PERSAMA",
      fields: [{ name: "poin", type: "text", label: "Poin tugas", required: true }],
    },
    {
      name: "kegiatanInti",
      type: "textarea",
      label: "What we do — uraian kegiatan INTI",
    },
    {
      name: "programInti",
      type: "array",
      label: "Program dan kegiatan INTI",
      fields: [
        { name: "judul", type: "text", label: "Judul", required: true },
        { name: "keterangan", type: "textarea", label: "Keterangan" },
      ],
    },
    {
      name: "keterangan",
      type: "textarea",
      label: "Keterangan",
      admin: {
        description: "Catatan singkat, misalnya tanggal pelantikan.",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (!data.aktif || req.context?.lewatiHookPeriode) return data;

        const lain = await req.payload.find({
          collection: "periode",
          where: {
            aktif: { equals: true },
            ...(originalDoc?.id
              ? { id: { not_equals: originalDoc.id } }
              : {}),
          },
          limit: 100,
          depth: 0,
          req,
        });

        for (const dokumen of lain.docs) {
          await req.payload.update({
            collection: "periode",
            id: dokumen.id,
            data: { aktif: false },
            depth: 0,
            req,
            context: { lewatiHookPeriode: true },
          });
        }

        return data;
      },
    ],
  },
};
