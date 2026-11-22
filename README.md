# PERSAMA — situs resmi 2026–2027

Next.js 16 + Payload CMS 3 + Supabase (Postgres) + Cloudflare R2.

## Menjalankan lokal

```bash
npm install
# isi DATABASE_URI dan PAYLOAD_SECRET di .env
npm run dev
```

- Situs: http://localhost:3000
- Admin: http://localhost:3000/admin

## Perintah penting

| Perintah | Guna |
|---|---|
| `npm run dev` | Pengembangan lokal |
| `npm run build` | Build produksi |
| `npm run generate:types` | Perbarui `src/payload-types.ts` |
| `npm run generate:importmap` | Perbarui import map admin |
| `npx payload migrate:create` | Buat migrasi skema Postgres |
| `npx payload migrate` | Jalankan migrasi |

## Konfigurasi dan deployment

Salin `.env.example` menjadi `.env` dan isi melalui komputer lokal atau pengaturan environment Vercel. Jangan commit kredensial. Repository ini hanya memuat sumber aplikasi, aset publik, dan konfigurasi utama; dokumen kerja internal tidak disertakan.

Pengembangan lokal memakai Webpack untuk menghindari masalah cache Turbopack pada Windows. Untuk deployment, hubungkan repository ini ke Vercel dan isi environment yang diperlukan sebelum build.

## Aturan tetap

- Tanpa kelas siswa, login publik, pencarian, dan pendaftaran event.
- Nama/gelar pengurus persis `DATA-PENGURUS-2026-2027.md`; kelas tidak ditampilkan.
- Konten ilustratif berbadge "Contoh".
- Mobile-first 390 px; teks isi minimal 16 px; fokus 3 px / offset 2 px.
