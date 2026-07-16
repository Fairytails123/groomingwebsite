#!/usr/bin/env node
// URL-manifest gate (WEBSITE-PLAN.md): every legacy WordPress URL must keep resolving.
//   --dist  : checks the local dist/ output (gates every page sign-off)
//   --live  : checks the live domain over HTTP (gates + confirms DNS cutover)
//   --preview : checks the preview subdomain over HTTP
//
// Entry statuses: 'built' entries FAIL the run when missing; 'planned' entries
// only warn. Flip planned -> built as each page ships.
//
// ⚠️ DIRECTORY FORMAT: unlike the Main Website, every URL here is a
// trailing-slash directory (dist/<path>/index.html). distFile() below encodes
// that — do not copy the Main Website's .html mapping back in.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://fairytailsdoggrooming.co.uk';
const PREVIEW = 'https://preview.fairytailsdoggrooming.co.uk';
const DIST = join(import.meta.dirname, '..', 'dist');

/** @type {{path: string, type: 'page'|'stub'|'gone', status: 'built'|'planned'}[]} */
const MANIFEST = [
  // ---- rebuilt pages (final 200s), 1:1 with the old WordPress URLs ----
  { path: '/', type: 'page', status: 'planned' }, // homepage — LAST in the inside-out order
  { path: '/who-we-are/', type: 'page', status: 'built' }, // built 2026-07-12
  { path: '/services/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/services/full-groom-price-list/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/services/haircut-lengths/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/services/teeth-cleaning/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/services/doggy-massage/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/services/homeless-dogs/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/services/frequently-asked-questions/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/gallery/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/contact/', type: 'page', status: 'built' }, // built 2026-07-12
  { path: '/terms-and-conditions/', type: 'page', status: 'built' }, // built 2026-07-12
  { path: '/blog/', type: 'page', status: 'built' }, // built 2026-07-16
  { path: '/why-dog-grooming-is-important/', type: 'page', status: 'built' }, // blog post at ROOT level — built 2026-07-16
  // ---- meta-refresh stubs (hand-authored in public/ — canonical + noindex) ----
  { path: '/services-2/', type: 'stub', status: 'built' }, // stale duplicate services page → /services/
  { path: '/category/blog/', type: 'stub', status: 'built' }, // WP category archive → /blog/
  { path: '/author/grace/', type: 'stub', status: 'built' }, // WP author archive → /who-we-are/
  // ---- intentional 404s ----
  { path: '/feed/', type: 'gone', status: 'planned' }, // WP RSS — revisit if the Ahrefs backlink audit says otherwise
];

const mode = process.argv.includes('--live') ? 'live' : process.argv.includes('--preview') ? 'preview' : 'dist';

function distFile(p) {
  if (p === '/') return join(DIST, 'index.html');
  return join(DIST, ...p.slice(1, -1).split('/'), 'index.html');
}

let fail = 0;
let warn = 0;

if (mode === 'live' || mode === 'preview') {
  const base = mode === 'live' ? SITE : PREVIEW;
  for (const entry of MANIFEST) {
    const url = `${base}${entry.path}`;
    let status = 0;
    try {
      const res = await fetch(url, { redirect: 'manual' });
      status = res.status;
    } catch (e) {
      status = -1;
    }
    const wantOk = entry.type !== 'gone';
    const ok = wantOk ? status === 200 : status === 404;
    if (ok) {
      console.log(`  OK   ${status}  ${entry.path}`);
    } else if (entry.status === 'planned') {
      warn++;
      console.log(`  WARN ${status}  ${entry.path} (planned, expected ${wantOk ? 200 : 404})`);
    } else {
      fail++;
      console.log(`  FAIL ${status}  ${entry.path} (expected ${wantOk ? 200 : 404})`);
    }
  }
} else {
  if (!existsSync(DIST)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(2);
  }
  for (const entry of MANIFEST) {
    const file = distFile(entry.path);
    const present = existsSync(file);
    const wantPresent = entry.type !== 'gone';
    const ok = wantPresent ? present : !present;
    if (ok) {
      console.log(`  OK   ${entry.path}`);
    } else if (entry.status === 'planned') {
      warn++;
      console.log(`  WARN ${entry.path} (planned, not built yet)`);
    } else {
      fail++;
      console.log(`  FAIL ${entry.path} (${wantPresent ? 'missing from' : 'should not be in'} dist)`);
    }
  }
}

console.log(`\n${MANIFEST.length} URLs checked — ${fail} failures, ${warn} planned-but-missing.`);
process.exit(fail > 0 ? 1 : 0);
