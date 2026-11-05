# CV content update — source reconciliation and traceability

**Date:** 2026-11-05  
**Branch:** `feature/update-cv-content-from-templates`  
**Base:** `master`  
**Pull request:** https://github.com/jotakv/KevinJoelValdiviesoOrdonez/pull/2 (draft; review required).

## Scope and method

Reviewed all four biographical Markdown CVs and the fifth draft configuration in `templates/`, together with the existing `src/data/master.yaml`, CV profiles, composition code, schema, tests, website and CI workflow.

These are **user-authored CV assertions**, not independent employer or credential verification. Repeated statements in near-identical CV versions are not independent corroboration. This update retains factual, qualitative descriptions and avoids publishing quantitative claims that need separate validation.

The original `templates/` files remain unchanged. No underlying CV engine, public page or deployment workflow was replaced.

## Source manifest

| Source identifier | Source file | Editorial role |
| --- | --- | --- |
| F | `templates/CV_Dynamics365CE_FunctionalConsultant (1).md` | Functional summary, consulting lifecycle, jobs and education |
| L | `templates/CV_Dynamics_365_Sales_TechnicalLead (2).md` | Technical lead framing, Dynamics 365 Sales, Dataverse and ALM |
| T | `templates/CV_Kevin_MS_D365_CRM (1).md` | Functional-technical experience and earlier technical roles |
| P | `templates/Kevin_Valdivieso_Senior_D365_Power_Platform_Functional_Consultant (3).md` | Power Platform capabilities, functional delivery and education |
| D | `templates/solution-architect.md` | Unpublished configuration template only, **not** biographical evidence |
| M | Existing `src/data/master.yaml` | Existing IDs, original role names, current public contact policy |

## Master CV migration and provenance matrix

| Master record | Information incorporated | Source provenance | Reconciliation |
| --- | --- | --- | --- |
| `identity.summary` | 7+ years; Dynamics 365 CE, Power Platform, Azure; functional-technical delivery | F, L, T, P | Wording cleaned; no new client or certified status claimed |
| `freelance` | Independent consulting focus from September 2026; functional and technical service scope | F, L, T, P | Service scope described without implying signed B2B contracts or delivered freelance client outcomes |
| `bravent` | Requirements, workshops, Sales/Customer Service/Marketing, Dataverse, integrations, mentoring, ALM and support | F, L, T, P | Updated end month to Sep 2026 as in newer templates; pending confirmation |
| `alten` | Dynamics CRM migration, plug-ins, workflows, PCF/Customer Voice, SQL, SSIS/KingswaySoft, FetchXML, DevOps | F, L, T, P, M | Updated end month to Jul 2023 as in newer templates; pending confirmation |
| `everis` | .NET CRM services, web UIs, Azure WebJobs/Functions, Git/TFS and incident tooling | F, L, T, P, M | Retained original employer identifier/name; newer CVs label the employer NTT DATA, relationship needs confirmation |
| `ciemat` | Liferay, JSP/Velocity, Moodle, responsive web technologies | F, L, T, P, M | Retained existing Jul 2015 start pending June 30/July discrepancy |
| `skills` | 54 technical and functional skills, including Dataverse security, CI/CD, ALM, stakeholder and fit-gap capabilities | F, L, T, P | Consolidated to stable unique IDs and two categories |
| `education.dorset` | Bachelor of Science in Computing; Dorset College, 2023–2026 | F, L, T, P | Credential appears in sources; degree award independently unverified |
| `education.ucm` | UCM Computer Science studies, 2016–2018 | F, L, T | Recorded as studies; qualification completion **not established** |
| `education.clara-del-rey` | Higher Technician in Multiplatform Applications Development, 2014–2016 | F, L, T, P | Kept as qualification wording supplied by the CV |
| `cert-1`, `cert-3` | MCSE and MCSD references | M, F, L, T, P | Existing IDs preserved; credential verification still advised |
| `cert-2` | Introduction to Microsoft PowerPlatform | M | Retained existing training entry |
| `scrum-manager` | Scrum Master / Scrum Manager (2020) | F, L, T, P | Named as training/certification listed in CV, not externally confirmed |
| `languages` | English Full Professional and Spanish Native | M | Retained levels; unsupported conflation of Cambridge C1 and IELTS not imported |

The central record now includes five professional roles, **33 selectable role bullets**, **54 skills**, three educational records and four certification/training records. These are normalized selections rather than a verbatim copy of duplicated prose.

### Legacy ID compatibility

Existing job IDs (`bravent`, `alten`, `everis`, `ciemat`), their first three bullet IDs, the legacy skill IDs and certification IDs are retained, reducing the risk of breaking existing selectors. The new `freelance` job and additional skills use stable new IDs.

## Target-profile updates

| Profile | Previous → new | Main emphasis | Distinctive selection |
| --- | --- | --- | --- |
| `technical-lead` | 1.0.0 → 1.1.0 | Sales solution design, CRM extensions, Dataverse security, mentoring and ALM | Technical review, ALM and implementation bullets |
| `senior-functional-consultant` | 1.0.0 → 1.1.0 | Workshops, requirements, fit-gap, stakeholders, demonstrations and user stories | Functional consulting and client-facing bullets |
| `senior-technical-consultant` | 1.0.0 → 1.1.0 | C#/.NET plug-ins, Azure, SQL/SSIS, Dataverse Web API and troubleshooting | Technical extensibility and integration bullets |
| `power-platform-consultant` | 1.0.0 → 1.1.0 | Power Apps, Canvas Apps, Dataverse, Power Automate and ALM | Platform automation and governance bullets |
| `dynamics-365-ce-specialist` | 1.0.0 → 1.1.0 | Sales/Customer Service, CRM implementation, Dataverse and support | CRM functionality and post-go-live bullets |
| `solution-architect` | unchanged | Unpublished example file | `published: false` preserved; no new public route |

All five live CVs keep two-page A4 targets and the original contact selections (`phone: none`, `address: none`). They select two education entries (`dorset`, `clara-del-rey`); `ucm` stays available in the shared database but is omitted from public PDFs until the status is clarified.

## Unresolved items and withheld claims

1. **Bravent end date:** Original Master: ongoing. Recent Markdown versions: 01 Sep 2026. A Sep 2026 end month is now used based on the newer CVs; confirm against employment documentation before external circulation.
2. **ALTEN end date:** Legacy Master: Aug 2023. Recent versions: 31 Jul 2023. The updated record uses Jul 2023; confirm.
3. **everis versus NTT DATA:** Older portfolio labels the 2019–2020 position everis; newer CVs use NTT DATA. Original employer label is retained to avoid an unsupported substitution.
4. **CIEMAT start date:** Existing portfolio says Jul 2015; newer files say 30 Jun 2015. Original month is retained.
5. **Freelance service claims:** CV sources say the independent practice started Sep 2026. Offers and capabilities are described, not a proven portfolio of paying freelance clients.
6. **Measured achievements:** Source versions assert six end-to-end implementations, sub-5-second synchronisation, a ~20% reduction in deployment rework, 15 workflows, 20+ plug-ins, one million migrated records, efficiency gains and several performance metrics. These are **not independently corroborated** and have been deliberately excluded from the public Master and generated CVs pending supporting evidence.
7. **UCM degree:** Source title says "BSc Computer" but does not establish whether the degree was conferred. Recorded only as computer science studies and not selected in the five published CVs.
8. **English qualification:** The merged phrase "Cambridge English: C1 Advanced IELTS" conflates different tests. Not imported as a verified credential; the pre-existing English proficiency label was retained.
9. **Legacy certification names/status:** MCSE, MCSD and Scrum Manager references should be checked against actual certificates; no new issue dates or current validity are claimed.

## Privacy and OCR hygiene

The original CV documents contain private residential/contact details, birth date and passport/work permit statements. No new phone number, residential address, birth date, nationality or immigration data was added to `master.yaml` or the public CV configurations. The previously stored Spanish contact number remains in Git source but is not rendered by the five live profiles. Because the repository itself is public, **source/history visibility is separate from website display**. Removing information from the page does not erase it from Git history.

Removed OCR fragments (e.g. `P—CSC—‘CisSYT`) and broken markup from the normalized text.

## Validation and deployment

- **Code edit review:** Existing schema, composition logic, site pages, test scripts and GitHub Actions workflow inspected.
- **Automated regression tests:** Existing `tests/composition.test.ts` retained.
- **New automated tests:** `tests/content-updates.test.ts` checks consolidation, educational records, profile differentiation, preserved privacy selectors and exclusion of unverified numeric claims.
- **Local execution:** No local environment available; all commands were executed by GitHub Actions.
- **CI run:** [Successful GitHub Actions execution #42018154409](https://github.com/jotakv/KevinJoelValdiviesoOrdonez/actions/runs/42018154409) on commit `2cff9cadea6a3e23ab16d900193d3b4467b98fc3` (2026-11-05). All six validation/build/test gates succeeded: `validate`, `build`, `export:pdf`, `npm test`, `test:site`, `test:discovery`.
- **PDF validation:** Five generated PDFs, each two A4 pages with selectable text and three functional links. Character counts: technical lead 3,131; functional consultant 3,206; technical consultant 3,232; Power Platform 3,131; Dynamics 365 CE 3,123.
- **Automated dynamic discovery:** Test confirmed that adding an enabled Markdown profile generates a new landing and PDF while unpublished drafts stay hidden. Two legacy test fixtures required compatibility updates to account for the new curated bullet selectors and YAML formatting.
- **Publication status:** PR remains a draft; `master` and the deployed site were not updated.

## Files modified

- `src/data/master.yaml`
- `src/content/cvs/technical-lead.md`
- `src/content/cvs/senior-functional-consultant.md`
- `src/content/cvs/senior-technical-consultant.md`
- `src/content/cvs/power-platform-consultant.md`
- `src/content/cvs/dynamics-365-ce-specialist.md`
- `tests/content-updates.test.ts`
- `tests/composition.test.ts` (isolate the unknown-reference test from curated job bullets)
- `scripts/test-discovery.ts` (allow equivalent YAML whitespace in acceptance fixture)
- `docs/CV_CONTENT_UPDATE_REPORT.md`

**Review requirement:** This is a content update prepared for Pull Request review, not authorisation to merge into `master` or deploy the changed public website.
