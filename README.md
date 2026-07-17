# EzeeFin Platform — Implementation (Phase 3–5 demo + Phase 6 scaffold)

React 18 + TypeScript + Vite frontend with a two-mode data layer, plus a PHP 8 / MySQL
API scaffold and cPanel deployment artefacts. Runs entirely on **synthetic data** in
demo mode — a "DEMONSTRATION" ribbon shows on every screen.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/ (a prebuilt dist/ is included)
npm run preview    # serve the built app
```

## What's inside
- `src/pages/` — public site (home, how-it-works, services, about, FAQs, contact, legal),
  Journey A/B/C multi-step forms, a five-area customer concierge portal, and a
  work-queue-driven operations portal.
- `src/data/concierge.ts` — shared customer/admin domain contracts, status mappings,
  synthetic account data, browser-persisted mock repositories, and the integration event
  layer used for profile verification and customer-visible journey updates.
- `/portal/*` (also available under `/customer/*`) — Home, Journey, document vault,
  Messages, Finance Passport, notification preferences, privacy, consent, and history.
- `/admin/*` — Work queues, Leads, Customers, Customer 360°, profile reviews, Cases,
  nine-tab case workspaces, Documents, Messages, Calendar, Reports, Staff, Audit, and
  Settings. Demo staff access opens the Manager workspace.
- `src/data/` — `contracts` (types.ts), `mock.ts` (in-memory repo + synthetic seed),
  `api.ts` (fetch repo for the PHP API). Switch with `VITE_DATA_MODE=mock|api` in `.env`.
- `api/` — PHP front controller, router, controllers (enquiries, auth incl. customer OTP,
  cases, documents, options, messages, admin), `config.sample.php`,
  `sql/001_schema.sql` + `sql/002_seed_demo.sql`.
- `deploy/` — root & api `.htaccess` templates and `DEPLOYMENT.md` for cPanel.
- `public/assets/` — 26 consent-safe images copied (originals untouched) under the
  approved naming scheme. People/child/number-plate images were excluded per the plan.

## Demo storyline (5 min)
Home → "Find me a vehicle" → submit → note the reference → `/admin` → open Nomvula's case
(EZ-2431) → validate and publish a stage transition or approve her income correction →
`/portal` → watch the shared journey/Profile state update, manage documents and notification
preferences, and choose a Swift option. The customer demo OTP is `2431`.

## Before production (from the planning docs)
The integrated portal experience is intentionally mock-first. Before production, complete
the MySQL expansion, server-side repository adapters, mobile OTP delivery, role and
object-level authorization tests, encrypted sensitive fields, hardened document storage,
notification providers, retention jobs, backups, and the legal/POPIA review. Replace seed
hashes, set `debug => false`, and move config and encryption keys above the web root.
