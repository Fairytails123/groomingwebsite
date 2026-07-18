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
- [ ] `docs/seo-baseline/` committed (dns-pre-flip.json, yoast-meta, Ahrefs exports)
- [ ] Hostinger mailbox send+receive test passed TODAY (pre-flip baseline)
- [ ] Harvest archive re-verified (insurance before any WP decommission later)

## Flip sequence

1. **Snapshot**: `DNS_getDNSRecordsV1` → diff against `docs/seo-baseline/dns-pre-flip.json`;
   `DNS_getDNSSnapshotListV1` → note newest snapshot id as ROLLBACK_SNAPSHOT_ID.
2. **Site config PR**: set `public/CNAME` to `fairytailsdoggrooming.co.uk`; set repo Actions
   variable `INDEXABLE=true` (`gh variable set INDEXABLE -b true -R Fairytails123/groomingwebsite`);
   push; wait for green deploy. (Robots + meta flip automatically; preview URL keeps working
   until the domain is swapped in step 4.)
3. **DNS flip** (Hostinger MCP; NEVER `DNS_resetDNSRecordsV1`):
   a. `DNS_validateDNSRecordsV1` dry-run with the new records.
   b. `DNS_deleteDNSRecordsV1`: ONLY name `@`, type `ALIAS`.
   c. Immediately `DNS_updateDNSRecordsV1` (overwrite true for @A/@AAAA/www only):
      - `@` A: 185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153 (TTL 300)
      - `@` AAAA: 2606:50c0:8000::153 · 8001::153 · 8002::153 · 8003::153 (TTL 300)
      - `www` CNAME: `fairytails123.github.io.` (TTL 300)
   d. `DNS_getDNSRecordsV1` post-diff: MX ×2, SPF, DMARC, DKIM ×3, autodiscover, autoconfig,
      preview CNAME, challenge/GSC TXTs — ALL byte-identical. Only `@` and `www` differ.
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

Surgical (preferred — protects TXTs added since):
1. `DNS_deleteDNSRecordsV1`: `@` A ×4 and `@` AAAA ×4.
2. `DNS_updateDNSRecordsV1`: re-add `@` ALIAS `fairytailsdoggrooming.co.uk.cdn.hstgr.net.`
   (TTL 300) + `www` CNAME `www.fairytailsdoggrooming.co.uk.cdn.hstgr.net.` (TTL 300)
   — values in `docs/seo-baseline/dns-pre-flip.json`.
Propagation ~5–10 min at TTL 300. WordPress never stopped serving — zero work on its side.
Blunt fallback: `DNS_restoreDNSSnapshotV1` with ROLLBACK_SNAPSHOT_ID (restores WHOLE zone —
re-add the GitHub challenge + GSC TXTs afterwards). LEAVE the Pages custom domain + account
verification in place (harmless, enables re-flip without redoing setup).

## WordPress decommission (earliest T+30 days)

All true: HTTPS enforced since flip · new pages indexed with apex canonicals · zero rollbacks ·
harvest re-verified (images are gone forever after deletion). Before cancelling ANYTHING:
`billing_getSubscriptionListV1` + `hosting_listWebsitesV1` — confirm email + DNS are NOT
bundled with the hosting being dropped. Delete only the WordPress website; the domain, DNS
zone and mailboxes stay at Hostinger indefinitely.
