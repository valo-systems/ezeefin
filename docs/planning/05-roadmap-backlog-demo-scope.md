# EzeeFin Digital Platform — Planning Phase
## Part 5 — Deliverables 10–12: Phased Roadmap, Prioritised Backlog, Demo Scope — and Closing Lists

---

# Deliverable 10: Phased roadmap

### Phase 0 — Discovery and confirmation
- **Objective:** convert every unverified fact into a confirmed fact or a removed claim.
- **Tasks:** client answers questionnaire Part A/B (doc 01); recover domain/hosting/email access and diagnose the 403; legal read on NCA/FAIS wording; confirm address, numbers, founding year, dealership claim; photo-consent decision.
- **Deliverables:** signed-off fact sheet; access credentials inventory; approved service-wording list.
- **Dependencies:** client availability. **Risks:** unreachable former webmaster (Slick Web Services); registrar access lost — may need SA domain-recovery process (ZACR).
- **Acceptance:** every item in the "Do not build until confirmed" list resolved or consciously deferred.

### Phase 1 — Asset and brand preparation
- **Objective:** production-ready brand kit and image library.
- **Tasks:** obtain vector logo or redraw; approve rename map (CSV); collect full-resolution originals; obtain photo consents; blur plates; select best frame per event; colour-grade set; commission team/office/fleet photos; define tokens (colour, type, spacing).
- **Deliverables:** brand tokens sheet; consented, graded image library in the approved folder structure.
- **Dependencies:** Phase 0 consents. **Risks:** consent non-response shrinks the gallery — plan a vehicles-only fallback gallery.
- **Acceptance:** every image slated for the site has consent + edit applied; no plate legible; no child images used.

### Phase 2 — UX and interface design
- **Objective:** high-fidelity designs of the design-system core and all MVP screens (public, portal, admin) in the chosen "Quiet Concierge" direction.
- **Tasks:** wireframes → hi-fi; form-step prototypes; tracker component design; admin patterns; accessibility pass; client review rounds.
- **Deliverables:** approved screen designs + component inventory + content draft v1.
- **Dependencies:** Phase 1 tokens. **Risks:** scope creep — hold to MVP page list.
- **Acceptance:** client signs off screens; contrast/touch-target audit passes.

### Phase 3 — Public website demo
- **Objective:** the public site running on synthetic content, statically hosted.
- **Tasks:** project scaffold (React/TS/Vite), design-system build, MVP pages, prerendering, Lighthouse tuning.
- **Deliverables:** deployed demo URL (e.g. demo subdomain or temporary host).
- **Dependencies:** Phase 2. **Acceptance:** all MVP pages responsive 360→1440 px; CWV budgets met; no real data.

### Phase 4 — In-memory customer journey
- **Objective:** Journeys A/B/C forms + customer tracker fully interactive in mock mode.
- **Tasks:** data contracts; mock repos + synthetic dataset; multi-step forms with validation/drafts; confirmation flows; tracker, tasks, documents (stub uploads), options, messages; demo ribbon.
- **Deliverables:** clickable end-to-end customer story in demo mode.
- **Dependencies:** Phase 3 scaffold. **Acceptance:** the full demo storyline (Deliverable 12) runs without network access.

### Phase 5 — Staff dashboard demo
- **Objective:** admin portal in mock mode telling the staff side of the same story.
- **Tasks:** leads inbox, case view, status transitions, option publishing, document review, tasks; "simulate" controls.
- **Deliverables:** integrated two-sided demo. **Acceptance:** a staff action in the demo visibly updates the customer view.

### Phase 6 — PHP and MySQL integration
- **Objective:** production data layer behind the same contracts.
- **Tasks:** migrations + seeds; API per conceptual plan; staff auth + customer OTP; real uploads; api-mode repos; contract tests against both modes; notification emails.
- **Deliverables:** working api-mode build on staging cPanel.
- **Dependencies:** Phase 0 hosting access; client sign-off on demo. **Risks:** host PHP/MySQL limits — verify first.
- **Acceptance:** same UI, `VITE_DATA_MODE=api`, all flows pass against MySQL.

### Phase 7 — Security and compliance review
- **Objective:** production readiness.
- **Tasks:** security checklist execution (headers, authz per object, rate limits, upload hardening); POPIA artefacts (privacy notice, consent versions, retention config); PAIA manual; backup + restore drill; incident checklist; legal sign-off on all public wording.
- **Acceptance:** checklist signed; a restore from backup demonstrated; legal approval recorded.

### Phase 8 — Client review and launch preparation
- **Objective:** content freeze and operational readiness.
- **Tasks:** final copy approval; staff training on admin portal; Google Business Profile fix; DNS/SSL/email (SPF/DKIM) setup; analytics; 301s from any legacy URLs; launch checklist.
- **Acceptance:** client UAT sign-off; staff can run a case unaided.

### Phase 9 — Production launch and support
- **Objective:** go live and stabilise.
- **Tasks:** production deploy; smoke tests; monitor logs/uptime; hypercare window; support cadence + backlog triage; measure success criteria (response time, portal adoption).
- **Acceptance:** 30 days stable; success metrics baselined; handover documentation delivered.

---

# Deliverable 11: Prioritised backlog

**Must have (MVP):** public MVP pages (Home, How It Works, both journey forms, Fleet, Finance Assistance, Insurance & Tracker, About, FAQs, Contact); consent capture on all forms; reference numbers + confirmations; customer tracker with curated statuses; document request/upload; vehicle options list + selection; admin leads inbox, case view, status transitions, document review, option publishing; staff auth; customer OTP access; audit logging; mock/api dual mode; POPIA privacy notice; mobile performance budgets.

**Should have:** messages thread (both sides); tasks module; email notifications; deliveries gallery (consented); complaints page; reports-lite (pipeline counts); dealership & institution directories; demo reset tooling; WhatsApp deep-link integration points.

**Could have:** appointments/booking; comparison view for options; testimonials module with consent linkage; buying-guide content hub; per-stage sub-trackers (finance/insurance/tracker detail); CSV exports; TOTP for staff.

**Future:** content management UI; dealership-side quote submission portal; WhatsApp Business API automation; SMS gateway; isiZulu localisation; customer accounts across purchases; delivery-day story generator; credit-bureau/e-signature integrations (compliance-heavy).

---

# Deliverable 12: Recommended demo scope

The smallest polished demo that communicates the whole vision — all in-memory, all synthetic, visibly labelled "Demonstration":

1. Public homepage + How It Works (full visual quality — this sells the brand direction).
2. Journey A form, 4 steps, with validation, draft-resume and confirmation + reference.
3. Journey B and Fleet forms (2–3 steps each, lighter polish).
4. Customer portal for one scripted customer ("Nomvula", buying a pre-owned Suzuki Swift): tracker mid-journey, one outstanding document task, two sourced vehicle options to compare and select, short message thread.
5. Staff dashboard: leads inbox with ~12 synthetic leads, Nomvula's case open, a status-advance action that visibly updates her tracker, document approve action, option-publish action.
6. Fully responsive; EzeeFin brand tokens; approved assets only (vehicle-only shots until consents exist).

**Demo storyline (5 minutes):** visitor lands on homepage → starts "Find Me a Vehicle" on a phone → submits → receives reference EZ-2431 → switch to staff view: lead arrives, consultant qualifies it, publishes two Swift options, requests a payslip → switch to customer portal: Nomvula sees "Options ready", compares, selects one, uploads the stub payslip → staff advances to "Finance in progress" → customer tracker lights up in EzeeFin red → close on the delivered-car gallery. The red bow becomes the completed-state motif — brand and product in one gesture.

---

# Closing lists

## Top ten client questions
1. Who currently controls ezeefin.co.za's registrar, hosting and email — and why does the site return 403?
2. What is the registered legal entity and its NCA/FSP status (if any)?
3. Which address is current — Musgrave or MTL House, Pinetown — and which may be published?
4. Which phone/WhatsApp numbers are live, and which is primary?
5. When was the business founded, and may we reference the "10 years" milestone?
6. How many dealership relationships can be honestly claimed today?
7. Is the service free to customers, and how is EzeeFin remunerated (disclosure)?
8. Which banks, insurers and tracker companies do you actually work with, and may they be named?
9. Can written consent be obtained for the customer delivery photos (children's photos excluded)?
10. What is your real internal workflow and status vocabulary from first contact to delivery?

## Top ten project risks
1. Lost domain/hosting access blocks everything (site currently 403).
2. NCA/FAIS wording risk — mispositioning EzeeFin as lender/insurer/advisor.
3. POPIA exposure from customer photos and finance documents.
4. Unverifiable historical claims (500/250 dealers, founding year, 48-hour promise).
5. Staff non-adoption of the admin portal → stale trackers → trust damage.
6. Shared-hosting security ceiling for very sensitive documents.
7. Consent collection fails → gallery/social-proof strategy shrinks.
8. Scope creep beyond MVP (CMS, integrations) stalling delivery.
9. Old compromised site/domain reputation (spam injection history) affecting SEO/email deliverability.
10. Single-developer bus factor and a ten-year emotional stake — guard against gold-plating.

## Top ten project opportunities
1. First mover among SA vehicle-finance facilitators with a customer progress tracker.
2. An active, warm Facebook audience (1.4K followers, 92% recommend) to relaunch to.
3. The red-bow delivery motif as a distinctive, ownable brand-product device.
4. WhatsApp-native customer experience (deep links now, Business API later).
5. Local SEO: "help buying a car Durban" style queries are winnable with a real site.
6. Fleet segment upside with almost no digital competition locally.
7. Buying-guide content moat for first-time buyers.
8. The 10-year founder story (once verified) as authentic About-page material.
9. Demo mode doubling as a permanent sales and staff-training environment.
10. Structured data collection enabling honest performance claims later ("average sourcing time: X days").

## Recommended MVP
Public MVP pages + Journeys A/B/C + customer tracker + document requests + admin case management + audit trail, mock-first then API — exactly the "Must have" backlog band, shipped through Phase 6.

## Recommended demo storyline
The Nomvula Swift story in Deliverable 12 above.

## Recommended first implementation milestone
Phase 3+4 subset: public homepage + How It Works + Journey A form + Nomvula's tracker, all in mock mode on a demo subdomain — the smallest artefact that makes the vision undeniable to the client.

## Proposed future folder structure (recommendation only)
Frontend `src/` with `features/`, `ui/`, `data/{contracts,mock,api}`; hosting layout per Part 4 §9.8; assets per Part 2 §6.

## Decisions required before implementation
Hosting/domain control; legal wording sign-off (NCA/FAIS); current address & numbers; founding-year claim; dealership-count wording; photo-consent outcome; fee/remuneration disclosure; notification channels (email only vs +WhatsApp); staff roles & count; demo subdomain choice; retention schedule owner; Information Officer designation.

## Do not build until these items are confirmed
1. Registrar + cPanel + mailbox access recovered and verified.
2. Legal confirmation of permissible service wording (NCA/FAIS review).
3. Current physical address and publishable phone numbers.
4. The legal entity name for Terms/Privacy documents.
5. Consent decision on customer photography (or approval of vehicles-only fallback).
6. Client sign-off on the fact sheet replacing all historical claims (dealership count, founding year, "free service", "48 hours", "any bank").
7. Confirmed internal workflow statuses (the tracker must mirror reality, not aspiration).
8. Hosting environment specs (PHP version, MySQL, SSL, storage) verified against this architecture.
9. Written approval of the asset rename map and folder structure.
10. Client approval of the recommended design direction and demo scope.

— End of planning documentation. No implementation was performed. —
