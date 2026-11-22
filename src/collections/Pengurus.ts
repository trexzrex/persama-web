import type { CollectionConfig } from "payload";

import { adminSaja, siapaSaja } from "../access";

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
          "Foto potret. Bila kosong, situs memakai placeholder netral.",
      },
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
