// One-off Stage-2 behavioural checks: mobile drawer opens; contact form
// submits end-to-end from the real page (waits out the 4s spam gate).
// Run against the local preview: node scripts/stage2-checks.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4321';
const browser = await chromium.launch();

// 1. Mobile drawer
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/who-we-are/', { waitUntil: 'networkidle' });
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(600);
  const open = await page.getAttribute('[data-menu-panel]', 'aria-hidden');
  const navVisible = await page.isVisible('nav[aria-label="Mobile"] >> text=Prices');
  console.log(`drawer: aria-hidden=${open} navVisible=${navVisible} ${open === 'false' && navVisible ? 'PASS' : 'FAIL'}`);
  await page.screenshot({ path: 'shots/mobile-drawer-open.png' });
  await page.click('[data-menu-backdrop]', { position: { x: 10, y: 400 }, force: true });
  await page.waitForTimeout(600);
  const closed = await page.getAttribute('[data-menu-panel]', 'aria-hidden');
  console.log(`drawer close: aria-hidden=${closed} ${closed === 'true' ? 'PASS' : 'FAIL'}`);
  await ctx.close();
}

// 2. Contact form E2E (real webhook POST — sends ONE test email to info@)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await page.fill('#ef-name', 'TEST - on-page form check');
  await page.fill('#ef-email', 'k.singh3184@gmail.com');
  await page.fill('#ef-phone', '07000000001');
  await page.check('#ef-concern-2');
  await page.fill('#ef-message', 'TEST from the real /contact/ page via Playwright (Stage 2 gate) - please ignore.');
  await page.waitForTimeout(4500); // outlast the elapsedMs<4000 spam gate
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('grooming-enquiry'), { timeout: 15000 }),
    page.click('#enquiry-form button[type="submit"]'),
  ]);
  console.log(`webhook response: ${resp.status()}`);
  await page.waitForSelector('#ef-status:has-text("Thank you")', { timeout: 10000 });
  console.log('success message shown: PASS');
  await ctx.close();
}

await browser.close();
