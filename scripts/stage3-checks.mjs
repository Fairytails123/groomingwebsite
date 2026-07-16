#!/usr/bin/env node
// Stage 3 (services cluster) content gate. Runs against dist/ after `npm run build`.
//
// This exists because Stage 3 is where the old site's facts contradicted each
// other most: pick-up was priced four different ways, the FAQ and T&Cs published
// different collection windows and different ear-plucking and payment policies,
// and a "£50+" hand-strip floor was undercut by £45 rows in its own price table.
// Every owner ruling that resolved one of those is asserted here so it cannot
// silently regress.
//
// The reveal checks are the important ones: the main site once lost 71% of a
// page's clicks because a JS animation left the body text at opacity:0 for
// anything that doesn't scroll (Googlebot, screen readers). The price list is
// this site's highest commercial-intent page — every row must be in the HTML,
// visible, at t=0.
//
// Run: node scripts/stage3-checks.mjs
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist');
const pricing = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'src', 'data', 'pricing.json'), 'utf8'));

let fail = 0;
const ok = (m) => console.log(`  OK   ${m}`);
const bad = (m) => {
  fail++;
  console.log(`  FAIL ${m}`);
};
const check = (cond, m) => (cond ? ok(m) : bad(m));

const read = (p) => {
  const f = join(DIST, ...p.slice(1, -1).split('/'), 'index.html');
  if (!existsSync(f)) {
    bad(`${p} not built`);
    return null;
  }
  return readFileSync(f, 'utf8');
};
/** Visible text with tags stripped — what a reader (and a crawler) actually gets. */
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

console.log('\n--- /services/full-groom-price-list/ ---');
const pl = read('/services/full-groom-price-list/');
if (pl) {
  const expected = pricing.fullGroom.breeds.length + pricing.fullGroom.crossbreeds.length + pricing.fullGroom.deShed.length;
  // Match the <tr> specifically — a bare /data-row/ also hits the querySelectorAll
  // calls in the page's own filter script and over-counts by 2.
  const rows = [...pl.matchAll(/<tr[^>]*\sdata-row/g)].length;
  check(rows === expected, `${rows} breed rows in the HTML (expected ${expected})`);

  // t=0 contract: nothing hidden, nothing waiting on JS or a scroll.
  const hiddenRows = [...pl.matchAll(/<tr[^>]*data-row[^>]*\shidden/g)].length;
  check(hiddenRows === 0, `0 rows ship with the hidden attribute (found ${hiddenRows})`);
  check(!/opacity:\s*0/.test(pl), 'no opacity:0 inline on the price list');
  check(/data-filter-ui[^>]*\shidden/.test(pl), 'filter UI ships hidden (JS reveals it — no dead input without JS)');

  // Spot-check prices straight out of the rendered table, one per price band.
  const spot = [
    ['Airedale (clip)', 45], ['Newfoundland', 60], ['Cockerpoo', 40], ['Pug', 25],
    ['Basset Griffon Vendéen (large)', 40], ['Yorkshire Terrier', 35], ['Chow Chow', 50],
    ['Zuchon', 35], ['Weimaraner', 30], ['Poodle (standard)', 55],
  ];
  let miss = 0;
  for (const [name, price] of spot) {
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`${esc}</td>\\s*<td[^>]*>£${price}</td>`).test(pl)) {
      bad(`spot check: ${name} should render £${price}`);
      miss++;
    }
  }
  check(miss === 0, `10-breed spot check against the rendered table`);
}

console.log('\n--- pick-up facts (owner rulings 2026-07-16) ---');
const pages = ['/terms-and-conditions/', '/who-we-are/', '/services/', '/services/full-groom-price-list/', '/services/frequently-asked-questions/', '/'];
// Wordings the old site published that are now WRONG. Any reappearance is a regression.
const banned = [
  [/free (pick|door)/i, 'a "free pick-up/door-to-door" claim (pick-ups are £2 per journey)'],
  [/£1 per journey/i, 'the old £1 per journey price'],
  [/£5 per journey/i, 'the retired £5 out-of-area price'],
  [/no extra cost/i, 'the old "at no extra cost" door-to-door claim'],
  // \b matters: a bare /Rye/i matches "d-rye-rs" in the FAQ's "Do you use cage dryers?".
  [/\b(Bexhill|Battle|Rye)\b/i, 'an out-of-area town we do not serve'],
  [/8:15|17:45|16:30 and 17:45/i, 'a stale pick-up time window'],
  [/unless there are loose hairs/i, 'the retired ear-plucking carve-out'],
  [/£50\+/i, 'the contradicted "£50+" hand-strip floor (the table has £45 rows)'],
];
for (const p of pages) {
  const html = read(p);
  if (!html) continue;
  const t = text(html);
  for (const [re, why] of banned) {
    if (re.test(t)) bad(`${p} contains ${why}`);
  }
}
ok('no banned pick-up/policy wording in any built page (see list above)');

console.log('\n--- single-sourced pick-up facts ---');
check(pricing.pickup.areas === 'Hastings and St Leonards', `areas = "${pricing.pickup.areas}" (St Leonards restored per ruling)`);
check(pricing.pickup.journeyPrice === 2 && pricing.pickup.roundTripPrice === 4, 'price = £2 per leg / £4 round trip');
check(Array.isArray(pricing.pickup.windows) && pricing.pickup.windows.length === 2, 'both collection windows present');
const tc = read('/terms-and-conditions/');
if (tc) {
  const t = text(tc);
  for (const w of pricing.pickup.windows) {
    check(t.includes(w.collect) && t.includes(w.home), `T&Cs render the ${w.appointment.toLowerCase()} window (${w.collect} → ${w.home})`);
  }
}

console.log('\n--- Bruno case-study video ---');
const mp4 = join(DIST, 'media', 'brunos-groom.mp4');
if (existsSync(mp4)) {
  ok(`video shipped (${(statSync(mp4).size / 1024 / 1024).toFixed(1)} MB)`);
} else {
  bad('video missing from dist/media/');
}
const svc = read('/services/');
if (svc) {
  check(/preload="none"/.test(svc), 'video is preload="none" (a 20 MB file must never load with the page)');
  check(/poster="/.test(svc), 'video has a poster frame');
}

console.log(`\n${fail} failure(s).`);
process.exit(fail > 0 ? 1 : 0);
