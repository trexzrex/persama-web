import type { CollectionConfig } from "payload";

import { kolomSlug } from "../fields/slug";
import { adminSaja, siapaSaja } from "../access";

export const Divisi: CollectionConfig = {
  slug: "divisi",
  labels: {
    singular: "Divisi",
    plural: "Divisi",
  },
  admin: {
    components: {
      views: {
        list: { Component: "@/components/admin/DivisiBertingkat" },
      },
    },
    useAsTitle: "nama",
    defaultColumns: ["nama", "periode", "urutan"],
    group: "Kepengurusan",
    description:
      "Kelola divisi per periode, termasuk foto anggota untuk beranda. Divisi baru otomatis tampil sesuai periode aktif dan urutan.",
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
      label: "Nama divisi",
      required: true,
      admin: {
        description:
          "Tulis persis, contoh: Hubungan Masyarakat, Pendidikan dan Latihan, Seni dan Olahraga.",
      },
    },
    kolomSlug("nama"),
    {
      name: "deskripsiSingkat",
      type: "textarea",
      label: "Deskripsi singkat",
      maxLength: 240,
      admin: {
        description:
          "Satu sampai dua kalimat. Dipakai di kartu daftar divisi dan beranda.",
      },
    },
    {
      name: "tugasTanggungJawab",
      type: "array",
      label: "Tugas dan tanggung jawab",
      labels: { singular: "Poin tugas", plural: "Poin tugas" },
      admin: { initCollapsed: true },
      fields: [
        {
          name: "poin",
          type: "text",
          label: "Poin",
          required: true,
        },
      ],
    },
    {
      name: "fotoGrup",
      type: "upload",
      relationTo: "media",
      label: "Foto anggota divisi",
      filterOptions: { mimeType: { contains: "image" } },
      admin: {
        description:
          "Unggah atau ganti foto bersama anggota langsung di sini, lalu simpan divisi. Dipakai pada kotak divisi di beranda, daftar divisi, dan detail divisi. Disarankan foto horizontal 16:9; posisikan semua anggota di tengah. Tanpa foto, situs menampilkan placeholder netral.",
      },
    },
    {
      name: "programKerja",
      type: "array",
      label: "Program kerja",
      labels: { singular: "Program", plural: "Program kerja" },
      admin: { initCollapsed: true },
      fields: [
        {
          name: "judul",
          type: "text",
          label: "Judul program",
          required: true,
        },
        {
          name: "keterangan",
          type: "textarea",
          label: "Keterangan",
        },
      ],
    },
    {
      name: "periode",
      type: "relationship",
      relationTo: "periode",
      label: "Periode",
      required: true,
      admin: {
        position: "sidebar",
        description: "Divisi hanya tampil pada periode yang dipilih.",
      },
    },
    {
      name: "urutan",
      type: "number",
      label: "Urutan tampil",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Angka kecil tampil lebih dulu. Urutan yang disarankan: Humas, Diklat, Dana dan Usaha, Kerohanian Islam, Kerohanian Kristen, Seni dan Olahraga, Pemerhati Lingkungan.",
      },
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const anggota = await req.payload.find({
          collection: "pengurus",
          where: {
            divisi: { equals: id },
          },
          limit: 1,
          depth: 0,
          req,
        });

        if (anggota.totalDocs > 0) {
          throw new Error(
            "Divisi ini masih memiliki pengurus atau anggota. Pindahkan atau hapus anggotanya lebih dulu, lalu hapus divisi.",
          );
        }
      },
    ],
  },
};
