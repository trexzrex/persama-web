-- Kolom pengaturan ukuran foto anggota tim.
-- Jalankan sekali pada database Postgres bila kolom belum ada.
DO $$ BEGIN
  CREATE TYPE "public"."enum_pengaturan_situs_ukuran_foto_anggota" AS ENUM('sedang', 'besar', 'sangat-besar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "public"."pengaturan_situs"
  ADD COLUMN IF NOT EXISTS "ukuran_foto_anggota" "public"."enum_pengaturan_situs_ukuran_foto_anggota";
