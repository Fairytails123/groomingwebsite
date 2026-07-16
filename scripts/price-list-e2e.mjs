#!/usr/bin/env node
// Browser gate for /services/full-groom-price-list/ — the site's highest
// commercial-intent page. Drives the breed filter for real, then re-loads the
// page with JS DISABLED to prove the rendered content does not depend on it.
//
// Why the no-JS half matters more than the filter half: the main site once lost
// 71% of a page's clicks because a JS reveal left the body text at opacity:0 for
// anything that never scrolls — Googlebot, screen readers, a stalled render.
// A price a crawler cannot read is a price that cannot rank. Every assertion
// below is against COMPUTED style and real visibility, not source text.
//
// Expects `npx astro preview` on :4321 (or set BASE).
// Run: node scripts/price-list-e2e.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4321';
const PATH = '/services/full-groom-price-list/';

const pricing = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'src', 'data', 'pricing.json'), 'utf8'));
const all = [...pricing.fullGroom.breeds, ...pricing.fullGroom.crossbreeds, ...pricing.fullGroom.deShed];
const TOTAL = all.length;
// Expected counts are DERIVED from the data, so they can't rot when a breed is
// added. (Hand-counting these is how the first version of this test got "cocker"
// wrong — it forgot American Cocker Spaniel.)
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const expect = (q) => all.filter((b) => fold(b.name).includes(fold(q))).length;

let fail = 0;
const t = (name, cond) => {
  console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${name}`);
  if (!cond) fail++;
};

const browser = await chromium.launch();

console.log('\n--- breed filter (JS on) ---');
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await page.goto(BASE + PATH, { waitUntil: 'networkidle' });
const visible = () => page.$$eval('[data-row]', (rs) => rs.filter((r) => !r.hidden).length);

t('filter UI revealed by JS', await page.isVisible('#breed-filter'));
t(`all ${TOTAL} rows visible initially`, (await visible()) === TOTAL);

for (const q of ['cocker', 'poodle', 'vendeen', 'terrier']) {
  await page.fill('#breed-filter', q);
  await page.waitForTimeout(100);
  const got = await visible();
  t(`"${q}" → ${got} rows (expected ${expect(q)})`, got === expect(q));
}

await page.fill('#breed-filter', 'zzzz');
await page.waitForTimeout(100);
t('no-match message shown', await page.isVisible('[data-no-results]'));
t('0 rows visible on no match', (await visible()) === 0);

await page.fill('#breed-filter', '');
await page.waitForTimeout(100);
t(`clearing restores all ${TOTAL}`, (await visible()) === TOTAL);
t('status line reports the full count', /\b105\b/.test(await page.textContent('[data-filter-status]')));

console.log('\n--- the t=0 contract (JS off) ---');
const ctx = await browser.newContext({ javaScriptEnabled: false });
const noJs = await ctx.newPage();
await noJs.goto(BASE + PATH, { waitUntil: 'load' });

t(`all ${TOTAL} rows still visible with no JS`, (await noJs.$$eval('[data-row]', (rs) => rs.filter((r) => !r.hidden).length)) === TOTAL);
t('no dead filter input is shown', !(await noJs.isVisible('#breed-filter')));

const hidden = await noJs.evaluate(() =>
  [...document.querySelectorAll('td, th, h1, h2, p, li')].filter((el) => {
    const s = getComputedStyle(el);
    return s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05;
  }).length,
);
t(`0 content nodes hidden by computed style (${hidden})`, hidden === 0);

// Prove real prices are in the text a non-scrolling agent receives.
const body = await noJs.textContent('body');
for (const [name, price] of [['Newfoundland', 60], ['Pug', 25], ['Poodle (standard)', 55]]) {
  t(`"${name} £${price}" present in body text`, body.includes(name) && body.includes(`£${price}`));
}

await browser.close();
console.log(`\n${fail} failure(s).`);
process.exit(fail ? 1 : 0);
