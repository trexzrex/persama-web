import json
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from playwright.sync_api import expect, sync_playwright


# This script writes records: deliberately pinned to the disposable local fixture.
base = "http://localhost:3112"
email = "bagan-fixture@example.test"
password = "persama-local-fixture-only"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get("QA_CHROMIUM"))
    context = browser.new_context()
    api = context.request

    def kirim(path, data):
        response = api.post(base + path, data=data, timeout=60000)
        assert response.ok, (path, response.status, response.text())
        return response.json().get("doc")

    login = api.post(base + "/api/users/login", data={"email": email, "password": password})
    if not login.ok:
        kirim("/api/users/first-register", {"email": email, "password": password, "nama": "Admin Fixture"})
        login = api.post(base + "/api/users/login", data={"email": email, "password": password})
        assert login.ok, login.status

    periode = kirim("/api/periode", {"nama": "Periode Fixture", "tahunMulai": 2026, "tahunSelesai": 2027, "aktif": True})["id"]
    lain = kirim("/api/periode", {"nama": "Periode Lain", "tahunMulai": 2025, "tahunSelesai": 2026})["id"]
    induk = kirim("/api/pengurus", {"nama": "Orang Induk Fixture", "jabatan": "Kepala Fixture", "kelompok": "penanggung_jawab", "periode": periode})["id"]
    anak = kirim("/api/pengurus", {"nama": "Orang Cabang Fixture", "jabatan": "Pembina Fixture", "kelompok": "pembina", "periode": periode, "urutan": 3})["id"]
    asing = kirim("/api/pengurus", {"nama": "Orang Periode Lain", "jabatan": "Pengarah Fixture", "kelompok": "pengarah", "periode": lain})["id"]

    page = context.new_page()
    page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    page.goto(f"{base}/admin/collections/pengurus/{anak}", wait_until="domcontentloaded", timeout=120000)
    field = page.locator("#field-indukBagan")
    combo = field.get_by_role("combobox")
    combo.click(timeout=45000)
    option = page.get_by_text("Orang Induk Fixture", exact=True)
    expect(option).to_be_visible(timeout=15000)
    expect(page.get_by_text("Orang Periode Lain", exact=True)).to_have_count(0)
    option.click()
    save = page.locator("#action-save")
    with page.expect_response(lambda response: response.request.method == "PATCH" and f"/api/pengurus/{anak}" in response.url) as saved:
        save.click()
    assert saved.value.ok, saved.value.text()
    doc = api.get(f"{base}/api/pengurus/{anak}?depth=0").json()
    assert doc["indukBagan"] == induk, doc
    for target, parent in ((induk, anak), (anak, asing), (anak, anak)):
        ditolak = api.patch(f"{base}/api/pengurus/{target}", data={"indukBagan": parent})
        assert ditolak.status == 400, (target, parent, ditolak.status, ditolak.text())
    a = kirim("/api/pengurus", {"jabatan": "Uji Serentak A", "kelompok": "pembina", "periode": lain})["id"]
    b = kirim("/api/pengurus", {"jabatan": "Uji Serentak B", "kelompok": "pembina", "periode": lain})["id"]
    token = login.json()["token"]

    def sambung(target, parent):
        request = Request(f"{base}/api/pengurus/{target}", data=json.dumps({"indukBagan": parent}).encode(), method="PATCH",
                          headers={"Authorization": f"JWT {token}", "Content-Type": "application/json"})
        try:
            with urlopen(request, timeout=20) as response:
                return response.status
        except HTTPError as error:
            return error.code

    with ThreadPoolExecutor(max_workers=2) as pool:
        status = sorted(result.result() for result in (pool.submit(sambung, a, b), pool.submit(sambung, b, a)))
    assert status == [200, 400], status
    kirim("/api/pengurus", {"nama": "Orang Cabang Kedua", "jabatan": "Pengarah Fixture", "kelompok": "pengarah", "periode": periode, "indukBagan": induk, "urutan": 2})
    bidang = kirim("/api/pengurus", {"jabatan": "Pembina Bidang Fixture", "kelompok": "pembina", "periode": periode, "indukBagan": anak})["id"]
    jabatan = (
        "Jabatan Tanpa Nama Fixture", "Pembina Bidang Pendidikan dan Latihan", "Pembina Bidang Dana dan Usaha",
        "Pembina Bidang Rohani Islam", "Pembina Bidang Rohani Kristen", "Pembina Bidang Seni dan Olahraga",
        "Pembina Bidang Pemerhati Lingkungan",
    )
    for urutan, peran in enumerate(jabatan):
        kirim("/api/pengurus", {"jabatan": peran, "kelompok": "pembina", "periode": periode, "indukBagan": bidang, "urutan": urutan})
    print("Payload admin: selected and saved parent; rejects cycles, cross-period and self-parenting", flush=True)

    for width in (320, 390, 1440):
        public = browser.new_page(viewport={"width": width, "height": 900})
        public.goto(base + "/tentang", wait_until="domcontentloaded", timeout=90000)
        chart = public.get_by_role("region", name="Penanggung jawab dan pembina")
        root = chart.locator("ul > li").filter(has=public.get_by_text("Orang Induk Fixture", exact=True))
        branches = root.locator(":scope > div > ul")
        branch = branches.locator(":scope > li").filter(has=public.get_by_text("Orang Cabang Fixture", exact=True))
        expect(branch.get_by_text("Jabatan Tanpa Nama Fixture", exact=True)).to_be_visible()
        expect(branches.get_by_text("Orang Cabang Kedua", exact=True)).to_be_visible()
        leaves = chart.get_by_text("Pembina Bidang Fixture", exact=True).locator("xpath=../../..").locator(":scope > div > ul > li")
        expect(leaves).to_have_count(7)
        boxes = leaves.evaluate_all("els => els.map(el => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width]; })")
        assert (len({round(box[1]) for box in boxes}) == 1) == (width == 1440), (width, boxes)
        assert leaves.first.evaluate("el => parseFloat(getComputedStyle(el, '::after').borderTopWidth) >= 3 || parseFloat(getComputedStyle(el, '::after').borderInlineStartWidth) >= 3")
        if width == 1440:
            centers = [
                public.get_by_text(label, exact=True).evaluate("el => { const r = el.parentElement.getBoundingClientRect(); return r.x + r.width / 2; }")
                for label in ("Orang Induk Fixture", "Orang Cabang Fixture", "Pembina Bidang Fixture")
            ]
            assert max(centers) - min(centers) <= 1, centers
            assert leaves.nth(3).evaluate("el => getComputedStyle(el, '::after').borderInlineStartWidth") == "3px"
        expect(chart.get_by_text("Orang Periode Lain", exact=True)).to_have_count(0)
        for scale in (100, 200):
            public.evaluate("scale => document.documentElement.style.fontSize = `${scale}%`", scale)
            assert public.evaluate("document.documentElement.scrollWidth <= innerWidth"), (width, scale)
        public.evaluate("document.documentElement.style.removeProperty('font-size')")
        if dest := os.environ.get("QA_SCREENSHOTS"):
            chart.screenshot(path=Path(dest) / f"bagan-pembina-{width}.png")
        print(f"{width}px: parent-branch semantics and 200% text reflow pass", flush=True)
        public.close()
    browser.close()
