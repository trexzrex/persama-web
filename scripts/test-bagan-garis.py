import os
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


base = os.environ.get("QA_BASE_URL", "http://localhost:3112")

# Read-only check against the local chart fixture or the current public hierarchy.
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=os.environ.get("QA_CHROMIUM"))
    for width in (320, 390, 430, 1440):
        for scale in (100, 200):
            page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
            page.goto(f"{base}/tentang", wait_until="domcontentloaded", timeout=90_000)
            page.evaluate("scale => document.documentElement.style.fontSize = `${scale}%`", scale)
            chart = page.get_by_role("region", name="Penanggung jawab dan pembina")
            advisors = chart.locator('[data-tata-cabang="sejajar"] > li')
            expect(advisors).to_have_count(7)
            result = chart.evaluate("""chart => {
                const box = el => el.getBoundingClientRect();
                const portrait = li => box(li.firstElementChild.firstElementChild);
                const center = r => r.left + r.width / 2;
                const px = (style, key) => parseFloat(style[key]);
                const close = (a, b) => Math.abs(a - b) < .6;
                const groups = chart.querySelectorAll('ul[data-tata-cabang]');
                const [side, single, leaves] = ['samping', 'lurus', 'sejajar'].map(
                    type => Array.from(groups).find(group => group.dataset.tataCabang === type)
                );
                const row = Array.from(leaves.children);
                const desktop = row.every(li => close(box(li).top, box(row[0]).top));
                const errors = [];
                const check = (ok, name) => { if (!ok) errors.push(name); };

                check(close(center(portrait(side.closest('li'))), center(portrait(single.closest('li')))), 'jalur utama bergeser dari tengah');
                check(close(center(portrait(single.closest('li'))), center(portrait(single.firstElementChild))), 'sambungan Wakasek–Pembina Bidang tidak lurus');
                if (desktop) {
                    for (const li of row) {
                        const rect = box(li), photo = portrait(li);
                        const drop = getComputedStyle(li, '::after');
                        check(px(drop, 'borderLeftWidth') === 3 &&
                              close(rect.left + px(drop, 'left'), center(photo)) &&
                              close(rect.top + px(drop, 'height'), photo.top), 'garis desktop tidak menyentuh potret');
                    }
                } else {
                    const [office, main] = side.children;
                    const officeBox = box(office), officePhoto = portrait(office);
                    const spine = getComputedStyle(side, '::before');
                    const continuation = getComputedStyle(office, '::before');
                    const fork = getComputedStyle(office, '::after');
                    const spineX = center(portrait(main));
                    const continuationTop = officeBox.top + px(continuation, 'top');
                    check(close(box(side).left + px(spine, 'left') + 1.5, spineX), 'garis dari kepala sekolah tidak di tengah');
                    check(close(officeBox.left + px(continuation, 'left') + 1.5, spineX), 'jalur vertikal bergeser di sisi Tata Usaha');
                    check(continuationTop <= box(side).top + px(spine, 'height') &&
                          continuationTop + px(continuation, 'height') >= portrait(main).top, 'jalur vertikal putus sebelum Wakasek');
                    check(close(officeBox.top + px(fork, 'top') + 1.5, officePhoto.top + officePhoto.height / 2), 'cabang Tata Usaha tidak setinggi tengah foto');
                    check(officePhoto.right < spineX && close(officeBox.right - px(fork, 'right'), spineX + 1.5), 'cabang Tata Usaha tidak menyentuh jalur utama');

                    for (const group of [leaves]) {
                        const start = getComputedStyle(group, '::before');
                        const railX = box(group).left + px(start, 'left');
                        let railEnd = box(group).top + px(start, 'height');
                        const children = Array.from(group.children);
                        for (const [index, li] of children.entries()) {
                            const rect = box(li), photo = portrait(li);
                            const vertical = getComputedStyle(li, '::before');
                            const horizontal = getComputedStyle(li, '::after');
                            const top = rect.top + px(vertical, 'top');
                            const y = rect.top + px(horizontal, 'top');
                            const end = rect.left + px(horizontal, 'left') + px(horizontal, 'width');
                            const name = `${group.dataset.tataCabang} ${index + 1}`;
                            check(close(railX, rect.left + px(vertical, 'left')), `${name}: rel tidak sejajar`);
                            check(top <= railEnd + .1, `${name}: rel terputus`);
                            railEnd = top + px(vertical, 'height');
                            check(close(y + 1.5, photo.top + photo.height / 2), `${name}: garis meleset dari tengah foto`);
                            check(end >= photo.left + 1, `${name}: garis tidak menyentuh foto`);
                            check(px(vertical, 'borderLeftWidth') === 3 && px(horizontal, 'borderTopWidth') === 3, `${name}: tebal garis bukan 3px`);
                            if (index === children.length - 1) check(close(railEnd, y + 3), `${name}: ujung rel tidak menutup siku`);
                        }
                    }
                    check(row.every(li => box(li.querySelector('[data-kelompok]')).left > portrait(li).right), 'teks pembina masih di bawah potret');
                }
                check(document.documentElement.scrollWidth <= innerWidth, 'halaman meluber');
                return { desktop, errors };
            }""")
            assert result["desktop"] == (width == 1440 and scale == 100), (width, scale, result)
            assert not result["errors"], (width, scale, result["errors"])
            if output := os.environ.get("QA_SCREENSHOTS"):
                chart.screenshot(path=Path(output) / f"garis-bagan-{width}-{scale}.png", timeout=30_000)
            print(f"{width}px / {scale}%: connector alignment, joins, layout and reflow passed", flush=True)
            page.close()
