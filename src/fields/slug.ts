import type { Field } from "payload";

export function buatSlug(sumber: string): string {
  return sumber
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Kolom slug yang dibuat otomatis dari judul/nama, tetap bisa disunting admin.
 * Slug unik (indeks basis data) dan dipakai di URL publik.
 */
export function kolomSlug(sumberField: "judul" | "nama"): Field {
  return {
    name: "slug",
    type: "text",
    label: "Slug (alamat halaman)",
    required: true,
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description:
        "Dibuat otomatis dari judul. Boleh diubah, tetapi jangan memakai spasi. Contoh: class-meeting-2026.",
    },
    hooks: {
      beforeValidate: [
        ({ data, value }) => {
          if (typeof value === "string" && value.trim()) {
            return buatSlug(value);
          }
          const sumber = data?.[sumberField];
          if (typeof sumber === "string" && sumber.trim()) {
            return buatSlug(sumber);
          }
          return value;
        },
      ],
    },
  };
}
