# MONIEZI Raise V1.5.4 — Section Video Builder

This version extends the premium investor portal builder with section-level video uploads in addition to the V1.5.3 image upload workflow.

## Main changes

- Adds up to three videos for each major portal section.
- Video sections include business overview, opportunity / market, proof / readiness, use of funds, and process / agreement.
- Videos appear in the live portal preview and exported static investor portal HTML.
- Videos are rendered with controls, muted default behavior, playsInline, and metadata preload for mobile-friendly review.
- Builder guidance now warns owners to keep videos short and compressed because embedded videos can make exported portals large.
- Version updated to 1.5.4 and service-worker cache was bumped.

## Packaging

Source-only package. Do not include node_modules or dist. Keep .github/workflows/deploy-pages.yml included for GitHub Pages deployment.
