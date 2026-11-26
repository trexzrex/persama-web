import type { CollectionConfig } from "payload";

import { adminSaja, terbitSaja } from "../access";
import { kolomSlug } from "../fields/slug";

export const Tabloid: CollectionConfig = {
  slug: "tabloid",
  labels: {
    singular: "E-Tabloid",
    plural: "E-Tabloid",
  },
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "edisi", "tanggalTerbit", "_status"],
    group: "Konten",
    description:
      "Edisi tabloid digital. Pembaca di situs memakai berkas PDF; tombol unduh selalu tersedia.",
  },
  access: {
    read: terbitSaja,
    create: adminSaja,
    update: adminSaja,
    delete: adminSaja,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  defaultSort: "-tanggalTerbit",
  fields: [
    {
      name: "judul",
      type: "text",
      label: "Judul edisi",
      required: true,
      maxLength: 140,
    },
    kolomSlug("judul"),
    {
      name: "contoh",
      type: "checkbox",
      label: "Konten contoh",
      defaultValue: false,
      admin: {
        description:
          "Centang bila isi edisi masih ilustratif. Situs menampilkan badge \"Contoh\" pada sampul dan arsip.",
      },
    },
    {
      name: "edisi",
      type: "text",
      label: "Edisi",
      admin: {
        description: "Contoh: Edisi 1 / 2026.",
      },
    },
    {
      name: "tanggalTerbit",
      type: "date",
      label: "Tanggal terbit",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMMM yyyy",
        },
      },
    },
    {
      name: "deskripsiSingkat",
      type: "textarea",
      label: "Deskripsi singkat",
      maxLength: 300,
      admin: {
        description: "Tampil di kartu daftar dan di atas pembaca.",
      },
    },
    {
      name: "sampul",
      type: "upload",
      relationTo: "media",
      label: "Sampul",
      admin: {
        description:
          "Gambar sampul edisi. Bila kosong, situs memakai placeholder netral.",
      },
    },
    {
      name: "berkasPdf",
      type: "upload",
      relationTo: "media",
      label: "Berkas PDF",
      required: true,
      admin: {
        description:
          "Unggah lewat koleksi Media dengan tipe application/pdf. Ukuran berkas tampil di tombol unduh.",
      },
      filterOptions: {
        mimeType: { equals: "application/pdf" },
      },
    },
  ],
};
