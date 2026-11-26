import os
from playwright.sync_api import expect, sync_playwright

origin = os.environ.get('QA_ORIGIN', 'http://127.0.0.1:3107')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('QA_CHROMIUM'))
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.set_default_timeout(9000)

    page.goto(origin + '/admin/login', wait_until='networkidle')
    expect(page.locator('[name=email]')).to_be_visible()
    lupa = page.get_by_role('link', name='Lupa kata sandi?')
    print('tautan lupa terlihat:', lupa.count())
    assert lupa.count() == 0, 'tautan lupa kata sandi masih tampil'
    assert page.locator('form.login__form > a[href$="/forgot"]').evaluate(
        'a=>getComputedStyle(a).display') == 'none'

    page.goto(origin + '/admin/forgot', wait_until='domcontentloaded')
    page.wait_for_url(origin + '/admin/login', timeout=9000)
    print('forgot dialihkan ke:', page.url)
    expect(page.locator('[name=email]')).to_be_visible()

    page.locator('[name=email]').fill(os.environ['QA_EMAIL'])
    page.locator('[name=password]').fill(os.environ['QA_PASS'])
    page.locator('button[type=submit]').click()
    page.wait_for_url(origin + '/admin', timeout=15000)
    print('masuk:', page.url)
    assert page.get_by_role('heading', name='Selamat datang kembali.').count() == 1

    page.goto(origin + '/admin/logout')
    page.wait_for_url(lambda url: '/admin/logout' not in url, timeout=9000)
    print('keluar:', page.url)
    browser.close()
    print('PASS tautan lupa hilang, /admin/forgot dialihkan, masuk dan keluar tetap jalan')
