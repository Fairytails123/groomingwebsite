#!/usr/bin/env node
// Recover the 10 bare dog photos from the old gallery's 5 before/after composites.
//
// WHY: each harvested slide is a 1200x600 composite with the OLD brand baked into
// the pixels — cyan/blue background, soap bubbles, and a tilted white polaroid
// frame around each photo. Owner ruling 2026-07-16: crop out the photos and
// reframe them in the countryside design system. Left half = BEFORE, right = AFTER.
//
// HOW: no ffmpeg/sharp on this box, so pixels are read in Chromium via canvas
// (same trick as scripts/video-poster.mjs).
//   1. Split the composite at x=600 into two 600x600 halves.
//   2. Find the white frame by scanning for the FIRST and LAST white pixel along
//      the middle row, then the same down the frame's middle column.
//      Two approaches were tried and rejected first, both worth not repeating:
//        - A row/column HISTOGRAM of white ("the frame spans >25% of the row").
//          Wrong: the frame is a ~20px BORDER, not a filled rectangle, so a middle
//          row only crosses ~40 white px out of 600 (~7%) and 6 of 10 photos came
//          back "no frame found".
//        - Classifying the BACKGROUND by its blue cast (b-r > threshold). Wrong:
//          slide 2's background is dark navy (40,77,104) and slide 5's dark dog fur
//          is (28,34,48) — no threshold separates them.
//      The scan works because it is measured, not assumed: white runs per middle
//      row are 37-41px across all five slides (= two ~20px borders), and nothing
//      inside a photo reaches 235 — the salon walls are darker than that.
//   3. Inset past the frame's white border AND past the tilt. The photos sit at a
//      few degrees, so the axis-aligned rect fully inside a tilted photo is a bit
//      smaller — we deliberately give up ~4% at the edges to guarantee no blue or
//      white creeps into a corner. Cropping inside the tilt is why this needs no
//      de-rotation maths.
//
// Run: node scripts/gallery-crop.mjs [--debug]
// Out: src/assets/pages/gallery/pair-<n>-{before,after}.jpg
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEBUG = process.argv.includes('--debug');
const SRC_DIR = join(
  process.cwd(), 'grooming-image-archive', 'gallery', 'images',
  'fairytailsdoggrooming.co.uk', 'wp-content', 'uploads', '2022', '09',
);
const OUT_DIR = join(process.cwd(), 'src', 'assets', 'pages', 'gallery');
mkdirSync(OUT_DIR, { recursive: true });

// Inset as a fraction of the frame's short side: clears the ~20px white border
// plus the photo's tilt. 0.11 suits most; a couple sit at a steeper angle and
// need more, found by LOOKING at the crops (scripts/_contact-sheet). Corner
// sampling alone cannot arbitrate this: it false-positives on a turquoise towel
// and on the light salon wall, and those are real photo content.
// Inset as a fraction of the frame's short side. A number = all four sides; an
// object = per side {t,r,b,l}.
//
// Per-side exists because the BUBBLES ARE DRAWN ON TOP OF THE PHOTOS, not merely
// on the background around them — slide 2's left photo has one over its top-right
// corner and more over its bottom-left. A uniform inset can only clear those by
// eating the dog, so the crop window is pushed away from whichever corner the
// bubble occupies.
//
// Every value was set by LOOKING at the contact sheet, not by the corner sampler,
// which missed bubbles in pair-2-after and pair-3-before while flagging a
// turquoise towel in pair-2-before. Treat the sampler as a hint, never a gate.
const INSET = {
  default: 0.11,
  'pair-1-before': 0.125,
  'pair-1-after': 0.125,
  'pair-2-before': { t: 0.09, r: 0.19, b: 0.20, l: 0.20 }, // bubbles top-right + bottom-left
  'pair-2-after': { t: 0.10, r: 0.20, b: 0.20, l: 0.10 }, // bubble bottom-right
  // Squeezed from both sides: a bubble sits over the bottom-left corner while the
  // tilt brings the white frame into the top-right.
  'pair-3-before': { t: 0.15, r: 0.17, b: 0.22, l: 0.22 },
  'pair-3-after': 0.155,
  'pair-5-before': 0.125,
};

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('about:blank');

const results = [];
for (let n = 1; n <= 5; n++) {
  const file = join(SRC_DIR, `Gallery-Slider-${n}.jpg`);
  if (!existsSync(file)) {
    console.error(`  MISSING ${file} — run the harvest first.`);
    process.exitCode = 1;
    continue;
  }
  const b64 = (await import('node:fs')).readFileSync(file).toString('base64');

  const out = await page.evaluate(async ({ b64, debug, insets, n }) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + b64;
    await img.decode();

    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    const halves = [];
    const halfW = Math.floor(img.naturalWidth / 2);

    for (const [side, x0] of [['before', 0], ['after', halfW]]) {
      const d = ctx.getImageData(x0, 0, halfW, img.naturalHeight).data;
      const W = halfW;
      const H = img.naturalHeight;

      // Measured on this set: the frame is #fff, the salon wall inside the photo
      // tops out around 230, and the bubbles' highlights are small. 235 separates
      // frame from photo with room to spare.
      const isWhite = (x, y) => {
        const i = (y * W + x) * 4;
        return d[i] >= 235 && d[i + 1] >= 235 && d[i + 2] >= 235;
      };
      const scanRow = (y) => {
        const hits = [];
        for (let x = 0; x < W; x++) if (isWhite(x, y)) hits.push(x);
        return hits;
      };
      const scanCol = (x) => {
        const hits = [];
        for (let y = 0; y < H; y++) if (isWhite(x, y)) hits.push(y);
        return hits;
      };

      // Middle row → the frame's left and right borders.
      const rowHits = scanRow(Math.floor(H / 2));
      if (rowHits.length < 8) {
        halves.push({ side, error: `no frame on the middle row (${rowHits.length} white px)` });
        continue;
      }
      const left = rowHits[0];
      const right = rowHits[rowHits.length - 1];

      // The frame's middle column → its top and bottom borders.
      const colHits = scanCol(Math.round((left + right) / 2));
      if (colHits.length < 8) {
        halves.push({ side, error: `no frame on the middle column (${colHits.length} white px)` });
        continue;
      }
      const frame = { left, right, top: colHits[0], bottom: colHits[colHits.length - 1] };

      const fw = frame.right - frame.left;
      const fh = frame.bottom - frame.top;
      const short = Math.min(fw, fh);
      const spec = insets[`pair-${n}-${side}`] ?? insets.default;
      const f = typeof spec === 'number' ? { t: spec, r: spec, b: spec, l: spec } : spec;
      const px = (v) => Math.round(short * v);
      const rect = {
        x: frame.left + px(f.l),
        y: frame.top + px(f.t),
        w: fw - px(f.l) - px(f.r),
        h: fh - px(f.t) - px(f.b),
      };

      // Square it off — the design shows these as square polaroids. Centre the
      // square inside the (possibly asymmetric) window so the bubble stays out.
      const size = Math.min(rect.w, rect.h);
      rect.x += Math.round((rect.w - size) / 2);
      rect.y += Math.round((rect.h - size) / 2);
      rect.w = size;
      rect.h = size;

      const cc = document.createElement('canvas');
      cc.width = size;
      cc.height = size;
      cc.getContext('2d').drawImage(c, x0 + rect.x, rect.y, size, size, 0, 0, size, size);

      // Did any blue background or white frame survive in the corners? Sample the
      // four corners: a leftover frame corner is near-white, leftover background is
      // strongly blue (b markedly greater than r).
      const cd = cc.getContext('2d').getImageData(0, 0, size, size).data;
      const corner = (cx, cy) => {
        const i = (cy * size + cx) * 4;
        return { r: cd[i], g: cd[i + 1], b: cd[i + 2] };
      };
      const pts = [corner(3, 3), corner(size - 4, 3), corner(3, size - 4), corner(size - 4, size - 4)];
      const bad = pts.filter((p) => (p.r > 246 && p.g > 246 && p.b > 246) || p.b - p.r > 40);

      halves.push({
        side,
        frame,
        rect,
        size,
        cornersSuspect: bad.length,
        url: cc.toDataURL('image/jpeg', 0.86),
        ...(debug ? { rowCount, colCount } : {}),
      });
    }
    return halves;
  }, { b64, debug: DEBUG, insets: INSET, n });

  for (const h of out) {
    if (h.error) {
      console.log(`  pair-${n} ${h.side}: ${h.error}`);
      process.exitCode = 1;
      continue;
    }
    const outFile = join(OUT_DIR, `pair-${n}-${h.side}.jpg`);
    writeFileSync(outFile, Buffer.from(h.url.split(',')[1], 'base64'));
    const flag = h.cornersSuspect ? `  ⚠ ${h.cornersSuspect}/4 corners still look like frame/background` : '';
    console.log(`  pair-${n}-${h.side}.jpg  ${h.size}x${h.size}  frame[${h.frame.left},${h.frame.top}→${h.frame.right},${h.frame.bottom}]${flag}`);
    results.push({ n, side: h.side, suspect: h.cornersSuspect });
  }
}

await browser.close();
const suspect = results.filter((r) => r.suspect);
console.log(`\n${results.length} photos written to src/assets/pages/gallery/.`);
if (suspect.length) {
  console.log(`⚠ ${suspect.length} need an eyeball: ${suspect.map((s) => `pair-${s.n}-${s.side}`).join(', ')}`);
}
console.log('LOOK at every one before shipping — corner sampling catches blue/white bleed, not a crop through a dog.');
