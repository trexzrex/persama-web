import type { CollectionConfig } from "payload";

import { adminSaja, siapaSaja } from "../access";

export const Ekstrakurikuler: CollectionConfig = {
  slug: "ekstrakurikuler",
  labels: {
    singular: "Ekstrakurikuler",
    plural: "Ekstrakurikuler",
  },
  admin: {
    useAsTitle: "nama",
    defaultColumns: ["nama", "urutan"],
    group: "Konten",
    description:
      "Kartu ekstrakurikuler saja. Tidak ada halaman detail dan tidak ada pendaftaran.",
  },
  access: {
    read: siapaSaja,
    create: adminSaja,
    update: adminSaja,
    delete: adminSaja,
  },
  defaultSort: "urutan",
  fields: [
    {
      name: "nama",
      type: "text",
      label: "Nama ekstrakurikuler",
      required: true,
      admin: {
        description: "Tulis persis, contoh: Remaja Masjid Ibnu Hayyan.",
      },
    },
    {
      name: "deskripsiSingkat",
      type: "textarea",
      label: "Deskripsi singkat",
      maxLength: 240,
    },
    {
      name: "gambarAtauLogo",
      type: "upload",
      relationTo: "media",
      label: "Gambar atau logo",
    },
    {
      name: "urutan",
      type: "number",
      label: "Urutan tampil",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
  ],
};
