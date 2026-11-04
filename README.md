# Kevin Valdivieso — multi-profile CV platform

One versioned Master CV, five specialised English CVs, and automatically generated A4 PDFs. Astro + TypeScript, Markdown/YAML, Zod and Playwright. No backend or paid service.

## Run locally

Node 22.12+ (Node 22 in CI):

```bash
npm ci
npx playwright install --with-deps chromium
npm run validate
npm run build
npm run export:pdf
npm test
npm run test:site
npm run test:discovery
npm run preview
```

Open the URL printed by Astro with `/KevinJoelValdiviesoOrdonez/`. `npm run dev` supports content editing; PDF links require `build` and `export:pdf` and are available in preview, not the development server. `npm run verify` runs the full release gate. PDF files are build artifacts, never committed.

## Editing

- Shared facts and public contact options: `src/data/master.yaml`.
- CV selection, order, contact visibility, sections and page budget: `src/content/cvs/*.md`.
- A file's basename is its stable route slug; `id` is its independent unique identifier.
- Optional Markdown body overrides the common summary. Leave it empty to inherit the Master summary.
- Add a profile by copying `templates/solution-architect.md` into `src/content/cvs/solution-architect.md`, editing verified selections and setting `published: true`. No routing or template edits needed.
- All inputs, including drafts, are validated. Drafts generate no public page, catalogue entry or PDF.

See [maintenance guide](docs/MAINTENANCE.md), [architecture](docs/ARCHITECTURE.md), [source audit](docs/SOURCE_AUDIT.md) and [implementation report](docs/IMPLEMENTATION_REPORT.md).

## Deployment

The workflow validates PRs and deploys only approved changes merged into **master**. Before the first deployment, check **Settings → Pages → Build and deployment → Source → GitHub Actions**. Selecting Actions changes the publishing mechanism: do this when ready to replace the legacy website. Repository settings were not changed during implementation.

The intended project URL is `https://jotakv.github.io/KevinJoelValdiviesoOrdonez/`. `site.config.mjs` is shared by Astro, templates and PDF/test servers. A custom domain requires reviewing both `site` and `base` before deployment.

All legacy files and assets remain tracked and unchanged except the Node package files and this README. Only Astro's `dist/` is deployed; legacy HTML, source data, dependency files and third-party demo sites are not copied into it.

## Privacy

This repository is public. Use **only public-authorised values**, even for hidden selectors and draft CVs. The phone already present in the original repository remains visible in Git history and source even though all initial public CVs hide it. Removing it from a rendered CV does not erase history. No new private addresses or telephone numbers were added.
