# WEBSITE-PLAN — fairytailsdoggrooming.co.uk rebuild

Master plan. Strategy: **build the whole site on the noindexed preview → DNS switchover
when roughly finished → polish indefinitely.** Old WordPress stays on Hostinger as instant
rollback until ≥30 days after a clean cutover.

## Locked spec (owner interview, 2026-07-12)

1. **Stack**: Astro 6 + Tailwind v4, same as the Main Website; GitHub Pages hosting via Actions.
2. **Design**: sister-site branding (countryside editorial: Fraunces/Karla, cream/moss/pine/
   bark/honey + clay) adapted with a grooming-salon personality.
3. **Prices**: the breed-by-breed Full Groom list + `/services/` add-on prices are canonical.
   `/services-2/` was stale → retired with a redirect stub.
4. **Content**: improved/rewritten copy; every fact, price, FAQ, T&C preserved accurately;
   URLs identical to WordPress; owner signs off page by page on the preview.
5. Contact form → n8n webhook (WPForms replaced). 6. Preview noindexed until cutover.

## URL manifest & build tracker

Source of truth for CI: `scripts/verify-urls.mjs` (flip `planned` → `built` there as pages ship,
and mirror the date here).

| URL | Status | Notes |
|---|---|---|
| `/` | stub (Stage-1 placeholder) | Homepage ships LAST |
| `/who-we-are/` | **built** 2026-07-12 | Stage 2 |
| `/contact/` | **built** 2026-07-12 | Stage 2 — form E2E verified via curl; on-page test pending |
| `/terms-and-conditions/` | **built** 2026-07-12 | Stage 2 — legal copy verbatim |
| `/services/` | **built** 2026-07-16 | Stage 3 hub — add-ons/extras from pricing.json; Bruno video self-hosted |
| `/services/full-groom-price-list/` | **built** 2026-07-16 | Stage 3 — 105 rows + breed filter (progressive enhancement) |
| `/services/haircut-lengths/` | **built** 2026-07-16 | Stage 3 — 6 clip lengths w/ rescued photos |
| `/services/teeth-cleaning/` | **built** 2026-07-16 | Stage 3 — emmi-pet |
| `/services/doggy-massage/` | **built** 2026-07-16 | Stage 3 — 4 oils |
| `/services/homeless-dogs/` | **built** 2026-07-16 | Stage 3 |
| `/services/frequently-asked-questions/` | **built** 2026-07-16 | Stage 3 — 15 FAQs, `<details>` |
| `/gallery/` | **built** 2026-07-16 | Stage 4 — 5 before/after pairs (cropped out of the old composites) + 20-photo polaroid grid |
| `/blog/` | **built** 2026-07-16 | Stage 4b — one-post index (featured card + growth-ready grid) |
| `/why-dog-grooming-is-important/` | **built** 2026-07-16 | Stage 4b — ROOT-level slug via content collection; date only, no byline (owner ruling) |
| `/services-2/` → `/services/` | **stub built** 2026-07-12 | public/ meta-refresh+canonical+noindex |
| `/category/blog/` → `/blog/` | **stub built** 2026-07-12 | " |
| `/author/grace/` → `/who-we-are/` | **stub built** 2026-07-12 | " |
| `/feed/` | intentional 404 | revisit after Ahrefs backlink audit |

## Build order (inside-out, homepage last — main-site-proven)

- **Stage 1 — Shell + pipeline** ✅ 2026-07-12: Base/Header/Footer/Consent/global.css,
  business.ts, 404, robots endpoint, stub homepage, Pages deploy, preview domain, noindex verified.
- **Stage 2 — Utility** ✅ 2026-07-12: terms-and-conditions, contact (form E2E PASS), who-we-are.
  Owner eyeball pending.
- **Stage 3 — Services cluster** ✅ 2026-07-16 (revenue/SEO core): all 7 pages built. Lighthouse
  95–100 perf / 100 a11y / 100 SEO across the cluster. Gated by `npm run verify-stage3` (static
  facts) + `npm run price-list-e2e` (browser: drives the filter, then re-loads with JS OFF and
  asserts all 105 rows are visible by computed style).
- **Stage 4 — Gallery + blog** ✅ 2026-07-16: gallery ✅ → blog index + the root-level post ✅ (Stage 4b).
- **Stage 5 — Homepage + whole-site pass**: hero/teasers/reviews/subscription band; dist-wide
  link crawl, sitemap sanity, both-viewport sweep, full verify-urls.

Per-page definition of done = the 6 quality gates in CLAUDE.md.

## "Ready for switchover" gate

- [ ] 15/15 pages `built` (14/15 as of 2026-07-16 evening — only `/` remains, Stage 5);
      `npm run verify-urls` 0 failures
- [ ] Per-page fact diff vs harvest signed off (prices, phones, hours, T&Cs verbatim)
- [x] Breed table rows == 105 (47+10+48) vs harvest; 10-breed spot check re-run; add-ons correct
      — automated in `npm run verify-stage3`, which asserts it against the RENDERED table
- [x] 15 FAQs · 6 clip lengths · gallery = **5 before/after pairs + 20 photos** (the old
      "~25 gallery pairs" estimate in this doc was wrong — the real page was a 5-slide carousel
      plus a 20-photo tiled grid)
- [ ] **`npm run verify-stage3` + `npm run price-list-e2e` green** (the second needs
      `npx astro preview` running) — these encode the 2026-07-16 owner rulings and the
      no-JS/crawler contract on the price list; a regression here is a silent revenue bug
- [ ] Yoast titles/descriptions carried or deliberately improved (logged below)
- [ ] Integrations clicked through ON the preview: JotForm opens · Stripe loads (NEVER complete)
      · EnquiryForm→n8n→email E2E · WhatsApp/tel/reviews links · GTM only after consent
- [ ] Lighthouse ≥90 ×3 on every page · 1440/390 sweeps · reduced-motion sweep
- [ ] Sitemap = apex trailing-slash URLs; canonicals → apex; preview still noindex (curl)
- [ ] **Owner walkthrough of the preview URL + explicit OK recorded in HANDOVER.md**

Then execute `docs/SWITCHOVER-RUNBOOK.md`.

## Integration inventory

| What | Value |
|---|---|
| Booking (primary CTA) | JotForm `251190647924057` — pci.jotform.com (Acuity is DEAD) |
| Subscription | Stripe `buy.stripe.com/8x27sM5K57BR1IL94W9MY00` — £25/mo/dog, 2-mo min |
| Enquiry form | n8n `grooming-enquiry` (wf `TpQFGJy87KIKGflV`, table `mbWR9tHS4u95s605`) — E2E verified 2026-07-12 |
| Reviews | Google place `ChIJV3P8-VAb30cRHoBgRmxCYIM` — 4.9★/63 (snapshot 2026-07-12) |
| WhatsApp | wa.me/447842116216 |
| Analytics | GTM `GTM-W93L9XK5`, Consent Mode v2 default-denied |

## Open items

- [ ] 🔴 **THE LIVE BOOKING FORM SELLS A SERVICE THE SITE SAYS WE DON'T OFFER.** The JotForm
      (`251190647924057`, updated **2026-07-15**) contains the question **"Bath and Brush
      Appointment – Bus pick-up and drop-offs"** — i.e. a customer can book a Bath & Brush *with*
      collection. Our site says the opposite in three places, all inherited from the harvest and
      reinforced by the 2026-07-16 rulings: `pricing.json` `bathBrushTidy.note`, the T&Cs
      ("We do not offer pick ups/drop offs for bath and brush appointments"), and /services/
      ("for full grooms and hand stripping only"). One of the two is wrong. **Owner must rule
      before switchover** — a customer who books and pays for a collection we then refuse is a
      real complaint, not a typo. (Found 2026-07-16 by reading the live form, not the harvest.)
- [ ] **Does the £2 per journey apply to a bus Bath & Brush too, if it's offered?** Falls out of
      the ruling above. Note the form's "Select pick-up, drop-off **or both** services" question
      independently corroborates the per-LEG pricing model.
- [x] ~~**Pickup price wording**~~ — RESOLVED 2026-07-16, see the copy log below.
- [ ] **"From £25" sets an expectation the price list can't meet.** All five £25 rows
      (Chihuahua smooth, French Bulldog, Greyhound, Jack Russell smooth, Pug) are **de-shed**
      breeds. The cheapest clipped/scissored full groom is £30 and the cheapest crossbreed is £35 —
      so a Cockapoo owner reading "From £25" finds nothing under £40 for their dog. Not a
      contradiction (it's true), but it's a bounce risk on the money page. Owner call: keep, or
      say "from £25 (de-shed breeds) / £30 for a clipped groom"?
- [ ] **Puppy groom £25 exists ONLY in the FAQ** — not in the price list, not in the /services/
      add-ons, not in pricing.json. Distinct from the free "Puppy introduction". The FAQ page now
      advertises a product nothing else on the site supports. Real service, or stale offer?
- [ ] **/who-we-are/ drops the K9 Centre's "online shop"** and says "day school" where the harvest
      says "day care". The shop was Adventure Dog, which is dead (see copy log), so dropping it is
      probably right — but confirm "day school" vs "day care" is the real service name.
- [x] ~~**`/blog/` 404s from the footer**~~ — RESOLVED 2026-07-16: `/blog/` and the root-level
      post are built; the footer link and the `/category/blog/` stub now land on a real page.
- [ ] **BREEDS ON /gallery/ NEED THE OWNER'S EYE.** Owner ruling 2026-07-16 was "use breeds, no
      names", accepting the risk that a guess could be wrong. Breeds are asserted in alt text ONLY
      where unmistakable; where it was a judgement call the alt text describes the coat instead.
      Asserted: Labradoodle (01), Cockapoo (03, 11, 18, 19), Poodle (05, 09), Shih Tzu (06, 20),
      Cocker Spaniel (07), Dachshund (08), French Bulldog (10), Jack Russell (12), Chihuahua ×2 (15),
      Bichon Frise (16), Afghan Hound (17). Deliberately NOT named: 02 ("wire-coated white terrier"),
      04 ("small white dog"), 13 ("long-coated tan and black collie"), 14 ("black and white
      short-coated dog"). Pairs: Cockapoo, wire-coated terrier, Poodle, collie, Afghan Hound.
      A wrong breed on a groomer's own site is embarrassing — please correct any.
- [ ] **Gallery photo resolution is capped by the source and cannot be improved.** The 5 before/after
      crops are only 242–309px (each was a ~400px photo inside a 1200×600 composite) and the grid
      photos are 480×480 originals. Display slots are deliberately small to stay sharp; `mobile-check`
      warns on 4 of them. Only new photography fixes this.
- [ ] GitHub **account-level verified domain** for fairytailsdoggrooming.co.uk (Settings →
      Pages → Add a domain; TXT `_github-pages-challenge-Fairytails123`) — anti-takeover;
      needs the GitHub web UI (no REST API). Do before flip day.
- [ ] **GSC Domain property** + DNS TXT verification, then export 16-month baseline.
- [ ] **Ahrefs baseline** via web UI (API plan-blocked): organic keywords, top pages, backlinks →
      `docs/seo-baseline/`; decide `/feed/` + wp-content stub questions from the backlink report.
- [ ] Identify the external .co.uk registrar + confirm auto-renew (not blocking; DNS is at Hostinger).
- [ ] The blog post exists on BOTH this domain and the Main Website — **owner confirmed
      2026-07-16: decide at polish.** Both copies ship self-canonical (exactly the old status
      quo). Note for the polish session: the Main Website's Base.astro computes canonicals
      generically — pointing its copy here needs a small per-post override prop there.
- [ ] Favicon .ico variant (PNG set shipped; .ico optional).
- [ ] /who-we-are/ photo: the old page's `Fairy-Tails.jpg` looks like the K9 Centre BARN, not
      the town salon — owner to confirm or supply a salon photo (alt text kept neutral meanwhile).

## Deliberate copy/SEO changes log

(Record every intentional deviation from the harvested Yoast titles/descriptions/copy here.)

- 2026-07-12 T&Cs: two unambiguous typo fixes only — "Dogs will be not be groomed" → "will not
  be"; "pet's need physical maintenance" → "pets need". Everything else verbatim.
- 2026-07-12 /contact/ meta description: old Yoast description referenced "near the Milking
  Parlour in Barley Lane" — that's the K9 CENTRE address, not the salon. Rewritten around
  15 Mount Pleasant Road + phone. (Old value preserved in grooming-image-archive/contact/meta.json.)
- 2026-07-12 /who-we-are/: copy tightened per locked spec (all facts kept); old title
  "The Fairy Tails Dog Grooming - The Fairy Tails Dog Grooming" kept as-is for now — candidate
  for improvement at polish (it's a doubled site-name, weak SEO).

### 2026-07-16 — /gallery/ (Stage 4)

1. **Carousel → grid.** The old page was a Smart Slider carousel of 5 before/after slides. A
   carousel shows 1 of 5 to anything that doesn't click, crawlers included, and these photos are the
   most persuasive content the business has. All 25 images now render in the HTML at t=0.
2. **The 5 before/after composites were cropped apart** (owner ruling): each was 1200×600 with the
   OLD brand baked into the pixels — cyan/blue background, soap bubbles, tilted white polaroid
   frames. `npm run gallery-crop` recovers the 10 bare photos and the page reframes them as
   Before | After pairs in the countryside system. Read that script's header before touching a crop:
   the bubbles are drawn OVER the photos, so some crops are deliberately asymmetric.
3. **Alt text names breeds only where unmistakable** — see the open item above for the full list and
   the four deliberately left unnamed.
4. ⚠️ **The harvest had MISSED all 5 before/after images.** They are referenced with
   protocol-relative URLs (`src="//host/…"`) and a CSS `background-image`, and `extractImageUrls`
   only matched `https?://` (protocol-relative was handled for `srcset` only). The harvest reported
   "failed: 0" while silently skipping them. Rescued at 1200×600 on 2026-07-16 and
   `scripts/harvest.mjs` fixed. Same near-miss class as the Bruno video.

### 2026-07-16 — Stage 4b: /blog/ + /why-dog-grooming-is-important/ (owner interview same day)

Owner rulings (locked via interview before the build): **date only, no author byline** (the old
post credited Grace Humbles); **hero = the K9 Centre site's 1600×1180 salon photo** (replacing the
old 650×433 end-of-post studio shot, alt=""); **both sites stay self-canonical for now** — the
cross-domain duplicate decision stays "at polish"; **more posts are planned**, so /blog/ is framed
as a growing tips section (new posts = markdown files in `src/content/blog/`).

1. **Post date = 17 April 2020, displayed without an author.** The old page's visible byline
   ("By Grace Humbles / November 6, 2022") carried a site-rebuild date: the body's own first line
   was a typed "17th April 2020", the WP auto-excerpt on /blog/ confirmed it as body text, and the
   Main Website's copy of this same post already uses 2020-04-17. The stray body line is dropped —
   it became the real `pubDate`.
2. **Four bold-paragraph section labels promoted to real H2s** ("Importance of Dog Grooming",
   "Dog grooming at home", "Puppies and grooming", "How often should I get my dog groomed?"). The
   old markup was `<p><strong>…</strong></p>` — zero headings in the whole article body.
3. **Two typo fixes** (same class as the T&Cs precedent): "brushing them to hard" → "too hard";
   "you can be confident pooch will leave" → "confident your pooch will leave". Everything else
   verbatim from the harvest, curly apostrophes included.
4. **/blog/ gains an H1 and a meta description** — the old index had NO H1 anywhere and a null
   Yoast description. The old card's excerpt was WP's broken auto-excerpt (it opened with the
   stray "17th April 2020"); the new card uses the post's own description (= its Yoast meta
   description, verbatim).
5. **og:type=article + article:published_time restored** on the post via a new optional
   `articlePublished` prop on Base.astro (the old Yoast emitted the same pair; og:type stays
   "website" everywhere else).
6. Titles verbatim: "Blog - The Fairy Tails Dog Grooming" and "Why dog grooming is important -
   The Fairy Tails Dog Grooming".

### 2026-07-16 — Stage 3 owner rulings (the old site contradicted itself; these settle it)

⚠️ **Never re-litigate these from the Yoast `article:modified_time` stamps.** The homepage,
`/services/`, `/services-2/` and the price list all carry stamps inside one 7-minute window
(16:47–16:53) on **the harvest date itself** — that is a migration re-save of the temporary
Bluehost origin, **not** four content edits. `/services-2/` appears 39s "newer" than `/services/`
purely as an artifact. Only the pre-2026 stamps (FAQ 2024, T&Cs 2023, who-we-are 2025-12,
contact 2025-07) carry real signal.

1. **Pick-up & drop-off = £2 PER JOURNEY** (£2 to collect + £2 to drop off = £4 round trip),
   **Hastings and St Leonards**, full grooms and hand stripping only. This value appears **nowhere**
   on the old site, which said four different things: homepage "at no extra cost", T&Cs "**Free**
   pick up/drop off service", /services/ "£1 per journey", /services-2/ "£5 Bexhill/Battle/Rye".
   **No out-of-area service** — Bexhill/Battle/Rye are not served at all.
   Changed: `pricing.json` `pickup` (now the SINGLE source — `business.ts`'s duplicate `pickup`
   object, which held a contradicting 5th variant, was **deleted**); T&Cs heading + body;
   /who-we-are/ (its "fee-paid" hedge existed only because this was unresolved); the homepage stub's
   meta description, which was shipping "With free door to door service in the Hastings area!".
2. **Pick-up TIME WINDOWS — a new third set**, replacing both published versions:
   morning collect **7:45–9:30** → home **12:45–13:30**; afternoon collect **12:45–13:45** → home
   **15:30–16:45**. (The FAQ published 8:30–9:45/16:15–17:30; the T&Cs published 8:15–9:30/16:30–17:45,
   whose 17:45 return was 15 min AFTER the 17:30 closing time.) Both pages now render them from
   `pricing.json` so they cannot drift apart again.
3. **Ear plucking — absolute "we never pluck"** (the FAQ's 2024 wording). The T&Cs' carve-out
   "unless there are loose hairs that gently come away from the ear when rubbed" is **removed**.
4. **Payment — invoicing is by prior arrangement only**, not a walk-up option. The T&Cs' flat "All
   charges are payable before you leave the salon" now carries that exception; the FAQ's bare
   "Invoice" bullet is reworded. (FAQ and T&Cs directly contradicted each other.)
5. **Adventure Dog shop link DROPPED** from the FAQ. `adventure-dog.co.uk` is a dead Shopify domain
   (`the-fairy-hut.myshopify.com`) — fails TLS, returns Shopify's 409 "domain not connected". The
   answer is kept and reworded with no outbound link.
6. **Hand stripping "£50+" → "£45+"**, and now DERIVED in `extract-prices.mjs` from the cheapest
   `(hand strip)` row rather than typed. £50 was never the floor — the same canonical price list has
   three hand-strip rows at £45 (Dachshund, Jack Russell, Lakeland Terrier).
7. **Subscription perk "Free pick ups and drop offs" → "Pick ups and drop offs included."** Same
   fact (it IS a real perk now pay-as-you-go is £2), but the word "free" sat on the same page as the
   £2 price and read as a contradiction.
8. **`bathBrushTidy.note`: "We do not offer ~~free~~ pick ups/drop offs for bath and brush"** — with
   nothing free anywhere, "free" implied free pick-ups exist elsewhere. Bath-and-brush gets no
   collection at any price.
9. **Tick removal £5 added to `extraCharges`.** It was the one charge the old site mentioned in T&Cs
   prose only, so it never reached the structured data.
10. **Price list title improved** (pre-authorised by the "carried or deliberately improved" rule):
    "The Fairy Tails Dog Grooming - The Fairy Tails Dog Grooming" → "Dog grooming price list - The
    Fairy Tails Dog Grooming". The old title was a doubled site name with zero keyword value on the
    site's highest commercial-intent page. Description kept verbatim.
11. **Price list section order changed** (no facts moved): the three breed tables are now contiguous,
    with bath/brush + subscription after them, so the breed filter runs over one uninterrupted block.
    The old page interleaved them.
12. **`business.ts` subscription comment corrected**: it described the cheaper visit as a "**Half
    Groom**", a term that exists nowhere in the harvest. Standardised on **"Bath, Brush & Tidy"**,
    which is what both the canonical /services/ page and the price-list table call it. (The price
    list also called it a "Maintenance Groom" — three names for one product.)
    ⚠️ **Corrected again the same day:** that comment ALSO claimed "**bus** pick-up" was a stray from
    the sister route-planner project. **That was wrong.** "Bus" is the salon's own word — the live
    JotForm asks for a "Full Groom or Hand Strip Appointment – with bus pick-up and/or drop-offs".
    It is merely absent from the *website*, which says "pick up and drop off".
    **Lesson: the harvest is the source of record for the OLD SITE, not for the BUSINESS.** "Not in
    the harvest" ≠ "not real". Check the booking form and the owner before calling a term foreign.

## Polish backlog (post-switchover, indefinite)

Copy/photo upgrades · FAQPage JSON-LD + LocalBusiness schema · gallery `<dialog>` lightbox ·
subscription sign-up page (Stripe recurring product — separate project) · fresh blog posts ·
duplicate-post canonical decision · GA4 property · Ahrefs-driven keyword pages · refresh
reviews snapshot.
