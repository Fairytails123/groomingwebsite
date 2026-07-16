// Extract the breed-by-breed price tables from the HARVESTED price-list HTML
// into src/data/pricing.json. Never retype the ~105 prices by hand (owner
// ruling 2026-07-12: the breed list + /services/ add-ons are canonical).
//
// The 4 tables are parsed from grooming-image-archive/services__full-groom-price-list/page.html.
// The ~15 add-on services are NOT tables on the old site (heading+price text
// blocks) — they are transcribed below verbatim from the harvest
// (grooming-image-archive/services/copy.md, 2026-07-12) and locked by the
// count/spot checks in WEBSITE-PLAN.md.
//
// Run: npm run extract-prices
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'grooming-image-archive', 'services__full-groom-price-list', 'page.html');
const OUT = join(process.cwd(), 'src', 'data', 'pricing.json');

const html = readFileSync(SRC, 'utf8');

const decode = (s) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/&#8217;/g, "'")
   .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&pound;/g, '£')
   .replace(/\s+/g, ' ').trim();

function parseTables(src) {
  const tables = [];
  for (const t of src.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const rows = [];
    for (const tr of t[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      const cells = [...tr[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) =>
        decode(c[1].replace(/<[^>]+>/g, ' ')),
      );
      if (cells.some((c) => c)) rows.push(cells);
    }
    if (rows.length) tables.push(rows);
  }
  return tables;
}

function toEntries(rows, label) {
  const out = [];
  for (const cells of rows) {
    const nonEmpty = cells.filter(Boolean);
    if (nonEmpty.length < 2) continue;
    const priceCell = nonEmpty[nonEmpty.length - 1];
    const name = nonEmpty.slice(0, -1).join(' ').trim();
    if (/price/i.test(priceCell) || /breed|size of dog/i.test(name)) continue; // header row
    const m = priceCell.match(/£\s*(\d+)/);
    if (!m) { console.warn(`  [${label}] SKIPPED row without £ price: ${JSON.stringify(nonEmpty)}`); continue; }
    out.push({ name, price: Number(m[1]) });
  }
  return out;
}

const tables = parseTables(html);
if (tables.length !== 4) {
  console.error(`Expected 4 tables on the price-list page, found ${tables.length} — page structure changed, re-check.`);
  process.exit(1);
}

// Table order on the page: Breeds, Crossbreeds, Bath/Brush/Tidy, De-shed.
const [breedRows, crossRows, bathRows, deShedRows] = tables;
const breeds = toEntries(breedRows, 'breeds');
const crossbreeds = toEntries(crossRows, 'crossbreeds');
const bathBrushTidy = toEntries(bathRows, 'bath-brush-tidy');
const deShed = toEntries(deShedRows, 'de-shed');

// The cheapest hand-strip in the breed table, for the /services/ add-on card's
// "from" price. Derived, never typed — see the addOns note below.
const handStripPrices = breeds.filter((b) => /hand strip/i.test(b.name)).map((b) => b.price);
if (!handStripPrices.length) {
  console.error('No "(hand strip)" rows found in the breed table — the /services/ hand-stripping "from" price is derived from them. Re-check the page structure.');
  process.exit(1);
}
const handStripFrom = Math.min(...handStripPrices);

const pricing = {
  _meta: {
    source: 'Extracted from the harvested WordPress price-list page (grooming-image-archive/services__full-groom-price-list/page.html) + /services/ add-on blocks, 2026-07-12. Owner ruling: this page + /services/ add-ons are canonical; /services-2/ was stale and is retired.',
    disclaimers: [
      'All prices are dependent on coat condition. Please note we charge extra for matting.',
      'If your dog is a cross or mix, please select the breed they resemble the most.',
    ],
  },

  fullGroom: {
    from: 25,
    breeds,
    crossbreeds,
    deShed,
    deShedNote: 'All are full grooms which include a bath, brush, de-shed, sanitary trim and nail trim.',
  },

  bathBrushTidy: {
    sizes: bathBrushTidy,
    // OWNER RULING 2026-07-16 (evening): bath-and-brush pick-ups ARE offered, at
    // the same £2-per-journey rate as full grooms. This REVERSES the harvest T&Cs
    // ("We do not offer pick ups/drop offs for bath and brush") — the live JotForm
    // had been selling a "Bath and Brush Appointment – Bus pick-up and drop-offs"
    // since at least 2026-07-15, and the owner confirmed the form is right.
    note: 'Pick ups and drop offs are available for bath and brush appointments too — £2 per journey, the same as full grooms.',
  },

  subscription: {
    price: 25,
    unit: 'per month, per dog',
    minTermMonths: 2,
    availability: 'Available to our regular dog grooming dogs only.',
    includes: [
      'Online code for bookings',
      'Fit around your schedule',
      'Booking reminders',
      // Harvested as "Free pick ups and drop offs". It IS a genuine subscriber
      // perk — pay-as-you-go pick-ups are £2 a journey — but the word "free" sat
      // on the same page as the £2 price and read as a contradiction. Same fact,
      // stated so the two cannot be misread against each other.
      'Pick ups and drop offs included',
      "One appointment per month: a 'Bath, Brush & Tidy' every other month, a 'Full Groom' every other month",
      'Free nail clipping whenever required',
    ],
  },

  // Verbatim from /services/ "Additional services" (canonical per owner ruling).
  addOns: [
    { name: 'Bath, Brush and Tidy', priceDisplay: '£25 – £30', note: 'Includes a bath, brush, sanitary trim, tidy up and nails (if the dog allows). See price list for details.' },
    // /services/ advertised "£50+" — but the breed table on the (equally canonical)
    // price list has three hand-strip rows at £45 (Dachshund, Jack Russell,
    // Lakeland Terrier), so £50 was never the floor. Derive it from the table so
    // it cannot drift out of step again if a price changes.
    { name: 'Hand stripping', priceDisplay: `£${handStripFrom}+`, note: 'Removing dead hairs from the coat by hand – breed dependent, please enquire before booking in.' },
    { name: 'Teeth cleaning', price: 10, note: 'Vibration free, sound free ultrasonic teeth cleaning – emmi®-pet oral hygiene. If booked with groom.' },
    { name: 'Intensive teeth cleaning', price: 70, note: 'A series of 4 to 5 intensive treatments.' },
    { name: 'Doggy oil massage', price: 10, note: 'A soothing massage for your dog. Ideal for itchy dogs or where the coat has been matted.' },
    { name: 'Mud bath', price: 10, note: 'A natural boost for the coat that removes loose undercoat.' },
    { name: 'Nails', price: 10, note: 'Additional nail clipping if the dog allows.' },
    { name: 'Puppy introduction', priceDisplay: 'FREE', note: 'Familiarisation visit with an introduction to different grooming routines for your pup.' },
    { name: 'Homeless dogs', priceDisplay: 'FREE', note: 'We offer FREE dog grooming for homeless dogs including pick up and drop-offs.' },
  ],

  extraCharges: [
    { name: 'Matting — Level 1', price: 10 },
    { name: 'Matting — Level 2', price: 20 },
    { name: 'Matting — Level 3', price: 30 },
    { name: 'Sensitive dog', price: 15, note: 'We may groom a sensitive dog at our discretion but if it is too much for the dog, we may not be able to groom.' },
    { name: 'Additional time', price: 15, note: 'For dogs requiring more time for their groom, if suitable and at our discretion.' },
    { name: 'Flea de-flea charge', price: 10, note: 'If your dog has fleas, or if we find any fleas on your dog, we charge £10 extra to cover the cost to de-flea the salon.' },
    // From the T&Cs, not /services/ — it was the only charge the old site
    // mentioned in prose only, so it never reached the structured data.
    { name: 'Tick removal', price: 5, note: 'If ticks are found, an additional £5 is added for their removal.' },
  ],

  // OWNER RULINGS 2026-07-16, and the SINGLE source of every pick-up fact for the
  // whole site — price, areas AND time windows together. Splitting them is what
  // broke this: the price lived in two files that disagreed, and the windows
  // lived in two PAGES that disagreed.
  //
  // The old WordPress site stated the price four ways and none was right:
  // homepage "no extra cost", T&Cs "Free pick up/drop off service", /services/
  // "£1 per journey", retired /services-2/ "£5 Bexhill, Battle and Rye".
  // ⚠️ Do NOT try to settle any of that on the Yoast modified_time stamps: the
  // four pricing pages all carry stamps inside one 7-minute window on the 2026-07-12
  // harvest date, which is a migration re-save of the Bluehost origin, not four
  // content edits. /services-2/ appears 39s "newer" than /services/ purely as an
  // artifact. Only the owner ruling settles these.
  //
  // business.ts deliberately carries NO pickup object: it used to hold a fifth
  // variant (free + £5 out-of-area) that had already drifted from this one.
  pickup: {
    areas: 'Hastings and St Leonards',
    priceDisplay: '£2 per journey',
    journeyPrice: 2,
    roundTripPrice: 4,
    // Eligible services: full grooms, hand stripping — and, per the 2026-07-16
    // evening owner ruling, bath & brush appointments too (the live JotForm sells
    // exactly that; the harvest's "no bath-and-brush collection" line is retired).
    // Every OTHER add-on still needs the dog brought to the salon.
    note: 'Available for full grooms, hand stripping and bath & brush appointments, in Hastings and St Leonards. Each leg is charged separately: £2 to collect and £2 to drop off — £4 for the round trip.',
    // Owner ruling 2026-07-16: a THIRD set of windows, replacing both the ones
    // the FAQ published (2024) and the ones the T&Cs published (2023). Both
    // pages now render these, so they can never drift apart again.
    windows: [
      { appointment: 'Morning appointments', collect: '7:45 – 9:30', home: '12:45 – 13:30' },
      { appointment: 'Afternoon appointments', collect: '12:45 – 13:45', home: '15:30 – 16:45' },
    ],
    nervousNote:
      'We recommend very nervous or sensitive dogs be dropped off to us at the salon and collected by the owner.',
  },
};

writeFileSync(OUT, JSON.stringify(pricing, null, 2));
console.log(`breeds: ${breeds.length}`);
console.log(`crossbreeds: ${crossbreeds.length}`);
console.log(`bathBrushTidy sizes: ${bathBrushTidy.sizes ? '' : bathBrushTidy.length}`);
console.log(`deShed: ${deShed.length}`);
console.log(`TOTAL breed-table rows: ${breeds.length + crossbreeds.length + deShed.length}`);
console.log(`addOns (transcribed): ${pricing.addOns.length}, extraCharges: ${pricing.extraCharges.length}`);
console.log(`\nWrote ${OUT}`);
