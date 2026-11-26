import os
import re

from playwright.sync_api import expect, sync_playwright

origin = os.environ.get('QA_ORIGIN', 'http://127.0.0.1:3107')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('QA_CHROMIUM'))
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.set_default_timeout(12000)
    page.goto(origin + '/admin/login')
    page.locator('[name=email]').fill(os.environ['QA_EMAIL'])
    page.locator('[name=password]').fill(os.environ['QA_PASS'])
    page.locator('button[type=submit]').click()
    page.wait_for_url(origin + '/admin', timeout=20000)

    page.goto(origin + '/admin/collections/periode', wait_until='networkidle')
    sel = page.locator('.persama-periode-sel').first
    nama = sel.locator('a').first
    href = nama.get_attribute('href')
    edit = sel.locator('a.persama-periode-edit').get_attribute('href')
    print('tautan tahun:', nama.inner_text(), href)
    print('tautan edit:', edit)
    assert re.search(r'/admin/collections/divisi\?periode=\d+', href or ''), href
    assert re.search(r'/admin/collections/periode/\d+', edit or ''), edit

    periode_id = re.search(r'periode=(\d+)', href).group(1)
    nama.click()
    page.wait_for_url(lambda url: '/admin/collections/divisi' in url, timeout=12000)
    print('mendarat di:', page.url)
    expect(page.get_by_role('heading', level=1)).to_contain_text('Struktur')
    expect(page.get_by_role('link', name='Lihat anggota →').first).to_be_visible()
    assert periode_id in page.url

    page.set_viewport_size({'width': 320, 'height': 844})
    page.goto(origin + '/admin/collections/periode', wait_until='networkidle')
    print('luapan 320:', page.evaluate('document.documentElement.scrollWidth-innerWidth'))

    browser.close()
    print('PASS tahun periode membuka struktur divisi, tautan edit dokumen tetap ada')
