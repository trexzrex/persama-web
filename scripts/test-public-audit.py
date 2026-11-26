"""Read-only Chromium regression checks for public audit fixes.

Run from repo root with an app already running. Set QA_CHROMIUM to override
Playwright's bundled Chromium and QA_BASE to override http://localhost:3100.
"""

import os
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


BASE = os.environ.get("QA_BASE", "http://localhost:3100").rstrip("/")
AXE = str(Path("node_modules/axe-core/axe.min.js").resolve())
ROUTES = ("/", "/event", "/tentang", "/tentang/arsip", "/e-tabloid", "/ekstrakurikuler")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get("QA_CHROMIUM"))
    context = browser.new_context(
        viewport={"width": 320, "height": 900}, reduced_motion="reduce", has_touch=True
    )
    failures = []
    for route in ROUTES:
        page = context.new_page()
        response = page.goto(BASE + route, wait_until="domcontentloaded", timeout=85_000)
        assert response and response.ok, f"Unexpected response for {route}"
        page.add_script_tag(path=AXE)
        violations = page.evaluate("""async () => {
          const result = await axe.run({runOnly: [
            'color-contrast', 'label-content-name-mismatch', 'target-size', 'heading-order'
          ]});
          return result.violations.map(rule => [rule.id, rule.nodes.map(node => node.target)]);
        }""")
        overflow = page.evaluate("document.documentElement.scrollWidth - innerWidth")
        page.keyboard.press("Tab")
        page.keyboard.press("Enter")
        focus = page.evaluate("document.activeElement.id")
        if violations or overflow or focus != "utama":
            failures.append((route, overflow, focus, violations))
        page.close()
    if not failures:
        mobile = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True)
        page = mobile.new_page()
        page.goto(BASE + "/", wait_until="domcontentloaded", timeout=85_000)
        group = page.get_by_role("group", name="Pilih event")
        markers = group.get_by_role("button")
        # Content is optional; run only when this environment has multiple events.
        if page.locator('[class*="eventTrack"] > article').count() > 1:
            expect(markers.nth(1)).to_be_visible()
            active = page.locator('[aria-label="Pilih event"] [aria-current="true"]')
            active.scroll_into_view_if_needed()
            expect(active).to_have_count(1)
            old_label = active.get_attribute("aria-label")
            page.wait_for_timeout(6700)  # Longer than the former autoplay interval.
            expect(active).to_have_attribute("aria-label", old_label)
            for marker in markers.all():
                box = marker.bounding_box()
                assert box and min(box["width"], box["height"]) >= 44, box
            next_marker = markers.nth(1) if markers.first.get_attribute("aria-current") else markers.first
            next_marker.focus()
            page.keyboard.press("Enter")
            expect(next_marker).to_have_attribute("aria-current", "true")
            print("Event carousel passed idle, touch target, and keyboard checks")
        else:
            print("Event interaction checks skipped: no multi-event carousel rendered")
    browser.close()
    assert not failures, failures
    print(f"{len(ROUTES)} routes passed targeted axe, reflow, and skip-link checks")
