-- Jalankan sebelum merilis field Induk di bagan. Tidak mengubah baris yang ada.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.pengurus ADD COLUMN IF NOT EXISTS induk_bagan_id integer;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.pengurus'::regclass
      AND conname = 'pengurus_induk_bagan_id_pengurus_id_fk'
  ) THEN
    ALTER TABLE public.pengurus ADD CONSTRAINT pengurus_induk_bagan_id_pengurus_id_fk
      FOREIGN KEY (induk_bagan_id) REFERENCES public.pengurus(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS pengurus_induk_bagan_idx ON public.pengurus (induk_bagan_id);
COMMIT;
