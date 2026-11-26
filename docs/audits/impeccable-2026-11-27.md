# PERSAMA UI audit — 27 November 2026

**Implementation integrity: pass with exceptions.** Public branding, navigation, and admin dashboard form a coherent PERSAMA system. Shared components also repeat accessibility defects. This is not a WCAG conformance statement, security assessment, or approval to release.

| Dimension | Public | Signed-in admin |
|---|---:|---:|
| Accessibility | 2/4 | 1/4 |
| Performance | 3/4 | 2/4 |
| Responsive design | 3/4 | 2/4 |
| Theming | 3/4 | 2/4 |
| Implementation integrity | 3/4 | 3/4 |
| **Total** | **14/20 — Good** | **10/20 — Acceptable** |

**Priorities:** 0 P0, 6 P1, 4 P2, 0 P3 in tested scope. No product code, DB content, permissions, or deployments changed.

## P1 — fix first

1. **Admin editor pages overflow on phones.** At 320 CSS px: Extracurricular edit +58 px, Period and Media edit +27 px each, Event edit +13 px. Extracurricular edit still overflows +27 px at 390. Dashboard, account, and collection lists did not reproduce this. Inspect `.step-nav`, `.app-header__account`, and `.doc-controls__meta` on these document routes, then fix sizing/wrapping in `src/app/(payload)/custom.scss`. Retest that breadcrumbs, metadata and edit actions remain reachable at 320 px (WCAG 1.4.10). `$impeccable adapt`.
2. **Admin editing controls lack accessible names.** Axe found unnamed Event editor content, two date inputs and a date popup, Settings logo edit/remove icons, and select inputs in dashboard/account. Some focusable select indicators also sit under `aria-hidden`. These originate in rendered Payload control markup; inspect configuration or supported component overrides before changing anything. Give controls distinct labels, remove decorative elements from tab order, and retest with keyboard and screen reader (WCAG 3.3.2, 4.1.2). `$impeccable harden`.
3. **Text contrast is below AA on both surfaces.** Public secondary headings and empty-state links: 2.77:1; Event image placeholder: 4.04:1 (`site.module.css`, `.eyebrow`, `.emptyLink`, `.placeholderText`). Admin Settings tabs: 2.74:1; Event form help: 2.71:1 against the light surface. Use darker semantic text tokens and verify 4.5:1 for normal text in each supported state (WCAG 1.4.3). `$impeccable colorize`.
4. **Event carousel advances without a visible pause control.** It moved 672 → 1008 px in a 6.9-second observation. Reduced motion stopped advancement in a separate test; a synthetic touch swipe worked. Hover/focus pause is not a persistent control. `BerandaKlien.tsx:113–124,197–233`; also inspect the same interval pattern in `TumpukEkskul` at lines 254–264 before changing shared behavior. Disable autoplay by default or add a persistent labeled pause/play toggle (WCAG 2.2.2). `$impeccable animate`.
5. **Touch targets are too small and close together.** Inactive Event dots are 6×6 px with 6 px gaps. Axe also flagged neighboring public footer links and admin list controls. Keep tiny visual dots inside ≥24×24 CSS px interactive boxes, or meet the spacing exception; aim for 44 px where practical (WCAG 2.5.8). `site.module.css:1114–1128,3557`; admin collection controls. `$impeccable adapt`.
6. **Public home link name omits visible label content.** Axe flags the brand link across the public sample. Its accessible name includes PERSAMA but overrides the visible school and period text. Align accessible and visible labels and verify voice navigation (WCAG 2.5.3). `SiteHeader.tsx:90–103`. `$impeccable harden`.

## P2 — next pass

1. **Desktop hero portrait clips the top of the head at 1440 px.** The same subject is framed on the 390 px screenshot. Adjust desktop image position or box without replacing the source image. `BerandaTampilan.tsx`, hero rules in `site.module.css`. `$impeccable layout`.
2. **Eight public Division tiles resolve to one source photo.** This is a production content observation, not evidence of an incorrect database relation. Confirm whether the photo is intentionally shared before assigning original group photos; retain useful fallback if none exist. `BerandaTampilan.tsx:199–226`. `$impeccable clarify`.
3. **Performance budget is missing evidence.** Observed browser resource totals were ~234 KiB encoded scripts on home, ~808 KiB on dashboard, ~822 KiB in the Event editor. They are estimates, not CWV or an apples-to-apples cold benchmark. Admin CSS imports remote Google Fonts; the detector also found a real width transition on the carousel dots, but no frame drop was measured. Profile cold and warm dashboard/editor loads before pruning bundles or changing font delivery. `custom.scss:28`, `site.module.css:1122`. `$impeccable optimize`.
4. **Semantic structure has recurring gaps.** Axe reported admin login/dashboard without a main landmark, duplicate banners on several collection lists, and a skipped heading level on public Extracurricular. Confirm headings in rendered DOM and fix within supported layouts; do not add duplicate landmarks to conceal warnings. `$impeccable harden`.

## Evidence and limits

- Live Chromium: 48 public loads across 320/390/768/1440 CSS px, covering 11 route samples plus four expected HTTP 404s. No page-wide horizontal overflow in the public sample. No published E-Tabloid detail available to verify.
- Live Chromium: 55 admin scan loads across 320/390/1440, including signed-in dashboard, account, eight collections, create forms, six existing edit samples and Site Settings. Additional checks: Storage, Period-filtered Division structure, Event version list, and Settings photo-size field. Anonymous users-list request and post-logout dashboard request both redirected to login. This confirms those screens only, not all role permissions.
- Mobile navigation moved focus to the first link; Escape closed the menu and returned focus. At 390 px, Event and Divisi both had a white base background, and Division cards had equal 24 px outer margins. Different motif textures remain separate assets.
- Local TypeScript and ESLint completed without diagnostics. Impeccable source detector flagged the dot width transition (real; impact unmeasured) and Plus Jakarta Sans as overused (subjective, not a defect or reason to rebrand).
- No production saves, uploads, publish, delete, restores, or credential changes. No physical-device, Safari, screen-reader, text-enlargement, complete theme matrix, or field Core Web Vitals verification. Automated axe checks do not prove conformance.

## Recommended actions

1. `$impeccable adapt`: fix admin document reflow and touch hit areas first.
2. `$impeccable harden` and `$impeccable colorize`: fix accessible names, focus exposure, landmarks, and contrast.
3. `$impeccable animate`: give carousel users durable control over motion.
4. `$impeccable layout`, `$impeccable clarify`, and `$impeccable optimize`: correct the desktop crop, confirm photo assignments, and measure before tuning.
5. `$impeccable polish`: verify in Chromium and Safari, then rerun `$impeccable audit`.
