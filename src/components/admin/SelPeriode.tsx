"use client";

import Link from "next/link";
import type { DefaultCellComponentProps } from "payload";

/**
 * Kolom nama periode di daftar admin.
 * Klik tahun membuka struktur divisi periode itu, bukan dokumen INTI.
 * Tautan "Edit" kecil tetap membuka dokumen periode.
 */
export default function SelPeriode({ cellData, rowData }: DefaultCellComponentProps) {
  const id = rowData?.id;
  const teks = typeof cellData === "string" ? cellData : "";

  if (id === undefined || id === null) return <span>{teks}</span>;

  const kode = encodeURIComponent(String(id));
  return (
    <span className="persama-periode-sel">
      <Link href={`/admin/collections/divisi?periode=${kode}`}>{teks}</Link>
      <Link className="persama-periode-edit" href={`/admin/collections/periode/${kode}`} aria-label={`Edit periode ${teks}`}>
        Edit
      </Link>
    </span>
  );
}
