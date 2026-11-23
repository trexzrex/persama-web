import Image from "next/image";
import Link from "next/link";

import type { MediaRel } from "@/lib/types";

import styles from "./site.module.css";

export function FotoKosong({
  label = "Foto menyusul",
  tinggi,
}: {
  label?: string;
  tinggi?: number;
}) {
  return (
    <div
      className={styles.placeholder}
      style={tinggi ? { minHeight: tinggi } : undefined}
      role="img"
      aria-label={label}
    >
      <svg
        className={styles.placeholderIcon}
        viewBox="0 0 28 24"
        width="28"
        height="24"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="1"
          y="1"
          width="26"
          height="22"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect x="6" y="8" width="16" height="8" rx="2" fill="currentColor" />
      </svg>
      <span className={styles.placeholderText}>{label}</span>
    </div>
  );
}

export function Gambar({
  media,
  alt,
  ukuran = "kartu",
  className,
  isi = true,
  prioritas = false,
  labelKosong,
}: {
  media: MediaRel;
  alt?: string;
  ukuran?: "thumbnail" | "kartu" | "hero" | "asli";
  className?: string;
  isi?: boolean;
  prioritas?: boolean;
  labelKosong?: string;
}) {
  const src =
    (media && typeof media === "object" && ukuran !== "asli"
      ? media.sizes?.[ukuran]?.url
      : null) ??
    (media && typeof media === "object" ? media.url : null) ??
    null;

  if (!src) {
    return <FotoKosong label={labelKosong ?? "Foto menyusul"} />;
  }

  const teks = alt || "Foto PERSAMA";

  if (isi) {
    return (
      <Image
        src={src}
        alt={teks}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 480px"
        className={className}
        priority={prioritas}
      />
    );
  }

  const lebar =
    media && typeof media === "object" ? media.width || 1200 : 1200;
  const tinggi =
    media && typeof media === "object" ? media.height || 800 : 800;

  return (
    <Image
      src={src}
      alt={teks}
      width={lebar}
      height={tinggi}
      sizes="(max-width: 768px) 100vw, 720px"
      className={className}
      priority={prioritas}
    />
  );
}

export function BadgeStatus({
  status,
}: {
  status: "akan-datang" | "berlangsung" | "selesai";
}) {
  const kelas =
    status === "selesai"
      ? `${styles.badge} ${styles.badgeGreen}`
      : `${styles.badge} ${styles.badgeRuby}`;
  const teks =
    status === "akan-datang"
      ? "Akan datang"
      : status === "berlangsung"
        ? "Berlangsung"
        : "Selesai";
  return <span className={kelas}>{teks}</span>;
}

function IkonKosong({ jenis }: { jenis: "event" | "tabloid" | "ekskul" | "umum" }) {
  if (jenis === "event") {
    return (
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
        <circle cx="28" cy="28" r="27.5" fill="#F2F7F6" stroke="#D6E3E0" />
        <rect x="16" y="18" width="24" height="20" rx="5" fill="none" stroke="#15AE9E" strokeWidth="1.5" />
        <path d="M16 26h24" stroke="#15AE9E" strokeWidth="1.5" />
        <rect x="21" y="15" width="3" height="5" rx="1.5" fill="#15AE9E" />
        <rect x="32" y="15" width="3" height="5" rx="1.5" fill="#15AE9E" />
      </svg>
    );
  }

  if (jenis === "tabloid") {
    return (
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
        <circle cx="28" cy="28" r="27.5" fill="#F2F7F6" stroke="#D6E3E0" />
        <rect x="18" y="16" width="20" height="24" rx="3" fill="none" stroke="#15AE9E" strokeWidth="1.5" />
        <path d="M18 24h20" stroke="#15AE9E" strokeWidth="1.5" />
        <path d="M23 30h10" stroke="#15AE9E" strokeWidth="1.5" />
      </svg>
    );
  }

  if (jenis === "ekskul") {
    return (
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
        <circle cx="28" cy="28" r="27.5" fill="#F2F7F6" stroke="#D6E3E0" />
        <circle cx="20.5" cy="20.5" r="4.5" fill="none" stroke="#15AE9E" strokeWidth="1.5" />
        <circle cx="32.5" cy="17.5" r="4.5" fill="none" stroke="#15AE9E" strokeWidth="1.5" />
        <circle cx="44.5" cy="20.5" r="4.5" fill="none" stroke="#15AE9E" strokeWidth="1.5" />
        <rect x="15" y="34" width="26" height="3" rx="1.5" fill="#15AE9E" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
      <circle cx="28" cy="28" r="27.5" fill="#F2F7F6" stroke="#D6E3E0" />
      <path d="M28 17v22M17 28h22" stroke="#15AE9E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function KeadaanKosong({
  judul,
  teks,
  aksiHref,
  aksiLabel,
  jenis = "umum",
}: {
  judul: string;
  teks: string;
  aksiHref?: string;
  aksiLabel?: string;
  jenis?: "event" | "tabloid" | "ekskul" | "umum";
}) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">
        <IkonKosong jenis={jenis} />
      </span>
      <p className={styles.emptyTitle}>{judul}</p>
      <p className={styles.emptyText}>{teks}</p>
      {aksiHref && aksiLabel ? (
        <Link className={styles.emptyLink} href={aksiHref}>
          {aksiLabel}
        </Link>
      ) : null}
    </div>
  );
}
