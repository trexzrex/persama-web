import assert from 'node:assert/strict';
import { test } from 'node:test';

const { susunBaganPembina, indukMelingkar } = await import('../src/lib/bagan-pembina.ts');

test('orders roots and connects children by ID, not by job title', () => {
  const data = [
    { id: 13, indukBagan: 12, urutan: 2 },
    { id: 10, urutan: 1 },
    { id: 12, indukBagan: { id: 10 }, urutan: 1 },
    { id: 11, indukBagan: 10, urutan: 0 },
    { id: 14, indukBagan: 99, urutan: 2 },
  ];
  const bentuk = (nodes) => nodes.map(({ orang, anak }) => [orang.id, bentuk(anak)]);
  assert.deepEqual(bentuk(susunBaganPembina(data)), [[10, [[11, []], [12, [[13, []]]]]], [14, []]]);
});

test('keeps invalid cyclic records visible without joining a cyclic branch', () => {
  const data = [{ id: 1, indukBagan: 2 }, { id: 2, indukBagan: 1 }, { id: 3, indukBagan: 2 }];
  assert.deepEqual(susunBaganPembina(data).map(({ orang }) => orang.id), [1, 2, 3]);
  assert.equal(indukMelingkar(1, 3, new Map([[3, 2], [2, 1]])), true);
  assert.equal(indukMelingkar(1, 3, new Map([[3, 2]])), false);
});
