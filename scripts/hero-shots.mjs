#!/usr/bin/env node
// Screenshots the hero at explicit points along its scrub — the eyeball check for the hero
// animation. `npm run shots` cannot do this job: it captures fullPage, and a fullPage capture of
// a position:sticky hero renders it ONCE at its scroll-top (p=0) followed by ~1,300px of empty
// moss band, which looks like a broken page and shows none of the animation.
//
// Usage: npx astro preview   (in another shell), then
//        node scripts/hero-shots.mjs
// Out:   shots/hero-<viewport>-p<NN>.png   (gitignored, like all of shots/)
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = 'shots';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

// Desktop: drive the 240vh track to explicit progress points. p is defined by the track's own
// geometry, so compute the scroll from the track rather than guessing pixel offsets.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  for (const p of [0, 0.25, 0.5, 0.72, 0.85, 1]) {
    await page.evaluate((target) => {
      const t = document.querySelector('[data-hero-track]');
      const r = t.getBoundingClientRect();
      const top = r.top + window.scrollY;
      window.scrollTo({ top: top + target * (r.height - window.innerHeight), behavior: 'instant' });
    }, p);
    // The scrub is critically damped (p += (target-p)*0.16), so it needs a beat to settle before
    // the frame is honest. ~40 frames gets |Δ| under the 0.0005 snap threshold from any start.
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/hero-1440-p${String(Math.round(p * 100)).padStart(2, '0')}.png` });
  }
  await ctx.close();
}

// Mobile: no scrub — the stage plays once on entering the viewport. Capture the resting hero,
// then the stage mid-play and finished.
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/hero-390-top.png` });
  await page.evaluate(() => document.querySelector('[data-hero-stage]').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/hero-390-mid.png` });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/hero-390-done.png` });
  await ctx.close();
}

await browser.close();
console.log('hero shots written to shots/');
