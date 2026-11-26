import os
from playwright.sync_api import expect, sync_playwright

origin = os.environ.get('QA_ORIGIN', 'http://localhost:3107')


def total_dokumen(page, collection):
    response = page.request.get(f'{origin}/api/{collection}', params={'draft': 'true', 'limit': 1, 'depth': 0})
    assert response.ok, response.status
    return response.json()['totalDocs']


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('QA_CHROMIUM'))
    page = browser.new_page(viewport={'width': 320, 'height': 844})
    page.goto(origin + '/admin/login')
    page.locator('[name=email]').fill(os.environ['QA_EMAIL'])
    page.locator('[name=password]').fill(os.environ['QA_PASS'])
    page.locator('button[type=submit]').click()
    page.wait_for_url(origin + '/admin')
    failures = []
    page.goto(origin + '/admin/account')
    expect(page.locator('.doc-controls__meta')).to_be_visible()
    for width in [320, 390, 1440]:
        page.set_viewport_size({'width': width, 'height': 844})
        widths = page.locator('.doc-controls__content').evaluate(
            'e=>[document.documentElement.scrollWidth-innerWidth,e.scrollWidth-e.clientWidth]')
        print('Akun', width, widths)
        if any(widths): failures.append(f'Akun {width}: metadata meluber {widths}')
    for collection in ([] if os.environ.get('QA_ACCOUNT_ONLY') else ['event', 'tabloid']):
        # On a fixed deployment this only reads. Run against a disposable DB on an unfixed deployment.
        before = total_dokumen(page, collection)
        page.goto(origin + f'/admin/collections/{collection}/create')
        expect(page.locator('[name=judul]')).to_be_visible()
        draft = page.get_by_role('button', name='Simpan Draf', exact=False)
        if not draft.count(): failures.append(f'{collection}: tombol Simpan Draf tidak ada')
        if not page.url.split('?')[0].endswith('/create'):
            failures.append(f'{collection}: form baru sudah dialihkan ke dokumen tersimpan')
        after = total_dokumen(page, collection)
        if before != after: failures.append(f'{collection}: jumlah dokumen berubah {before} → {after}')
        print(collection, 'Simpan Draf:', draft.count(), 'jumlah dokumen:', before, after)
    browser.close()
    assert not failures, failures
