// Dual-viewport screenshot harness for the page quality gates (CLAUDE.md):
// every page must be checked at desktop ~1440px AND phone ~390px.
// Usage: node scripts/shots.mjs [path ...]   (defaults to all built pages)
// Serves nothing itself — expects `npx astro preview` on :4321 (or set BASE).
// Output: shots/<slug>-{1440,390}.png
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = join(process.cwd(), 'shots');
mkdirSync(OUT, { recursive: true });

const paths = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      '/',
      '/terms-and-conditions/',
      '/contact/',
      '/who-we-are/',
      // Stage 3 — services cluster
      '/services/',
      '/services/full-groom-price-list/',
      '/services/haircut-lengths/',
      '/services/teeth-cleaning/',
      '/services/doggy-massage/',
      '/services/homeless-dogs/',
      '/services/frequently-asked-questions/',
    ];

const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 950, '1440'], [390, 844, '390']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const slug = p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__');
    await page.screenshot({ path: join(OUT, `${slug}-${tag}.png`), fullPage: true });
    console.log(`${slug}-${tag}.png`);
  }
  await ctx.close();
}
await browser.close();
