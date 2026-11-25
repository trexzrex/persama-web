"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function TombolMuatUlang() {
  const router = useRouter();
  const [memuat, mulai] = useTransition();
  const [otomatis, setOtomatis] = useState(true);

  useEffect(() => {
    if (!otomatis || memuat) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const jadwalkan = () => {
      clearTimeout(timer);
      if (!document.hidden && navigator.onLine) {
        timer = setTimeout(() => mulai(() => router.refresh()), 15000);
      }
    };
    const terlihat = () => {
      if (!document.hidden && navigator.onLine) mulai(() => router.refresh());
      jadwalkan();
    };
    jadwalkan();
    document.addEventListener("visibilitychange", terlihat);
    window.addEventListener("online", terlihat);
    window.addEventListener("offline", jadwalkan);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", terlihat);
      window.removeEventListener("online", terlihat);
      window.removeEventListener("offline", jadwalkan);
    };
  }, [otomatis, memuat, router]);

  return <div className="persama-storage-controls">
    <div className="persama-storage-buttons">
      <button type="button" className="persama-admin-refresh" onClick={() => mulai(() => router.refresh())} disabled={memuat}>
        {memuat ? "Memuat…" : "Muat ulang"}
      </button>
      <button type="button" className="persama-storage-pause" aria-pressed={!otomatis} onClick={() => setOtomatis(!otomatis)}>
        Jeda pembaruan otomatis
      </button>
    </div>
    <small>{otomatis ? "Otomatis setiap 15 detik saat tab aktif. Bukan pembaruan seketika." : "Pembaruan otomatis dijeda."}</small>
  </div>;
}
