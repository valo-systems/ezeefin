# EzeeFin Digital Platform — Planning Phase
## Part 4 — Deliverable 9: Technical Architecture Plan
(covers brief §11 architecture, §12 demo mode, §13 data model, §14 API, §15 security & compliance, §19 cPanel deployment — all conceptual; no files, schemas, code or configuration created)

---

## 9.1 Frontend approach

- React 18 + TypeScript + Vite; React Router for a three-zone app: public site, `/portal`, `/admin`.
- Feature-folder structure (`features/enquiry`, `features/tracker`, `features/admin-cases`…) over type-folders; shared `ui/` design-system components.
- Forms: controlled multi-step wizards with a schema-validation library (Zod-class) shared between steps; validation schemas mirrored server-side.
- State: server-state via a query library (TanStack-Query-class) against the data-access layer; minimal global client state.
- Code-splitting per zone so the public site never ships portal/admin JS; public pages prerendered to static HTML at build time (vite-prerender-class approach) for SEO on shared hosting.
- Styling: design tokens (CSS variables) + utility or CSS-module approach; no runtime CSS-in-JS (perf on low-end devices).

## 9.2 Data-access abstraction and in-memory demo mode (§12)

Single most important architectural decision: **UI depends only on TypeScript contracts, never on mock data or PHP details.**

```text
src/data/
  contracts/   # TS interfaces + repository interfaces (EnquiryRepo, CaseRepo, DocumentRepo…)
  mock/        # in-memory implementations + synthetic seed dataset
  api/         # fetch-based implementations calling the PHP API
```

- Selected by `VITE_DATA_MODE=mock | api` at build time via a single provider/factory; nothing else in the app knows which mode is active.
- **Demo mode plan:** fully interactive — submit enquiries (stored in memory), watch a scripted case advance through statuses ("simulate next step" control), upload stub documents (name captured, bytes discarded), select vehicle options, exchange canned messages; admin dashboard browsable with realistic pipeline. Simulated-only: authentication (one-click demo login), notifications (rendered as on-screen toasts, not sent), file storage. A persistent "Demonstration — sample data only" ribbon on every screen. **Never any real customer data** — synthetic dataset of ~12 leads, ~8 customers, ~10 cases across all statuses, 3 fleet enquiries, quotes, tasks, messages, 3 staff personas, invented names/numbers (0xx 000-prefix style), placeholder vehicle images.
- Transition to production = implementing the same repo interfaces in `api/` and flipping the env var; demo mode is retained forever as a sales/training tool and for UI tests.

## 9.3 Backend approach (PHP 8+, cPanel-compatible)

- Plain, dependency-light PHP 8.2+ REST-ish JSON API (no heavy framework; a micro-router + PSR-inspired layering keeps cPanel deploys trivial): `index.php` front controller → router → middleware (auth, CSRF, rate-limit, logging) → controllers → services (business rules) → repositories (PDO) → MySQL.
- PDO with prepared statements exclusively; DB credentials in a config file **above** `public_html` (or an untracked config outside the API web root with deny rules).
- Server-side validation mirrors frontend schemas; every mutation writes an `audit_logs` row; JSON errors with stable codes.
- File uploads: stored outside the web root (or in a `.htaccess`-denied storage dir), random opaque filenames, MIME + extension allow-list (PDF/JPG/PNG), size caps, served only through an authenticated PHP download endpoint — never direct URLs.

## 9.4 Authentication approach

- **Staff:** email + strong password (password_hash/argon2id), server-side sessions (httpOnly, Secure, SameSite=Lax cookies), login rate-limiting + lockout, optional TOTP later. Roles: consultant, admin.
- **Customers:** passwordless — case reference + OTP sent to the verified mobile/email, or signed magic links; short-lived sessions. Rationale: this audience will not maintain passwords for a weeks-long process; OTP matches WhatsApp-era expectations and reduces credential-storage risk.
- CSRF tokens on all state-changing requests (session-bound); no JWT-in-localStorage patterns.

## 9.5 Conceptual data model (§13)

Central object: the **case** (called "application" in the brief). Entities grouped, with demo/production need and sensitivity:

| Group | Entities | Purpose / key relationships | Demo | Prod | Sensitivity |
|---|---|---|---|---|---|
| People & access | `staff_users`, `customers`, `customer_consents` | Staff auth+roles; customer identity; immutable consent records (what was agreed, when, wording version) | ✔ (personas) | ✔ | High (PII); consents = compliance-critical |
| Intake | `leads`, `website_enquiries`, `fleet_enquiries` | Raw inbound before qualification; fleet has company fields + `fleet_vehicles` lines | ✔ | ✔ | Medium |
| Core case | `applications`, `application_status_history` | One case per vehicle need; FK to customer + assigned staff; history = append-only status trail | ✔ | ✔ | High |
| Vehicle side | `vehicle_requests`, `vehicle_options`, `vehicles`, `trade_ins`, `dealerships`, `dealership_contacts` | What the customer wants; what staff sourced (option = vehicle + dealership + price + quote doc); dealer directory | ✔ (requests/options) | ✔ | Medium |
| Finance side | `finance_applications`, `finance_status_history`, `financial_institutions` | Per-bank submissions under one case; institution directory | simplified | ✔ | **Very high** |
| Insurance/tracker | `insurance_requests`, `insurance_quotes`, `tracker_requests`, `tracker_quotes` | Quotation coordination records | simplified | ✔ | High |
| Documents | `documents`, `document_requests` | Request-then-upload model; storage pointer, type, status (requested/uploaded/verified/rejected) | stub | ✔ | **Very high** |
| Workflow | `tasks`, `appointments`, `notes` | Staff to-dos, bookings, internal notes (never customer-visible) | ✔ tasks | ✔ | Medium |
| Comms | `conversations`, `messages`, `notifications` | Case-scoped threads; notification outbox with delivery status | ✔ canned | ✔ | High |
| Governance | `audit_logs`, `users`(unified auth if preferred), `system_settings` | Append-only audit; config | — | ✔ | High |
| Content | `testimonials`, `delivery_stories`, `content_pages` | Marketing content with consent linkage (testimonial FK → consent record) | — | Future | Low–medium |

Retention concerns: finance documents and declined-case data need a defined retention schedule (client + legal to confirm; POPIA minimality); audit logs retained longest; consent records retained beyond case life.

## 9.6 Conceptual API plan (§14)

Conventions: JSON; `Authorization` via session cookie; `staff` vs `customer` guard middleware; all mutations audited; per-IP + per-account rate limits on public/auth endpoints; validation errors → 422 with field map.

| Endpoint | Purpose | User | Auth | Key request data | Notes/risks |
|---|---|---|---|---|---|
| `POST /api/enquiries` | Journey B/general enquiry intake | Public | None + CAPTCHA-alternative (honeypot/time-trap) + rate limit | contact, vehicle-found details, consent flag | Spam target — throttle hard; store consent wording version |
| `POST /api/vehicle-requests` | Journey A intake | Public | Same | vehicle prefs, budget band, contact, consent | Never accept ID/income here |
| `POST /api/fleet-enquiries` | Journey C intake | Public | Same | company, fleet lines, contact | |
| `POST /api/auth/login` / `POST /api/auth/logout` | Staff session | Staff | Credentials; lockout | email, password | Argon2id; audit both |
| `POST /api/auth/otp` + `POST /api/auth/verify` | Customer access | Customer | Reference + OTP | reference, channel, code | Enumeration-safe responses |
| `GET /api/applications/{reference}` | Customer's own case snapshot | Customer | Customer session | — | Return curated statuses only; no internal notes |
| `GET /api/applications/{id}` / `PATCH /api/applications/{id}` | Case detail / staff updates | Staff | Staff session + role + assignment | status, assignment, fields | PATCH audited with before/after |
| `GET …/{id}/status-history`, `…/tasks`, `…/documents`, `…/vehicle-options` | Case sub-resources | Staff or owning customer | Session; ownership check on every id | — | IDOR is the #1 risk — enforce object-level authz |
| `POST /api/applications/{id}/documents` | Upload against an open request | Customer | Customer session | multipart file + request id | Allow-list, size cap, store off-webroot, scan if host allows |
| `POST /api/applications/{id}/messages` | Case thread message | Both | Session | body | Sanitise output (XSS) |
| `GET /api/admin/leads`, `GET /api/admin/applications` | Pipelines | Staff | Staff | filters, pagination | |
| `POST /api/admin/vehicle-options` | Publish sourced option | Staff | Staff | vehicle, dealership, price, quote ref | Customer notified on publish |
| `PATCH /api/admin/tasks/{id}` | Task workflow | Staff | Staff | status/assignee | |

## 9.7 Security & compliance plan (§15)

**Application security:** HTTPS forced (AutoSSL); argon2id password hashing; session security as §9.4; CSRF tokens; output encoding + CSP against XSS; prepared statements everywhere (SQLi); object-level authorization on every resource; upload hardening as §9.3; brute-force throttling; security headers (HSTS, X-Content-Type-Options, frame-ancestors); secrets outside web root; error detail suppressed in production, logged privately; append-only audit trail; scheduled MySQL + file backups via cPanel with periodic offsite copies; documented access-revocation and incident checklist (who to notify, POPIA Information Regulator thresholds).

**POPIA plan:** lawful-basis mapping per field; explicit, versioned, timestamped consent at each collection point; minimality (public forms collect the least; sensitive data deferred to authenticated portal); purpose limitation stated in the privacy notice; data-subject access/correction/deletion handled via defined staff process; operator agreements for hosting and any third parties; retention schedule per entity (client/legal to set); Information Officer named. **PAIA:** private-body manual, template-based — legal review.

**Demo vs production split:**

| Requirement | Public demo | Production |
|---|---|---|
| Real personal data | **Forbidden** — synthetic only | Yes, under POPIA controls |
| Auth | Simulated | Full (staff pw + customer OTP) |
| HTTPS | Yes (hosting default) | Yes + HSTS |
| Documents | Stubs, bytes discarded | Encrypted-at-rest ideal (see cPanel caveat), off-webroot mandatory |
| Audit/backup/incident | N/A | Mandatory |
| Legal pages | Draft placeholders labelled | Reviewed + published |

**Needs legal review:** NCA/FAIS positioning (blocking for wording), privacy notice, PAIA manual, retention schedule, testimonial/photo consent wording. **Needs client confirmation:** partner naming, fees disclosure, Information Officer. **Hard on shared cPanel:** at-rest encryption, WAF, proper virus-scanning of uploads, guaranteed log retention, fine-grained backup control — mitigations: minimise stored sensitive data, shortest workable retention, consider upgraded hosting tier at production if volume justifies.

## 9.8 cPanel deployment plan (§19)

```text
public_html/
  index.html + assets/        # React static build (public site + portal + admin bundles)
  .htaccess                   # SPA fallback rewrites; HTTPS redirect; cache headers; gzip/brotli
  api/
    index.php                 # front controller (all /api/* rewritten here)
    config/ (denied)          # or config above public_html — preferred
    controllers/ services/ repositories/ middleware/
    storage/ (denied, or above web root)
```

- Apache rewrites: `/api/*` → `api/index.php`; everything else without a file-extension → `index.html`; deny rules for `config/`, `storage/`, dotfiles.
- Environment: per-environment config file (dev/demo/prod) outside VCS; DB credentials via cPanel-created MySQL user with least privilege.
- CORS: same-origin by design (SPA + API on one domain) → effectively no CORS surface; keep it that way.
- Caching: hashed asset filenames + long-lived immutable cache headers; HTML no-cache.
- Pipeline: build locally/CI → upload `dist/` + `api/` via cPanel Git deploy or SFTP → run SQL migrations manually/via migration script runner → smoke-test checklist. Rollback = previous build folder swap + migration down-scripts (migrations kept small and reversible).
- Database: versioned migration files + seed scripts (demo seed ≠ prod seed); nightly cPanel backup job + weekly offsite download.
- Demo reset: a guarded script/endpoint that truncates and reseeds the demo database (demo hosted on a subdomain, e.g. `demo.ezeefin.co.za`, never sharing a DB with production).

## 9.9 Key technical risks and trade-offs

1. **Hosting access unknown** — current site 403s; registrar/cPanel control must be recovered before anything ships. (Top project risk.)
2. **SPA SEO on shared hosting** — mitigated by build-time prerendering of public pages; trade-off: slightly more build complexity, no server rendering needed.
3. **No framework backend** — trade-off: more hand-rolled plumbing vs. guaranteed cPanel compatibility and zero-dependency deploys; acceptable at this scale.
4. **Shared-hosting security ceiling** — documented mitigations above; escalate hosting tier if production volume/sensitivity grows.
5. **Staff adoption** — the portal's honesty depends on staff updating statuses; mitigate with a dead-simple admin UI and WhatsApp-fast interactions.
6. **Two data modes drifting** — mitigate with shared contracts + a contract test suite that runs against both implementations.

**Recommended implementation order:** contracts + design system → public site (mock) → Journey forms (mock) → customer tracker (mock) → admin demo (mock) → client sign-off → PHP API + MySQL behind the same contracts → auth → documents → notifications → hardening → launch.
