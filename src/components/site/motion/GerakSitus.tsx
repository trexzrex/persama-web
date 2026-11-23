"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import "lenis/dist/lenis.css";
import styles from "../site.module.css";

gsap.registerPlugin(ScrollTrigger);

/** Public-only runtime. Server-rendered children remain visible without JavaScript. */
export function GerakSitus({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let stopped = false;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const syncLock = () => {
      const menu = document.querySelector('header[data-terbuka="ya"]');
      const locked = Boolean(menu) || getComputedStyle(document.body).overflow === "hidden";
      if (locked === stopped) return;
      stopped = locked;
      if (locked) lenis?.stop(); else lenis?.start();
    };
    const setup = () => {
      lenis?.destroy();
      lenis = undefined;
      if (media.matches) return;
      lenis = new Lenis({ autoRaf: false, lerp: 0.12, syncTouch: false,
        anchors: { offset: -110 },
        prevent: (node) => Boolean(node.closest('[role="dialog"], [data-lenis-prevent], iframe, [class*="eventTrack"]')),
      });
      lenis.on("scroll", ScrollTrigger.update);
      stopped = false;
      syncLock();
    };
    setup();
    gsap.ticker.add(tick);
    media.addEventListener("change", setup);
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-terbuka", "style"] });
    return () => {
      observer.disconnect();
      media.removeEventListener("change", setup);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;
    let disposed = false;
    const media = gsap.matchMedia();
    const cls = (name: string) => `.${styles[name]}`;
    media.add({ full: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" }, (context) => {
      if (!context.conditions?.full) return;
      const hero = root.querySelector(cls("hero"));
      if (hero && window.scrollY < 100) {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });
        const copy = hero.querySelector(cls("heroCopy"));
        if (copy) timeline.from(Array.from(copy.children), { y: 24, opacity: 0, stagger: 0.1 });
        const photo = hero.querySelector(cls("heroFotoPanggung"));
        if (photo) timeline.from(photo, { y: 40, opacity: 0, duration: 0.9 }, "<0.15");
      }
      const sections = root.querySelectorAll(`${cls("bagian")}, ${cls("section")}`);
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.8) return;
        const children = Array.from(section.children).filter((e) => e.tagName !== "SCRIPT");
        gsap.from(children, { y: 24, opacity: 0, duration: 0.65, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 88%", once: true },
        });
      });
      if (context.conditions?.desktop && hero) {
        hero.querySelectorAll(cls("heroOrnamen")).forEach((node, index) => {
          gsap.to(node, { y: index ? -20 : 20, ease: "none", scrollTrigger: {
            trigger: hero, start: "top top", end: "bottom top", scrub: 0.7,
          } });
        });
      }
    }, root);
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    root.querySelectorAll("img").forEach((img) => img.addEventListener("load", refresh));
    refresh();
    return () => {
      disposed = true;
      root.querySelectorAll("img").forEach((img) => img.removeEventListener("load", refresh));
      media.revert();
    };
  }, [pathname]);

  return <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>;
}
