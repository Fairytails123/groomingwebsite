// Extract a poster frame from the Bruno case-study video.
// There is no ffmpeg on the build machine, so we decode the frame in a browser
// (Playwright is already a devDependency for the viewport gate).
//
// Run: node scripts/video-poster.mjs [seconds]   (default 3s in)
// In:  public/media/brunos-groom.mp4
// Out: src/assets/pages/services/brunos-groom-poster.jpg
//
// The poster matters for more than looks: it is what lets the <video> ship with
// preload="none" (a 20 MB file must never be fetched on page load) while still
// rendering something at t=0 for Googlebot and for anyone who never presses play.
//
// TWO gotchas, both hit while writing this:
//  1. A <video> pointed at file:// from an about:blank page never loads (opaque
//     origin), so we write a scratch HTML file NEXT TO the video and navigate to
//     it — same directory, same file:// origin. It also keeps the canvas
//     untainted, which toDataURL() requires.
//  2. Playwright's bundled Chromium is the open-source build with NO H.264
//     decoder, so an MP4 silently fails to load. We use the real Chrome/Edge
//     channel, which ships the proprietary codecs.
import { chromium } from 'playwright';
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const AT = Number(process.argv[2] || 3);
const MEDIA = join(process.cwd(), 'public', 'media');
const SRC = join(MEDIA, 'brunos-groom.mp4');
const SCRATCH = join(MEDIA, '__poster.html');
const OUT = join(process.cwd(), 'src', 'assets', 'pages', 'services', 'brunos-groom-poster.jpg');

writeFileSync(SCRATCH, '<!doctype html><meta charset="utf-8"><video id="v" src="brunos-groom.mp4" muted></video>');

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      const b = await chromium.launch({ channel, args: ['--allow-file-access-from-files'] });
      console.log(`using channel: ${channel}`);
      return b;
    } catch {
      /* try the next channel */
    }
  }
  throw new Error('Need real Chrome or Edge for H.264 — bundled Chromium cannot decode this MP4.');
}

const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(pathToFileURL(SCRATCH).href);

  const shot = await page.evaluate(async (at) => {
    const v = document.getElementById('v');
    await new Promise((res, rej) => {
      if (v.readyState >= 2) return res();
      v.onloadeddata = res;
      v.onerror = () => rej(new Error(`video failed to load (readyState ${v.readyState})`));
    });
    await new Promise((res) => {
      v.onseeked = res;
      v.currentTime = Math.min(at, v.duration - 0.1);
    });
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    return { url: c.toDataURL('image/jpeg', 0.82), w: v.videoWidth, h: v.videoHeight, dur: v.duration };
  }, AT);

  writeFileSync(OUT, Buffer.from(shot.url.split(',')[1], 'base64'));
  console.log(`video: ${shot.w}x${shot.h}, ${shot.dur.toFixed(1)}s`);
  console.log(`poster written: ${OUT} (frame at ${AT}s)`);
} finally {
  await browser.close();
  unlinkSync(SCRATCH);
}
