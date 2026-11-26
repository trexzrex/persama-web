import type { GlobalConfig } from "payload";

import { adminSaja, siapaSaja } from "../access";

export const PengaturanSitus: GlobalConfig = {
  slug: "pengaturan-situs",
  label: "Pengaturan Situs",
  admin: {
    group: "Pengaturan",
    description:
      "Identitas, narasi, kontak, dan aset dasar situs. Semua bagian situs membaca data dari sini.",
  },
  access: {
    read: siapaSaja,
    update: adminSaja,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identitas",
          fields: [
            {
              name: "namaSitus",
              type: "text",
              label: "Nama situs",
              required: true,
              defaultValue: "PERSAMA",
            },
            {
              name: "namaLengkap",
              type: "text",
              label: "Nama lengkap organisasi",
              defaultValue: "Persatuan Siswa Analis Kimia",
            },
            {
              name: "sekolah",
              type: "text",
              label: "Sekolah",
              defaultValue: "SMK-SMAK Makassar",
            },
            {
              name: "slogan",
              type: "text",
              label: "Slogan",
              maxLength: 160,
              admin: {
                description:
                  "Kalimat pendek di bawah nama PERSAMA pada beranda. Boleh dikosongkan.",
              },
            },
          ],
        },
        {
          label: "Narasi",
          fields: [
            {
              name: "pengenalan",
              type: "textarea",
              label: "Pengenalan PERSAMA",
              admin: {
                description:
                  "Dua sampai empat paragraf singkat tentang PERSAMA. Tampil di beranda dan halaman Tentang.",
              },
            },
            {
              name: "visi",
              type: "textarea",
              label: "Visi",
            },
            {
              name: "misi",
              type: "array",
              label: "Misi",
              labels: { singular: "Poin misi", plural: "Poin misi" },
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
          ],
        },
        {
          label: "Kontak & media sosial",
          fields: [
            {
              name: "email",
              type: "email",
              label: "Email",
              admin: {
                description:
                  "Alamat email kontak yang ditampilkan di footer.",
              },
            },
            {
              name: "instagram",
              type: "text",
              label: "Instagram (URL lengkap)",
              admin: {
                description: "Contoh: https://instagram.com/akun.",
              },
            },
            {
              name: "mediaSosial",
              type: "array",
              label: "Media sosial lain",
              labels: { singular: "Tautan", plural: "Tautan" },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: "nama",
                  type: "text",
                  label: "Nama platform",
                  required: true,
                },
                {
                  name: "url",
                  type: "text",
                  label: "URL",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Aset",
          fields: [
            {
              name: "logoPersama",
              type: "upload",
              relationTo: "media",
              label: "Logo PERSAMA",
              admin: {
                description:
                  "Bila kosong, situs memakai logo bawaan dari folder public.",
              },
            },
            {
              name: "logoSekolah",
              type: "upload",
              relationTo: "media",
              label: "Logo sekolah",
            },
            {
              name: "fotoHero",
              type: "upload",
              relationTo: "media",
              label: "Foto Ketua dan Wakil (Hero)",
              admin: {
                description: "Foto bersama atau komposisi Ketua dan Wakil untuk lingkaran hero beranda. Gunakan gambar persegi dengan subjek di tengah. Terpisah dari logo situs.",
              },
            },
            {
              name: "gambarPratinjau",
              type: "upload",
              relationTo: "media",
              label: "Gambar pratinjau tautan (Open Graph)",
              admin: {
                description:
                  "Dipakai saat tautan dibagikan di WhatsApp atau Instagram. Ukuran disarankan 1200 × 630 piksel.",
              },
            },
          ],
        },
        {
          label: "Tampilan",
          fields: [
            {
              name: "ukuranFotoAnggota",
              type: "select",
              label: "Ukuran foto anggota tim",
              defaultValue: "besar",
              options: [
                { label: "Sedang — potret persegi, seluruh badan terlihat", value: "sedang" },
                { label: "Besar — potret 4:5, subjek lebih dekat (disarankan)", value: "besar" },
                { label: "Sangat besar — potret 3:4, subjek paling dekat", value: "sangat-besar" },
              ],
              admin: {
                description:
                  "Mengatur foto pengurus selain ketua/koordinator di halaman INTI dan divisi. Syarat foto: rasio 4:5 atau 3:4, minimal 800 × 1000 piksel (ideal 1200 × 1500), JPG/PNG/WebP maksimal 2 MB, subjek dari pinggang ke atas dengan ruang kepala sekitar 10%, latar terang dan pencahayaan rata.",
              },
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            {
              name: "teksFooter",
              type: "textarea",
              label: "Teks footer",
              admin: {
                description:
                  "Kalimat penutup di footer. Hak cipta dan periode ditambahkan otomatis.",
              },
            },
          ],
        },
      ],
    },
  ],
};
