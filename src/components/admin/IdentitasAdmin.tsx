import Image from "next/image";
import Link from "next/link";

export function LogoAdmin() {
  return (
    <div className="persama-admin-brand">
      <Image src="/persama.png" width={88} height={64} alt="Logo PERSAMA" style={{ objectFit: "contain" }} />
      <div><strong>PERSAMA</strong><span>Ruang kelola · SMK-SMAK Makassar</span></div>
    </div>
  );
}

export function IkonAdmin() {
  return <Image src="/persama.png" width={40} height={32} alt="PERSAMA" style={{ objectFit: "contain" }} />;
}

export function PengantarLogin() {
  return <p className="persama-admin-login-note">Kelola cerita, kegiatan, dan kepengurusan dalam satu ruang.</p>;
}

export function TautanDashboard() {
  return (
    <Link className="persama-admin-dashboard-link" href="/admin">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
      Dashboard
    </Link>
  );
}

export function TautanSitus() {
  return <a className="persama-admin-site-link" href="/" target="_blank" rel="noopener noreferrer">Lihat situs PERSAMA ↗</a>;
}
