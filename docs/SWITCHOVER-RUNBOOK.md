# SWITCHOVER RUNBOOK — fairytailsdoggrooming.co.uk → GitHub Pages

Executes only after the WEBSITE-PLAN "Ready for switchover" gate passes with owner sign-off.
Old WordPress stays untouched on Hostinger = instant rollback. **Email lives on this domain
(Hostinger MX/SPF/DKIM/DMARC/autodiscover) — only `@` and `www` records ever change.**

**Timing:** Tuesday or Wednesday, 07:00–08:00 UK (booking-traffic trough; full business day to
monitor with support desks awake). Operator needs ~3 uninterrupted hours + browser access.

## GO/NO-GO (all must be YES)

- [ ] Build-stage gate passed + owner sign-off in HANDOVER.md
- [ ] All 18 manifest URLs green on the preview (`npm run verify-urls -- --preview`)
- [ ] GSC Domain property verified (DNS TXT — survives the flip); baseline exported
- [ ] GitHub account-level verified domain for the apex (Settings → Pages → verified domains)
- [ ] No CAA record in the zone — ⚠ Windows `Resolve-DnsName` CANNOT query CAA (not in its
      RecordType enum; the command errors — verified live 2026-07-18). Use DNS-over-HTTPS:
      `curl -s "https://cloudflare-dns.com/dns-query?name=fairytailsdoggrooming.co.uk&type=CAA" -H "accept: application/dns-json"`
      — no `"Answer"` array in the JSON = no CAA record (absent as of 2026-07-18).
- [ ] `docs/seo-baseline/` committed (dns-pre-flip-2026-08-08.json = the CURRENT diff reference,
      dns-pre-flip.json = the original rollback values, Ahrefs export). Yoast meta is captured
      per-slug as `meta.json` inside the gitignored harvest, not as a separate file here.
- [x] ~~Hostinger mailbox send+receive test~~ — **N/A, the premise was wrong.** Zero mailboxes
      exist on this domain; all five are on `thefairytails.co.uk`, which this flip never touches.
      Verified 2026-08-08 via `mail_listOrdersV1` + `mail_listMailboxesV1`, and mail flow proved
      live the same day from Hostinger's own logs (inbound delivered 18:29Z, outbound 08:24Z).
- [ ] Harvest archive re-verified (insurance before any WP decommission later)

## Flip sequence

1. **Snapshot**: `DNS_getDNSRecordsV1` → diff against **`docs/seo-baseline/dns-pre-flip-2026-08-08.json`**
   (12 record-sets — the 2026-07-12 `dns-pre-flip.json` has only 10 and is NO LONGER a valid diff
   reference: it predates the preview CNAME, the GitHub challenge TXT and the GSC token, so diffing
   against it reports three explained records as unexplained drift. Keep the old file — it still
   holds the original surgical-rollback values);
   `DNS_getDNSSnapshotListV1` → note newest snapshot id as ROLLBACK_SNAPSHOT_ID.
   ⚠️ **RE-READ THE SNAPSHOT LIST IMMEDIATELY BEFORE STEP 3** — every zone write mints a new
   snapshot, so an id captured earlier in the session is already stale by the time you need it.
2. **Site config PR**: set `public/CNAME` to `fairytailsdoggrooming.co.uk`; set repo Actions
   variable `INDEXABLE=true` (`gh variable set INDEXABLE -b true -R Fairytails123/groomingwebsite`);
   push; wait for green deploy. (Robots + meta flip automatically; preview URL keeps working
   until the domain is swapped in step 4.)
3. **DNS flip** — ⚠️ **AMENDED 2026-08-08. READ THIS BEFORE TOUCHING DNS.**

   > ### 🔴 NEVER CALL `DNS_deleteDNSRecordsV1` OR `DNS_resetDNSRecordsV1` ON THIS ZONE
   > The previous version of this step said *"`DNS_deleteDNSRecordsV1`: ONLY name `@`, type
   > `ALIAS`"*. **That instruction is not executable and is actively dangerous.** The MCP tool's
   > schema exposes **only a `domain` parameter** — there is no `name` and no `type`, despite its
   > human-readable description claiming filters exist. Called as previously written it can delete
   > the **entire zone**, taking MX ×2, SPF (which now also carries the GSC verification token),
   > DMARC, all three DKIM records, autodiscover, autoconfig, the preview CNAME and the GitHub
   > challenge TXT with it. Verified against the live schema 2026-08-08.

   > ### 🔴 THE `@` ALIAS AND THE NEW `@` A RECORDS MUST NEVER COEXIST
   > `DNS_updateDNSRecordsV1` with `overwrite:true` only replaces RRs matching the supplied
   > **name AND type**, so applying the A/AAAA payload leaves the `@` ALIAS in place. Hostinger's
   > ALIAS flattener synthesises apex A answers (proved 2026-08-08: zone TTL is 300 but public
   > answers return TTL 60, and three consecutive lookups gave three different Hostinger CDN IP
   > pairs). With both present, **some visitors resolve to GitHub Pages and some to the old
   > WordPress** — a half-flipped site that presents as an intermittent caching bug and burns the
   > monitoring window. The apex must change in ONE operation.

   a. `DNS_validateDNSRecordsV1` dry-run with the new records (non-mutating; returns
      `{"message":"Request accepted"}` on success).
   b. **In the Hostinger hPanel DNS UI** (hpanel.hostinger.com → Domains →
      fairytailsdoggrooming.co.uk → DNS Zone), where records are individually visible and
      deletable, perform as ONE edit:
      - **delete** `@` ALIAS → `fairytailsdoggrooming.co.uk.cdn.hstgr.net.`
      - **add** `@` A: 185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153 (TTL 300)
      - **add** `@` AAAA: 2606:50c0:8000::153 · 2606:50c0:8001::153 · 2606:50c0:8002::153 ·
        2606:50c0:8003::153 (TTL 300)
      ⚠️ Do **not** touch the `@` TXT set (two strings: SPF + GSC token) or the `@` MX set — they
      share the `@` name and are the easiest thing in the zone to destroy by accident.
   c. `www` CNAME → `fairytails123.github.io.` (TTL 300). This one IS safe via
      `DNS_updateDNSRecordsV1` with `overwrite:true`, because `www`/CNAME is the only RRset on
      that name.
   d. `DNS_getDNSRecordsV1` post-diff against `docs/seo-baseline/dns-pre-flip-2026-08-08.json`:
      MX ×2 (TTL 14400), the `@` TXT set with **BOTH** strings, DMARC, DKIM ×3, autodiscover,
      autoconfig, preview CNAME, `_github-pages-challenge-fairytails123` TXT — ALL byte-identical.
      Only `@` (ALIAS gone, A×4 + AAAA×4 added) and `www` differ. **Count the record-sets: 13
      expected** (12 before, minus the ALIAS, plus A and AAAA).
4. **Pages custom domain** → apex:
   `gh api repos/Fairytails123/groomingwebsite/pages -X PUT -f cname=fairytailsdoggrooming.co.uk`
   (www auto-301s to apex — same direction as the old WordPress). Cert: 5–30 min, allow 24 h.
   Poll `gh api repos/Fairytails123/groomingwebsite/pages --jq '.https_enforced,.status'`;
   when issued: `-X PUT -F https_enforced=true`.
   ⚠️ Expect transient 404s ≤10 min (Pages edge cache `max-age=600`) — do NOT panic-rollback
   on 404-only symptoms in the first 10 minutes.
5. **Verify** (PowerShell):
   ```powershell
   Resolve-DnsName fairytailsdoggrooming.co.uk -Type A    -Server aster.dns-parking.com
   Resolve-DnsName fairytailsdoggrooming.co.uk -Type AAAA -Server aster.dns-parking.com
   Resolve-DnsName www.fairytailsdoggrooming.co.uk -Type CNAME -Server aster.dns-parking.com
   Resolve-DnsName fairytailsdoggrooming.co.uk -Type A -Server 1.1.1.1
   Resolve-DnsName fairytailsdoggrooming.co.uk -Type MX  -Server aster.dns-parking.com   # unchanged!
   Resolve-DnsName fairytailsdoggrooming.co.uk -Type TXT -Server aster.dns-parking.com   # SPF intact!
   curl.exe -sI https://fairytailsdoggrooming.co.uk/      # expect Server: GitHub.com, 200
   curl.exe -sI https://www.fairytailsdoggrooming.co.uk/  # expect 301 → apex
   npm run verify-urls -- --live
   ```
6. **SEO flip**: GSC → submit `https://fairytailsdoggrooming.co.uk/sitemap-index.xml` (NEW
   hyphenated path; Yoast's was `sitemap_index.xml`); URL-Inspection → Request Indexing on
   `/`, `/services/`, `/contact/`. NO Change-of-Address (same domain). Google Business
   Profile: verify the website link resolves — do not edit it.

## Post-flip monitoring

- **+1 h / +4 h / +24 h / +48 h**: all-URL status sweep (`npm run verify-urls -- --live`);
  email round-trip test on the Hostinger mailbox (check SPF/DKIM pass in Gmail "Show original");
  EnquiryForm submit → n8n execution check (`n8n_executions`, wf `TpQFGJy87KIKGflV`);
  test JotForm booking opens; GSC crawl stats; cert issuer = Let's Encrypt.
- **Weekly ×4**: GSC coverage/404s/canonicals (watch `/services-2/` drop out, `/services/`
  retain); Ahrefs keywords vs `docs/seo-baseline/` exports.

## Rollback (trigger: cert stall >24 h with booking impact · sustained 404s past cache window · ANY email failure)

⚠️ **The "ANY email failure" trigger is obsolete for THIS domain.** There are zero mailboxes on
`fairytailsdoggrooming.co.uk`; all five Hostinger mailboxes are on `thefairytails.co.uk`, a zone
this flip never touches, and the site publishes `info@thefairytails.co.uk`. The flip cannot break
salon email. (Owner ruling 2026-08-08: no mailbox is wanted on the grooming domain.)

Surgical (preferred — protects TXTs added since):
1. **In the hPanel DNS UI** — delete the `@` A ×4 and `@` AAAA ×4 records.
   🔴 **NOT** `DNS_deleteDNSRecordsV1` — see the step-3 warning; it has no name/type filter and
   can wipe the zone. This applies to the rollback path just as much as to the flip, and you will
   be reaching for it under pressure, which is exactly when the wrong call gets made.
2. In the same edit, re-add `@` ALIAS `fairytailsdoggrooming.co.uk.cdn.hstgr.net.` (TTL 300).
   Then `www` CNAME → `www.fairytailsdoggrooming.co.uk.cdn.hstgr.net.` (TTL 300), which IS safe
   via `DNS_updateDNSRecordsV1` `overwrite:true`.
   — values in `docs/seo-baseline/dns-pre-flip-2026-08-08.json` → `SURGICAL_ROLLBACK_VALUES`.
Propagation ~5–10 min at TTL 300. WordPress never stopped serving — zero work on its side.

Blunt fallback: `DNS_restoreDNSSnapshotV1` with ROLLBACK_SNAPSHOT_ID (restores the WHOLE zone).
⚠️ **Use the CURRENT snapshot id, not a remembered one.** As of 2026-08-08 the newest is
**`170609771`** (18:30:50Z) — and the step-3 apex write will mint another, so re-read
`DNS_getDNSSnapshotListV1` and take the newest. **Do NOT use `163366476`** (2026-07-12): it
predates the preview CNAME, the `_github-pages-challenge` TXT and the `google-site-verification`
TXT, so restoring it would delete all three — **un-verifying the GitHub domain and destroying the
GSC property mid-incident**, at the exact moment things are already going wrong. After any blunt
restore, re-add whichever of those three the snapshot lacks. LEAVE the Pages custom domain +
account verification in place (harmless, enables re-flip without redoing setup).

## WordPress decommission (earliest T+30 days)

All true: HTTPS enforced since flip · new pages indexed with apex canonicals · zero rollbacks ·
harvest re-verified (images are gone forever after deletion). Before cancelling ANYTHING:
`billing_getSubscriptionListV1` + `hosting_listWebsitesV1` — confirm email + DNS are NOT
bundled with the hosting being dropped. Delete only the WordPress website; the domain, DNS
zone and mailboxes stay at Hostinger indefinitely.
