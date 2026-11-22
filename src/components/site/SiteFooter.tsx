import Image from "next/image";
import Link from "next/link";

import type { PengaturanSitus } from "@/lib/types";

import styles from "./site.module.css";

const NAV: { href: string; label: string; hanyaLebar?: boolean }[] = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Visi & Misi" },
  { href: "/divisi", label: "Divisi" },
  { href: "/event", label: "Event" },
  { href: "/e-tabloid", label: "E-Tabloid" },
  { href: "/ekstrakurikuler", label: "Ekstrakurikuler", hanyaLebar: true },
];

function namaInstagram(url?: string | null) {
  if (!url?.trim()) return null;
  try {
    const alamat = new URL(url.trim());
    const nama = alamat.pathname.split("/").filter(Boolean)[0];
    return nama ? `@${nama}` : "Instagram";
  } catch {
    return "Instagram";
  }
}

export function SiteFooter({
  pengaturan,
  periode,
  logoSekolah,
}: {
  pengaturan: PengaturanSitus;
  periode?: string | null;
  logoSekolah: string;
}) {
  const nama = pengaturan.namaSitus?.trim() || "PERSAMA";
  const sekolah = pengaturan.sekolah?.trim() || "SMK-SMAK Makassar";
  const instagram = pengaturan.instagram?.trim();
  const email = pengaturan.email?.trim();
  const igLabel = namaInstagram(instagram);
  const tahun =
    periode?.trim().split("/")[0]?.trim() ||
    String(new Date().getFullYear());

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLogos}>
          <Image
            src={logoSekolah}
            alt={`Logo ${sekolah}`}
            width={34}
            height={32}
            className={styles.footerLogo}
          />
          <Image
            src="/persama.png"
            alt={`Logo ${nama}`}
            width={52}
            height={32}
            className={styles.footerLogoPersama}
          />
        </div>

        <p className={styles.footerBrand}>{nama}</p>
        <p className={styles.footerSub}>
          {sekolah}
          {periode?.trim() ? ` · Periode ${periode.trim()}` : ""}
        </p>

        <nav className={styles.footerNav} aria-label="Menu footer">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.footerNavLink} ${
                item.hanyaLebar ? styles.footerNavEkskul : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {instagram || email ? (
          <div className={styles.footerSosial}>
            {instagram ? (
              <a
                className={styles.footerSosialLink}
                href={instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="3.5"
                    y="3.5"
                    width="17"
                    height="17"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle cx="17.2" cy="6.9" r="1.1" fill="currentColor" />
                </svg>
                {igLabel}
              </a>
            ) : null}
            {email ? (
              <a className={styles.footerSosialLink} href={`mailto:${email}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="3"
                    y="5.5"
                    width="18"
                    height="13"
                    rx="2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="m4.5 7 7.5 6 7.5-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
                {email}
              </a>
            ) : null}
          </div>
        ) : null}

        <div className={styles.footerGaris} />
        <p className={styles.footerCopy}>
          © {tahun} {nama}.
        </p>
      </div>
    </footer>
  );
}
