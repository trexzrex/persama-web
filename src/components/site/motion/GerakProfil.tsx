"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "../profil-kelompok.module.css";

/** Animate only this hydrated boundary. Server HTML stays visible without JavaScript. */
export function GerakProfil({ children, ukuranFoto = "besar" }: { children: ReactNode; ukuranFoto?: "sedang" | "besar" | "sangat-besar" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};
    const setup = () => {
      stop();
      if (preference.matches || !window.IntersectionObserver || !Element.prototype.animate) return;
      const active = new Set<Animation>();
      const groups = new Map<Element, { el: Element; x: number; y: number; delay: number }[]>();
      const small = window.matchMedia("(max-width: 767px)").matches;
      const distance = small ? 18 : 40;
      const add = (className: string, children = false, sideways = false) => {
        Array.from(root.getElementsByClassName(className)).forEach(group => {
          const targets = children ? Array.from(group.children) : [group];
          groups.set(group, targets.map((el, i) => ({ el, x: sideways && i === 0 ? -distance : 0, y: sideways && i === 0 ? 0 : distance, delay: i * 120 })));
        });
      };
      add(styles.judul);
      add(styles.uraian, true);
      add(styles.pimpinan, true, true);
      add(styles.timJudul);
      add(styles.orang, true);
      add(styles.program, true);
      add(styles.lanjutan, true);
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          // Do not replay elements already passed when restoring scroll position.
          if (entry.boundingClientRect.bottom <= 0) continue;
          for (const { el, x, y, delay } of groups.get(entry.target) ?? []) {
            const animation = el.animate([
              { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0)` },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ], { duration: 800, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
            active.add(animation);
            animation.onfinish = () => active.delete(animation);
          }
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
      groups.forEach((_, group) => observer.observe(group));
      stop = () => { observer.disconnect(); active.forEach(animation => animation.cancel()); active.clear(); };
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { stop(); preference.removeEventListener("change", setup); };
  }, []);
  return <article ref={ref} className={styles.halaman} data-gerak-profil data-ukuran-foto={ukuranFoto}>{children}</article>;
}
