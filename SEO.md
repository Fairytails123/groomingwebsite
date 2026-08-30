# SEO programme memory

Last updated: 2026-08-30. This is the durable source of truth for Fairy Tails Dog Grooming SEO work. Read it with `HANDOVER.md` before every SEO session and update both when the state changes. Never record passwords, tokens or other secrets here.

## Objective and success measure

- Win local organic visibility for **dog grooming in Hastings and St Leonards only**.
- Primary conversion: a completed online booking. Calls, WhatsApp and enquiries are secondary.
- Position the business as an easy, trusted salon choice: book online with immediate confirmation, optionally have the dog collected from home and returned, and leave the grooming journey to the team.
- Avoid implying mobile or in-home grooming. All grooming happens at the single Hastings salon.

## Confirmed business facts

- Trading name: The Fairy Tails Dog Grooming.
- Salon: Number 15, Mount Pleasant Road, Hastings, TN34 3SB.
- Telephone and WhatsApp: 01424 300668.
- Service area: Hastings and St Leonards only.
- Collection/return: £2 per journey, £4 round trip; available for full grooms, hand stripping and bath and brush appointments.
- Booking: online appointments are confirmed immediately by the booking system.
- Trust: City & Guilds dog grooming qualifications, fully insured grooming team, air-conditioned salon, more than seven years in business.
- Competitors to monitor: Parkside Parlour, Gillsmans, The Pawfect Pooch and Tails of St Leonards.

## Anti-regression contract

These are owner-confirmed operating facts, not phrases to optimise away. Until Kam explicitly
changes a fact, every page, schema object, directory submission and future campaign must preserve:

- one grooming premises only: Number 15, Mount Pleasant Road, Hastings, TN34 3SB;
- one public phone/WhatsApp number: 01424 300668; never restore 07842 116216;
- salon-only grooming; collection and return do not make the business mobile or in-home;
- service area limited to Hastings and St Leonards; St Leonards is not a second premises;
- collection at £2 per journey / £4 round trip, only for full grooms, hand stripping and bath and brush appointments;
- immediate booking-system confirmation, without promising appointment availability beyond what the booking system shows;
- City & Guilds dog grooming qualifications, full insurance, an air-conditioned salon and more than seven years in business;
- canonical HTTPS domain `https://fairytailsdoggrooming.co.uk/`, indexable real pages, trailing-slash page URLs and no self-serving first-party `AggregateRating` markup.
- absolute third-party separation from `www.thefairytails.co.uk`: the two sites must never share analytics accounts, properties, containers, streams, pixels, tags or other integration assets. Grooming uses GTM `GTM-TZWLLT4H` and GA4 `G-TVNY7185K3`; the main-site GTM container `GTM-W93L9XK5` is prohibited here.

Prohibited regressions include the retired Fairlight Place/Barley Lane and 100 Parker Road addresses,
TN35 5DT, the retired mobile, “free” collection, service outside Hastings/St Leonards, a St Leonards
salon, mobile grooming, in-home grooming, or invented qualification levels, licences, memberships,
awards or review claims.

If a real business fact changes, stop and obtain an explicit owner ruling. Then update
`src/data/business.ts` or `src/data/pricing.json` as the canonical source, every affected consumer,
structured data, the applicable automated checks, this file and the newest `HANDOVER.md` entry in
the same approved scope. Do not patch one page in isolation, infer facts from a directory, or leave
mixed old/new NAP state.

## Keyword and page map

| Intent | Primary page | Current treatment |
|---|---|---|
| dog groomers Hastings / dog grooming Hastings | `/` | Primary homepage target, booking-led proposition |
| dog grooming services Hastings | `/services/` | Service overview and conversion route |
| dog groomers St Leonards / dog grooming St Leonards | `/dog-groomers-st-leonards/` | Honest collection-area landing page; one Hastings salon made explicit |
| qualified dog groomers Hastings | `/who-we-are/` | Qualifications, insurance, experience and salon trust |
| service-specific and price intent | Existing `/services/.../` pages | Preserve specialist relevance and link back into booking |

Do not create near-duplicate location pages for surrounding towns. Expand only when the owner confirms a genuine service area and there is enough unique customer value to justify a page.

## Baseline and current position

Ahrefs programme-start snapshot is stored at `docs/seo-baseline/ahrefs-programme-start-2026-08-09.json`; the pre-domain-flip snapshot is `docs/seo-baseline/ahrefs-pre-flip-2026-08-08.json`. The first locality-specific Rank Tracker configuration is recorded at `docs/seo-baseline/ahrefs-local-rank-tracker-2026-08-10.json`. The current combined Ahrefs/GSC/link/analytics baseline is `docs/seo-baseline/ahrefs-gsc-programme-2026-08-30.json`.

- Ahrefs project: `10212777` (`Fairytailsdoggrooming`), verified.
- Domain Rating: approximately 1.
- Organic keywords: 4; estimated UK organic traffic approximately 57 in the 2026-08-30 Site Explorer read-back.
- `dog groomers hastings`: Ahrefs Rank Tracker position 2 on mobile and desktop on 2026-08-30. GSC for 2026-08-09 to 2026-08-29 recorded 15 clicks, 101 impressions, 14.9% CTR and average position 3.76 for the exact query.
- Ahrefs Site Audit remained in progress on 2026-08-30: health 84 across 87 URLs, with 14 errors, 17 warnings and 8 notices. The 14 missing-alt reports remain deliberate decorative-image false positives; re-read the completed crawl before prioritising the remainder.
- GSC is available through the verified Ahrefs project and is the primary performance source. The first post-cutover window shows the homepage owning core Hastings intent, while price/cost terms have the largest evidenced non-brand impression opportunity.
- Raw backlink counts are polluted by low-quality `.shop`/`.site` profile spam. Do not use the count as a success metric; assess relevance, crawlability, editorial independence and referral value.
- Ahrefs Rank Tracker contains exactly 11 keyword/location pairs: eight for Hastings and three for Saint Leonards-on-sea. On 2026-08-30 the core Hastings phrases were positions 2–3 on mobile; St Leonards phrases were positions 11–12 and remain the clearest location-page opportunity.
- The 2026-08-10 Site Audit review found that 14 missing-alt warnings are deliberate `alt=""` on decorative Header/Hero images. The actionable metadata findings were resolved locally for contact, gallery, teeth cleaning and who-we-are, and the SEO test now enforces a 100–165-character description range.

## Measurement and property separation

- Dedicated grooming GTM account/container: `Fairy Tails Dog Grooming` / `fairytailsdoggrooming.co.uk`, container `GTM-TZWLLT4H`.
- Dedicated grooming GA4 account/property/stream: `Fairy Tails Dog Grooming` / `Fairy Tails Dog Grooming — Website`, measurement ID `G-TVNY7185K3`, stream ID `15528315552`.
- The GA4 property is linked only to the verified `sc-domain:fairytailsdoggrooming.co.uk` Search Console property.
- `enquiry_submitted` is sent through the grooming container and configured as a GA4 key event without an artificial monetary value.
- An accidental main-site GTM Version 6 publish was detected during clean-up. Historical Version 5 was immediately restored as Live, and clean Version 7 (`Restored_5`) became Latest. The `www.thefairytails.co.uk` workspace was synchronised to Version 7 with zero pending changes; the session-created Meta tags and grooming-named triggers are absent. Public payload read-back confirms that the main-site container remains on its own pre-existing measurement estate.
- Completed JotForm booking attribution is not yet evidenced. Do not report enquiries or outbound booking clicks as completed bookings.

## Phase 1 local foundation

Local candidate work on branch `codex/seo-foundation-2026-08-09`:

- Clear local titles/descriptions and booking-led copy on the homepage, services and who-we-are pages.
- New `/dog-groomers-st-leonards/` page describing collection to the single Hastings salon without presenting the business as mobile.
- Centralised business trust/service facts in `src/data/business.ts`.
- Homepage `WebSite` and `LocalBusiness` JSON-LD with the current NAP and only Hastings/St Leonards as service areas. No self-serving `AggregateRating` markup.
- Internal links to the St Leonards page from the homepage, services page and footer.
- `npm run verify-seo` protects canonical URLs, titles, H1s, robots state, sitemap membership, structured data, service-area honesty and retired/misleading claims.

This work remains a local release candidate until the 2026-08-30 approved commit/push/deployment completes and the production read-back passes. The older 2026-08-09 no-release instruction is superseded only for the currently defined SEO, link-integrity and grooming-analytics release scope.

## Backlink ledger

A link counts only when the public source URL returns successfully and contains a crawlable direct link to `https://fairytailsdoggrooming.co.uk/` with truthful details. Submission alone is not a live backlink.

| Source | Source/profile URL | Status | Target/context | Evidence and next action |
|---|---|---|---|---|
| Waggy List | `https://waggylist.co.uk/listing/the-fairy-tails-dog-grooming-2` | **LIVE and independently verified 2026-08-09 — qualifying new backlink 1 of 2** | Two direct followed links to the canonical homepage from a free Hastings dog-grooming listing | Public profile displays the correct full NAP, is discoverable in Waggy List search, is self-canonical and has `index,follow`. Both website links point directly to `https://fairytailsdoggrooming.co.uk/` with `rel="noopener noreferrer"` only. LocalBusiness JSON-LD has the correct name, telephone and address and uses the canonical site in `sameAs`. Ahrefs: low authority (DR 0; about 60 traffic/19 keywords) with spam-inflated refdomains, but genuine topical visibility. Counted as the first new qualifying link; recheck after crawler discovery. |
| Local Dog Groomers | `https://localdoggroomers.co.uk/contact/` | **Submitted 2026-08-09 15:46 BST; awaiting editorial publication** | Requested canonical homepage link in a Hastings dog-groomer profile | The directory explicitly invites dog groomers to request a free listing without signup. Its form returned `Your submission was successful.` after receiving the truthful public NAP, salon-only description, service areas and canonical URL. Do not count until a public profile is live, returns 200 and contains the direct crawlable link. |
| MuddyPup | `https://www.muddypup.com/groomer/220d6b5e-ec98-4e7f-a434-28906daebdae` | **LIVE followed backlink; profile claimed and NAP corrected 2026-08-09** | Direct canonical homepage link; pre-existing, so not a new-session link | Public profile is self-canonical, `index,follow`, and links directly to the canonical site with `rel="noopener noreferrer"` only. It now shows the correct business name, phone, Hastings TN34 3SB, City & Guilds/insurance/salon facts, 6–10 years' experience, services and collection terms; the retired Fairlight/Barley address, TN35 postcode and old mobile are absent from visible text and HTML. Remaining citation defect: the embedded OpenStreetMap marker and JSON-LD `geo` still use the old coordinates `50.8710632, 0.6299924`, while Google/Apple map links query the correct Mount Pleasant Road address; opening hours are not exposed publicly. Correct the geo through the listing owner controls or separately authorised support contact. The backlink predates this session and does not count toward the two-new-link gate. |
| The Good Dog Guide | `https://www.thegooddogguide.com/east-sussex/hastings/dog-grooming-groomers/the-fairy-tails/30416` | Existing profile; **not a qualifying backlink route** | Citation/profile correction only | Public 200 profile has current address/phone but no website link and contains the typo `Hastings Dog Grooming Saloon`. Its own advertising table says website links require Basic (£25/year) or Premium (£50/year), and its terms say outbound links are nofollow. Do not pay merely to obtain this link; correct the citation only under a separately approved profile action. |
| FreeIndex | `https://www.freeindex.co.uk/profile(the-fairy-tails-dog-grooming)_865530.htm` | **LIVE, indexable and independently verified 2026-08-30 — qualifying new backlink 2 of 2** | Direct followed homepage link under the public `Website` field; anchor `fairytailsdoggrooming.co.uk` | Kam approved and privately created/authenticated the account. The free profile returns HTTP 200, is self-canonical, now permits indexing, and contains the correct name, `15 Mount Pleasant Road, Hastings, East Sussex, TN34 3SB`, 01424 300668, truthful salon/service details and Mon–Fri 08:00–17:30 hours. Its website anchor points directly to `https://fairytailsdoggrooming.co.uk/` with no `rel` attribute. Submission date: 2026-08-10; qualifying live verification: 2026-08-30; approval owner: Kam. Recheck crawler discovery in Ahrefs and GSC. No Premium purchase, fabricated review or unsupported claim was made. |
| MyPetGroomer | `https://www.mypetgroomer.co.uk/listing/the-fairy-tails.html` | Stale unclaimed profile; no link | Potential fallback | Shows old 100 Parker Road details. Claim flow requires authentication and may include checkout; correct only after terms/cost are clear. |

The backlink gate is **complete at 2 of 2**: Waggy List and FreeIndex are both public, crawlable, topically relevant, truthful and independently verified with direct canonical-site links. Local Dog Groomers remains a legitimate editorial submission but does not need to be counted. MuddyPup remains a corrected pre-existing link. The Good Dog Guide remains excluded because its website-link tiers are paid and outbound links are nofollow. Passwords, email codes, activation links and CAPTCHA must be handled privately by the owner and never placed in the repo, prompts or memory.

Latest Ahrefs prospect comparison: FreeIndex (DR 81; about 4,866 UK traffic/1,880 keywords), Dog Owners Guide (DR 37; about 2,465 UK traffic/888 keywords) and DogPack (DR 48; about 1,762 UK traffic/1,128 keywords) are materially stronger than generic fallbacks, but all require a real owner account and private authentication. Do not substitute zero-traffic directories merely to hit the quota. Ahrefs also exposes a Paw Pages data-quality problem: five live nofollow profile links—including competitor profiles such as The Groom Room Hastings and Pawfect Pooch—point to the Fairy Tails canonical domain. The genuine Fairy Tails Paw Pages profile also predates this session, so none is a new-link win; audit and correct the mislinked competitor profiles before using Paw Pages as a citation source.

## Session protocol

1. Read `AGENTS.md`, `CLAUDE.md`, `HANDOVER.md` and this file.
2. Run a background agent for backlink research/execution as required by the project backlink gate; never lower the quality standard to reach two.
3. Record the starting date, target queries, Ahrefs/GSC/GBP evidence and conversion hypothesis before changing pages.
4. Preserve one primary intent per page; avoid cannibalising the homepage with duplicate local pages.
5. Verify both local/noindex and production/indexable builds. Never unset the repository `INDEXABLE` variable.
6. Record each link's source URL, target, context/anchor, `rel`, HTTP status, NAP accuracy, submission/live dates, approval owner and read-back evidence.
7. Recheck rankings and live links after crawling; compare completed online bookings, not vanity metrics alone.

## Required handoff evidence

For any SEO source change, the minimum local evidence is:

1. `$env:PUBLIC_INDEXABLE='true'; npm run build` — production-mode build succeeds and real pages are indexable.
2. `npm run verify-seo -- --indexable` — keyword ownership, canonicals, metadata, sitemap, schema, NAP and service-area honesty pass.
3. `npm run verify-urls` and `npm run verify-stage3` — URL and collection/pricing contracts pass.
4. `npm run mobile-check` plus targeted screenshots/interaction checks for every changed page.
5. `git diff --check`, a final scoped diff review and a read-back of the rendered/persisted values rather than only source assignments.

Run additional booking, no-JS, accessibility, performance or live checks when the affected journey
requires them. Never quote an old Lighthouse result as a fresh measurement. A deploy additionally
requires separate authorisation and live checks of robots, sitemap, canonicals, schema, booking
links and the GitHub Pages workflow.

For backlinks, record source URL, target URL, anchor/context, `rel`, HTTP status, NAP accuracy,
submission date, live date, approval owner and public read-back evidence. Moderated or submitted
listings remain pending. Lost or materially inaccurate links must be downgraded in this ledger; raw
Ahrefs counts never override public verification.

## Phase 1 release checkpoint — 2026-08-30

- Local SEO candidate: implemented and previously regression-tested on branch
  `codex/seo-foundation-2026-08-09`, based on `8602d2d`.
- Backlink gate: **2 of 2 complete**. Waggy List and FreeIndex are the two verified new qualifying links.
- Release state: approved for the current commit/push/deployment scope, but it must not be recorded as live until the final gates, GitHub Pages workflow and public read-back pass.
- The final release must include the dedicated grooming analytics migration, supported Google Maps review URL, deterministic generated-site link checking and the original Phase 1 local SEO candidate.

## Next priorities

1. After deployment, inspect and request indexing for `/dog-groomers-st-leonards/` in the grooming Search Console property, then compare query/page ownership after recrawl.
2. Establish completed JotForm booking attribution without mixing the main-site analytics estate; until then, report `enquiry_submitted` separately from completed bookings.
3. Correct stale citations, beginning with Yell's old Barley Lane/retired mobile details and the MyPetGroomer Parker Road profile, using truthful NAP only.
4. Monitor the approved 11-pair Hastings/Saint Leonards-on-sea Ahrefs Rank Tracker set on mobile and desktop weekly, with GSC as the performance source of truth.
5. Align Google Business Profile services and description with the same salon-only, qualified, insured, immediate-booking and paid collection facts; use truthful review requests without incentives or gating.
6. Re-read the completed Ahrefs Site Audit and fix only real, current canonical-site issues; exclude spam backlinks and old-domain noise from success reporting.
