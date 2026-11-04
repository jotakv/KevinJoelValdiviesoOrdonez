# Architecture

## Data flow

`master.yaml` + discovered Markdown frontmatter/body → strict Zod schemas → `composeCV()` → public view model → shared Astro template → static HTML → Playwright Chromium → validated PDF.

- `src/lib/schema.ts`: strict data shapes, version/date formats, global Master IDs and duplicate selection checks.
- `src/lib/load.ts`: deterministic Markdown discovery, unique CV IDs, draft validation, published filtering and catalogue ordering.
- `src/lib/compose-cv.ts`: selected contacts only, reference validation, ordered skills/jobs/bullets, localised text, section filtering and sanitised summary Markdown.
- `src/content.config.ts`: declared Astro glob collection with the same schema. The pages and standalone PDF scripts deliberately call the same filesystem loader rather than maintaining a second composition path through `getCollection()`. This keeps CLI and Astro behaviour identical.
- `src/components/CVDocument.astro`: single-column document used for browser and PDF. No full source record or config is serialised into the client.
- `scripts/export-pdfs.ts`: disposable local server mounted under the real Pages base, waits for fonts and image decoding, prints A4, checks extracted text, page count and links.
- `scripts/test-site.ts`: built-site browser checks, local resources, mobile width, print control, images, catalogue and privacy checks.
- `scripts/test-discovery.ts`: inserts a synthetic new profile and draft, rebuilds HTML/PDF, verifies discovery and exclusion, then restores sources and final artifacts in `finally`.

Only `public/images/profile.jpg` is copied from the legacy assets. Other existing assets remain available in Git for later curation. Original root files are preserved; Astro has a separate `src/pages` entry point. The old contact form is not deployed because its JavaScript only displayed a success alert and had no delivery integration.

## Configuration decisions

Stable skill IDs replace display-name references so labels can change without breaking selection. One YAML file keeps the Master atomic and easy to review; splitting it later does not require changes to the public view contract.

`updatedAt` is explicit, ISO-dated source metadata, not an unreliable filesystem mtime or build timestamp. Initial values record the actual 2026-11-04 migration. A rendered CV uses the later Master/profile update date. Editors must update the affected date when changing content; Git remains the audit trail.

`maxPages` is an enforced upper bound, not a target that silently shrinks text or truncates facts. An overlong PDF fails the release gate with its actual page count. Sections and bullets are the controls for shortening a document.

All English and Spanish labels are implemented. Spanish facts require `es` entries in selected Master texts; missing translations fail clearly. No automatic machine translation or silent English fallback is used. A Spanish CV uses its own filename/slug, `language: es` and translated title/description/summary. English content remains shared.

## Deployment boundary

PR and feature-branch runs build artifacts but cannot reach the deployment job. Only `refs/heads/master`, after all checks pass, can deploy. The deployment job alone has `pages: write` and `id-token: write`; build jobs have read-only contents. No settings update, merge or production deployment is performed by this implementation task.

## References

- https://docs.astro.build/en/guides/deploy/github/
- https://docs.astro.build/en/reference/content-loader-reference/
- https://playwright.dev/docs/api/class-page#page-pdf
