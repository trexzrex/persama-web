import type { CollectionConfig } from "payload";

import { adminSaja, terbitSaja } from "../access";
import { kolomSlug } from "../fields/slug";

export const Event: CollectionConfig = {
  slug: "event",
  labels: {
    singular: "Event",
    plural: "Event",
  },
  admin: {
    useAsTitle: "judul",
    defaultColumns: ["judul", "tanggalMulai", "lokasi", "_status"],
    group: "Konten",
    description:
      "Informasi dan dokumentasi kegiatan. Status (akan datang / berlangsung / selesai) dihitung otomatis dari tanggal, bukan diisi manual.",
  },
  access: {
    read: terbitSaja,
    create: adminSaja,
    update: adminSaja,
    delete: adminSaja,
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 20,
  },
  defaultSort: "-tanggalMulai",
  fields: [
    {
      name: "judul",
      type: "text",
      label: "Judul event",
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
          "Centang bila isi event masih ilustratif. Situs menampilkan badge \"Contoh\" pada kartu event.",
      },
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      label: "Poster",
      admin: {
        description:
          "Rasio tegak atau persegi lebih rapi di kartu. Bila kosong, situs memakai placeholder netral.",
      },
    },
    {
      name: "tanggalMulai",
      type: "date",
      label: "Tanggal mulai",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMMM yyyy",
        },
        description: "Waktu mengikuti zona Asia/Makassar (WITA).",
      },
    },
    {
      name: "tanggalSelesai",
      type: "date",
      label: "Tanggal selesai",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMMM yyyy",
        },
        description:
          "Kosongkan bila event hanya satu hari. Event tanpa tanggal selesai dianggap berlangsung pada tanggal mulai.",
      },
    },
    {
      name: "lokasi",
      type: "text",
      label: "Lokasi",
      maxLength: 160,
    },
    {
      name: "deskripsi",
      type: "richText",
      label: "Deskripsi",
      admin: {
        description: "Teks sederhana: paragraf, daftar, dan tautan.",
      },
    },
    {
      name: "galeri",
      type: "array",
      label: "Galeri dokumentasi",
      labels: { singular: "Foto", plural: "Foto dokumentasi" },
      maxRows: 30,
      admin: {
        initCollapsed: true,
        description: "Maksimal 30 foto per event untuk menjaga kuota.",
      },
      fields: [
        {
          name: "foto",
          type: "upload",
          relationTo: "media",
          label: "Foto",
          required: true,
        },
        {
          name: "keterangan",
          type: "text",
          label: "Keterangan",
        },
      ],
    },
    {
      name: "divisiPenyelenggara",
      type: "relationship",
      relationTo: "divisi",
      hasMany: true,
      label: "Divisi penyelenggara",
      admin: {
        description:
          "Boleh lebih dari satu. Event otomatis muncul di halaman divisi yang dipilih.",
      },
    },
  ],
};
