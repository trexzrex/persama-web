import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";

import { GerakSitus } from "@/components/site/motion/GerakSitus";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import styles from "@/components/site/site.module.css";
import { alamatMedia, ambilPengaturan, ambilPeriodeAktif } from "@/lib/content";
import { tahunPeriode } from "@/lib/format";

import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pengaturan = await ambilPengaturan();
  const nama = pengaturan.namaSitus?.trim() || "PERSAMA";
  const namaLengkap =
    pengaturan.namaLengkap?.trim() || "Persatuan Siswa Analis Kimia";
  const sekolah = pengaturan.sekolah?.trim() || "SMK-SMAK Makassar";
  const situs = process.env.NEXT_PUBLIC_SITE_URL || "https://persama.my.id";
  const gambar =
    alamatMedia(pengaturan.gambarPratinjau, "hero") ||
    alamatMedia(pengaturan.logoPersama) ||
    "/persama.png";

  return {
    metadataBase: new URL(situs),
    title: {
      default: `${nama} · ${sekolah}`,
      template: `%s · ${nama}`,
    },
    description:
      pengaturan.pengenalan?.trim() ||
      `${nama} (${namaLengkap}), organisasi siswa ${sekolah}. Profil, divisi, event, dan e-tabloid.`,
    applicationName: nama,
    icons: {
      icon: "/persama.png",
      apple: "/persama.png",
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: nama,
      title: `${nama} · ${sekolah}`,
      description: `${namaLengkap}, ${sekolah}.`,
      images: [{ url: gambar }],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#144647",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [pengaturan, periode] = await Promise.all([
    ambilPengaturan(),
    ambilPeriodeAktif(),
  ]);
  const logoSekolah = alamatMedia(pengaturan.logoSekolah) || "/smak.png";
  const tahun = tahunPeriode(periode?.nama);

  return (
    <html lang="id" className={`${poppins.variable} ${jakarta.variable}`}>
      <body>
        <GerakSitus><div className={styles.page}>
          <a className={styles.skip} href="#utama">
            Lewati ke konten utama
          </a>
          <SiteHeader
            pengaturan={pengaturan}
            periode={tahun}
            logo={alamatMedia(pengaturan.logoPersama) || "/persama.png"}
          />
          <main className={styles.main} id="utama">
            {children}
          </main>
          <SiteFooter
            pengaturan={pengaturan}
            periode={tahun}
            logoSekolah={logoSekolah}
          />
        </div></GerakSitus>
      </body>
    </html>
  );
}
