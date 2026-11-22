import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Admin",
    plural: "Admin",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "nama", "kelompok"],
    group: "Pengaturan",
  },
  auth: true,
  fields: [
    {
      name: "nama",
      type: "text",
      label: "Nama",
      required: true,
    },
    {
      name: "kelompok",
      type: "select",
      label: "Kelompok",
      required: true,
      defaultValue: "inti",
      options: [
        { label: "Inti", value: "inti" },
        { label: "Humas", value: "humas" },
        { label: "Diklat", value: "diklat" },
        { label: "Senorga", value: "senorga" },
      ],
    },
  ],
};
