#!/usr/bin/env node
// Prepares the two hero-animation artworks for a DARK band. Run once; output is committed.
//
//   node scripts/hero-assets.mjs
//
//   in:  Luxury dog grooming animation/design_handoff_hero_animation/assets/{dog-hero,fairy-color}.png
//   out: src/assets/pages/home/hero-dog.png          (cleaned puppy)
//        src/assets/pages/home/hero-fairy-stencil.png (alpha-only fairy; CSS paints her)
//
// Same convention as scripts/gallery-crop.mjs: the SOURCE is an untracked handoff folder, the
// OUTPUT is committed. Re-run only if the handoff artwork changes.
//
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY THE DOG NEEDS FIXING AT ALL
//
// The handoff prototype sat on a #FFFFFF page. This site's hero band is bg-moss-900 (#2c3823).
// Two defects in dog-hero.png are invisible on white BY CONSTRUCTION and only appear on a dark
// band — the handoff could not have seen either. Both measured, not guessed:
//
//   1. WHITE MATTE. 5,871 of the PNG's semi-transparent pixels have mean colour #fcf4e4, and
//      100.0% of them have a max channel > 200. The background was removed from a white
//      backdrop without un-matting, so every soft edge still carries white. This puppy is
//      FLUFF — her ears and topknot are almost entirely soft alpha — so on moss the halo would
//      trace the whole outline. It is the single cheapest-looking artifact a dark hero can have.
//
//   2. BAKED CREAM GROUND. The artwork has a pale floor painted into its bottom edge, wider
//      than the dog and with a torn outline. On white it reads as the page. On moss it is a
//      torn-paper slab under her paws.
//
// FINDING THE FLOOR'S REAL EXTENT. A first attempt measured cream as a SHARE of each row's
// opaque pixels and concluded the floor started at fy≈0.93. That was wrong and the render
// proved it: at those rows the golden paws dominate the count, so a physically-present floor
// reads as a small percentage. Counting fur and floor SEPARATELY (high-chroma vs pale
// low-chroma) shows what is actually there, per row:
//
//     y:      670   688   700   712   718   721   724   730   736   739
//     fur:    407   407   380   370   307   212    77    49    11     0     ← collapses at ~722
//     floor:    4    15    76   124   188   193   343   318   159    24     ← peaks below it
//
// So the paws genuinely END at y≈722, and the floor is TWO distinct things: a slab below that
// line, and pale "wings" that spread SIDEWAYS past the paws above it. Hence two removals — a
// cut and a key. A single vertical alpha ramp (tried first) cannot do it: it only makes the
// slab translucent, leaving its torn edge legible.
//
// THE TRADE (same one gallery-crop.mjs makes): key conservatively and accept losing a sliver of
// the palest paw pixels rather than risk contaminating real fur. Below fy 0.90 the key costs
// ≤15 px/row of genuine pale fur — the measured floor count for those rows. The warm ground
// pool that the component paints under her covers the cut line.
// ─────────────────────────────────────────────────────────────────────────────────────────
// WHY THE FAIRY IS A STENCIL, NOT A RECOLOUR
//
// fairy-color.png is a flat blue silhouette: hue locked at 196–197°, saturation 100%,
// lightness ramping 47% → 30% top-to-bottom. Its RGB carries no modelling worth keeping — it
// is literally a linear gradient — so there is nothing to preserve by recolouring it.
//
// And recolouring it (by any means: a filter chain, or remapping its luminance) inherits a flaw
// that only a dark band exposes: the artwork runs LIGHT at the head and DARK at the skirt. On
// white that is correct — contrast grows downward, 2.58 → 5.77. On moss-900 it is backwards:
// 4.74 → 2.12, i.e. her skirt and legs sink into the band. No uniform filter can invert a
// gradient's direction, and a luminance remap faithfully reproduces it.
//
// So: keep only the alpha (which is the real artwork — including a distinct band of ~3,260 px
// at alpha 64–95 that IS the translucent wing panes), and let CSS paint her with a gradient
// chosen for THIS background. The component owns her colour in one line, tunable without
// re-baking a binary. Same idiom as .paw-bullet in global.css (mask + background) and as the
// animation's own sheen clip.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IN = resolve(root, 'Luxury dog grooming animation/design_handoff_hero_animation/assets');
const OUT = resolve(root, 'src/assets/pages/home');

const clamp255 = (n) => Math.min(255, Math.max(0, Math.round(n)));
// Smoothstep — used for both feathers so neither removal leaves an edge of its own.
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

async function raw(file) {
  return sharp(resolve(IN, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

// ── Dog ──────────────────────────────────────────────────────────────────────────────────
// All five constants are measured off the artwork (see the row table above), not eyeballed.
const KEY_TOP = 0.9; // start of the floor's sideways "wings" — above this it is all fur
const CHROMA_MAX = 78; // colourfulness below which a pale pixel is floor, not fur
const CHROMA_FEATHER = 14; // narrow: the floor sits at chroma≈39, so it must key to ZERO.
const CUT_A = 0.96; // y≈714 — the paws' contact line
const CUT_B = 0.97; // y≈722 — where fur has collapsed to nothing anyway

// ── The tie band ─────────────────────────────────────────────────────────────────────────
// The artwork ties the topknot with a CRIMSON band (measured: 554 px at source x302–335,
// y113–140, mean rgb 201,86,59). It is the only red anywhere in the composition, and the
// countryside palette has no red at all. It also can't simply be covered: the bow the handoff
// pops onto the topknot at p≈.735 sits exactly on it (bow centre 191,75 vs band centre
// 188.6,74.8 in dog-box units — the handoff aimed correctly) but its loops and knot leave the
// band's lower edge showing between the tails. A moss bow above a red band reads, unmistakably,
// as a sprig of Christmas holly. Verified on the render — that is what it looked like.
//
// So the band is remapped into the ribbon it should have been: a moss tone matching the bow, in
// which case bow + band read as one green ribbon and the red is simply gone.
//
// Isolating it needs care, because golden fur is ORANGE and orange is red-dominant too. The
// discriminator is g−b: fur's green sits midway between red and blue (g−b ≈ 80), while the
// band's green collapses toward its blue (g−b < 35). Bounded to the top 22% as well, which is
// far above her eyes (source y≈230) and her tongue — both legitimately warm, both must survive.
const BAND_Y_MAX = 0.22;
const BAND_RAMP = [
  [0x2c, 0x38, 0x23], // moss-900 — the band's shadowed side
  [0x59, 0x6f, 0x44], // moss-600 — matches the bow's loops
];
const isBandish = (r, g, b) => r - g > 50 && g - b < 45;
{
  const { data, info } = await raw('dog-hero.png');
  const { width: W, height: H } = info;
  const out = Buffer.from(data);
  let unmatted = 0;
  let removed = 0;
  let banded = 0;

  // Pass 0 — measure the band's own luminance range, so the remap preserves its shading
  // instead of flattening it to a sticker.
  let blo = 1;
  let bhi = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    if (Math.floor(((i / 4) | 0) / W) / H > BAND_Y_MAX) continue;
    if (!isBandish(data[i], data[i + 1], data[i + 2])) continue;
    const L = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    if (L < blo) blo = L;
    if (L > bhi) bhi = L;
  }
  // NOT `bhi - blo || 1`: the sentinels start inverted (blo=1, bhi=0), so a zero-match pass
  // yields -1, which is truthy — the guard would never fire and every band pixel would get a
  // silently INVERTED ramp that the clamp below then hides. Zero matches is reachable: pass 0
  // reads the matted source while the main loop reads un-matted pixels, and matting drags
  // colour toward white, which shrinks r-g below the isBandish threshold.
  const bspan = bhi > blo ? bhi - blo : 1;

  for (let i = 0; i < out.length; i += 4) {
    const fy = Math.floor(((i / 4) | 0) / W) / H;
    let a = out[i + 3];
    if (a === 0) continue;
    const a0 = a;

    // 1. Un-matte — the exact algebraic inverse of compositing over white:
    //      observed = fg·α + 255·(1−α)   ⇒   fg = (observed − 255·(1−α)) / α
    //    Only partial pixels need it (α=1 is already the true colour). Below α≈1/255 the
    //    division amplifies rounding noise into confetti, hence the floor on af.
    const af = a / 255;
    if (af > 0.004 && af < 0.996) {
      for (let k = 0; k < 3; k++) out[i + k] = clamp255((out[i + k] - 255 * (1 - af)) / af);
      unmatted++;
    }

    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];

    // 2. Remap the crimson tie band to moss. Feathered on BOTH discriminators rather than
    //    thresholded, so the band's antialiased rim blends into the fur instead of leaving a
    //    red halo around a green blob.
    if (fy <= BAND_Y_MAX && isBandish(r, g, b)) {
      const w = smooth(Math.min(1, (r - g - 50) / 40)) * smooth(Math.min(1, (45 - (g - b)) / 22));
      if (w > 0) {
        const t = Math.min(1, Math.max(0, ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 - blo) / bspan));
        for (let k = 0; k < 3; k++) {
          const target = BAND_RAMP[0][k] + (BAND_RAMP[1][k] - BAND_RAMP[0][k]) * t;
          out[i + k] = clamp255(out[i + k] + (target - out[i + k]) * w);
        }
        banded++;
      }
    }

    const mx = Math.max(out[i], out[i + 1], out[i + 2]);
    const mn = Math.min(out[i], out[i + 1], out[i + 2]);
    const L = (mx + mn) / 2;
    const chroma = mx - mn;

    // 3. Key the floor's pale wings. "Pale AND colourless" separates them from her coat, which
    //    is golden (high chroma) everywhere. The feather is deliberately narrow: with a wide
    //    one the floor (chroma≈39) only drops to ~15% alpha and a ghost of the slab survives —
    //    which is exactly what the first attempt shipped, and the render caught.
    if (fy > KEY_TOP && L > 165 && chroma < CHROMA_MAX) {
      a *= 1 - smooth(Math.min(1, (CHROMA_MAX - chroma) / CHROMA_FEATHER));
    }
    // 4. Cut the slab. Below the contact line there is essentially no fur left to protect.
    if (fy > CUT_A) a *= 1 - smooth((fy - CUT_A) / (CUT_B - CUT_A));

    out[i + 3] = clamp255(a);
    if (out[i + 3] < a0) removed++;
  }

  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(resolve(OUT, 'hero-dog.png'));
  console.log(`dog:   un-matted ${unmatted} edge px, re-tied ${banded} band px, removed floor from ${removed} px → hero-dog.png (${W}×${H})`);
}

// ── Fairy ────────────────────────────────────────────────────────────────────────────────
{
  const { data, info } = await raw('fairy-color.png');
  const { width: W, height: H } = info;
  const out = Buffer.alloc(data.length);
  // White RGB + the original alpha. A CSS mask reads ONLY alpha, so the colour channels are
  // free — making them a constant also lets PNG's filters flatten them to almost nothing.
  for (let i = 0; i < data.length; i += 4) {
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    out[i + 3] = data[i + 3];
  }
  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(resolve(OUT, 'hero-fairy-stencil.png'));
  console.log(`fairy: alpha stencil → hero-fairy-stencil.png (${W}×${H})`);
}
