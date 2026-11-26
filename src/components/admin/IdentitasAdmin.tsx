import Image from "next/image";
import Link from "next/link";

import { alamatMedia, ambilPengaturan } from "@/lib/content";

const LOGO_BAWAAN = "/persama.png";

async function alamatLogo(): Promise<string> {
  const pengaturan = await ambilPengaturan();
  return alamatMedia(pengaturan.logoPersama) || LOGO_BAWAAN;
}

export async function LogoAdmin() {
  const src = await alamatLogo();
  return (
    <div className="persama-admin-brand">
      <Image src={src} width={88} height={64} alt="Logo PERSAMA" unoptimized style={{ objectFit: "contain" }} />
      <div><strong>PERSAMA</strong><span>Ruang kelola · SMK-SMAK Makassar</span></div>
    </div>
  );
}

export async function IkonAdmin() {
  const src = await alamatLogo();
  return <Image src={src} width={40} height={32} alt="PERSAMA" unoptimized style={{ objectFit: "contain" }} />;
}

export function PengantarLogin() {
  return <p className="persama-admin-login-note">Kelola cerita, kegiatan, dan kepengurusan dalam satu ruang.</p>;
}

export function TautanDashboard() {
  return (
    <div className="persama-admin-menu">
      <Link className="persama-admin-dashboard-link" href="/admin">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Dashboard
      </Link>
      <Link className="persama-admin-storage-link" href="/admin/penyimpanan">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
        Penyimpanan
      </Link>
    </div>
  );
}

export function TautanSitus() {
  return <a className="persama-admin-site-link" href="/" target="_blank" rel="noopener noreferrer">Lihat situs PERSAMA ↗</a>;
}
