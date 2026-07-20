# EzeeFin Digital Platform — Planning Phase
## Part 3 — Deliverables 5–8: Product Requirements, Information Architecture, UX Plan, Design Direction

---

# Deliverable 5: Product Requirements Document

## 5.1 Vision

A concierge platform where a customer describes the vehicle they need once, and EzeeFin coordinates sourcing, finance application assistance, insurance and tracker quotations, paperwork and delivery — with the customer tracking progress in one place. Trustworthy, calm, premium, human, mobile-first, South African.

## 5.2 Goals

1. Replace the dead website with a credible public presence that converts visitors into qualified enquiries.
2. Turn every enquiry into a structured, trackable case with statuses and document checklists.
3. Reduce staff coordination overhead (WhatsApp/phone chaos → one admin portal).
4. Produce a polished demo (in-memory data) that wins client sign-off before any backend investment.
5. Stay legally safe: coordinator language only, POPIA-compliant data handling.

## 5.3 Non-goals

- No vehicle listings/marketplace, no price comparison engine, no online credit scoring or affordability calculators that constitute advice, no payments, no lending, no insurance underwriting, no real-time bank integrations, no native mobile apps (responsive web only), no multi-language at launch (English; isiZulu a future consideration).

## 5.4 User types

| User | Description | Primary interface |
|---|---|---|
| Visitor | Browsing, comparing, deciding whether to trust | Public website |
| Prospective customer | Submits Journey A/B/C enquiry | Public forms |
| Active customer | Has a case in progress; returns to check status | Customer portal |
| Fleet contact | Business buyer, possibly recurring | Public form → portal |
| Consultant (staff) | Works leads and cases daily | Admin portal |
| Admin/owner | Oversees everything, manages staff, reporting, content | Admin portal |

## 5.5 Customer problems

Repeated dealership visits; intimidating finance jargon; scattered communication across salespeople, banks, insurers and tracker installers; no visibility of progress; fear of being pressured or misled; paperwork burden; for fleets — no single accountable coordinator.

## 5.6 User journeys (detailed)

### Journey A — "Help me find and finance a vehicle"

- **User goal:** get a suitable vehicle without doing the legwork.
- **Entry points:** homepage primary CTA, "Find Me a Vehicle" page, WhatsApp/social referral, Google search.
- **Required information (minimum):** name, mobile, province/city, new/pre-owned/either, vehicle category or make/model, budget *or* target monthly instalment, contact consent.
- **Optional:** email, year range, transmission, fuel, colour, deposit, trade-in details, intended use, needed-by date, preferred contact time.
- **Decision points:** budget vs instalment framing; trade-in yes/no; proceed to finance-info stage or stay enquiry-only.
- **Staff involvement:** review lead → qualify (call/WhatsApp) → request finance info/documents → source options from dealerships → present options → customer selects → coordinate finance application → coordinate insurance + tracker → delivery.
- **Status stages (customer-facing):** Received → Under review → Sourcing options → Options ready → Finance in progress → Insurance & tracker → Preparing delivery → Delivered. (Terminal alternatives: Closed — not proceeding.)
- **Risks:** unrealistic budgets; stale leads; customers shopping the request to competitors; scope creep in preferences.
- **Failure scenarios:** finance declined (needs a dignified, private status and human follow-up — never an automated "declined" notification); no suitable vehicle found; customer unreachable.
- **Privacy:** affordability data is sensitive; collect the minimum publicly and defer financial details to the portal/secure channel.
- **Success criteria:** ≥X qualified leads/month (baseline after launch); <24h first response; customer can state their status without phoning.

### Journey B — "I already found a vehicle"

- **User goal:** finance/admin assistance for a specific vehicle.
- **Entry:** dedicated page/CTA "Found your car already?".
- **Required:** name, mobile, consent, vehicle make/model, price, seller/dealership name.
- **Optional:** listing URL, year, salesperson contact, quotation upload (defer uploads to portal if possible), trade-in.
- **Decision points:** private seller vs dealership (different admin path); customer needs insurance/tracker too?
- **Staff involvement:** review deal (sanity-check price/condition risk), collect documents, submit/coordinate finance application, offer insurance/tracker, coordinate delivery/collection.
- **Statuses:** Received → Reviewing the deal → Documents needed → Finance in progress → Insurance & tracker → Ready for handover → Complete.
- **Risks:** being blamed for a bad car chosen by the customer (needs clear wording that EzeeFin coordinates, not warrants the vehicle); private-seller fraud.
- **Failure:** deal falls through at dealer; finance declined.
- **Privacy:** quotation uploads may contain ID numbers — treat as documents, not form fields.
- **Success:** time from enquiry to finance submission; % of B-journey customers adding insurance/tracker.

### Journey C — Fleet assistance

- **User goal:** procure/renew multiple vehicles with one accountable partner.
- **Entry:** Fleet Solutions page; likely also direct sales outreach.
- **Required:** company name, contact person, phone/email, vehicle types & quantities, consent.
- **Optional:** company registration number, operating region, usage description, replacement schedule, funding preference (loan/lease/rental).
- **Decision points:** one-off purchase vs ongoing management; new vs pre-owned mix.
- **Staff involvement:** senior consultant owns fleet cases end-to-end; prepares options and funding structures with institutions.
- **Statuses:** Received → Consultation scheduled → Requirements confirmed → Options in preparation → Proposal delivered → In progress → Active fleet client.
- **Risks:** long sales cycles; commercial credit complexity beyond EzeeFin's mandate.
- **Privacy:** company data is less sensitive but director IDs may enter later — same document handling rules.
- **Success:** consultation booked within 48h; proposals delivered per agreed date.

### Journey D — Returning customer (portal)

- **User goal:** know what's happening and what's needed from them, without phoning.
- **Entry:** magic link / reference + OTP from SMS/email/WhatsApp message (see auth planning).
- **Stages:** authenticate → dashboard (status, next step) → outstanding tasks → upload requested documents → review sourced vehicle options → confirm choice → messages → delivery arrangements.
- **Decision points:** option selection; consent confirmations; appointment slots.
- **Staff involvement:** every customer-visible status change is staff-triggered; portal is read-mostly for customers plus uploads/choices/messages.
- **Risks:** stale statuses destroy trust — the portal is only as good as staff discipline; auth friction on low-end devices.
- **Failure:** lost access (recovery via staff); upload failures on mobile data.
- **Privacy:** document vault is the most sensitive area of the system; strict access control and audit.
- **Success:** ≥50% of active customers use the portal instead of phoning for status; document turnaround time drops measurably.

## 5.7 Features (summary)

Public site (pages below); enquiry forms A/B/C with progressive steps, draft resume, confirmation with reference number; customer portal (status tracker, tasks, document requests/uploads, vehicle options with comparison, messages, appointments, profile, consents); admin portal (lead inbox, case management, status transitions, document review, vehicle-option publishing, quotation logging for dealership/insurance/tracker, tasks, notes, messages, fleet pipeline, staff/roles, audit log, basic reports, website enquiry inbox); notifications (email first; WhatsApp deep links; SMS optional later).

## 5.8 Non-functional requirements

Mobile-first (design at 360 px); fast on cellular (LCP < 2.5 s on mid-range Android over 3G-equivalent; initial JS budget ≤ ~200 KB gz for public site); WCAG 2.1 AA; POPIA compliance; works on cPanel shared hosting; graceful offline/poor-signal form behaviour (client-side draft retention); all customer-facing text in plain South African English at roughly Grade-8 reading level.

## 5.9 Business rules (draft — confirm with client)

- A lead becomes an application only after staff qualification.
- Every status change requires a staff user and is audit-logged; customer-visible statuses are a curated subset of internal statuses.
- Documents are requested by named type; customers can only upload against an open request.
- Finance decline is never shown as a raw status; it triggers a "Speak to your consultant" state.
- Vehicle options are visible to the customer only after staff publish them.
- Consent records are immutable (superseded, never edited).
- One active case per customer per vehicle need; fleets may have many.

## 5.10 Permissions (conceptual)

| Capability | Consultant | Senior/Admin | Customer |
|---|---|---|---|
| View/work own assigned cases | ✔ | ✔ (all) | own only |
| Change statuses, request docs | ✔ | ✔ | — |
| View documents | assigned cases | all | own only |
| Manage staff users, settings, content | — | ✔ | — |
| Export/reports | — | ✔ | — |
| Delete anything | — | soft-delete only | — |

## 5.11 Acceptance criteria (representative)

- A visitor on a 360 px phone can complete Journey A's first step in under 2 minutes with only thumb input.
- Submitting any journey yields a reference number and confirmation screen + email.
- A customer with a reference can authenticate and see an accurate status within 10 seconds.
- An uploaded document is visible to staff, virus-scanned path-safe, and never web-listable.
- Every admin mutation appears in the audit log with actor, timestamp, before/after.
- Demo mode runs with zero network calls and is visibly labelled "Demonstration".

---

# Deliverable 6: Information Architecture

## 6.1 Public website sitemap (with classification)

| Page | Purpose | Classification |
|---|---|---|
| Home | Concept, trust, primary CTAs into Journeys A/B/C | **MVP** |
| How It Works | The concierge process step-by-step; sets expectations | **MVP** |
| Find Me a Vehicle (Journey A form) | Core conversion | **MVP** |
| I Already Found a Vehicle (Journey B form) | Second conversion path | **MVP** |
| Finance Assistance | Explains assistance (coordinator language) | **MVP** |
| Insurance & Tracker | Quotation coordination explained | **MVP** (can be one page) |
| Fleet Solutions (+ Journey C form) | Business audience | **MVP** |
| Vehicle Deliveries (gallery/stories) | Social proof from consented photos | Production (needs consent first) |
| About EzeeFin | Story, team, values, the 10-year arc | **MVP** |
| FAQs | Objection handling, compliance-safe answers | **MVP** |
| Buying Guides | SEO content hub | Future |
| Contact | All channels incl. WhatsApp deep link | **MVP** |
| Privacy Policy / Terms / PAIA | Legal | Production (drafts needed at MVP) |
| Complaints & Support | Trust + regulatory hygiene | Production |

## 6.2 Customer portal structure

Overview (status hero + next step) → Progress tracker → Outstanding tasks → Documents (requests + uploads) → Vehicle options (compare/select) → Finance progress → Insurance progress → Tracker progress → Messages → Appointments → Profile & consent records.

Classification: Overview, tracker, tasks, documents, options, messages = **Demo + Production core**. Finance/insurance/tracker sub-trackers = Production (fold into main tracker for demo). Appointments = Future. Consent records = Production.

## 6.3 Staff portal structure

Leads inbox → Customers → Applications/cases (the central object) → Vehicle requests → Vehicle options/quotations → Dealerships directory → Finance stages → Insurance quotes → Tracker quotes → Documents review → Tasks → Notes → Messages → Fleet enquiries → Website enquiries → Staff users & roles → Reports → Audit history → Content management → Settings.

Classification: Leads, applications, statuses, documents, options, tasks, messages = **Demo (read-only feel) + Production core**. Dealerships/institutions directories, reports, audit UI = Production. Content management (edit FAQs/guides via DB) = Future — static content in code is acceptable initially. "Unnecessary for now": full CMS, granular per-field permissions, multi-branch support.

## 6.4 Navigation

- Public desktop: logo · How It Works · Services (dropdown: Finance, Insurance & Tracker, Fleet) · Deliveries · About · FAQs · Contact · [Find My Vehicle — primary button].
- Public mobile: sticky top bar (logo + hamburger + WhatsApp icon) and a persistent bottom CTA on scroll ("Start your request").
- Portal: bottom tab bar on mobile (Home, Tasks, Documents, Messages), sidebar on desktop.

## 6.5 URL recommendations

`/how-it-works`, `/find-me-a-vehicle`, `/found-a-vehicle`, `/services/finance-assistance`, `/services/insurance-and-tracker`, `/fleet`, `/deliveries`, `/about`, `/faqs`, `/guides/…`, `/contact`, `/privacy`, `/terms`, `/portal/…` (noindex), `/admin/…` (noindex, robots-disallowed, ideally separate subpath with extra protection).

---

# Deliverable 7: UX Plan

## 7.1 Primary flows and form staging

All three journeys use the same pattern: **3–4 short steps, one topic per screen, progress indicator, ~60–90 seconds per step.**

**Journey A steps:** (1) The vehicle — new/pre-owned/either, category, make/model (optional), year range. (2) The money — budget OR preferred instalment (toggle), deposit (optional), trade-in yes/no (+3 quick fields if yes). (3) You — name, mobile, city/province, preferred contact method & time. (4) Consent + review → submit → confirmation with reference.

**Journey B steps:** (1) The vehicle you found — make/model, year, price, seller type + name, listing URL (optional). (2) What you need — finance / insurance / tracker checkboxes. (3) You + consent → confirmation. Quotation upload is *deferred to the portal* — keeps the public form light and the sensitive data out of the first touch.

**Journey C steps:** (1) Your company. (2) Your fleet need (types, quantities, region, timeline). (3) Contact + consent.

**Form rules:** minimum required fields marked, everything else skippable; sensitive items (ID number, income, documents) are **never** collected on public forms — portal only, after staff contact; inline validation on blur; SA mobile-number format validation; draft state kept client-side (survives refresh; "resume" banner); every submit → reference number + what-happens-next timeline + expected response time.

## 7.2 States

- **Loading:** skeleton screens (never spinners on full pages); optimistic step transitions.
- **Empty:** portal with nothing pending → "You're up to date — we're working on: [current stage]". Admin empty lead inbox → friendly zero-state with last-7-days stats.
- **Success:** confirmation screens repeat the reference number, show the status timeline with step 1 already lit, and offer "Save to WhatsApp" (share deep link with own reference).
- **Error:** field-level messages in plain language ("That mobile number looks too short — SA numbers have 10 digits"); submit failures keep all data and offer retry + WhatsApp fallback ("Rather send us a WhatsApp? Your details are copied.").
- **Recovery:** resumable drafts; document upload retry per-file; lost portal access → "Ask your consultant to resend your link".

## 7.3 Wireframe descriptions (text only)

- **Home (mobile):** full-bleed hero (covered-car reveal image, dark gradient), H1 "Your next vehicle, handled." + one-line explainer + primary CTA; 3-step "How it works" strip; brand-logo row of delivered marques (evidence, not partnership claims — pending confirmation); delivery-stories carousel (consented photos); trust panel (reviews count, years, coverage — verified claims only); Journey B and Fleet secondary cards; FAQ teaser; footer with POPIA/consent links.
- **Tracker (portal):** vertical timeline, completed steps solid, current step pulsing with description + expected duration, upcoming steps dimmed; sticky "Next: upload your payslip" action card above the fold.
- **Vehicle options:** cards with photo, price, instalment estimate (labelled indicative), key specs; compare view stacks 2–3 side-by-side attributes on mobile via horizontal snap.
- **Admin case view:** header (customer, reference, stage pills), left column timeline/notes, right column tasks/documents/options; status change is a deliberate two-tap action with optional customer-notification toggle.

## 7.4 Accessibility requirements

WCAG 2.1 AA: 4.5:1 contrast minimum; visible focus states; full keyboard operability; labels tied to inputs; error text programmatically associated; touch targets ≥44 px; no hover-dependent interactions; reduced-motion respected; alt text for all meaningful images; form steps announced to screen readers; language attribute en-ZA.

## 7.5 Mobile behaviour

Bottom-anchored primary buttons within thumb reach; numeric keypads for money/phone fields; native selects; file upload accepts camera capture directly; all tables become stacked cards under 480 px; WhatsApp deep links throughout (the audience lives there).

---

# Deliverable 8: Design Direction

Brand raw material: red roundel "e" + charcoal wordmark, strap "any car · any bank · any place"; recurring photographic motifs of red bows, red consultant shirts, showroom light. Three directions:

## Option 1 — "Quiet Concierge" (recommended)

- **Feel:** premium restraint; more boutique advisory than car site.
- **Colour:** deep charcoal/ink (#1A1D21-range) foundations, warm off-white surfaces, EzeeFin red reserved *only* for CTAs and progress moments (the bow-red becomes the "milestone" colour), soft neutral greys.
- **Typography:** modern grotesque with warmth for headings (e.g. a humanist sans in the spirit of "Inter/Instrument/Schibsted"-class faces), same family for body; generous line-height; minimum 16 px body.
- **Photography:** real delivery moments, colour-graded consistently warm; heroes use the covered-car/bow motif; people shown mid-emotion, not posed grids.
- **Components:** soft-radius cards (12–16 px), hairline borders, one shadow level; pill status chips; timeline as the signature component.
- **Motion:** micro only — step transitions, timeline pulse, button feedback; 150–250 ms; nothing autoplaying.
- **Why strongest:** matches "trustworthy, calm, premium, human"; differentiates from every loud car-lead-gen site in the space; the red-as-milestone idea turns the existing brand asset into a product mechanic (red bow at delivery = red completion state in the tracker — the story tells itself).

## Option 2 — "Warm Guide"

Lighter, friendlier: cream/sand backgrounds, charcoal text, red + a secondary warm accent; slightly rounded type; illustrated spot icons for process steps; photography cropped into rounded frames. Feels approachable for first-time buyers; slightly less premium; risk of reading "fintech-startup generic".

## Option 3 — "Executive Fleet"

Darker, corporate: navy/graphite, silver accents, red minimal; sharp corners, denser layouts. Strong for fleet buyers, but cold for individual first-time buyers and drifts toward "banking portal", which the brief excludes.

**Recommendation:** Option 1, borrowing Option 2's illustrated step icons for the How-It-Works sequence. Iconography: single-weight outline set, consistent 24 px grid. Spacing: 4 px base scale, 8/16/24/32/48 rhythm. Accessibility as in Deliverable 7. Avoid (per brief): heavy animation, 3D, autoplay, generic luxury-car stock, busy layouts, weak contrast, tiny type, hover-dependence.

---

## Content strategy (brief §17)

- **Positioning line (draft direction only):** "Your next vehicle, handled." / supporting: "Tell us what you need. We coordinate the dealerships, the finance application, the insurance and the tracker — and you watch it all come together in one place."
- **Voice:** a knowledgeable friend in the industry — warm, direct, unhurried; South African English ("bakkie" is allowed); no exclamation-mark salesmanship, no bank formality, no AI-brochure blandness.
- **Homepage messaging order:** what we do → how it works (3 steps) → proof (deliveries, reviews) → who it's for (first car / found a car / fleet) → FAQs → start.
- **About narrative:** the one-call idea, the team's industry background (combined experience wording), the delivery-day photos as the heartbeat of the business; the 10-year arc *only once verified*.
- **Compliant service language (per brief §16):** "vehicle-finance application assistance", "we help you apply through registered credit providers", "quotation coordination", "dealership engagement" — never lender/insurer/dealer language; flag-list from the brief adopted verbatim as a pre-publication checklist.
- **Status terminology (customer-facing):** Received / Under review / Sourcing options / Options ready / Finance in progress / Insurance & tracker / Preparing delivery / Delivered — short, human, jargon-free.
- **Confirmation copy pattern:** "Got it, [name]. Your reference is EZ-2431. A consultant will call you before [time window]. Here's what happens next…"
- **Error copy pattern:** cause + fix, no blame. WhatsApp templates and email notifications planned as a small copy library in Phase 2 (drafted, client-approved before use).
- **FAQ themes:** Is this really free? Do you work with my bank? Do I have to take the insurance? What documents will I need? How long does it take? What if finance is declined? Can you help if I'm blacklisted? (Answer carefully/compliantly.)

## SEO strategy (brief §18)

- **Keyword → page mapping:** "vehicle finance assistance South Africa" → Finance Assistance; "car sourcing service South Africa" → Find Me a Vehicle; "help buying a car Durban" → Home/About (local); "fleet vehicle sourcing" → Fleet; long-tail questions → FAQs/Guides.
- **Local:** claim/repair the Google Business Profile (address conflict must be resolved first); consistent NAP everywhere; local schema.
- **Technical:** unique metadata per page; Organization + LocalBusiness + FAQPage structured data; XML sitemap; robots blocking /portal and /admin; canonical URLs; descriptive alt text (naming scheme from asset plan feeds this); prerendered/static public pages for crawlability despite SPA (see technical plan); Core Web Vitals budgets as in §5.8.
- **Content moat:** buying guides ("First car in South Africa: the real steps", "Trade-in basics", "Balloon payments explained carefully") — future phase, high compounding value.
- **Guardrail:** brand-adjacent domains (ezeecars, ezifinance) mean exact-brand SEO and a distinctive look matter for disambiguation.
