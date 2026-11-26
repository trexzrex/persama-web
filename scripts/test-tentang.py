import os
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


base = os.environ.get("QA_BASE_URL", "http://127.0.0.1:3100")
axe = Path("node_modules/axe-core/axe.min.js")

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get("QA_CHROMIUM"))
    for width in (320, 390, 1440):
        page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        response = page.goto(f"{base}/tentang", wait_until="domcontentloaded", timeout=90_000)
        assert response is not None and response.ok
        main = page.get_by_role("main")
        expect(main.get_by_role("heading", level=1)).to_have_count(1)
        missions = main.get_by_role("region", name="Visi dan misi").locator("ol > li")
        assert missions.count() > 0, "Misi must be an ordered, fully visible list"
        for mission in missions.all():
            expect(mission).to_be_visible()
        links = main.get_by_role("navigation", name="Kepengurusan PERSAMA").get_by_role("link")
        assert [link.get_attribute("href") for link in links.all()] == ["/inti-persama", "/tentang/arsip"]
        for link in links.all():
            link.focus()
            assert link.evaluate("el => el.matches(':focus-visible')")
            assert link.bounding_box()["height"] >= 44
        for scale in (100, 200):
            page.evaluate("scale => document.documentElement.style.fontSize = `${scale}%`", scale)
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), (width, scale)
        page.evaluate("document.documentElement.style.removeProperty('font-size')")
        if axe.is_file():
            page.add_script_tag(path=axe)
            violations = main.evaluate("""async el => (await axe.run(el, {
                runOnly: ['color-contrast', 'heading-order', 'list', 'listitem', 'target-size']
            })).violations.map(({ id }) => id)""")
            assert not violations, violations
        if output := os.environ.get("QA_SCREENSHOTS"):
            page.evaluate("document.activeElement.blur(); window.scrollTo(0, 0)")
            page.screenshot(path=Path(output) / f"tentang-{width}.png", full_page=True)
        print(f"{width}px: editorial list, links, focus, and reflow passed", flush=True)
        page.close()
    browser.close()
