# Bagan penanggung jawab dan pembina

Di **Admin → Kepengurusan → Pengurus**, buka catatan pada periode aktif dengan kelompok **Penanggung jawab**, **Pengarah**, atau **Pembina**.

1. Ubah **Nama**, **Jabatan**, atau **Foto** bila perlu.
2. Pada **Induk di bagan**, pilih catatan yang langsung menaungi jabatan ini. Untuk pilihan tanpa nama, cocokkan ID pilihan dengan ID pada URL catatan Pengurus yang bersangkutan.
3. Kosongkan induk untuk posisi yang tampil sendiri. **Urutan tampil** yang lebih kecil didahulukan di antara cabang setingkat atau posisi mandiri.
4. Simpan, lalu buka `/tentang` untuk melihat hasilnya.

Induk harus berasal dari periode yang sama. Untuk memindahkan catatan dengan cabang ke periode atau kelompok di luar bagan, lepas atau pindahkan cabangnya terlebih dahulu. Nama kosong menampilkan jabatan saja; foto kosong memakai siluet.

## Rilis

Sebelum deploy kode yang memakai field baru, jalankan `node scripts/migrate-induk-bagan.mjs` dengan `DATABASE_URI` untuk database tujuan yang sudah diverifikasi. Migrasi menambah kolom nullable, indeks, dan foreign key; tidak menetapkan induk untuk data yang sudah ada. Kode lama tetap dapat membaca tabel setelah migrasi. Jalankan uji penulisan dari panel admin hanya pada database lokal yang terpisah.
