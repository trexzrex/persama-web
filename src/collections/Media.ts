import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Media",
  },
  admin: {
    useAsTitle: "teksAlternatif",
    defaultColumns: ["teksAlternatif", "keterangan", "updatedAt"],
    group: "Konten",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "teksAlternatif",
      type: "text",
      label: "Teks alternatif",
      required: true,
      admin: {
        description: "Deskripsi singkat untuk pembaca layar dan saat gambar gagal dimuat.",
      },
    },
    {
      name: "keterangan",
      type: "text",
      label: "Keterangan",
    },
    {
      name: "kredit",
      type: "text",
      label: "Fotografer / sumber",
    },
  ],
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 480,
        position: "centre",
      },
      {
        name: "kartu",
        width: 800,
        height: 600,
        position: "centre",
      },
      {
        name: "hero",
        width: 1600,
        height: 1200,
        position: "centre",
      },
    ],
  },
};
