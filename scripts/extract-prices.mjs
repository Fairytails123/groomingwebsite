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
    note: 'We do not offer free pick ups/drop offs for bath and brush appointments — please drop off and collect your doggy from our salon.',
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
      'Free pick ups and drop offs',
      "One appointment per month: a 'Bath, Brush & Tidy' every other month, a 'Full Groom' every other month",
      'Free nail clipping whenever required',
    ],
  },

  // Verbatim from /services/ "Additional services" (canonical per owner ruling).
  addOns: [
    { name: 'Bath, Brush and Tidy', priceDisplay: '£25 – £30', note: 'Includes a bath, brush, sanitary trim, tidy up and nails (if the dog allows). See price list for details.' },
    { name: 'Hand stripping', priceDisplay: '£50+', note: 'Removing dead hairs from the coat by hand – breed dependent, please enquire before booking in.' },
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
  ],

  pickup: {
    areas: 'Hastings and St Leonards',
    priceDisplay: '£1 per journey',
    note: 'Pick up/drop offs are offered for full groom appointments only.',
    // ⚠ OPEN ITEM (WEBSITE-PLAN.md): the old homepage says "free door to door
    // service" for full grooms while /services/ lists £1 per journey — owner to
    // confirm the final wording before the /services/ page ships.
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
