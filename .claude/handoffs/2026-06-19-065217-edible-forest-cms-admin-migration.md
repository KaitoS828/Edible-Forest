# Handoff: Edible-Forest Admin/CMS Migration

## Session Metadata
- Created: 2026-06-19 06:52:17 JST
- Project: /Users/sekimotokaito/Edible-Forest
- Branch: main
- Current git state at handoff creation: clean working tree except this handoff file
- Session duration: multi-turn implementation session across admin UI, auth, CMS migration, import, verification, commit, and push

### Recent Commits
- 3d22ab2 feat(cms): migrate content management to Firestore
- 55b0f00 feat(admin): expand management console
- 867ad75 feat(membership): update member management workflows
- 4622239 merge: 会員サイト化(CMS/認証/メルマガ)＋6/13確定スキーマ実装
- f4bb854 feat: 6/13確定スキーマ実装 — 会員種別/登録2分岐/イベント/施設審査

## Handoff Chain

- Continues from: None
- Supersedes: None

## Current State Summary

The project has been moved from a microCMS-driven public content model to a Firestore-backed internal CMS model controlled from the Next.js admin console. Admin UI was redesigned into a left-sidebar console, admin login was switched to email/password-only via NextAuth Credentials + Firebase Admin custom claims, and admin-only editing was added for members, ensembles, lodging spots, fixed CMS pages, and reports. Existing microCMS content was imported into Firestore successfully, then the migration was committed and pushed to origin/main. Local dev server is running at http://localhost:3000.

## Important Context

The current source of truth for CMS content is Firestore, not microCMS. Public pages read through `src/lib/cms.ts`, which intentionally preserves microCMS-like view shapes so the existing public UI did not need a large refactor. The latest pushed commit is `3d22ab2`; Vercel should deploy from `origin/main`. Existing microCMS data was imported successfully into Firestore with preserved content IDs: `cmsPages` 2 docs, `ensembles` 2 docs, `spots` 1 doc, and `reports` 5 docs. Do not reintroduce the microCMS SDK; the only remaining microCMS references are the import script and explanatory text.

## Immediate Next Steps

1. Check the Vercel deployment for commit `3d22ab2` and confirm production environment variables are present.
2. Verify production admin routes: `/admin`, `/admin/cms/pages`, `/admin/reports`, `/admin/ensembles`, and `/admin/spots`.
3. Verify public production routes after deployment: `/`, `/concept`, `/ensembles`, `/spots`, and `/reports`.
4. If production points to a different Firebase project than local, rerun the import script with production Firebase Admin credentials.
5. Add ISR revalidation secret/signature validation before treating `/api/revalidate` as production-safe.

## Codebase Understanding

### Architecture Overview

- Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- Public site now reads CMS content through `src/lib/cms.ts`, not the removed microCMS client.
- Storage of CMS content is Firestore via Firebase Admin SDK:
  - `cmsPages` for top/concept fixed-page content.
  - `ensembles` for ensemble/public local community pages.
  - `spots` for lodging/spots.
  - `reports` for activity reports.
- Admin routes are under `src/app/admin/(protected)` and are protected in `layout.tsx` by `auth()` plus `session.user.isAdmin`.
- Admin API routes are under `src/app/api/admin/*` and use NextAuth session admin checks before writing Firestore.
- Member-facing Firebase session cookie (`fb_session`) still exists for ordinary member flows. Admin auth is separate and uses NextAuth.
- Rich text editing uses TipTap via `src/components/editor/RichTextEditor.tsx`.

### Critical Files

| File | Purpose | Relevance |
|------|---------|-----------|
| `src/lib/cms.ts` | Public CMS read layer | Replaces public microCMS reads; maps Firestore docs into legacy-compatible view models. |
| `src/lib/firestore.ts` | Firestore types and CRUD utilities | Contains `CmsPageDoc`, `CmsReportDoc`, spot/ensemble/user/event/facility helpers. |
| `src/app/admin/AdminHeader.tsx` | Admin sidebar navigation | Contains dashboard, members, ensembles, spots, fixed pages, reports, facility review links. |
| `src/app/admin/(protected)/layout.tsx` | Admin route protection | Redirects non-admin users away from admin. |
| `src/app/admin/login/page.tsx` | Admin login page | Email/password-only admin login UI. No Google login. |
| `src/app/admin/(protected)/cms/pages/*` | Fixed-page CMS admin | Manages `top` and `concept` pages in Firestore. |
| `src/app/admin/(protected)/reports/*` | Report CMS admin | List/new/edit/delete reports in Firestore. |
| `src/app/admin/(protected)/spots/*` | Lodging/spots admin | Lists and edits Firestore `spots`, including `bookingUrl`. |
| `src/app/admin/(protected)/ensembles/page.tsx` | Ensemble admin list | Lists Firestore `ensembles`, links to existing edit route. |
| `src/app/api/admin/cms/pages/[pageId]/route.ts` | Admin page CMS write API | PATCH to Firestore `cmsPages/{pageId}`. |
| `src/app/api/admin/reports/*` | Admin report APIs | POST/PATCH/DELETE for Firestore `reports`. |
| `src/app/api/admin/spots/[id]/route.ts` | Admin spot API | PATCH/DELETE for Firestore `spots`. |
| `src/app/api/ensemble/[id]/route.ts` | Ensemble update API | Was tightened to require admin for PATCH. |
| `scripts/import-microcms-to-firestore.mjs` | One-off/reusable import script | Fetches microCMS pages/ensembles/reports and writes Firestore. |
| `README.md` and `PLAN.md` | Documentation | Updated from microCMS-centric to internal CMS/Firestore. |

### Key Patterns Discovered

- Server components fetch data directly from Firestore helper functions.
- Client forms submit JSON to route handlers under `/api/admin/...`.
- Admin checks use:
  - `const session = await auth()`
  - `Boolean(session?.user && (session.user as Record<string, unknown>).isAdmin)`
- Firestore writes use `FieldValue.serverTimestamp()` in app code, while import script maps microCMS date strings to `Timestamp.fromDate(...)`.
- Public pages still expect older microCMS-like shapes such as `Ensemble.title`, `heroImage.url`, `stats`, `activity`, and `Report.image.url`; `src/lib/cms.ts` preserves those shapes so UI edits stay small.
- Some Firestore timestamp fields may be real Firestore Timestamp objects or serialized/date-like values. Admin list pages now use safe local `formatDate(value: unknown)` functions.

## Work Completed

### Tasks Finished

- Admin UI changed from public-site-like UI to a more management-console style.
- Admin sidebar added with:
  - Dashboard
  - 会員管理
  - アンサンブル管理
  - 宿泊施設管理
  - 固定ページCMS
  - 活動レポート管理
  - 施設審査
- Admin login redesigned to match new admin UI.
- Admin login is email/password-only; Google login removed from admin.
- Admin access restricted to Firebase accounts with `admin: true` custom claim.
- Admin-capable account was created in Firebase Auth during the session. Do not store its password in repo or handoff.
- Member management README/project report work was completed earlier.
- Admin ensemble management page added at `/admin/ensembles`.
- Admin lodging management added at `/admin/spots` and `/admin/spots/[id]`.
- Admin spot edit API added at `/api/admin/spots/[id]`.
- Existing ensemble PATCH API now requires admin.
- Public content reads were switched from the former microCMS import path to `@/lib/cms`.
- `microcms-js-sdk` dependency removed from package.json/package-lock.
- Removed the old microCMS client file.
- Removed the old microCMS seed script.
- New internal CMS admin pages added:
  - `/admin/cms/pages`
  - `/admin/cms/pages/[pageId]`
  - `/admin/reports`
  - `/admin/reports/new`
  - `/admin/reports/[id]`
- Admin APIs added:
  - `/api/admin/cms/pages/[pageId]`
  - `/api/admin/reports`
  - `/api/admin/reports/[id]`
- Import script added:
  - `npm run import:microcms:dry-run`
  - `npm run import:microcms`
- microCMS import executed successfully into Firestore:
  - `cmsPages`: 2
  - `ensembles`: 2
  - `spots`: 1
  - `reports`: 5
- Changes were committed and pushed:
  - `55b0f00 feat(admin): expand management console`
  - `3d22ab2 feat(cms): migrate content management to Firestore`

### Files Modified Or Added In Latest Commit

| Area | Changes | Rationale |
|------|---------|-----------|
| `src/lib/cms.ts` | New public CMS read adapter | Remove app dependency on microCMS SDK while keeping UI view models stable. |
| `src/lib/firestore.ts` | Added CMS page/report types and CRUD | Provide internal CMS data operations. |
| `src/app/admin/(protected)/cms/pages/*` | New fixed page CMS UI | Let admin edit top/concept content in Firestore. |
| `src/app/admin/(protected)/reports/*` | New report CMS UI | Let admin create/edit/delete reports. |
| `src/app/api/admin/cms/pages/*` | New page write API | Admin-only Firestore writes. |
| `src/app/api/admin/reports/*` | New report write/delete APIs | Admin-only Firestore writes/deletes. |
| `scripts/import-microcms-to-firestore.mjs` | New import tool | One-off and repeatable migration from microCMS to Firestore. |
| `package.json` | Added import scripts; removed SDK dependency | Keep migration runnable while removing runtime SDK dependency. |
| Public pages | Imports changed from the former microCMS path to `@/lib/cms` | Public UI now reads internal CMS. |
| README/PLAN | Updated docs | Reflect current Firestore internal CMS architecture. |

### Decisions Made

| Decision | Options Considered | Rationale |
|----------|-------------------|-----------|
| Firestore is now the canonical CMS data source | Keep microCMS, dual-read, or migrate fully | User requested no microCMS and admin-managed self-hosted CMS behavior. |
| Preserve microCMS-like view types in `src/lib/cms.ts` | Refactor all public UIs or add adapter | Adapter minimized UI churn and reduced migration risk. |
| Keep microCMS import script despite removing SDK | Delete all microCMS references or keep import-only script | Needed a repeatable bridge for existing content. Script uses `fetch`, not SDK. |
| Use original microCMS content IDs as Firestore doc IDs | Generate new IDs or preserve IDs | Preserving IDs reduces public URL breakage. |
| Reports fallback to static `src/data/reports.ts` when Firestore reports are empty | Empty reports or fallback data | Prevents public reports page from going blank in fresh environments. |
| Admin pages use JSON APIs rather than Server Actions | Server Actions or route handlers | Existing project patterns already use route handlers for admin/member writes. |
| Do not store secrets in docs/handoff | Include full credentials or env names only | Security and repo safety. |

## Pending Work

### Immediate Next Steps

1. Check Vercel deployment for commit `3d22ab2` and confirm production has required env vars.
2. In production admin, verify `/admin`, `/admin/cms/pages`, `/admin/reports`, `/admin/ensembles`, and `/admin/spots`.
3. Confirm imported content looks correct on public pages: `/`, `/concept`, `/ensembles`, `/spots`, `/reports`.

### Blockers/Open Questions

- Production Firebase/Vercel env vars must be correct. If production uses different Firebase project than local, run the import against production Firebase credentials too.
- The admin account created locally/session-side must exist in the Firebase project used by production and have custom claim `admin: true`.
- It is unknown whether Vercel has `MICROCMS_SERVICE_DOMAIN` and `MICROCMS_API_KEY`. Runtime no longer needs them, but the import script does if re-run.
- On-demand revalidation `/api/revalidate` still has TODO security around secret/signature validation.
- `NEXT_PUBLIC_SITE_URL` and Stripe/Benchmark env vars should be checked before production use, but they were not part of this migration.

### Deferred Items

- Rich media upload in fixed-page/report admin forms. Current forms accept image URLs; spot/member forms already use Firebase Storage upload patterns.
- Full visual QA in browser. HTTP/build checks passed; in-app browser plugin was unstable/timed out during parts of the session.
- More polished CMS editing UX: preview, autosave, draft preview, slug management, image picker, and content validation.
- Report import currently maps one category string from microCMS. If multi-category taxonomy is needed, extend schema/UI.
- Region mapping for imported microCMS ensembles/spots currently uses `sub` as region fallback. Consider adding explicit region fields or migration cleanup.

## Context For Resuming Agent

### Important Context

- The repository path is `/Users/sekimotokaito/Edible-Forest`, not the projectless Codex cwd.
- Latest pushed branch is `main`.
- Latest pushed commit is `3d22ab2 feat(cms): migrate content management to Firestore`.
- Working tree was clean after push; this handoff file is newly created after that push and may be untracked unless committed separately.
- The user wants a large self-hosted CMS-style admin where anything previously editable through microCMS is editable from admin.
- That migration is now functionally started and first-phase complete: public content imports `@/lib/cms`.
- microCMS SDK dependency was removed. Remaining `microCMS` string references are intentional: import script/env names and explanatory notes.
- Existing microCMS data was imported into Firestore using `npm run import:microcms`. Successful output showed 2 pages, 2 ensembles, 1 spot, 5 reports.
- A failed first import wrote some docs before stopping on an undefined report image. Script was fixed to strip undefined and rerun successfully. Because writes use `set(..., merge: true)`, rerun is safe/idempotent for same IDs.
- Build failed once because admin list pages called `.toDate()` on values that could be serialized/non-Timestamp. Fixed with local `formatDate` helpers in:
  - `src/app/admin/(protected)/page.tsx`
  - `src/app/admin/(protected)/ensembles/page.tsx`
  - `src/app/admin/(protected)/spots/page.tsx`
- After fix, `npm run build` succeeded.

### Assumptions Made

- Firestore should be canonical CMS storage going forward.
- microCMS content IDs should be preserved as Firestore document IDs.
- Admin route protection with NextAuth `isAdmin` is acceptable for production.
- Firebase Storage should be used later for image upload enhancements, but URL input is acceptable for first CMS migration.
- Static reports fallback is acceptable only as a safety fallback for empty Firestore, not as the long-term source of truth.

### Potential Gotchas

- Do not reintroduce `microcms-js-sdk`; import script uses raw fetch by design.
- Do not commit `.env.local` or real admin passwords/API keys.
- Vercel production needs `AUTH_SECRET` and Firebase Admin env vars, or admin auth/Firestore reads will fail.
- If running import against production, confirm the Firebase Admin env vars point to the intended production project.
- The import script requires `MICROCMS_SERVICE_DOMAIN` and `MICROCMS_API_KEY`; these may exist locally but not on Vercel.
- The admin account password was shared during prior work but must not be placed in repo/handoff.
- Some public routes are statically generated with `revalidate = 60`; after CMS writes, changes may take up to a minute or need revalidation.
- `npm run build` emits a workspace-root warning because multiple lockfiles exist under `/Users/sekimotokaito`. It does not fail the build.
- Browser plugin/in-app browser was unreliable in this session; prefer `curl`, `npm run build`, and manual browser QA if automation fails.

## Environment State

### Tools/Services Used

- GitHub remote: `https://github.com/KaitoS828/Edible-Forest`
- Vercel is expected to deploy from `origin/main`.
- Firebase Auth/Admin/Firestore/Storage.
- NextAuth v5 for admin auth.
- Benchmark Email integration exists but was not deeply changed in latest CMS commit.
- Stripe integration exists but was not changed in latest CMS commit.
- TipTap editor for rich text fields.

### Active Processes

- Local dev server is running at `http://localhost:3000`.
- Codex exec session id at time of handoff: `62423`.
- Do not stop the dev server unless user asks. User explicitly asked earlier to keep it running.

### Environment Variables

Names only; no secrets are stored here.

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `AUTH_SECRET`
- `MICROCMS_SERVICE_DOMAIN` (only needed if rerunning import script)
- `MICROCMS_API_KEY` (only needed if rerunning import script)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID`
- `BENCHMARK_API_BASE`
- `BENCHMARK_API_KEY`
- `BENCHMARK_LIST_ID`
- `BENCHMARK_CONTACT_STRUCTURE_ID`
- `BENCHMARK_FIELD_FIRSTNAME_ID`
- `BENCHMARK_FIELD_LASTNAME_ID`
- `NEXT_PUBLIC_SITE_URL`

## Verification Performed

- `npm run import:microcms:dry-run`: OK
  - Output counts: cmsPages 2, ensembles 2, spots 1, reports 5.
- `npm run import:microcms`: OK after fixing undefined stripping.
  - Same output counts.
- `npx tsc --noEmit --incremental false`: OK.
- `git diff --check`: OK.
- `npm run build`: OK after timestamp display fix.
- `curl -I http://localhost:3000/reports`: 200 OK.
- `curl -I http://localhost:3000/admin/reports`: 200 OK.
- `git status --short`: clean before handoff file creation.
- `git push origin main`: OK for commits `55b0f00` and `3d22ab2`.

## Related Resources

- Repo: `/Users/sekimotokaito/Edible-Forest`
- Handoff file: `/Users/sekimotokaito/Edible-Forest/.claude/handoffs/2026-06-19-065217-edible-forest-cms-admin-migration.md`
- Main CMS adapter: `/Users/sekimotokaito/Edible-Forest/src/lib/cms.ts`
- Firestore helpers: `/Users/sekimotokaito/Edible-Forest/src/lib/firestore.ts`
- Import script: `/Users/sekimotokaito/Edible-Forest/scripts/import-microcms-to-firestore.mjs`
- Admin fixed pages: `/Users/sekimotokaito/Edible-Forest/src/app/admin/(protected)/cms/pages`
- Admin reports: `/Users/sekimotokaito/Edible-Forest/src/app/admin/(protected)/reports`
- Admin spots: `/Users/sekimotokaito/Edible-Forest/src/app/admin/(protected)/spots`
- README: `/Users/sekimotokaito/Edible-Forest/README.md`

---

Security note for next agent: Do not add secrets, passwords, API keys, private keys, or `.env.local` values to git, comments, docs, or handoff files.
