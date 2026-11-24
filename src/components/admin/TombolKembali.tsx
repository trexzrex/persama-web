"use client";

import { Link } from "@payloadcms/ui";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore, type MouseEvent } from "react";
import { catatHalaman, indukAdmin } from "@/lib/admin-kembali";

const KEY = "persama-admin-history";
let memory: string[] = [];
let tujuanKembali: string | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const snapshot = () => memory.at(-2) ?? null;
const serverSnapshot = () => null;

export default function TombolKembali() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const current = `${pathname}${search ? `?${search}` : ""}`;
  const previous = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  useEffect(() => {
    const onPopState = () => { tujuanKembali = `${window.location.pathname}${window.location.search}`; };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    if (/^\/admin\/(login|logout)(?:\/|$)/.test(pathname)) {
      memory = [];
      tujuanKembali = null;
      try { sessionStorage.removeItem(KEY); } catch { /* Storage may be blocked. */ }
      listeners.forEach((listener) => listener());
      return;
    }
    if (!pathname.startsWith("/admin") || /\/admin\/(login|logout|forgot|reset)/.test(pathname)) return;
    let history = memory;
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) history = saved.filter((item): item is string => typeof item === "string" && /^\/admin(?:\/|\?|$)/.test(item));
    } catch { /* Storage unavailable: retain in-memory navigation. */ }
    history = catatHalaman(history, current, tujuanKembali === current);
    tujuanKembali = null;
    memory = history;
    try { sessionStorage.setItem(KEY, JSON.stringify(history)); } catch { /* Private browsing may block storage. */ }
    listeners.forEach((listener) => listener());
  }, [current, pathname]);
  if (pathname === "/admin" || /\/admin\/(login|logout|forgot|reset)/.test(pathname)) return null;
  return <nav className="persama-admin-back" aria-label="Kembali ke halaman sebelumnya">
    <Link href={previous ?? indukAdmin(current)} replace onClick={(event: MouseEvent<HTMLAnchorElement>) => {
      if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        tujuanKembali = previous ?? indukAdmin(current);
      }
    }}>← Kembali</Link>
  </nav>;
}
