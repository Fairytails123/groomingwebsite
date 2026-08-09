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

// Wait for the pack artwork to actually decode before shooting.
//
// ⚠️ This used to be a bare waitForFunction on a class name, and when the hero was rebuilt as v2
// the class was renamed `.ft-dog-before` -> `.ft-dogs-before`. The selector then matched nothing,
// the predicate could never become true, and the whole script died on an OPAQUE 30-second
// "Timeout 30000ms exceeded" with no hint as to why. So the element's EXISTENCE is now asserted
// separately from its readiness, and says which selector went missing. Any future rename of the
// pack layers must be reflected in ART_SELECTOR.
const ART_SELECTOR = '.ft-dogs-before';
async function waitForArt(page, where) {
  const found = await page.locator(ART_SELECTOR).count();
  if (!found) {
    throw new Error(
      `hero-shots (${where}): no element matches "${ART_SELECTOR}". The hero's markup has been ` +
        'renamed and this script was not updated — fix ART_SELECTOR rather than waiting it out. ' +
        '(Left alone this surfaced only as an unexplained 30s Playwright timeout.)',
    );
  }
  // loading="lazy" + fetchpriority="low" is deliberate (decoration must not outrank the H1's
  // font), so headless Chromium's lazy flush can land AFTER networkidle and the p00 frame would
  // capture an empty stage a real visitor never dwells on. These captures judge ART, not loading.
  await page.waitForFunction(
    (sel) => {
      const d = document.querySelector(sel);
      return d && d.complete && d.naturalWidth > 0;
    },
    ART_SELECTOR,
  );
}

// Desktop: drive the 240vh track to explicit progress points. p is defined by the track's own
// geometry, so compute the scroll from the track rather than guessing pixel offsets.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await waitForArt(page, 'desktop 1440');
  // Ladder retuned for the v2 (four-dog) choreography — the old [0,.25,.5,.72,.85,1] wasted two
  // of its six frames on it. Computed from front(p): at p=0.25 the reveal front has not reached
  // the pack at all (0% in colour, i.e. identical to p=0), and 0.72/0.85/1 are three near-
  // identical finished frames. The reveal's own midpoint — half the pack in colour, the single
  // most informative frame — is at p=0.42, and every glint pops between 0.30 and 0.52.
  for (const p of [0, 0.3, 0.42, 0.55, 0.73, 1]) {
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
  await waitForArt(page, 'mobile 390');
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
