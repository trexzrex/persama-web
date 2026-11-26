"use client";

import * as m from "motion/react-m";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { PengaturanSitus } from "@/lib/types";

import styles from "./site.module.css";

const MENU = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Visi & Misi" },
  { href: "/divisi", label: "Divisi" },
  { href: "/event", label: "Event" },
  { href: "/e-tabloid", label: "E-Tabloid" },
  { href: "/ekstrakurikuler", label: "Ekskul" },
];

function menuAktif(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  pengaturan,
  periode,
  logo,
}: {
  pengaturan: PengaturanSitus;
  periode?: string | null;
  logo: string;
}) {
  const nama = pengaturan.namaSitus?.trim() || "PERSAMA";
  const sekolah = pengaturan.sekolah?.trim() || "SMK-SMAK Makassar";
  const tahun = periode?.trim() || "2026/2027";
  const pathname = usePathname();

  const [menuPath, setMenuPath] = useState<string | null>(null);
  const terbuka = menuPath === pathname;
  const [kenaGulir, setKenaGulir] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tombolRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const saatGulir = () => setKenaGulir(window.scrollY > 8);
    saatGulir();
    window.addEventListener("scroll", saatGulir, { passive: true });
    return () => window.removeEventListener("scroll", saatGulir);
  }, []);

  useEffect(() => {
    if (!terbuka) return;

    const saatTombol = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        tombolRef.current?.focus();
      }
    };
    const saatKlikLuar = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !tombolRef.current?.contains(target)
      ) {
        setMenuPath(null);
      }
    };

    document.addEventListener("keydown", saatTombol);
    document.addEventListener("mousedown", saatKlikLuar);
    const tautan = panelRef.current?.querySelector<HTMLAnchorElement>("a");
    tautan?.focus();

    return () => {
      document.removeEventListener("keydown", saatTombol);
      document.removeEventListener("mousedown", saatKlikLuar);
    };
  }, [terbuka]);

  return (
    <header
      className={`${styles.header} ${kenaGulir ? styles.headerKena : ""}`}
      data-terbuka={terbuka ? "ya" : "tidak"}
    >
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/">
          <Image
            src={logo}
            alt=""
            width={48}
            height={48}
            className={styles.brandMark}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandName}>{nama}</span>
            <span className={styles.brandSub}>
              {sekolah} · {tahun}
            </span>
          </span>
        </Link>

        <nav className={styles.primaryNav} aria-label="Menu utama">
          {MENU.map((item) => {
            const aktif = menuAktif(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${aktif ? styles.navLinkAktif : ""}`}
                aria-current={aktif ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <m.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          ref={tombolRef}
          type="button"
          className={styles.menuTombol}
          aria-expanded={terbuka}
          aria-controls="menu-ponsel"
          aria-label={terbuka ? "Tutup menu" : "Buka menu"}
          onClick={() =>
            setMenuPath((nilai) => (nilai === pathname ? null : pathname))
          }
        >
          <span className={styles.menuGaris} />
          <span className={styles.menuGaris} />
        </m.button>

        <m.div
          initial={false}
          animate={{ opacity: terbuka ? 1 : 0, y: terbuka ? 0 : -10 }}
          transition={{ duration: 0.22 }}
          ref={panelRef}
          id="menu-ponsel"
          className={`${styles.menuPanel} ${terbuka ? styles.menuPanelTerbuka : ""}`}
          hidden={!terbuka}
        >
          <nav aria-label="Menu ponsel">
            {MENU.map((item) => {
              const aktif = menuAktif(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.menuLink} ${aktif ? styles.menuLinkAktif : ""}`}
                  aria-current={aktif ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </m.div>
      </div>
    </header>
  );
}
