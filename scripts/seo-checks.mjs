#!/usr/bin/env node
// Local SEO regression gate. Run after either build mode:
//   npm run build && npm run verify-seo
//   $env:PUBLIC_INDEXABLE='true'; npm run build; npm run verify-seo -- --indexable
//
// A plain local build MUST be noindexed. The flagged build models production
// and MUST be indexable. Keeping both assertions prevents the live site's
// env-driven indexability handle from silently flipping in either direction.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://fairytailsdoggrooming.co.uk';
const GROOMING_GTM = 'GTM-TZWLLT4H';
const PROHIBITED_MAIN_SITE_GTM = 'GTM-W93L9XK5';
const expectIndexable = process.argv.includes('--indexable');

const pages = [
  '/',
  '/dog-groomers-st-leonards/',
  '/who-we-are/',
  '/services/',
  '/services/full-groom-price-list/',
  '/services/haircut-lengths/',
  '/services/teeth-cleaning/',
  '/services/doggy-massage/',
  '/services/homeless-dogs/',
  '/services/frequently-asked-questions/',
  '/gallery/',
  '/contact/',
  '/terms-and-conditions/',
  '/blog/',
  '/why-dog-grooming-is-important/',
];

const expectedTitles = new Map([
  ['/', 'Dog Groomers Hastings | Book Online | Fairy Tails'],
  ['/dog-groomers-st-leonards/', 'Dog Groomers St Leonards | Collection & Return | Fairy Tails'],
  ['/services/', 'Dog Grooming Services Hastings | Fairy Tails'],
  ['/who-we-are/', 'Qualified Dog Groomers in Hastings | Fairy Tails'],
]);

const decode = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&pound;', '£')
    .replaceAll('&ndash;', '–')
    .replaceAll('&mdash;', '—');

const text = (html) =>
  decode(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );

const fileFor = (path) =>
  path === '/' ? join(DIST, 'index.html') : join(DIST, ...path.slice(1, -1).split('/'), 'index.html');

let failures = 0;
const ok = (message) => console.log(`  OK   ${message}`);
const bad = (message) => {
  failures++;
  console.log(`  FAIL ${message}`);
};
const check = (condition, message) => (condition ? ok(message) : bad(message));

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(2);
}

console.log(`\n--- page signals (${expectIndexable ? 'production/indexable' : 'local/noindex'} build) ---`);
const titles = [];
const htmlByPath = new Map();
for (const path of pages) {
  const file = fileFor(path);
  if (!existsSync(file)) {
    bad(`${path} exists in dist`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  htmlByPath.set(path, html);

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const description = decode(
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ?? '',
  );
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)?.[1] ?? '';
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);

  titles.push([path, title]);
  check(title.length > 10, `${path} has a descriptive title`);
  check(
    description.length >= 100 && description.length <= 165,
    `${path} meta description is useful (${description.length} chars)`,
  );
  check(canonical === `${SITE}${path}`, `${path} canonical is the apex trailing-slash URL`);
  check(h1Count === 1, `${path} has exactly one H1`);
  check(expectIndexable ? !noindex : noindex, `${path} has the expected robots state`);

  if (expectedTitles.has(path)) {
    check(title === expectedTitles.get(path), `${path} carries its approved local-search title`);
  }
}

check(new Set(titles.map(([, title]) => title)).size === titles.length, 'all canonical pages have unique titles');
check(!titles.some(([, title]) => /^Home\s*[-|]/i.test(title)), 'homepage title is not the vague word “Home”');

console.log('\n--- robots and sitemap ---');
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
check(expectIndexable ? !/^Disallow:\s*\/$/im.test(robots) : /^Disallow:\s*\/$/im.test(robots), 'robots.txt matches the build mode');
check(/^Sitemap:\s*https:\/\/fairytailsdoggrooming\.co\.uk\/sitemap-index\.xml$/im.test(robots) || !expectIndexable, 'indexable robots.txt names the canonical sitemap');

const sitemapFiles = readdirSync(DIST).filter((name) => /^sitemap-\d+\.xml$/.test(name));
const sitemap = sitemapFiles.map((name) => readFileSync(join(DIST, name), 'utf8')).join('\n');
for (const path of pages) {
  check(sitemap.includes(`<loc>${SITE}${path}</loc>`), `sitemap includes ${path}`);
}
check((sitemap.match(/<loc>/g) ?? []).length === pages.length, `sitemap contains exactly ${pages.length} canonical pages`);

console.log('\n--- local business entity ---');
const home = htmlByPath.get('/') ?? '';
const jsonLdBlocks = [...home.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
const parsed = [];
for (const block of jsonLdBlocks) {
  try {
    parsed.push(JSON.parse(block[1]));
  } catch (error) {
    bad(`homepage JSON-LD parses (${error.message})`);
  }
}
const graph = parsed.flatMap((item) => item['@graph'] ?? [item]);
const localBusinesses = graph.filter((item) => item['@type'] === 'LocalBusiness');
const localBusiness = localBusinesses[0];
const website = graph.find((item) => item['@type'] === 'WebSite');
check(localBusinesses.length === 1, 'homepage declares exactly one LocalBusiness entity');
check(Boolean(website), 'homepage declares the WebSite/site-name entity');
if (localBusiness) {
  check(localBusiness.name === 'The Fairy Tails Dog Grooming', 'schema business name matches the site');
  check(localBusiness.url === `${SITE}/`, 'schema URL is canonical');
  check(localBusiness.telephone === '+441424300668', 'schema uses the current salon number');
  check(localBusiness.address?.streetAddress === 'Number 15, Mount Pleasant Road', 'schema uses the physical Hastings address');
  check(localBusiness.address?.addressLocality === 'Hastings', 'schema locality is Hastings');
  check(localBusiness.address?.postalCode === 'TN34 3SB', 'schema postcode matches the visible NAP');
  check(localBusiness.address?.addressCountry === 'GB', 'schema country is GB');
  check(localBusiness.email === 'info@thefairytails.co.uk', 'schema uses the current public email address');
  check(
    localBusiness.openingHoursSpecification?.opens === '08:00' &&
      localBusiness.openingHoursSpecification?.closes === '17:30' &&
      localBusiness.openingHoursSpecification?.dayOfWeek?.length === 5,
    'schema states the current weekday opening hours',
  );
  check(
    JSON.stringify(localBusiness.sameAs) ===
      JSON.stringify([
        'https://www.facebook.com/thefairytailsdoggrooming',
        'https://www.instagram.com/thefairytailsgroomers/',
        'https://www.tiktok.com/@thefairytailsdoggrooming',
      ]),
    'schema sameAs contains the three current social profiles',
  );
  check(
    JSON.stringify(localBusiness.areaServed) === JSON.stringify([
      { '@type': 'City', name: 'Hastings' },
      { '@type': 'City', name: 'St Leonards' },
    ]),
    'schema service areas are Hastings and St Leonards only',
  );
  check(!('aggregateRating' in localBusiness), 'schema does not self-mark up Google reviews');
}

console.log('\n--- St Leonards honesty and conversion path ---');
const stLeonardsHtml = htmlByPath.get('/dog-groomers-st-leonards/') ?? '';
const stLeonardsText = text(stLeonardsHtml);
check(/One Hastings salon, serving St Leonards/i.test(stLeonardsText), 'page states there is one Hastings salon');
check(/do not groom in a van or inside customers' homes/i.test(stLeonardsText), 'page distinguishes collection from mobile grooming');
check(/£2[^.]*£2[^.]*£4/i.test(stLeonardsText), 'page states the £2-per-leg and £4-round-trip prices');
check(/full grooms,? hand stripping and bath (and|&) brush/i.test(stLeonardsText), 'page states the current eligible services');
check(stLeonardsHtml.includes('https://pci.jotform.com/form/251190647924057'), 'page links directly to immediate online booking');
check((home.match(/\/dog-groomers-st-leonards\//g) ?? []).length >= 2, 'homepage links to the St Leonards page in content and navigation');
check((htmlByPath.get('/services/')?.match(/\/dog-groomers-st-leonards\//g) ?? []).length >= 2, 'services page links to the St Leonards page in content and navigation');

console.log('\n--- retired or misleading claims ---');
const allHtml = [...htmlByPath.values()].join('\n');
check(!/07842\s*116216/.test(allHtml), 'retired mobile number is absent');
check(!/Fairlight Place|Barley Lane|Parker Road|TN35\s*5DT/i.test(text(allHtml)), 'retired addresses and postcode are absent');
check(!/free (pick|door)|no extra cost/i.test(text(allHtml)), 'paid collection is never described as free');
check(!/\bmobile dog groom/i.test(text(allHtml)), 'the site never presents itself as a mobile dog groomer');
check(!/we groom (?:inside|in) (?:a )?(?:van|customer(?:\'s)? home)/i.test(text(allHtml)), 'the site never claims mobile or at-home grooming');
check(!allHtml.includes('https://search.google.com/local/reviews?placeid='), 'the retired Google reviews URL is absent');

console.log('\n--- analytics isolation ---');
for (const [path, html] of htmlByPath) {
  check(html.includes(GROOMING_GTM), `${path} loads the dedicated grooming GTM container`);
}
check(!allHtml.includes(PROHIBITED_MAIN_SITE_GTM), 'the prohibited main-site GTM container is absent');
check(allHtml.includes('enquiry_submitted'), 'the enquiry success journey emits its dedicated data-layer event');

console.log(`\n${failures ? `FAIL — ${failures} SEO regression(s)` : 'PASS — SEO foundation checks are green'}\n`);
process.exit(failures ? 1 : 0);
