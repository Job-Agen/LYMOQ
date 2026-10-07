// Renders every job from jobs.json (written by build.py) to PNG with headless Chromium.
// Usage: node brand/source/render.mjs <jobs_dir>/jobs.json
// Needs playwright-core; set CHROMIUM_PATH to a Chromium binary if Playwright's own is not installed.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const jobs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  await page.goto('file://' + j.html);
  await page.screenshot({ path: j.png, omitBackground: j.transparent });
  await page.close();
  console.log(`${j.w}x${j.h}  ${j.png}`);
}
await browser.close();
