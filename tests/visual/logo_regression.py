#!/usr/bin/env python3
"""Visual regression test for the Deskia logo on the demo page.

Checks, across mobile / tablet / desktop viewports:
  1. Every <img alt="Deskia"> has loaded (naturalWidth > 0).
  2. The logo is visible (non-zero rendered size).
  3. Pixel-diff of the chat widget vs the committed baseline (tolerance 2%).

Usage:
    python3 tests/visual/logo_regression.py             # run check
    python3 tests/visual/logo_regression.py --update    # refresh baselines
    URL=http://localhost:8080/r/demo python3 ...        # custom target
"""
import asyncio, os, sys
from pathlib import Path
from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).parent
URL = os.environ.get("URL", "http://localhost:8080/r/demo")
# Lovable serves uploaded assets (/__l5e/*) from its CDN, not the local dev
# server, so when testing against localhost we transparently proxy those
# requests to the preview origin.
ASSET_ORIGIN = os.environ.get(
    "ASSET_ORIGIN",
    "https://id-preview--2c73aff8-1811-46af-98ee-ccd1e19e9c73.lovable.app",
)
UPDATE = "--update" in sys.argv
DIFF_THRESHOLD = 0.02  # 2% of pixels may differ

VIEWPORTS = [
    ("mobile", 375, 720),
    ("tablet", 768, 1024),
    ("desktop", 1280, 900),
]

BASELINE = ROOT / "baseline"
ACTUAL = ROOT / "actual"
DIFF = ROOT / "diff"
for d in (BASELINE, ACTUAL, DIFF):
    d.mkdir(parents=True, exist_ok=True)

failures = 0
def log(ok, msg):
    global failures
    print(("\u2713 " if ok else "\u2717 ") + msg)
    if not ok:
        failures += 1


def pixel_diff(base_path: Path, actual_path: Path, diff_path: Path) -> float:
    a = Image.open(base_path).convert("RGB")
    b = Image.open(actual_path).convert("RGB")
    if a.size != b.size:
        return 1.0
    d = ImageChops.difference(a, b)
    bbox_pixels = sum(1 for px in d.getdata() if px != (0, 0, 0))
    total = a.size[0] * a.size[1]
    # Save a visible diff (amplified)
    Image.eval(d, lambda v: min(255, v * 8)).save(diff_path)
    return bbox_pixels / total


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        try:
            for name, w, h in VIEWPORTS:
                ctx = await browser.new_context(viewport={"width": w, "height": h})
                page = await ctx.new_page()
                # Proxy /__l5e/* asset requests to the Lovable CDN.
                async def _proxy_asset(route):
                    req = route.request
                    target = ASSET_ORIGIN + req.url.split("://", 1)[1].split("/", 1)[1].replace(req.url.split("/", 3)[2], "", 1)
                    # simpler: rebuild from path
                    from urllib.parse import urlparse
                    path = urlparse(req.url).path
                    await route.continue_(url=ASSET_ORIGIN + path)
                await ctx.route("**/__l5e/**", _proxy_asset)

                await page.goto(URL, wait_until="networkidle")
                await page.wait_for_selector('img[alt="Deskia"]', timeout=10_000)
                await page.wait_for_function(
                    """() => {
                        const imgs = [...document.querySelectorAll('img[alt=\"Deskia\"]')];
                        return imgs.length > 0 && imgs.every(i => i.complete && i.naturalWidth > 0);
                    }""",
                    timeout=10_000,
                )

                imgs = await page.eval_on_selector_all(
                    'img[alt="Deskia"]',
                    """els => els.map(el => ({
                        natW: el.naturalWidth, natH: el.naturalHeight,
                        w: el.getBoundingClientRect().width,
                        h: el.getBoundingClientRect().height,
                    }))""",
                )
                log(len(imgs) >= 1, f"[{name}] found {len(imgs)} Deskia logo(s)")
                for i, im in enumerate(imgs):
                    log(im["natW"] > 0 and im["natH"] > 0,
                        f"[{name}] logo#{i} loaded (naturalWidth={im['natW']})")
                    log(im["w"] > 0 and im["h"] > 0,
                        f"[{name}] logo#{i} visible ({round(im['w'])}x{round(im['h'])})")

                card = await page.query_selector(".overflow-hidden")
                clip = await card.bounding_box() if card else None
                actual_path = ACTUAL / f"{name}.png"
                await page.screenshot(path=str(actual_path), clip=clip)

                base_path = BASELINE / f"{name}.png"
                if not base_path.exists() or UPDATE:
                    base_path.write_bytes(actual_path.read_bytes())
                    print(f"  \u21b3 baseline {'updated' if UPDATE else 'created'}: {base_path}")
                else:
                    ratio = pixel_diff(base_path, actual_path, DIFF / f"{name}.png")
                    log(ratio <= DIFF_THRESHOLD,
                        f"[{name}] pixel diff {ratio*100:.2f}% (threshold {DIFF_THRESHOLD*100}%)")

                await ctx.close()
        finally:
            await browser.close()

    if failures:
        print(f"\n{failures} check(s) failed", file=sys.stderr)
        sys.exit(1)
    print("\nAll logo visual checks passed.")


asyncio.run(main())
