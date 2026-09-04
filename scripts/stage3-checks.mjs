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
const pages = ['/terms-and-conditions/', '/who-we-are/', '/services/', '/services/full-groom-price-list/', '/services/frequently-asked-questions/', '/dog-groomers-st-leonards/', '/'];
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
  // Owner ruling 2026-07-16 (evening): bath-and-brush pick-ups ARE offered at the
  // same £2/journey — the live JotForm sells them. The old restriction is retired.
  [/do not offer pick ups?\s*\/?\s*drop offs? for bath/i, 'the retired "no bath-and-brush pick-ups" restriction (offered at £2/journey since 2026-07-16)'],
  [/full grooms and hand stripping only/i, 'the retired "full grooms and hand stripping only" pick-up restriction (bath & brush now included)'],
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

// POSITIVE assertion: every page that states pick-up eligibility must carry the
// CURRENT list (pricing.pickup.eligible). Banned patterns only catch retired
// wordings — this catches a page silently keeping a stale list after the next
// ruling change (eligibility changed twice on 2026-07-16 alone).
const eligiblePages = ['/', '/services/', '/services/frequently-asked-questions/', '/services/full-groom-price-list/', '/terms-and-conditions/', '/dog-groomers-st-leonards/'];
const eligibleRe = /full grooms,? hand stripping and bath (and|&(amp;)?) brush/i;
for (const p of eligiblePages) {
  const html = read(p);
  if (!html) continue;
  check(eligibleRe.test(text(html)), `${p} carries the current pick-up eligibility list`);
}

console.log('\n--- single-sourced pick-up facts ---');
check(pricing.pickup.areas === 'Hastings and St Leonards', `areas = "${pricing.pickup.areas}" (St Leonards restored per ruling)`);
check(pricing.pickup.journeyPrice === 2 && pricing.pickup.roundTripPrice === 4, 'price = £2 per leg / £4 round trip');
check(Array.isArray(pricing.pickup.windows) && pricing.pickup.windows.length === 2, 'both collection windows present');
check(/bath/i.test(pricing.pickup.note) && /bath and brush appointments too/i.test(pricing.bathBrushTidy.note),
  'bath & brush pick-ups offered (owner ruling 2026-07-16 evening) — both notes carry it');
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

// ---------------------------------------------------------------------------
// Dog grooming subscription — Stripe Billing Customer Portal (added 2026-09-04)
//
// WHY THESE EXIST: this repo's own rule is "docs rot; the gate does not" — the
// INDEXABLE assertion was added after stale documentation nearly de-indexed the
// live site. Everything below was shipped on an owner ruling and is defended by
// prose everywhere else; these make the regressions impossible to ship instead.
//
// ⚠️ SCOPE LIMIT, read before trusting a green run: the Stripe portal's BEHAVIOUR
// lives in the Stripe Dashboard, NOT in this repo. Nothing here can see it. These
// checks prove the SITE still says what the owner ruled on 2026-09-04 — they
// cannot detect the owner flipping self-service cancel back on, after which this
// gate would happily keep enforcing copy that has become a lie. Re-read the
// Dashboard config before changing any assertion below.
// ---------------------------------------------------------------------------
console.log('\n--- subscription: Stripe links (owner ruling 2026-09-04) ---');

// 🔴 These two URLs end in the SAME token. That is a Stripe coincidence, not
// duplication — never "DRY" them into one constant. Asserting the FULL href is the
// point: a portal link silently swapped for the payment link ("click Manage, get
// asked to pay again") still matches on the token alone and would sail through.
const STRIPE_BUY = 'https://buy.stripe.com/8x27sM5K57BR1IL94W9MY00';
const STRIPE_PORTAL = 'https://billing.stripe.com/p/login/8x27sM5K57BR1IL94W9MY00';

// The footer links the portal on EVERY page, so an unscoped html.includes(PORTAL)
// is satisfied by the footer alone and proves nothing about the band it guards.
const bodyOf = (h) => (h.includes('<footer') ? h.slice(0, h.indexOf('<footer')) : h);
const footerOf = (h) => (h.includes('<footer') ? h.slice(h.indexOf('<footer')) : '');

const bandPages = ['/', '/services/', '/services/full-groom-price-list/'];
for (const p of bandPages) {
  const html = read(p);
  if (!html) continue;
  const band = bodyOf(html);
  // portalUrl is a plain property read and there is no `astro check` in the build:
  // drop it from business.ts and Astro renders no href at all, leaving dead text.
  check(band.includes('href="' + STRIPE_BUY + '"'), `${p} band keeps the Stripe sign-up link`);
  check(band.includes('href="' + STRIPE_PORTAL + '"'), `${p} band keeps the billing-portal link`);
  check(/Manage my subscription/.test(text(band)), `${p} band keeps the "Manage my subscription" button`);
}
// Footer.astro is ONE shared component — one page proves it for all of them.
check(footerOf(read('/') ?? '').includes('href="' + STRIPE_PORTAL + '"'), 'the shared footer links the billing portal');

console.log('\n--- subscription: footer Explore capacity ---');
// grid-flow-col over grid-rows-N holds 2N links. At grid-rows-7 the 15th link
// spilled into a THIRD sub-column and broke the footer on every desktop page;
// grid-rows-8 was the fix. mobile-check renders 390px ONLY, where the footer is
// single-column, so it structurally cannot see this.
const homeFooter = footerOf(read('/') ?? '');
const exploreUl = homeFooter
  .slice(homeFooter.indexOf('>Explore</p>'))
  .match(/<ul class="[^"]*grid-rows-(\d+)[^"]*"[^>]*>([\s\S]*?)<\/ul>/);
if (!exploreUl) {
  bad('footer Explore list located (the grid-rows <ul> after the Explore heading)');
} else {
  const capacity = Number(exploreUl[1]) * 2;
  const links = [...exploreUl[2].matchAll(/<li\b/g)].length;
  check(links <= capacity, `footer Explore fits its grid: ${links} links, grid-rows-${exploreUl[1]} holds ${capacity}`);
}

console.log('\n--- subscription: single-sourced facts ---');
// subscription.optionalAddOn is a HARDCODED literal in scripts/extract-prices.mjs,
// NOT harvested — a rewrite of that script can drop it, and a session fact-checking
// pricing.json against grooming-image-archive/ finds it absent and "foreign".
const sub = pricing.subscription;
const addOn = sub.optionalAddOn ?? {};
check(sub.price === 25 && sub.minTermMonths === 2, `subscription = £${sub.price}/month, ${sub.minTermMonths}-month minimum term`);
check(addOn.price === 10 && /month/i.test(addOn.unit ?? ''), `teeth-cleaning add-on = £${addOn.price} ${addOn.unit}`);
check(/not covered by the .*minimum term/i.test(addOn.terms ?? ''), 'add-on terms place it OUTSIDE the minimum term');
// The pay-per-visit row is the SAME treatment sold the other way, and a separate
// object. /services/teeth-cleaning/ finds it by EXACT NAME, so renaming either entry
// "to disambiguate them" breaks that page. Never merge them, never rename them, and
// changing one £10 requires an explicit decision about the other.
check(!!pricing.addOns.find((a) => a.name === 'Teeth cleaning'),
  'the pay-per-visit "Teeth cleaning" addOns row still resolves by exact name (/services/teeth-cleaning/ depends on it)');
for (const p of bandPages) {
  const t = text(bodyOf(read(p) ?? ''));
  // Assert the VALUES, not one sentence's word order — the copy may be reworded legitimately.
  check(t.includes('£' + addOn.price) && /teeth cleaning/i.test(t), `${p} band advertises the £${addOn.price} teeth-cleaning add-on`);
  check(t.includes(`${sub.minTermMonths}-month minimum term`), `${p} band renders the ${sub.minTermMonths}-month minimum term`);
}

console.log('\n--- subscription: T&Cs clause (owner-authored 2026-09-04, NOT from the harvest) ---');
// ⚠️ THE HIGHEST-RISK ITEM ON THE SITE. This section is the one thing on the page that
// is NOT verbatim from the 2026-07-12 harvest, and terms-and-conditions.astro's own
// header says the legal copy IS verbatim — so a session fact-checking the page against
// grooming-image-archive/terms-and-conditions/copy.md (18 sections, no subscription
// section) reads this as foreign copy and deletes it. Without it, the only cancellation
// wording a subscriber can read is the appointment clause "We do not charge any
// cancellation fees", which argues against the 2-month minimum term. It was written on
// the owner's explicit instruction. Do not delete it.
const tcSub = read('/terms-and-conditions/');
if (tcSub) {
  const b = bodyOf(tcSub);
  const t = text(b);
  check(/<h2[^>]*>Dog grooming subscription<\/h2>/i.test(b), 'T&Cs keep the "Dog grooming subscription" section');
  check(/unused subscription time cannot be refunded/i.test(t), 'T&Cs state unused subscription time cannot be refunded');
  check(/if a month passes without an appointment/i.test(t), 'T&Cs tell subscribers to book an appointment every month');
  check(/to cancel your subscription[^.]{0,80}(contact us|call us|phone)/i.test(t),
    'T&Cs route CANCELLATION to a phone call (Stripe self-service cancel is OFF)');
  check(b.includes('href="' + STRIPE_PORTAL + '"'), 'T&Cs clause links the billing portal');
}

console.log('\n--- subscription: copy vs the Stripe portal config (WARN only) ---');
// DELIBERATELY WARN-ONLY, for two reasons:
//   1. Stripe ships self-service cancel ON by default, so a session working from generic
//      Stripe docs will write "cancel any time in the portal" — false here, and it voids
//      the 2-month minimum term. Worth flagging loudly.
//   2. But this is a fuzzy prose scan, and verify-stage3 also gates the n8n reviews
//      rotator's UNATTENDED Monday 06:30 commit to main. A false positive there fails a
//      deploy with nobody watching and silently freezes the review carousel. A warning
//      costs a human ten seconds; a false failure costs a silent outage.
// Questions are skipped: an FAQ may legitimately ASK "Can I cancel online?".
const contradictions = [
  [/\bcancel\b[^.]{0,60}\b(online|in (the|your) (billing )?portal|yourself|self-service)\b/i, 'a self-service cancellation claim'],
  [/\bcancel\b[^.]{0,60}\bany ?time\b/i, 'a "cancel any time" claim, which voids the 2-month minimum term'],
  [/\b(log ?in|logging in|sign in|members? area)\b/i, 'a login/account claim (Stripe emails a one-time link; there is no login here)'],
];
// ⚠️ Never add /password/ to that list — the shipped helper line is "no password needed".
const notAClaim = /\b(cannot|can'?t|do not|don'?t|never|unable|only by|please (call|phone|contact))\b/i;
let portalWarnings = 0;
for (const p of [...bandPages, '/terms-and-conditions/', '/services/frequently-asked-questions/']) {
  const html = read(p);
  if (!html) continue;
  for (const s of text(bodyOf(html)).split(/(?<=[.!?])\s+/)) {
    if (notAClaim.test(s) || s.includes('?')) continue;
    for (const [re, why] of contradictions) {
      if (re.test(s)) {
        portalWarnings++;
        console.log(`  WARN ${p} may contain ${why}: "${s.trim().slice(0, 90)}"`);
      }
    }
  }
}
if (portalWarnings === 0) {
  ok('no copy contradicting the Stripe portal config (cancel OFF, quantity ON, no login)');
} else {
  console.log(`  ${portalWarnings} warning(s) — re-read the Stripe Dashboard, then fix the copy (or this list, if the config changed).`);
}


console.log(`\n${fail} failure(s).`);
process.exit(fail > 0 ? 1 : 0);
