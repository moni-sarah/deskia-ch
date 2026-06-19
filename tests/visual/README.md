# Visual Regression — Deskia logo

Automated check that the Deskia logo renders correctly on the public demo
chat page across mobile, tablet, and desktop viewports.

## What it verifies

Per viewport (375 / 768 / 1280 px wide):

- Every `<img alt="Deskia">` is present and loaded (`naturalWidth > 0`).
- The image has non-zero rendered dimensions.
- A screenshot of the chat widget card is captured and compared
  pixel-by-pixel against the committed baseline (tolerance 2%).

Screenshots:
- `tests/visual/baseline/{mobile,tablet,desktop}.png` — committed reference
- `tests/visual/actual/*.png` — last run output
- `tests/visual/diff/*.png` — highlighted pixel differences (when mismatched)

## Run

```bash
# one-off check against the running dev server (defaults to http://localhost:8080/r/demo)
node tests/visual/logo-regression.mjs

# point at a different URL (e.g. preview deployment)
URL=https://your-preview-url/r/demo node tests/visual/logo-regression.mjs

# refresh baselines after an intentional design change
node tests/visual/logo-regression.mjs --update
```

Exits non-zero on any failure, so it slots into CI directly.

## CI

Add a job that boots the dev server, waits for `:8080`, then runs the script.
GitHub Actions example:

```yaml
- run: bun install
- run: bun run dev &
- run: npx wait-on http://localhost:8080
- run: node tests/visual/logo-regression.mjs
- if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: visual-diff
    path: tests/visual/{actual,diff}
```
