# EzeeFin Digital Platform — Planning Phase
## Part 1: Executive Summary, Business Research, Client Discovery Questionnaire

Planning document only. No implementation was performed. No project files were modified.
Prepared: 17 July 2026.

---

# Deliverable 1: Executive Summary

## What should eventually be built

A premium, mobile-first digital platform for EzeeFin — Vehicle and Asset Finance Specialists (Durban / Pinetown, KwaZulu-Natal) — consisting of:

1. A modern public website that explains, in plain South African English, how EzeeFin coordinates the entire vehicle-buying journey: sourcing, finance application assistance, insurance and tracker quotations, paperwork and delivery.
2. Guided enquiry journeys ("Find me a vehicle", "I already found a vehicle", "Fleet assistance") built as short, progressive mobile forms rather than one large application form.
3. A customer progress portal where a customer can see the status of their request, outstanding tasks, requested documents, sourced vehicle options and messages.
4. A staff administration portal for managing leads, applications, dealership quotations, finance stages, insurance/tracker coordination, documents and communication.
5. A clean two-mode data architecture: an in-memory demonstration mode (for client sign-off, with entirely synthetic data) and a PHP 8 + MySQL API mode for production, deployable on conventional cPanel hosting.

## Why the project matters

- The current ezeefin.co.za returns **403 Forbidden** — the business effectively has no working website in 2026, while its Facebook page remains active with regular delivery posts. Its only functioning digital front door is social media plus a WhatsApp button.
- The last known website was a 2015-era Joomla/RocketTheme template (© 2015, "Slick Web Services"), and the archived copy contains injected spam text ("Tens Unit Depot") in the footer — a sign of past compromise or neglect. Rebuilding is safer and cheaper than rescuing it.
- The business model — one point of contact coordinating dealership sourcing, bank finance applications, insurance and tracking — is inherently a *journey*, and journeys deserve status tracking, not a brochure site.
- Personally: this completes a ten-year-old promise, with the maturity to do it properly this time.

## Who it serves

- First-time buyers who find dealership and finance processes intimidating.
- Experienced buyers who value time and want one point of contact.
- Customers who already found a vehicle and only need finance/admin assistance.
- SMEs and fleet operators needing multiple vehicles and ongoing coordination.
- EzeeFin staff, who currently coordinate everything through phone, WhatsApp and paper.

## Central product concept

> **"Tell EzeeFin what you need. Track everything in one place."**
> A vehicle-buying concierge: the customer describes the vehicle and budget once; EzeeFin coordinates dealerships, finance applications, insurance, tracking, paperwork and delivery — and the customer watches progress on a single tracker instead of chasing calls.

## How it differs from a normal company website

A normal small-business website is a static brochure with a contact form. This platform treats every enquiry as a structured, trackable case: statuses, document checklists, sourced vehicle options to compare, and message history. The website is the front door; the portal is the product. It is explicitly **not** a marketplace, dealership site, loan-application funnel or banking portal — EzeeFin is a coordinator, and the language, design and legal posture must reflect that.

---

# Deliverable 2: Business Research Report

Research performed 17 July 2026 via web search, the live domain, the Internet Archive (23 January 2022 capture of ezeefin.co.za), the live Facebook page, and directory/competitor searches. Every item is classified. Nothing below should be published without client confirmation.

## 2.1 Verified current information (observed directly, July 2026)

| Finding | Source |
|---|---|
| Domain `ezeefin.co.za` is registered and resolves, but the site returns **HTTP 403 Forbidden** (Apache) — no usable website | Direct visit, 17 Jul 2026 |
| Google still indexes old site copy titled "Ezeefin - Any Car, Any Bank, Any Place" | Search results |
| Facebook page **facebook.com/Ezeefin** is active: ~1.4K followers, "92% recommend (12 reviews)", WhatsApp contact button | Facebook page, 17 Jul 2026 |
| Facebook bio: "EzeeFin \| Specialised car-buying journey made effortless • Financing • Sourcing • Insurance • Tracking" | Facebook page |
| Facebook lists address: **302 MTL House, 75 Crompton Street, Pinetown, 3610** | Facebook page |
| Facebook links to ezeefin.co.za (currently broken) | Facebook page |
| Instagram profile **@ezeefin**, located Pinetown | Instagram (via search) |
| Recent Facebook content is dominated by vehicle-delivery/handover photos at franchised dealerships (Toyota, VW, Suzuki, Ford, Hyundai, Renault, Audi, GWM, Mercedes-Benz) | Facebook photo set in workspace folder |
| Branded materials show slogan "**any car · any bank · any place**", phone **0861 666 669**, email **info@ezeefin.co.za**, www.ezeefin.co.za | Pull-up banners visible in delivery photos |
| A "**ezeefin 10**" anniversary logo appears on current banners, and one collage contrasts "2016 … 2026" | Photos in workspace folder |
| One graphic reads "FAREWELL — Ezeefin Group would like to bid farewell" (staff departure post; note the name "**Ezeefin Group**") | Photo in workspace folder |

## 2.2 Historically published information (2022 archived website)

From the Wayback Machine capture of 23 Jan 2022 (paraphrased, not for republication without confirmation):

- Positioning: easiest way to purchase a vehicle; one point of communication; "one-stop-shop where one call gets you everything".
- Claimed **over a decade of combined/collective experience** in corporate vehicle and asset finance (team experience, not company age).
- Claimed partnership with **over 500 renowned dealerships nationwide** (the brief said 250 — see conflicts).
- Services in navigation: Vehicle Financing, Vehicle Sourcing, Insurance, Fleet Solutions, Tracking Solutions; plus Media/News, Corporate Social Investment, Testimonials, New Releases, Careers, Gallery, Quote, Contact.
- Stated values: integrity, confidentiality, convenience, professionalism, customer satisfaction, cost-saving.
- Contact: +27 861 666 669, **165 Steve Biko Road, Musgrave, Durban, 4001**, info@ezeefin.co.za.
- Footer: "© Copyright 2015. Website development, design & management by Slick Web Services. Designed by RocketTheme" (Joomla-era template).
- ⚠️ Footer also contained the unrelated text "Tens Unit Depot" — characteristic of SEO spam injection; the old site/CMS was likely compromised at some point.

## 2.3 Conflicting information

| Topic | Version A | Version B | Resolution needed |
|---|---|---|---|
| Physical address | 165 Steve Biko Road, Musgrave, Durban (old site, brief) | 302 MTL House, 75 Crompton Street, Pinetown (current Facebook) | Confirm current premises; Pinetown appears newer |
| Dealership network | "over 250" (brief/historical claims) | "over 500" (2022 website) | Confirm a defensible, current number — or use unquantified wording |
| Founding year | ~2010 (brief) | "ezeefin 10" banner + "2016…2026" collage imply founding ~2016 | Confirm founding date before any "since 20xx" or anniversary claims |
| "Decade of experience" | Sometimes read as company age | Site text says *combined team* experience | Wording must specify combined team experience if used |
| Phone numbers | 0861 666 669 (on banners, site) | 061 582 2619 / 082 512 2565 (brief; unverified anywhere current) | Confirm which numbers are live and which is primary/WhatsApp |

## 2.4 Information requiring client confirmation

- Legal entity name and registration number (is it "Ezeefin", "Ezeefin Group", a Pty Ltd?); VAT status.
- Current address, trading hours, service coverage area.
- All live phone numbers, the WhatsApp business number, and current email deliverability of info@ezeefin.co.za.
- Founding year; team size and named staff; who may appear on the website.
- Current bank/financial-institution relationships and whether EzeeFin acts as an agent, referrer or intermediary for any of them.
- Dealership network: real, current, countable relationships.
- Insurance and tracker partners; whether any commission is earned (disclosure implications).
- Whether the service is genuinely free to customers, and how EzeeFin earns revenue.
- The "48-hour insurance/tracker quotation" turnaround claim.
- The 12 Facebook reviews and any testimonials: permission to reuse.
- Domain, hosting, and email account access (who controls the cPanel/registrar today, and why the site 403s).

## 2.5 Information requiring legal or compliance review

- **NCA (National Credit Act):** whether assisting with finance applications requires EzeeFin to be a registered credit provider or work under a registered entity's supervision — wording on the site depends on this.
- **FAIS:** whether "insurance quotation assistance" constitutes financial advice or intermediary services requiring an FSP licence or a relationship with a licensed FSP. This is the single largest compliance question for the platform.
- **POPIA:** lawful basis, consent records, operator agreements with dealerships/banks/insurers, cross-border considerations, retention schedule (detailed in Part 4).
- **PAIA:** manual requirements for a private body.
- Marketing claims: "best possible deals", "competitive interest rates", "any bank", "cost-free" — all need substantiation or softening (Section 16 restrictions applied throughout this plan).
- Use of customer photographs (including children) from Facebook on the website — needs documented consent (see Asset Assessment).

## 2.6 Information that should not be published

- The Musgrave address (superseded, unless confirmed still valid).
- Any dealership-count number until verified.
- Founding-year or anniversary claims until verified.
- Customer delivery photos without written consent — especially the three images containing children and all images with legible number plates.
- The farewell/staff graphic (internal HR content).
- Unverified phone numbers 061 582 2619 and 082 512 2565.
- Any claim implying EzeeFin lends money, approves finance, insures vehicles, or guarantees outcomes.

## 2.7 Competitor observations

| Competitor | Model | Observation |
|---|---|---|
| Vehicle Finance Specialists (vehiclefinancespecialists.co.za) | Free bespoke car sourcing + finance facilitation | Closest model match; positions on "we do the hard work"; brochure site, no customer portal — a portal is a differentiator |
| The Car Finance Company / CFC (cfc.co.za) | Finance facilitation incl. private-to-private sales | Emphasises admin handling (inspection, ownership transfer); heavier "loan" language than EzeeFin should use |
| Bank captives: WesBank, MFC (Nedbank), Standard Bank VAF, Absa AVAF | Direct lenders | Not competitors in positioning — EzeeFin's pitch is bank-agnostic coordination *across* them ("any bank") |
| Marketplaces: cars.co.za, AutoTrader, WeBuyCars | Listings/marketplace | EzeeFin must not look like these; its value is service, not inventory |
| ezeecars.co.za, Ezi Finance and similar | Name-adjacent lead-gen sites | Brand-confusion risk; strengthens the case for distinctive design + SEO on the exact brand name |

**Gap in the market:** none of the observed facilitation competitors offer a customer-facing progress tracker. "See your application's status like you track a parcel" is a credible, ownable differentiator.

## 2.8 Recommended market position

Position EzeeFin as a **personal vehicle-buying concierge for South Africa**: bank-agnostic, dealership-agnostic, human, and transparent — the calm alternative to walking dealership floors and juggling calls. Lead with service and process transparency, not rates or approvals. Anchor locally (Durban/Pinetown, KZN) while noting nationwide sourcing reach — pending confirmation.

Sources: [ezeefin.co.za (403)](http://www.ezeefin.co.za/) · [Wayback capture 2022-01-23](http://web.archive.org/web/20220123130808/http://www.ezeefin.co.za/) · [Facebook: Ezeefin](https://www.facebook.com/Ezeefin/) · [Instagram: @ezeefin](https://www.instagram.com/ezeefin/) · [Vehicle Finance Specialists](https://vehiclefinancespecialists.co.za/) · [CFC](https://cfc.co.za/) · [MFC](https://www.mfc.co.za/home.html) · [WesBank](https://www.wesbank.co.za/home/) · [MTL House, Pinetown (Broll)](https://www.broll.com/to-let/office/pinetown/pinetown/mtl-house-ex-charter-house/unit-401)

---

# Deliverable 3: Client Discovery Questionnaire

## A. Must answer before design

**Identity and legal**
1. What is the registered legal entity name and registration number? Is "Ezeefin Group" a separate entity?
2. When was the business actually founded? May we reference an anniversary?
3. Do you hold, or operate under, any NCA/FSP registrations? (Determines every service description.)
4. Is the service genuinely free to customers? How does EzeeFin earn revenue, and must this be disclosed?

**Contact and location**
5. What is the current physical address — Pinetown (MTL House) or elsewhere? Should it appear publicly?
6. Which phone numbers are live? Which is primary? Which is the WhatsApp Business number?
7. Is info@ezeefin.co.za working and monitored? Who has access to the mailbox?

**Services and claims**
8. Exactly which services do you offer today: sourcing, finance assistance, insurance quotes, tracker coordination, fleet, delivery coordination, trade-in assistance?
9. How many dealership relationships can you honestly claim today (250? 500? "a nationwide network"?)?
10. Which banks/financial institutions do you routinely submit applications to?
11. Do you still promise insurance/tracker quotations within ~48 hours of delivery? Is that defensible?
12. What geographic area do you serve for sourcing vs. delivery?

**Brand**
13. Do you have original logo files (vector), brand colours, fonts? Who created the "ezeefin 10" mark?
14. Do you want to keep "any car · any bank · any place"? ("any bank" needs substantiation.)
15. May we contact Slick Web Services or whoever controls the old site/hosting?

## B. Must answer before development

16. Who controls the domain registrar, cPanel hosting and DNS? Can access be recovered? Why does the site 403?
17. What are your cPanel plan limits (PHP version, MySQL, storage, SSL)?
18. Describe your current internal workflow step-by-step: what happens from first WhatsApp message to delivery? What statuses do staff actually use?
19. What documents do you request from customers, at what stage? (ID, licence, payslips, bank statements…)
20. How many staff will use the admin portal, and what roles/permissions are needed?
21. What volume of enquiries do you handle monthly? (Sizes the build and hosting.)
22. How do you communicate with customers today (WhatsApp, calls, email)? Should the portal notify by email, WhatsApp link, or both?
23. Do you keep existing customer records anywhere (spreadsheets, books)? Any migration expectations?
24. What must a fleet enquiry capture that an individual enquiry does not?

## C. Must answer before production launch

25. Who is the POPIA Information Officer? Is there a privacy notice, PAIA manual, retention policy?
26. Signed consent for every customer photo used (especially images with children) — can these be obtained retroactively?
27. Which testimonials/reviews may be published, in what form?
28. Insurance/tracker partner agreements — do they permit naming partners on the site?
29. Complaints process: who handles complaints and how should the site describe it?
30. Who will operate the admin portal daily and be trained before go-live?
31. Backup, incident-response and support expectations after launch.
32. Email sending: may we set up transactional email (SPF/DKIM) on the domain?

## D. Optional future questions

33. Interest in customer accounts with saved profiles for repeat purchases?
34. Interest in structured dealership-side access (dealers uploading quotes directly)?
35. Content ambitions: buying guides, delivery stories, social auto-feed?
36. Paid channels: Google Business Profile, Meta ads, WhatsApp Business API?
37. Long-term: vehicle delivery tracking integration, e-signature, credit-bureau pre-checks (all carry compliance weight)?
