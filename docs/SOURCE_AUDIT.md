# Source audit and content gaps

Audited 2026-11-04 through the GitHub connector and a local checkout of `master` at `9fdae3e47d5823ca505afee245cc349384f47a1b`.

## Repository findings

- Public repository, default branch `master`; repository metadata reports Pages enabled. Pages configuration endpoint was rejected by the connector, so the active source/custom domain could not be independently checked.
- Root `index.html`, `styles.css`, `script.js`; Node package only depended on `servor`; no existing Actions workflows or repository AGENTS.md discovered.
- Legacy directories include demo, plugins, layonerweb, css/js and images. Some contain third-party template content, so their example biographies/education were not treated as Kevin's facts.
- `images/profile.jpg` and `.png` do **not** exist in the audited commit. The live source references `d365powerplatformpowerapps.jpg`, which was visually checked and copied byte-for-byte to `public/images/profile.jpg`.
- Original `index.html` is the factual source for identity, contact options, four jobs and their dates/bullets, named technology skills, three certification/training entries and two language levels. GitHub URL uses the verified repository owner's public profile. No client names, metrics, qualifications or new job achievements were invented.
- Specification read: `arquitectura_cv_multiperfil(1).md` (2026-11-04). Its sample employers, achievements and contact placeholders were explicitly not imported as real facts.

## Editorial review needed

1. The source says Bravent September 2023–Present. Preserved as supplied; confirm the end date/current employment before sending CVs.
2. The source locates Kevin in Zürich Metropolitan Area. This was not imported as a current address; initial profiles select `address: none`.
3. No attributable education or project records in the current portfolio. These collections and schema/template support exist but remain empty and disabled initially.
4. Technical Lead and Senior Functional Consultant are requested target-profile titles, not proof of held titles. Jobs retain their exact source titles. Verified workshops, requirements gathering, leadership scope and measurable impact would strengthen those variants; none was invented.
5. Certification/training names and English “Full Professional” level are repository assertions, not independently verified credentials. No issue dates, IDs, active status or expanded credentials were invented.
6. The attached converted HTML CV was not used to override source facts: this task explicitly restricted professional facts to the repository and supplied Markdown. Reconcile newer employment/education details in a separate editorial update.
7. The original “6 years” claim was removed from the general summary rather than recalculated or updated without a confirmed scope.

## Privacy

The original portfolio already publishes a phone and email. They remain in Git source/history. Initial public pages/PDFs expose the email and social links but not the phone; the home exposes only social links. No full address is stored. Hidden config values are not passed to client JavaScript/JSON. Draft visibility protects deployed output, not the public repository.
