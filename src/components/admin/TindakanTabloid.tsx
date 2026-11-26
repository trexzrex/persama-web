"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import type { DefaultCellComponentProps } from "payload";

type BarisTabloid = {
  id?: number | string;
  _status?: string;
};

async function bacaGalat(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as {
      errors?: { message?: string }[];
      error?: string;
    };
    return (
      json.errors?.[0]?.message ??
      json.error ??
      `Permintaan gagal (${res.status}).`
    );
  } catch {
    return `Permintaan gagal (${res.status}).`;
  }
}

/**
 * Kolom judul e-tabloid dengan tindakan per baris: batalkan publikasi dan hapus.
 * Memakai API admin yang sama dengan tombol bawaan Payload, tanpa mengubah alur.
 */
export default function TindakanTabloid({
  cellData,
  rowData,
  linkURL,
}: DefaultCellComponentProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const judulDialog = useId();
  const [memuat, mulai] = useTransition();
  const [sibuk, setSibuk] = useState<"batalkan" | "hapus" | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);

  const baris = (rowData ?? {}) as BarisTabloid;
  const id = baris.id;
  const terbit = baris._status === "published";
  const judul = typeof cellData === "string" && cellData ? cellData : "Edisi ini";

  async function batalkanPublikasi() {
    if (id === undefined) return;
    setSibuk("batalkan");
    setPesan(null);
    try {
      const res = await fetch(`/api/tabloid/${id}?depth=0`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _status: "draft" }),
      });
      if (!res.ok) throw new Error(await bacaGalat(res));
      setPesan("Publikasi dibatalkan. Edisi kini tersimpan sebagai draf.");
      mulai(() => router.refresh());
    } catch (galat) {
      setPesan(
        galat instanceof Error
          ? galat.message
          : "Gagal membatalkan publikasi.",
      );
    } finally {
      setSibuk(null);
    }
  }

  async function hapus() {
    if (id === undefined) return;
    setSibuk("hapus");
    setPesan(null);
    try {
      const res = await fetch(`/api/tabloid/${id}?depth=0`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await bacaGalat(res));
      setPesan("Edisi dihapus.");
      mulai(() => router.refresh());
    } catch (galat) {
      setPesan(
        galat instanceof Error ? galat.message : "Gagal menghapus edisi.",
      );
    } finally {
      setSibuk(null);
    }
  }

  const nonaktif = sibuk !== null || memuat;

  return (
    <div className="persama-row-actions">
      {linkURL ? (
        <a className="persama-row-title" href={linkURL}>
          {judul}
        </a>
      ) : (
        <span className="persama-row-title">{judul}</span>
      )}
      <div className="persama-row-buttons">
        {terbit ? (
          <button
            type="button"
            className="persama-row-button"
            onClick={batalkanPublikasi}
            disabled={nonaktif}
          >
            {sibuk === "batalkan" ? "Membatalkan…" : "Batalkan publikasi"}
          </button>
        ) : null}
        <button
          type="button"
          className="persama-row-button persama-row-button--hapus"
          onClick={() => dialogRef.current?.showModal()}
          disabled={nonaktif}
        >
          {sibuk === "hapus" ? "Menghapus…" : "Hapus"}
        </button>
      </div>
      <dialog
        ref={dialogRef}
        className="persama-row-dialog"
        aria-labelledby={judulDialog}
      >
        <h2 id={judulDialog} className="persama-row-dialog__title">
          Hapus edisi ini?
        </h2>
        <p className="persama-row-dialog__text">
          &ldquo;{judul}&rdquo; akan dihapus permanen. Tindakan ini tidak bisa
          dibatalkan.
        </p>
        <div className="persama-row-dialog__actions">
          <button
            type="button"
            className="persama-row-button"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            Batal
          </button>
          <button
            type="button"
            className="persama-row-button persama-row-button--hapus"
            onClick={() => {
              dialogRef.current?.close();
              void hapus();
            }}
          >
            Hapus permanen
          </button>
        </div>
      </dialog>
      <p className="persama-row-note" role="status">
        {pesan}
      </p>
    </div>
  );
}
