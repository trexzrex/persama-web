# PERSAMA — Impeccable remediation

Baseline: [production audit](impeccable-2026-11-27.md). Changes are local; no deployment or production content edits.

## Public site

- **Adapt / harden:** Larger footer and carousel hit areas, native visible-text name for the home link, a focusable skip-link destination, clearance for keyboard focus below the sticky header, and corrected Extracurricular heading order.
- **Colorize / polish:** Higher contrast for labels, breadcrumbs, metadata, missing-image text, and carousel artwork; larger small labels and more line spacing in the hero subtitle.
- **Animate:** Event and Extracurricular carousels advance only on user input. Event retains touch scrolling. Keyboard focus stays usable when moving between Extracurricular cards. Active markers are distinguishable by shape as well as color.
- **Layout:** Desktop hero no longer scales the configured photo past its frame. Image and mobile framing are unchanged.

### Verification

- Local Chromium: targeted axe, 320 CSS px reflow, and keyboard skip-link checks passed on six routes. `scripts/test-public-audit.py` reproduced baseline failures on production. A later combined local rerun timed out during navigation after adding the carousel checks; those interaction checks passed separately.
- Local Chromium at 390 px with touch emulation: Event markers measured at least 44 × 44 CSS px, keyboard activation selected a different event, and the active card did not change during a 6.7-second idle check. Targeted homepage axe checks passed.
- Impeccable rendered homepage scan returned no findings at 390 and 1280 CSS px. Reviewed the 1440 px hero screenshot, where both faces were visible.
- No Division photo assignments changed. Current code reads each Division's own `fotoGrup`; choosing distinct content needs source photos and editorial confirmation. No field Core Web Vitals claims or speculative bundle changes.

## Admin

- **Adapt / colorize:** Allow breadcrumbs and document action/metadata rows to wrap; enlarge sorting, bulk-selection, pagination, and Period list controls; darken light-theme form help and inactive tab labels.
- **Harden:** Add main landmarks to the existing login and dashboard, label Event dates and calendar popups, and use the Event content field label for its Lexical editor. Existing manual draft save behavior is unchanged.
- **Verification:** Chromium fixture using Payload styles reported zero page overflow at 320, 390, and 1440 CSS px, with a minimum 44 px sort control width under touch emulation. TypeScript and ESLint passed. This fixture is not a signed-in admin session.
- **Still open:** Local admin route checks timed out; verify sign-in and signed-in routes against a disposable database before deployment. Stock Payload select indicators, the Settings logo actions, duplicate list banners, and details such as date-clear naming and validation descriptions are not claimed fixed. The detector's existing subjective Plus Jakarta Sans warning remains; no font or branding change.

## Modern Web Guidance

| Guide ID | Rule applied |
|---|---|
| `form-factor-adaptation` | “Make every control at least 24×24 CSS pixels … and at least 44×44 on touch screens.” Applied to footer links and carousel markers. |
| `accessibility` | Accessible name “should typically be the same as its visible link text”; the public brand link now takes its name from visible content. |
| `color` | “Maintain 4.5:1 for normal text.” Darkened audited text and verified targeted rules with axe. |
| `motion` | “Consider defaulting to static states and allowing users to opt in to motion.” Applied by removing automatic advancement. |
| `carousel` | “The active slide's control must not communicate that it is active through color alone.” Active marker also changes shape. |
