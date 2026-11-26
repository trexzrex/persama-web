import assert from 'node:assert/strict';

const origin = process.env.QA_ORIGIN ?? 'http://localhost:3107';
for (const [collection, route] of [['event', 'event'], ['tabloid', 'e-tabloid']]) {
  const pathname = `/${route}/qa-slug-tidak-ada-f0438`;
  const response = await fetch(new URL(pathname, origin));
  console.log(`${pathname}: HTTP ${response.status}`);
  assert.equal(response.status, 404, `${pathname} harus merespons HTTP 404`);
  assert.match(await response.text(), /tidak ditemukan/i);

  const list = await fetch(new URL(`/api/${collection}?depth=0&limit=1`, origin));
  assert.ok(list.ok, `daftar ${collection}: HTTP ${list.status}`);
  const doc = (await list.json()).docs[0];
  assert.ok(doc?.slug && doc._status === 'published', `perlu data terbit untuk ${collection}`);
  const detail = await fetch(new URL(`/${route}/${encodeURIComponent(doc.slug)}`, origin));
  assert.equal(detail.status, 200);
  assert.ok(!(await detail.text()).includes('NEXT_HTTP_ERROR_FALLBACK;404'));
  console.log(`/${route}/[slug terbit]: HTTP ${detail.status}`);
}
