import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { id } from "@payloadcms/translations/languages/id";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Divisi } from "./collections/Divisi";
import { Ekstrakurikuler } from "./collections/Ekstrakurikuler";
import { Event } from "./collections/Event";
import { Media } from "./collections/Media";
import { Pengurus } from "./collections/Pengurus";
import { Periode } from "./collections/Periode";
import { Tabloid } from "./collections/Tabloid";
import { Users } from "./collections/Users";
import { PengaturanSitus } from "./globals/PengaturanSitus";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const r2Enabled = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT,
);

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: "light",
    components: {
      graphics: {
        Logo: "@/components/admin/IdentitasAdmin#LogoAdmin",
        Icon: "@/components/admin/IdentitasAdmin#IkonAdmin",
      },
      beforeLogin: ["@/components/admin/IdentitasAdmin#PengantarLogin"],
      beforeDashboard: ["@/components/admin/RingkasanAdmin"],
      beforeNavLinks: ["@/components/admin/IdentitasAdmin#TautanDashboard"],
      afterNavLinks: ["@/components/admin/IdentitasAdmin#TautanSitus"],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · PERSAMA",
    },
  },
  i18n: {
    supportedLanguages: { id },
    fallbackLanguage: "id",
  },
  collections: [
    Periode,
    Pengurus,
    Divisi,
    Event,
    Tabloid,
    Ekstrakurikuler,
    Media,
    Users,
  ],
  globals: [PengaturanSitus],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      ssl: { rejectUnauthorized: false },
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      clientUploads: true,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: file, prefix }) => {
            const key = prefix ? `${prefix}/${file}` : file;
            const base = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
            return `${base}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
});
