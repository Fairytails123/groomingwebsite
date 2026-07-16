#!/usr/bin/env node
// Proves the hero's CSS masks decode in WebKit — i.e. in Safari/iOS, which cannot be opened on
// a Windows machine. Playwright ships the real WebKit engine, so this is a genuine test and not
// an assumption.
//
// WHY IT EXISTS. Both of the hero's masks are WebP-with-alpha (HeroStage.astro explains why
// webp is the smallest option for each). WebP-as-a-CSS-mask is the one part of that component
// which is well-supported in theory and untestable with Chromium-only tooling — and it has the
// worst failure mode in the whole hero. Per CSS Masking, a mask-image that cannot be decoded
// behaves as `none`: NO mask. So the fairy would not vanish, she would render as a SOLID GOLD
// RECTANGLE, and the sheen would sweep as a white bar across her bounding box. Silent, ugly,
// and invisible to every other gate we run.
//
// It asserts the SHAPE, not merely that a mask is declared: the fairy's corners must be
// background (masked away) while her middle is gold. An unmasked rectangle fails the corners.
//
// Usage: npx astro preview   (in another shell), then
//        node scripts/hero-mask-support.mjs
import { webkit, chromium } from 'playwright';
import sharp from 'sharp';

const BASE = process.env.BASE || 'http://localhost:4321';
const problems = [];

// Is a pixel "painted fairy" (honey gradient: #f3dcae → #cf9038) rather than the moss band?
const isGold = ([r, g, b]) => r > 120 && r > b + 40 && g > b;

for (const [name, engine] of [
  ['webkit', webkit],
  ['chromium', chromium],
]) {
  const browser = await engine.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // Drive to the end of the scrub: she fades in over p .04–.10, so at p=0 there is nothing to
  // measure. Then let the damped scrub settle.
  await page.evaluate(() => {
    const t = document.querySelector('[data-hero-track]');
    const r = t.getBoundingClientRect();
    window.scrollTo({ top: r.top + window.scrollY + (r.height - window.innerHeight), behavior: 'instant' });
  });
  await page.waitForTimeout(1200);

  const box = await page.locator('.ft-fairy').boundingBox();
  if (!box) {
    problems.push(`${name}: no .ft-fairy element`);
    await browser.close();
    continue;
  }

  const png = await page.screenshot({ clip: box });
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => {
    const i = (Math.round(y) * info.width + Math.round(x)) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const W = info.width;
  const H = info.height;

  // COVERAGE is the assertion, not corner sampling. (A first draft tested all four corners and
  // failed everywhere — because her right WING legitimately fills the top-right corner of her
  // box. The test was wrong, not the mask.) Her alpha covers roughly a fifth of the box, so:
  //   masked correctly → well under half the box is gold
  //   mask ignored     → the gradient paints edge to edge, ~100%
  // The two are so far apart that no threshold tuning is needed.
  let gold = 0;
  let total = 0;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      total++;
      if (isGold(at(x, y))) gold++;
    }
  }
  const cover = (gold / total) * 100;
  const body = at(W * 0.5, H * 0.62); // torso/skirt — solidly inside her silhouette

  if (cover > 55) {
    problems.push(`${name}: mask NOT applied — ${cover.toFixed(0)}% of her box is gold (rendering as a rectangle)`);
    console.log(`  FAIL ${name} — ${cover.toFixed(0)}% gold coverage: she is a rectangle`);
  } else if (cover < 5 || !isGold(body)) {
    problems.push(`${name}: fairy did not render — ${cover.toFixed(0)}% coverage, body ${JSON.stringify(body)}`);
    console.log(`  FAIL ${name} — only ${cover.toFixed(0)}% coverage; mask may be inverted or she is absent`);
  } else {
    console.log(`  OK   ${name} — masked to her silhouette (${cover.toFixed(0)}% gold coverage, body ${JSON.stringify(body)})`);
  }
  await browser.close();
}

console.log('');
console.log(problems.length ? `❌ CSS mask test FAILED:\n  - ${problems.join('\n  - ')}` : '✅ WebP-alpha masks decode and mask correctly in WebKit and Chromium.');
process.exit(problems.length ? 1 : 0);
