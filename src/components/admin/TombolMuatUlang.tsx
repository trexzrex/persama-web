"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function TombolMuatUlang() {
  const router = useRouter();
  const [memuat, mulai] = useTransition();

  return (
    <button
      type="button"
      className="persama-admin-refresh"
      onClick={() => mulai(() => router.refresh())}
      disabled={memuat}
    >
      {memuat ? "Memuat…" : "Muat ulang"}
    </button>
  );
}
