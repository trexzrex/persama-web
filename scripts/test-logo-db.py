import os
import json
import struct
import uuid
import zlib

from playwright.sync_api import sync_playwright

origin = os.environ.get('QA_ORIGIN', 'http://127.0.0.1:3107')
tag = 'QA-LOGO-' + uuid.uuid4().hex[:8]


def png():
    def chunk(name, data):
        return (
            struct.pack('>I', len(data))
            + name
            + data
            + struct.pack('>I', zlib.crc32(name + data))
        )

    pixels = (b'\0' + bytes([0x14, 0x46, 0x47]) * 64) * 64
    return (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', 64, 64, 8, 2, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(pixels))
        + chunk(b'IEND', b'')
    )


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('QA_CHROMIUM'))
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.set_default_timeout(12000)
    page.goto(origin + '/admin/login')
    page.locator('[name=email]').fill(os.environ['QA_EMAIL'])
    page.locator('[name=password]').fill(os.environ['QA_PASS'])
    page.locator('button[type=submit]').click()
    page.wait_for_url(origin + '/admin', timeout=20000)

    anonim = browser.new_page(viewport={'width': 1440, 'height': 900})
    anonim.set_default_timeout(12000)

    global_url = origin + '/api/globals/pengaturan-situs?depth=0'
    awal = page.request.get(global_url).json()
    relasi = awal.get('logoPersama')
    id_awal = relasi.get('id') if isinstance(relasi, dict) else relasi

    def potret(label):
        temuan = {}
        page.goto(origin + '/admin', wait_until='networkidle')
        temuan['admin'] = page.locator('.app-header img[alt="PERSAMA"]').first.get_attribute('src')
        page.goto(origin + '/', wait_until='networkidle')
        temuan['header'] = page.locator('header img').first.get_attribute('src')
        temuan['footer'] = page.locator('footer img').last.get_attribute('src')
        temuan['favicon'] = page.locator('link[rel~="icon"]').first.get_attribute('href')
        anonim.goto(origin + '/admin/login', wait_until='networkidle')
        temuan['login'] = anonim.locator('.persama-admin-brand img').first.get_attribute('src')
        for tempat, src in temuan.items():
            assert src, f'{label}: {tempat} tidak punya src'
        print(label, temuan)
        return temuan

    baseline = potret('sebelum (logo global %s)' % id_awal)

    unggah = page.request.post(
        origin + '/api/media',
        multipart={
            'file': {'name': tag + '.png', 'mimeType': 'image/png', 'buffer': png()},
            '_payload': json.dumps({'teksAlternatif': tag}),
        },
    )
    assert unggah.ok, (unggah.status, unggah.text()[:300])
    media = unggah.json()['doc']
    print('media uji:', media['id'], media['filename'])

    def simpan_logo(nilai):
        r = page.request.post(origin + '/api/globals/pengaturan-situs', data={'logoPersama': nilai})
        assert r.ok, (r.status, r.text()[:300])

    try:
        simpan_logo(media['id'])
        baru = potret('dengan logo dari DB')
        for tempat, src in baru.items():
            assert media['filename'] in src, f'{tempat} memakai {src}, bukan logo DB'
    finally:
        simpan_logo(id_awal)
        pulih = potret('setelah dipulihkan')
        assert pulih == baseline, (pulih, baseline)
        hapus = page.request.delete(origin + '/api/media/' + str(media['id']))
        print('hapus media uji:', hapus.status, page.request.get(origin + '/api/media/' + str(media['id'])).status)
        akhir = page.request.get(global_url).json()
        relasi = akhir.get('logoPersama')
        assert (relasi.get('id') if isinstance(relasi, dict) else relasi) == id_awal

    browser.close()
    print('PASS logo admin, login, header situs, dan favicon mengikuti Pengaturan Situs')
