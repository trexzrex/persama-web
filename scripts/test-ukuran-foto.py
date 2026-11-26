import os

from playwright.sync_api import sync_playwright

origin = os.environ.get('QA_ORIGIN', 'http://127.0.0.1:3107')
tujuan = os.path.join(os.environ['LOCALAPPDATA'], 'Temp/opencode')
global_url = origin + '/api/globals/pengaturan-situs?depth=0'


def ukur(page):
    box = page.locator('section[aria-labelledby=judul-anggota] article[data-profil=anggota] > div:first-child').first.bounding_box()
    gaya = page.locator('section[aria-labelledby=judul-anggota] article[data-profil=anggota] > div:first-child img').first.evaluate(
        'i => { const s = getComputedStyle(i); return [s.objectFit, s.objectPosition]; }'
    )
    pimpinan = page.locator('article[data-profil=pimpinan] > div:first-child').first.bounding_box()
    return {
        'anggota': round(box['width'] / box['height'], 3),
        'tinggi': round(box['height']),
        'gaya': gaya,
        'pimpinan': round(pimpinan['width'] / pimpinan['height'], 3) if pimpinan else None,
    }


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('QA_CHROMIUM'))
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.set_default_timeout(15000)
    page.goto(origin + '/admin/login')
    page.locator('[name=email]').fill(os.environ['QA_EMAIL'])
    page.locator('[name=password]').fill(os.environ['QA_PASS'])
    page.locator('button[type=submit]').click()
    page.wait_for_url(origin + '/admin', timeout=20000)

    awal = page.request.get(global_url).json().get('ukuranFotoAnggota')
    print('nilai awal:', awal)

    hasil = {}
    try:
        for nilai in ('besar', 'sedang', 'sangat-besar'):
            r = page.request.post(origin + '/api/globals/pengaturan-situs', data={'ukuranFotoAnggota': nilai})
            assert r.ok, (r.status, r.text()[:200])
            page.goto(origin + '/inti-persama', wait_until='networkidle')
            hasil[nilai] = ukur(page)
            print(nilai, hasil[nilai])
            page.locator('article[data-profil=anggota]').nth(2).screenshot(path=os.path.join(tujuan, f'foto-{nilai}.png'))

        assert abs(hasil['besar']['anggota'] - 0.8) < 0.02, hasil['besar']
        assert abs(hasil['sangat-besar']['anggota'] - 0.75) < 0.02, hasil['sangat-besar']
        assert abs(hasil['sedang']['anggota'] - 1) < 0.02, hasil['sedang']
        assert hasil['besar']['gaya'][0] == 'cover'
        assert hasil['sedang']['gaya'][0] == 'contain'
        assert hasil['besar']['pimpinan'] == 1, hasil['besar']['pimpinan']
        print('tinggi foto anggota besar vs sedang:', hasil['besar']['tinggi'], '>', hasil['sedang']['tinggi'])
    finally:
        r = page.request.post(origin + '/api/globals/pengaturan-situs', data={'ukuranFotoAnggota': awal})
        assert r.ok, (r.status, r.text()[:200])
        print('dipulihkan:', page.request.get(global_url).json().get('ukuranFotoAnggota'))

    page.set_viewport_size({'width': 320, 'height': 844})
    page.goto(origin + '/inti-persama', wait_until='networkidle')
    print('luapan 320:', page.evaluate('document.documentElement.scrollWidth-innerWidth'))
    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(origin + '/inti-persama', wait_until='networkidle')
    print('luapan 390:', page.evaluate('document.documentElement.scrollWidth-innerWidth'))
    page.goto(origin + '/divisi/hubungan-masyarakat', wait_until='networkidle')
    print('divisi ada foto anggota:', page.locator('article[data-profil=anggota]').count())

    browser.close()
    print('PASS ukuran foto anggota mengikuti Pengaturan Situs')
