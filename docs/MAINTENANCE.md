# Maintenance guide

## Edit facts once

Change `src/data/master.yaml`. Every record has a stable ID. Do not repurpose an ID for a different job or achievement. Preserve source evidence for new facts and update `updatedAt`. Each `text`/role/summary supports `en` and optional `es`. Add records to projects/education as `{id: unique-id, text: {en: Verified description}}`.

Jobs have `from`/`to` in `YYYY-MM` (`to: null` means Present), role, employer and ordered bullets. Avoid deleting a referenced ID: validation names the invalid profile/reference.

## Contacts

Only commit authorised public values:

```yaml
contacts:
  phones:
    primary: "existing authorised public value"
    international: "another authorised public value"
  emails:
    professional: "name@example.com"
  addresses:
    city: "Authorised city"
    full: "Only if explicitly authorised for a PUBLIC repository"
  linkedin: "https://www.linkedin.com/in/your-profile"
  github: "https://github.com/your-profile"
```

This is a structural example, not Kevin's replacement data. Each profile selects keys or `none`: `phone: primary`, `phone: international`, `phone: none`; similarly for emails. Address is `city`, `full` or `none`. A missing selected value fails validation. `linkedin: false` / `github: false` omits links. Never use hidden entries as private storage.

## Full new-CV example

The complete reusable configuration lives in `templates/solution-architect.md`. To create it without changing components or routes:

```bash
cp templates/solution-architect.md src/content/cvs/solution-architect.md
```

Edit that file: set `published: true`, use a verified target title/description, increment/version the profile and update its ISO `updatedAt` date. The template already has complete valid Master references. Its initial `published: false` is intentional. The filename generates `/cv/solution-architect/` and `pdfs/kevin-valdivieso-solution-architect.pdf`, both under the configured Pages base.

For example, select and reorder existing facts:

```yaml
experience:
  include: [bravent, alten]
  bullets:
    bravent: [bravent-2, bravent-1]
    alten: [alten-1, alten-2]
skills:
  include: [d365, azure, dataverse, agile]
  first: [azure, d365]
```

Omitting a selected job from `bullets` includes all its bullets in Master order. An explicit empty array displays none. Job order follows `include`; priority skills precede the remaining selected skills. Technical/functional categories render separately: move `functionalSkills` earlier in `sectionOrder` to prioritise that section.

`sections` toggles each section. Empty collections have no heading. `sectionOrder` must contain every enabled section exactly once. Use `projects`, `education`, `certifications`, `languages` ID arrays for selection. `print.showPhoto` controls the photo on both the web document and PDF. `print.format` is A4; `maxPages` can be 1–20. Changing `maxPages` never truncates content.

After the closing frontmatter delimiter, optionally write a short Markdown summary supported by your real experience; leave blank to use the Master summary. HTML and unsafe links are sanitised. Avoid storing repeated job details in the summary.

Run `npm run verify`. Commit the Markdown plus any new shared facts, open a PR toward `master`, wait for checks, review the CVs and merge when ready. A new file is discovered for the home, route and PDF automatically. Set `published: false` to remove all three on the next clean build.

## English / Spanish

For a Spanish profile, copy a config to a distinct slug such as `technical-lead-es.md`, give it a unique `id`, set `language: es`, translate title/description/body and add `es` text for every selected job, bullet, skill and other record. Missing selected translations fail validation. Labels and month names follow the language. No component changes are needed.

## Validate, print and export

```bash
npm ci
npx playwright install --with-deps chromium
npm run validate
npm run build
npm run export:pdf
npm test
npm run test:site
npm run test:discovery
```

`Print / Save as PDF` opens the browser print dialog; use A4 and turn browser headers/footers off. Automated PDFs use the same HTML and print CSS with 12 mm margins. `Download PDF` serves the generated file from the site. A PDF must have valid signature, selectable matching document text, A4 pages, clickable links and page count within its configured budget. Long CVs fail with a clear message; reduce selected material or increase the explicit budget.

## Publish safely

The workflow is `.github/workflows/deploy.yml`. PRs run checks and artifact generation only. Merging to `master` triggers deployment after tests. Before the first deployment, verify Settings → Pages → Build and deployment → Source is **GitHub Actions**, and check environment protections allow `master`. Changing from branch-based publishing replaces that mechanism, so do it only when ready to adopt the new site. Do not point Pages at the repository root as the new build output lives in `dist`.

No automatic merge is configured. A deployment URL is not considered verified until Actions completes and the published home/CV/PDF can be checked. The task did not change Pages settings.

## History and recovery

```bash
git log -- src/data/master.yaml src/content/cvs/technical-lead.md
git show <commit>:src/content/cvs/technical-lead.md
git switch -c restore-cv-review
git restore --source=<commit> -- src/content/cvs/technical-lead.md src/data/master.yaml
```

Restore all referenced shared records as needed, validate, and open a PR; restoring only an old config against new Master IDs may fail. For an exact historical snapshot use a separate worktree at the original commit, install its lockfile (`npm ci`), build and export with its documented Node/Chromium versions. Text/layout should be reproducible; PDF binary hashes may differ due to rendering metadata/platform fonts. For immutable delivery copies retain release PDFs manually at meaningful milestones, not every commit. Tags such as `cv-v1.0.0` identify reviewed snapshots; no tag is created automatically.
