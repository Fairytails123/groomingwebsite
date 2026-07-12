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
| `/services/` | planned | Stage 3 hub — add-ons from pricing.json |
| `/services/full-groom-price-list/` | planned | Stage 3 — PriceTable + JS filter |
| `/services/haircut-lengths/` | planned | Stage 3 — 6 clip lengths w/ photos |
| `/services/teeth-cleaning/` | planned | Stage 3 — emmi-pet |
| `/services/doggy-massage/` | planned | Stage 3 |
| `/services/homeless-dogs/` | planned | Stage 3 |
| `/services/frequently-asked-questions/` | planned | Stage 3 — 15 FAQs, `<details>` |
| `/gallery/` | planned | Stage 4 — before/after polaroid grid |
| `/blog/` | planned | Stage 4 |
| `/why-dog-grooming-is-important/` | planned | Stage 4 — ROOT-level slug, orig date 17 Apr 2020 |
| `/services-2/` → `/services/` | **stub built** 2026-07-12 | public/ meta-refresh+canonical+noindex |
| `/category/blog/` → `/blog/` | **stub built** 2026-07-12 | " |
| `/author/grace/` → `/who-we-are/` | **stub built** 2026-07-12 | " |
| `/feed/` | intentional 404 | revisit after Ahrefs backlink audit |

## Build order (inside-out, homepage last — main-site-proven)

- **Stage 1 — Shell + pipeline** ✅ 2026-07-12: Base/Header/Footer/Consent/global.css,
  business.ts, 404, robots endpoint, stub homepage, Pages deploy, preview domain, noindex verified.
- **Stage 2 — Utility**: terms-and-conditions → contact (form E2E on preview) → who-we-are.
- **Stage 3 — Services cluster** (revenue/SEO core): services hub → price list → haircut-lengths
  → teeth-cleaning → doggy-massage → homeless-dogs → FAQs.
- **Stage 4 — Gallery + blog**: gallery grid → blog index + post.
- **Stage 5 — Homepage + whole-site pass**: hero/teasers/reviews/subscription band; dist-wide
  link crawl, sitemap sanity, both-viewport sweep, full verify-urls.

Per-page definition of done = the 6 quality gates in CLAUDE.md.

## "Ready for switchover" gate

- [ ] 15/15 pages `built`; `npm run verify-urls` 0 failures
- [ ] Per-page fact diff vs harvest signed off (prices, phones, hours, T&Cs verbatim)
- [ ] Breed table rows == 105 (47+10+48) vs harvest; 10-breed spot check re-run; add-ons correct
- [ ] 15 FAQs · 6 clip lengths · ~25 gallery pairs present
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

- [ ] **Pickup price wording**: old homepage says "free door to door" for full grooms; the
      canonical /services/ page says "£1 per journey" (Hastings & St Leonards) and /services-2/
      said £5 for Bexhill/Battle/Rye. Owner to confirm final wording before /services/ ships.
- [ ] GitHub **account-level verified domain** for fairytailsdoggrooming.co.uk (Settings →
      Pages → Add a domain; TXT `_github-pages-challenge-Fairytails123`) — anti-takeover;
      needs the GitHub web UI (no REST API). Do before flip day.
- [ ] **GSC Domain property** + DNS TXT verification, then export 16-month baseline.
- [ ] **Ahrefs baseline** via web UI (API plan-blocked): organic keywords, top pages, backlinks →
      `docs/seo-baseline/`; decide `/feed/` + wp-content stub questions from the backlink report.
- [ ] Identify the external .co.uk registrar + confirm auto-renew (not blocking; DNS is at Hostinger).
- [ ] The blog post exists on BOTH this domain and the Main Website — canonical decision at polish.
- [ ] Favicon .ico variant (PNG set shipped; .ico optional).

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

## Polish backlog (post-switchover, indefinite)

Copy/photo upgrades · FAQPage JSON-LD + LocalBusiness schema · gallery `<dialog>` lightbox ·
subscription sign-up page (Stripe recurring product — separate project) · fresh blog posts ·
duplicate-post canonical decision · GA4 property · Ahrefs-driven keyword pages · refresh
reviews snapshot.
