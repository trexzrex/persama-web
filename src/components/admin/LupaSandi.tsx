"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Pemulihan kata sandi tidak dipakai di PERSAMA.
 * Halaman /admin/forgot dialihkan kembali ke formulir masuk.
 */
export default function LupaSandi() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return (
    <div className="persama-lupa-sandi" role="status" aria-live="polite">
      <p>Pemulihan kata sandi tidak tersedia. Mengalihkan ke halaman masuk…</p>
    </div>
  );
}
