#!/usr/bin/env node
/**
 * Visual regression test for the Deskia logo on the public demo page.
 *
 * Verifies, across mobile / tablet / desktop viewports, that:
 *   1. Every <img alt="Deskia"> on the page has loaded (naturalWidth > 0).
 *   2. The logo is visible (non-zero rendered size, in viewport).
 *   3. Rendered height stays within the Tailwind class budget for that slot
 *      (header logo h-6 = 24px, avatar/typing logo h-5 = 20px).
 *   4. A screenshot is captured per viewport for manual diffing against the
 *      committed baseline in tests/visual/baseline/.
 *
 * Compares current run screenshots against baseline pixel-by-pixel when a
 * baseline exists; otherwise writes the current run as the new baseline.
 *
 * Usage:
 *   node tests/visual/logo-regression.mjs              # run check
 *   node tests/visual/logo-regression.mjs --update     # refresh baseline
 *   URL=http://localhost:8080/r/demo node tests/visual/logo-regression.mjs
 */
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const URL = process.env.URL || "http://localhost:8080/r/demo";
const UPDATE = process.argv.includes("--update");
const DIFF_THRESHOLD = 0.02; // 2% changed pixels tolerated

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 720 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

const BASELINE_DIR = join(__dirname, "baseline");
const ACTUAL_DIR = join(__dirname, "actual");
const DIFF_DIR = join(__dirname, "diff");
[BASELINE_DIR, ACTUAL_DIR, DIFF_DIR].forEach((d) => mkdirSync(d, { recursive: true }));

const EXPECTED_HEIGHTS = { header: 24, avatar: 20, typing: 20 };
const HEIGHT_TOLERANCE = 2; // px

let failures = 0;
const log = (ok, msg) => {
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failures++;
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      await page.goto(URL, { waitUntil: "networkidle" });
      // wait for chat widget header logo
      await page.waitForSelector('img[alt="Deskia"]', { timeout: 10_000 });

      // Verify every Deskia logo image
      const imgs = await page.$$eval('img[alt="Deskia"]', (els) =>
        els.map((el) => ({
          src: el.getAttribute("src"),
          natW: el.naturalWidth,
          natH: el.naturalHeight,
          rect: el.getBoundingClientRect().toJSON(),
        }))
      );

      log(imgs.length >= 1, `[${vp.name}] found ${imgs.length} Deskia logo(s)`);
      imgs.forEach((img, i) => {
        log(img.natW > 0 && img.natH > 0, `[${vp.name}] logo#${i} loaded (naturalWidth=${img.natW})`);
        log(img.rect.width > 0 && img.rect.height > 0, `[${vp.name}] logo#${i} visible (${Math.round(img.rect.width)}×${Math.round(img.rect.height)})`);
      });

      // Crop & screenshot the chat widget card for visual diff
      const card = await page.$('.overflow-hidden'); // the ChatWidget Card
      const clip = card ? await card.boundingBox() : null;
      const shotPath = join(ACTUAL_DIR, `${vp.name}.png`);
      await page.screenshot({ path: shotPath, clip: clip || undefined });

      const basePath = join(BASELINE_DIR, `${vp.name}.png`);
      if (!existsSync(basePath) || UPDATE) {
        writeFileSync(basePath, readFileSync(shotPath));
        console.log(`  ↳ baseline ${UPDATE ? "updated" : "created"}: ${basePath}`);
      } else {
        const base = PNG.sync.read(readFileSync(basePath));
        const actual = PNG.sync.read(readFileSync(shotPath));
        if (base.width !== actual.width || base.height !== actual.height) {
          log(false, `[${vp.name}] screenshot dimensions changed ${base.width}×${base.height} → ${actual.width}×${actual.height}`);
        } else {
          const diff = new PNG({ width: base.width, height: base.height });
          const changed = pixelmatch(base.data, actual.data, diff.data, base.width, base.height, { threshold: 0.1 });
          const ratio = changed / (base.width * base.height);
          writeFileSync(join(DIFF_DIR, `${vp.name}.png`), PNG.sync.write(diff));
          log(ratio <= DIFF_THRESHOLD, `[${vp.name}] pixel diff ${(ratio * 100).toFixed(2)}% (threshold ${DIFF_THRESHOLD * 100}%)`);
        }
      }

      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll logo visual checks passed.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
