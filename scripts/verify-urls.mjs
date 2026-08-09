#!/usr/bin/env node
// URL-manifest gate (WEBSITE-PLAN.md): every legacy WordPress URL must keep resolving.
//   --dist  : checks the local dist/ output (gates every page sign-off)
//   --live  : checks PRODUCTION over HTTP — https://fairytailsdoggrooming.co.uk, live since
//             the 2026-08-08 cutover. This is the post-deploy gate now.
//   --preview : REMOVED 2026-08-08. Pages serves the apex, not the preview subdomain, so that
//             host 404s on every path; the flag used to "fail" 18 URLs and look like a
//             regression. It now aborts with an explanation instead. There is no preview URL —
//             check locally with `npm run build && npx astro preview`.
//
// ⚠️ Note the double dash: `npm run verify-urls -- --live`. Without it npm swallows the flag
// and you silently get dist mode while believing you checked production.
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
// (There is deliberately no PREVIEW constant any more — see the --preview note in the header.)
const DIST = join(import.meta.dirname, '..', 'dist');

/** @type {{path: string, type: 'page'|'stub'|'gone', status: 'built'|'planned'}[]} */
const MANIFEST = [
  // ---- rebuilt pages (final 200s), 1:1 with the old WordPress URLs ----
  { path: '/', type: 'page', status: 'built' }, // homepage — built LAST in the inside-out order, 2026-07-16
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

if (process.argv.includes('--preview')) {
  console.error(`
❌ --preview was REMOVED at the 2026-08-08 go-live.

   GitHub Pages now serves the apex (https://fairytailsdoggrooming.co.uk), NOT
   preview.fairytailsdoggrooming.co.uk — that host returns GitHub's "Site not found" 404 on
   every path, so this flag would report 18 failures that mean nothing.

   Use instead:
     npm run verify-urls -- --live     # check PRODUCTION over HTTP
     npm run verify-urls               # check the local dist/ output
     npm run build && npx astro preview  # a real local preview
`);
  process.exit(2);
}

const mode = process.argv.includes('--live') ? 'live' : 'dist';

function distFile(p) {
  if (p === '/') return join(DIST, 'index.html');
  return join(DIST, ...p.slice(1, -1).split('/'), 'index.html');
}

let fail = 0;
let warn = 0;

if (mode === 'live') {
  const base = SITE;
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
// ── INDEXABILITY (live mode only) ────────────────────────────────────────────────────────────
// This exists because the failure it catches is SILENT and expensive. Indexability is driven by
// the repo Actions variable INDEXABLE; unset it, rename it, or lose it in a workflow edit and the
// next deploy de-indexes the live business site — through a completely GREEN Actions run, with no
// error raised anywhere.
//
// It nearly happened for a different reason on 2026-08-09: the project's session memory — which
// loads at the start of EVERY session — still said "noindexed until cutover; flip day sets true"
// a day AFTER the flip, which reads as an instruction to unset the variable. Documentation rots.
// A gate does not. So the post-deploy check now asserts the property directly against production
// instead of trusting anyone to remember.
//
// ⚠️ dist mode deliberately does NOT check this. A LOCAL build is noindexed by design (the env var
// is not set on a dev machine) and that is correct, not a bug — asserting it locally would train
// everyone to ignore a red gate. Only production is asserted.
if (mode === 'live') {
  console.log('');
  const problems = [];
  try {
    const robots = await (await fetch(`${SITE}/robots.txt`, { redirect: 'follow' })).text();
    const disallowsAll = /^\s*Disallow:\s*\/\s*$/im.test(robots);
    const namesSitemap = /^\s*Sitemap:\s*https?:\/\/\S+/im.test(robots);
    if (disallowsAll) problems.push('robots.txt says `Disallow: /` — production is blocking ALL crawlers');
    if (!namesSitemap) problems.push('robots.txt does not name a Sitemap');
    console.log(
      `  ${disallowsAll || !namesSitemap ? 'FAIL' : 'OK  '} robots.txt — ${disallowsAll ? 'DISALLOWS EVERYTHING' : 'allows'}${namesSitemap ? ', names the sitemap' : ', NO sitemap line'}`,
    );

    const html = await (await fetch(`${SITE}/`, { redirect: 'follow' })).text();
    const meta = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
    const noindexed = meta && /noindex/i.test(meta[0]);
    if (noindexed) problems.push(`the live homepage carries ${meta[0]}`);
    console.log(`  ${noindexed ? 'FAIL' : 'OK  '} homepage meta robots — ${meta ? meta[0] : 'none (indexable)'}`);
  } catch (err) {
    problems.push(`could not verify indexability: ${err.message}`);
    console.log(`  FAIL indexability check errored — ${err.message}`);
  }
  if (problems.length) {
    fail += problems.length;
    console.log(`\n❌ PRODUCTION IS NOT INDEXABLE:\n  - ${problems.join('\n  - ')}`);
    console.log('  Check the repo Actions variable: gh variable list -R Fairytails123/groomingwebsite');
    console.log('  It must be INDEXABLE=true. This is a live business site — fix this before anything else.');
  }
}

process.exit(fail > 0 ? 1 : 0);
