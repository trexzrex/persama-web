import os
import re

from playwright.sync_api import expect, sync_playwright

base = os.environ.get("QA_BASE_URL", "http://127.0.0.1:3112")
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get("QA_CHROMIUM"))
    for width, method in ((390, "touch"), (1440, "mouse"), (390, "keyboard")):
        page = browser.new_page(viewport={"width": width, "height": 900}, has_touch=method == "touch")
        page.goto(base, wait_until="domcontentloaded", timeout=90_000)
        expect(page.get_by_alt_text("Ketua dan Wakil PERSAMA", exact=True)).to_be_visible()
        cta = page.get_by_role("link", name=re.compile(r"^Kenali PERSAMA(?! lebih)"))
        if method == "touch":
            cta.tap(timeout=8000)
        elif method == "keyboard":
            for _ in range(30):
                page.keyboard.press("Tab")
                if cta.evaluate("link => link === document.activeElement"):
                    break
            expect(cta).to_be_focused()
            page.keyboard.press("Enter")
        else:
            cta.click(timeout=8000)
        page.wait_for_url("**/tentang", timeout=15000)
        print(f"{width}px, {method}: navigates to /tentang", flush=True)
        page.close()
    browser.close()
