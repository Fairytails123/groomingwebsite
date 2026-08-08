# The Fairy Tails Dog Grooming — website engineering brief

Static rebuild of **fairytailsdoggrooming.co.uk** (previously WordPress on Hostinger).
Astro 6 + Tailwind v4, **hosted on GitHub Pages** (repo `Fairytails123/groomingwebsite`, public).
Read `HANDOVER.md` first every session (where we are), `WEBSITE-PLAN.md` for the master plan,
`docs/SWITCHOVER-RUNBOOK.md` for what the DNS cutover did and how to roll it back.

## 🔴 THE SITE IS LIVE — read this before you change anything (go-live 2026-08-08, 19:02 UTC)

**https://fairytailsdoggrooming.co.uk is PRODUCTION**, served from GitHub Pages, HTTPS enforced
(cert covers apex AND www; http → 301 → https; www → 301 → apex). It is no longer WordPress.
**Every push to `main` is in front of paying customers within ~2 minutes** — there is no staging
step left between you and them.

- **The site is INDEXED.** The repo Actions variable `INDEXABLE` is `true`; robots.txt allows and
  names the sitemap; none of the 14 real pages carries a `noindex` (the three legacy redirect
  stubs — `/services-2/`, `/category/blog/`, `/author/grace/` — keep theirs deliberately; never
  strip those). **Never re-introduce a noindex on a real page, never unset `INDEXABLE`, never add
  a static `public/robots.txt`.** Google Search Console
  (`sc-domain:fairytailsdoggrooming.co.uk`) is verified and the sitemap is submitted.
- **`preview.fairytailsdoggrooming.co.uk` is DEAD as a preview.** Pages serves the apex now, not
  that host; its DNS CNAME still exists but nothing serves it (it 404s). Preview = `npm run build`
  + `npx astro preview` locally. **Do not send the owner a preview URL — there isn't one.**
- **The old WordPress site is still up and untouched at Hostinger — that IS the rollback.**
  Do not decommission it before T+30 days (2026-09-07). ⚠️ And when it does go, **delete the
  WordPress website only — do NOT cancel the Business Web Hosting plan**: this domain is the
  main vhost on that plan and `thefairytails.co.uk` (the Main Website) is an addon on the SAME
  plan (order 1009494758), so cancelling it takes the Main Website down too. Detail:
  `HANDOVER.md` 2026-08-08; procedure: the runbook's "WordPress decommission" section.
- Rollback values, the flip sequence and its post-mortem: `docs/SWITCHOVER-RUNBOOK.md` plus the
  2026-08-08 entry at the top of `HANDOVER.md`.

## ⚠️ Divergences from the Main Website repo (do NOT "fix" these)

1. **URL format is the OPPOSITE**: `build.format: 'directory'` + `trailingSlash: 'always'`.
   Legacy WordPress URLs are trailing-slash directories (`/contact/`, `/services/teeth-cleaning/`).
   The Main Website uses `format:'file'` + `trailingSlash:'never'` — never copy its config back in.
   `scripts/verify-urls.mjs` `distFile()` maps `/x/` → `dist/x/index.html` accordingly.
2. **GitHub Pages IS production** (Main Website deploys to Hostinger; its Pages is preview-only).
   Every push to `main` deploys via `.github/workflows/deploy.yml` — and since 2026-08-08 that
   deploy is the live customer-facing site at the apex, not a preview.

## The INDEXABLE handle (indexability is env-driven — never hardcode)

- `Base.astro` emits `<meta name="robots" content="noindex, nofollow">` unless
  `import.meta.env.PUBLIC_INDEXABLE === 'true'`.
- `src/pages/robots.txt.ts` reads the same env: unset → `Disallow: /`; true → allow + sitemap.
  There is deliberately NO static `public/robots.txt`.
- The deploy workflow passes `PUBLIC_INDEXABLE: ${{ vars.INDEXABLE }}`. **The repo Actions
  variable `INDEXABLE` is `true` — set at go-live 2026-08-08 — and must stay that way.**
  Unsetting, renaming or "restoring" it de-indexes the live business site on the next deploy,
  silently, via a GREEN run. Check, don't assume:
  `gh variable list -R Fairytails123/groomingwebsite`.
- ⚠️ A **local** build is still noindexed, because the env var is not set on this machine. That
  is correct and expected — it is **NOT** evidence that production is noindexed, and it is not a
  bug to fix. Confirm production directly:
  `curl -s https://fairytailsdoggrooming.co.uk/robots.txt`.
- Lighthouse SEO scores must therefore be measured against a local
  `$env:PUBLIC_INDEXABLE='true'; npx astro build; npx astro preview` build — an unflagged local
  build's noindex caps the score by design.

## Hosting, domain & DNS

- **Production URL: https://fairytailsdoggrooming.co.uk** — the GitHub Pages custom domain since
  2026-08-08. `public/CNAME` holds the apex; `protected_domain_state: verified` (account-level
  domain verification done the same day). `site` in `astro.config.mjs` was always this apex, so
  canonicals/sitemap needed no change at the flip.
- ⚠️ **Pushing `public/CNAME` does NOT move the Pages custom domain** under
  `actions/deploy-pages`. Only the API does:
  `gh api repos/Fairytails123/groomingwebsite/pages -X PUT -f cname=…`. Keep the two in step.
- ⚠️ **A stuck TLS cert is stuck, not slow.** If `https_certificate.state` sits at `null` for
  more than ~10 minutes, visitors get a full-page `ERR_CERT_COMMON_NAME_INVALID`. Waiting does
  not help and re-PUTting the same cname is a no-op — **remove the custom domain, then re-add
  it** (approved in ~20s when this happened at go-live). Full write-up: HANDOVER 2026-08-08.
- **`preview.fairytailsdoggrooming.co.uk` is DEAD as a preview.** Its CNAME is still in the zone
  but Pages no longer serves it (404) — there is no preview URL any more. Check changes locally
  (`npm run dev`, or `astro build` + `astro preview`); a push to `main` goes straight to
  production.
- **Registrar ≠ DNS host.** The domain is **registered at Bluehost**, but its nameservers point
  at **Hostinger** (`aster`/`helios.dns-parking.com`), which serves the live zone (13 record-sets).
  **Bluehost's DNS tab is a decoy — edits there do nothing.** Only its nameserver setting matters.
- 🔴 **NEVER call `DNS_deleteDNSRecordsV1` or `DNS_resetDNSRecordsV1` on this zone.** The delete
  tool's MCP schema takes **`{domain}` only** — no `name`, no `type`, whatever its description
  claims — so a single call can wipe the ENTIRE zone (MX ×2, SPF+GSC token, DKIM ×3, DMARC,
  autodiscover, autoconfig, the GitHub challenge TXT). Delete individual records in the Hostinger
  hPanel DNS UI instead. Verified against the live schema 2026-08-08; red block in
  `docs/SWITCHOVER-RUNBOOK.md` step 3.
- **No email lives on this domain.** There are **zero** mailboxes on fairytailsdoggrooming.co.uk;
  all five are on `thefairytails.co.uk` (a different zone), and the site publishes
  `info@thefairytails.co.uk`. This zone's MX/SPF/DKIM/DMARC/autodiscover/autoconfig are
  **vestigial — nothing consumes them.** Owner ruling 2026-08-08: no mailbox is wanted here.
  (Don't delete them casually either: the `@` TXT set also carries the GSC verification token.)
- 🔴 **Do NOT cancel the Hostinger "Business Web Hosting" plan.** The old WordPress site still
  sits on it untouched as the **rollback** and must stay until T+30 days — and on that same
  order `fairytailsdoggrooming.co.uk` is the **main** vhost with the Main Website
  (`thefairytails.co.uk`) as an **addon**, so cancelling the plan would kill the Main Website too.

## Facts live in data files, never in page copy

- `src/data/business.ts` — NAP, phones (ONE number: salon 01424 300668, which is also the
  WhatsApp — the old mobile 07842 116216 is RETIRED from the site, owner ruling 2026-07-17;
  the harvest still carries it, never copy it back),
  hours, socials, booking/subscription/review URLs, GTM id, enquiry webhook.
- `src/data/pricing.json` — ALL prices (~105 breed rows + add-ons + extras). Generated by
  `npm run extract-prices` from the harvest — edit the script/source, don't hand-edit rows.
  ⚠️ `pickup.eligible` is the ONE display string for which services get pick-ups (it changed
  twice on 2026-07-16 alone) — five pages render it; `stage3-checks` positively asserts it on
  all of them. Never retype that list as prose.
- `src/data/reviews-snapshot.json` — the homepage Google-reviews band (white widget-style
  cards with More/Less expanders since 2026-07-17). **OWNED BY THE
  n8n "Grooming Reviews Rotator"** (`sXavTjxM4hzZ8bTo`, VPS, Mon 06:30): it commits a fresh
  version weekly when the newest 5★ reviews change, which triggers the Pages deploy. NEVER
  hand-edit (your edit is overwritten on the next rotation); to change the block's behaviour,
  edit the workflow. Credentials: `_SECRETS/google-services.md` (Maps key, IP-locked to the
  VPS — it will NOT work from this machine) + `_SECRETS/github.md` (repo-scoped PAT).
- **Blog = a content collection**: a new post is ONE markdown file in `src/content/blog/`
  (filename = its ROOT-level legacy slug, e.g. `why-dog-grooming-is-important.md`); the
  `[slug].astro` route, /blog/ card grid, dates and share images all generate from frontmatter.
- ⚠️ **Acuity is DEAD** (grooming account disabled 2026-07-11). Booking = JotForm
  `https://pci.jotform.com/form/251190647924057` (link out, never iframe). Never carry over
  the old site's Acuity links.
- ⚠️ The Stripe subscription link is LIVE — never complete a test checkout. Always show
  "£25/month per dog, 2-month minimum term" next to the sign-up CTA.

## The homepage hero animation (2026-07-16)

`src/components/HeroStage.astro` — a scroll-scrubbed transformation: a scruffy puppy is groomed
by the Fairy Tails fairy's wand. Ported from `Luxury dog grooming animation/` (gitignored, like
the harvest: bulky SOURCE out, derived assets + generator script in). **Read HeroStage.astro's
frontmatter before touching it** — it documents all five deliberate divergences from the handoff.
The load-bearing ones:

- ⚠️ **The handoff is designed in the OLD BRAND BLUE (#00AFF1) on a WHITE page.** This site is
  moss/honey/cream on a dark hero band. Every blue is remapped to honey, and the remap re-anchors
  LIGHTNESS, not just hue: the blue palette carried its sparkle on dark members that only work on
  white. **Never use honey-500/600/700 for sparkle on the moss band — they read as mud.**
- ⚠️ **The handoff's artwork had two defects that are invisible on white by construction**: a
  white matte on every soft edge (all 5,871 semi-transparent px were near-white) and a cream
  floor painted into the bottom. On moss: a halo round a fluffy dog, and a torn-paper slab.
  `scripts/hero-assets.mjs` fixes both, plus recolours the topknot's crimson band — the only red
  in the palette, and next to the moss bow it read as Christmas holly. All constants in that
  script are MEASURED off the artwork; its header shows the workings.
- **Authored FINISHED, armed backwards.** The markup renders the final state; CSS imposes p=0
  only under `[data-ft-armed]` inside `@media (prefers-reduced-motion: no-preference)`. That is
  what makes JS-off and reduced-motion correct for free. An `is:inline` script arms it pre-paint
  and **disarms after 3s if the module never initialises**. Don't "simplify" this to p=0 markup.
- **Astro runs a component script at most ONCE PER SESSION**, even across ClientRouter navs. So
  the back-nav failure mode is *nothing re-initialising* (never double-init). `astro:page-load`
  re-init + module-scope teardown listeners are mandatory. `npm run hero-resilience` guards it.
- **The stage is percentages of an `aspect-ratio: 760/620` box, never JS-sized.** The handoff
  measures and writes px (safe there — its script is inline/sync; here Astro defers it, so that
  port would shift layout every load). CLS is 0 and must stay 0.
- **Desktop ≥lg scrubs a sticky 240vh track; below lg there is NO scroll-jack** — the stage plays
  once on entering view. Owner rule: most customers are on a phone.
- Perf: the whole animation is **50KB** (dog 41KB webp + fairy 8.4KB mask), ONE fetch for the dog
  (the two stacked copies and the sheen mask share one deterministic `getImage()` URL — never add
  `widths`/`densities` there or the mask desyncs and double-downloads). Both assets are at NATIVE
  width because downscaling makes them BIGGER (measured). Nothing in the hero may outrank the
  fonts: the LCP element is the H1, and it waits on Fraunces.

## Harvest archive (content source of record)

`grooming-image-archive/` (gitignored) = verbatim harvest of the old WordPress site
(2026-07-12, before anything could vanish — 70 images rescued from the temporary Bluehost
origin). Per slug: `page.html`, `copy.md`, `meta.json` (Yoast title/description/canonical/og),
`links.json`, `images/<host>/<path>`. Regenerate/extend with `npm run harvest` (idempotent).
Every page build starts from its harvest folder; facts must match verbatim.

⚠️ **The harvest has had TWO holes, and both times it reported `failed: 0`.** It missed the 20 MB
Bruno case-study video (it never scanned for `<video>`) and all 5 gallery before/after images
(protocol-relative `src="//host/…"` + a CSS `background-image`; the scanner only matched
`https?://`). Both were rescued in time and the scanner is fixed. **If content seems missing,
suspect the scanner before concluding the old site never had it.**

⚠️ **The harvest is the source of record for the OLD SITE, not for the BUSINESS.** "Not in the
harvest" ≠ "not real": "bus pick-up" appears nowhere on the website but is the salon's own term on
the live JotForm. Check the booking form and the owner before calling a fact foreign. And the old
site contradicted *itself* on ~9 facts — when two pages disagree, **ask the owner**; do NOT settle
it with the Yoast `article:modified_time` stamps (the four pricing pages all carry stamps from a
single migration re-save on the harvest date — see WEBSITE-PLAN's copy log).

## Tooling (`npm run …`)

| Script | What it does |
|---|---|
| `verify-urls` | URL manifest gate (18 URLs). No flag = local `dist/`. **`-- --live` checks PRODUCTION over HTTP — that is the post-deploy gate now** (note the double dash; `npm run verify-urls --live` is swallowed by npm and silently runs in dist mode). `--preview` still points at the dead preview subdomain and will fail every URL; don't use it. |
| `mobile-check` | 📱 The mobile gate (above). Needs `astro preview` running. |
| `shots` | Dual-viewport screenshots → `shots/<slug>-{1440,390}.png`. Needs `astro preview`. |
| `verify-stage3` | Services-cluster facts: 105 rows render, 0 hidden at t=0, spot-check vs the rendered table, and no banned pick-up/policy wording anywhere. |
| `price-list-e2e` | Drives the breed filter, then reloads with **JS off** and asserts all 105 rows are visible by computed style. |
| `extract-prices` | Regenerates `pricing.json` from the harvest. Edit the SCRIPT, never the JSON. |
| `harvest` | Re-harvests the old site (idempotent). |
| `video-poster` | Poster frame for the Bruno video. No ffmpeg here — decodes in real Chrome. |
| `gallery-crop` | Recovers the 10 gallery photos from the old before/after composites. Read its header before touching a crop. |
| `hero-shots` | Hero-animation eyeball check: screenshots the scrub at p = 0/.25/.5/.72/.85/1 plus the mobile play-through. **`shots` cannot do this** — it captures fullPage, which renders a sticky hero once at p=0 followed by ~1,300px of empty moss. |
| `hero-resilience` | The hero's four untestable-elsewhere failure modes: reduced-motion, JS off, view-transition back-nav, and play-once-only-when-seen. Needs `astro preview`. |
| `hero-mask-support` | Proves the hero's WebP-alpha CSS masks decode in **WebKit** (= Safari/iOS, which we can't open on Windows). Needs `astro preview`. |
| `hero-assets` | Regenerates the hero artwork from the design handoff. One-off; output is committed. Edit the SCRIPT. |

## 📱 THE MOBILE GATE — no page ships without it (owner rule, 2026-07-16)

**Before shipping ANY page, Claude must check it on a phone viewport for all three of:
responsiveness, visuals, and speed.** Most of this salon's customers arrive on a phone; a page
that is only correct at 1440px is not done. This is not satisfied by "the CSS looks responsive"
or by a desktop Lighthouse run — it requires actually rendering the page at phone size and
**looking at it**.

**1. Responsiveness + visuals** — `npm run mobile-check` (needs `npx astro preview` running).
It renders every page at 390×844 as a touch device and FAILS on:
- **horizontal overflow** — the body must never scroll sideways at 390px (a wide table must
  scroll inside its own `overflow-x` container), plus any element extending past the viewport;
- **content hidden by computed style at t=0** (a closed `<details>` is fine);
- **broken or overflowing images**;
- **tap targets under 44×44 CSS px** — links, buttons, `summary`, inputs. Inline links inside a
  paragraph are exempt (WCAG 2.5.8's sentence exception), and a checkbox is measured by its
  `<label>`, which is what you actually tap.
It only WARNS on low-resolution images, because the harvested sources are genuinely small (the
clip photos are 580×580, the add-on thumbs 300×300, the gallery crops 242–309px) and a gate that
demands an image we cannot create just teaches us to ignore it.

**2. Speed** — Lighthouse, run separately; `mobile-check` does NOT measure it. `npx lighthouse`
already emulates a mid-range phone on throttled 4G **by default**, so a plain run IS the mobile
number; if you ever pass `--preset=desktop` you have not run this gate. Must be ≥ 90, measured on
a `PUBLIC_INDEXABLE=true` **local** build (else SEO reads ~69 by design — a plain local build is
noindexed). Production is indexable, so a run against `https://fairytailsdoggrooming.co.uk/`
needs no flag.
⚠️ **One Lighthouse run is not evidence.** The gallery scored 88 on its first run and 99/99/99 on
three re-runs — the first was competing with the build/preview starting up. If a score fails,
re-run before "fixing" anything; check whether the individual metrics agree with the total.

**3. The half no script can check is on Claude:** **actually open the 390px screenshot**
(`npm run shots` → `shots/<slug>-390.png`) and look for text collision, cramped spacing, a CTA
below the fold, or an image cropped to nonsense. Take the screenshot AND look at it.

## Quality gates (every page, before it ships)

1. Copy fact-checked against `grooming-image-archive/<slug>/copy.md` (prices/phones/hours verbatim).
2. **The mobile gate above** — `npm run mobile-check` green AND the 390px screenshot eyeballed.
   Then check desktop ~1440px too (hard owner rule from the main site: BOTH viewports).
3. Lighthouse ≥ 90 perf/SEO/a11y, measured on MOBILE (production-flagged local build, see above).
4. `prefers-reduced-motion` pass.
5. `npm run build && npm run verify-urls` green; manifest entry flipped `planned` → `built`.
   For the services cluster also: `npm run verify-stage3` + `npm run price-list-e2e`.
6. HANDOVER.md updated; push. ⚠️ **A push to `main` IS the deploy, and the deploy is LIVE to
   customers** — there is no preview URL to hide behind any more (Pages no longer serves
   `preview.fairytailsdoggrooming.co.uk`), so anything risky gets the owner's sign-off BEFORE
   the push, not after. Once the Pages run is green, re-check production:
   `npm run verify-urls -- --live` (18/18) and eyeball `https://fairytailsdoggrooming.co.uk/`
   at a phone viewport.

## Local dev (Windows + OneDrive) — ⚠️ TWO MACHINES, TWO ARCHITECTURES

- ⚠️ **`node_modules` is NOT currently a junction** (checked 2026-07-16). The intent below still
  stands, but the reality is that `C:\dev\` does not exist on the arm64 laptop and `node_modules`
  is a real directory **inside OneDrive — i.e. deps are syncing between the two machines.**
  *Intended:* `New-Item -ItemType Junction -Path node_modules -Target C:\dev\grooming-website-node_modules`
  Restoring it is a Kam call and must be done on BOTH machines or neither. See HANDOVER 2026-07-17.
- ⚠️ **The two machines are different CPU architectures** (one **win32-arm64**, one **x64**), and
  because `node_modules` syncs, whichever machine last ran `npm install` leaves its own natives
  behind. Symptom on the other one: `Cannot find module '@rollup/rollup-win32-*'` or
  `Could not load the "sharp" module using the win32-* runtime` — i.e. **`astro build` is simply
  broken, before you have changed anything.** Fix: **`npm install`** (re-resolves this machine's
  optional natives). It is not a code problem; do not go looking for one.
  - ⚠️ A plain `npm install` may rewrite `package-lock.json`, stripping `libc`/`musl`/`glibc`
    fields that gate which `sharp` **Linux CI** picks. **Never commit that churn** —
    `git checkout -- package-lock.json` after installing.
  - ⚠️ Never `Remove-Item -Recurse` a directory that contains a junction to `node_modules` —
    PowerShell follows the junction and deletes the TARGET's contents. (Learned the hard way.)
- Tailwind v4 loads via `@tailwindcss/postcss` (NOT the Vite plugin — Astro 6 bug,
  withastro/astro#16542).
- Node ≥ 22.12. `npm run dev` → localhost:4321.
- The gh CLI token lacks `workflow` scope — pushes that touch `.github/workflows/` must go
  through plain `git push` (Git Credential Manager holds a working credential).
- ⚠️ **Lighthouse's absolute score is machine-dependent here.** The homepage measures **86–87 on
  the arm64 laptop even on a clean `main`**, against the 97–100 recorded elsewhere — GTM alone
  ships 313KB from a live CDN and the LCP element is the H1 waiting on Fraunces. Before treating
  a sub-90 score as a regression, **measure the same commit on `main` on the same machine** and
  compare; a bare number from one machine proves nothing.

## Integrations

- **Enquiry form** → n8n webhook `https://auto.thefairytails.co.uk/webhook/grooming-enquiry`
  (workflow "Grooming Website Enquiry" `TpQFGJy87KIKGflV` on the self-hosted VPS; logs to
  data table `grooming_enquiries` `mbWR9tHS4u95s605`, emails **info@thefairytails.co.uk** — that
  mailbox is on the OTHER domain, see Hosting). Spam gate: honeypot `website` field +
  `elapsedMs < 4000` → silent `{ok:true}`. **Proven end-to-end on the LIVE domain 2026-08-08**
  (execution `396075`, 6/6 nodes, owner confirmed it reached the inbox); `grooming_enquiries`
  rows 1–3 are test data. ⚠️ An SMTP `250` is **not** proof of delivery — Hostinger's relay logs
  don't record info@ → info@ internal delivery, so a human has to look in the inbox.
  ⚠️ Known weakness: the workflow answers `{ok:true}` BEFORE it writes the row and sends the
  email, and has no `errorWorkflow` — an SMTP failure shows the customer "thanks" and loses the
  enquiry. Hardening it is the top candidate for the next pass.
- **Reviews rotation** → n8n "Grooming Reviews Rotator" `sXavTjxM4hzZ8bTo` (VPS, Mon 06:30
  London): Google Place Details (newest) → 4 five-star excerpts → commits
  `src/data/reviews-snapshot.json` via the GitHub contents API only when changed → Pages
  deploys. Fail-closed (error ⇒ no commit). Live-verified end-to-end 2026-07-16. ⚠️ Since go-live
  that weekly commit publishes **straight to the live site**, with no human in the loop.
- **GTM** `GTM-W93L9XK5` (shared container), Consent Mode v2 defaulted denied before load;
  self-hosted ConsentBanner writes `localStorage.ft-consent`.
- Public repo: no client data, no secrets, no harvest archive in git.
