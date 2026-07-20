# EzeeFin Digital Platform — Planning Phase
## Part 2 — Deliverable 4: Asset Assessment

Read-only assessment of the 80 image files in the workspace folder. **No file was renamed, moved, edited, converted, optimised or deleted.** The complete per-file table (all 80 files, 17 attributes each) is in `asset-rename-map.csv` alongside this document — it is the proposed rename map, for approval only.

## 1. Inventory summary

| Metric | Value |
|---|---|
| Total files | 80 (79 × .jpg, 1 × .jpeg) |
| Format | All JPEG |
| Dominant size | 76 files at **414×414 px** (Facebook feed thumbnails) |
| Other sizes | 480×480 (logo), 447×447 (logo), 1536×2048 (one high-res portrait) |
| Total volume | ~2.3 MB — these are compressed social thumbnails, not originals |

### Content breakdown

| Category | Count | Notes |
|---|---|---|
| Customer handover / delivery photos (people present) | ~48 | Dealership key-handover moments; EzeeFin consultants in red branded shirts; "ezeefin 10" pull-up banners frequently visible |
| Vehicle-only shots (bows, ribbons, reveals) | ~24 | Toyota, VW, Suzuki, Ford, Hyundai, Renault, Audi, Mercedes-Benz, GWM — evidence of multi-brand, multi-dealer reach (incl. Hyundai Hillcrest, Kempster Ford, Honda The Glen — Gauteng, Automark) |
| Logo renders | 4 | Red "e" roundel + grey "zeefin", strap "any car · any bank · any place"; one pair is the same artwork at two sizes |
| Brand/anniversary graphics | 2 | "2016…2026" collage; "ezeefin 10" appears across banners |
| Internal content | 1 | "FAREWELL — Ezeefin Group would like to bid farewell" staff graphic |
| Covered-car reveal shots | ~6 | The strongest recurring visual motif — emotionally distinctive, ownable |

## 2. Quality assessment

Essentially the entire set is **unusable at hero scale**: 414 px thumbnails will look blurred anywhere larger than a small gallery card. Only one file (`572124195…n.jpg`, 1536×2048) is genuinely high-resolution. The four logo files are raster screen-grabs — the vector original must be recovered from the client or its original designer.

**Implication for Phase 1 (later):** request original-resolution photos from the client's phone/Drive/Facebook account (Facebook stores higher-res versions accessible to the page owner), and commission one small photo session (team, office, one staged handover) for hero imagery.

## 3. Duplicates

One exact-content duplicate pair (`273551012…n.jpg` and `273551012…n (1).jpg` — same logo art at 414 px and 480 px). Roughly 15 further *near-duplicate clusters*: multiple frames of the same handover event (e.g. the Ford Ranger elderly-customer set, the GWM family set, the Polo Vivo pair). The CSV marks each cluster; keep the best frame per event.

## 4. Privacy and consent risks

| Risk | Files affected | Required action before any use |
|---|---|---|
| Identifiable customers | ~48 photos | Written POPIA consent per person, or do not publish |
| **Children visible** | 3 photos (indices 59, 62, 69 in CSV) | Explicit parental consent mandatory; recommend excluding from the website entirely |
| Legible number plates | 3 confirmed (indices 11, 21, 54), ~5 possible | Blur plates before use, even with consent |
| Internal HR content | 1 (farewell graphic) | Never publish |
| Third-party trademarks | Most photos (dealer signage: Toyota Certified, Hyundai Hillcrest, Kempster Ford, GWM, Honda) | Low risk in genuine delivery photos, but confirm dealership relationships are current before implying partnership |
| Copyright | Unknown photographer(s) | Confirm EzeeFin owns/commissioned all photos |

## 5. Proposed rename map

Full map in `asset-rename-map.csv` (column `recommended_filename` / `recommended_folder`). Naming scheme: `category-subject-context-sequence.ext`. Representative examples:

| Current | Proposed |
|---|---|
| `273551012_4743512335717025_…n (1).jpg` | `brand/logo-ezeefin-primary-01.jpg` |
| `480770152_9235499403184940_…n.jpg` | `deliveries/customer-handover-bakkie-01.jpg` |
| `480206731_1191079233022340_…n.jpg` | `vehicles/vehicle-delivery-renault-kiger-01.jpg` |
| `572124195_1423520509778210_…n.jpg` | `hero/vehicle-showroom-fronx-01.jpg` |
| `714896702_1616076097189316_…n.jpg` | `brand/brand-anniversary-collage-2016-2026-01.jpg` |
| `648449429_1539352254861701_…n.jpg` | `archive/internal-farewell-staff-01.jpg` |

## 6. Proposed future folder structure (recommendation only — not created)

```text
public/
  assets/
    brand/          # logos, anniversary marks, banner artwork
    hero/           # high-res hero imagery (mostly to be commissioned)
    vehicles/       # vehicle-only delivery/bow shots
    deliveries/     # consented customer handover photos
    customers/      # consented portrait/testimonial photos
    team/           # staff photos (to be taken)
    services/       # finance / insurance / tracker illustrative imagery
    fleet/          # commercial vehicle imagery (none exists yet — gap)
    social-proof/   # review snippets, milestone graphics
    backgrounds/    # textures, gradients
    icons/          # UI icon set
    placeholders/   # demo-mode synthetic images
    archive/        # duplicates, children photos pending consent, internal content
```

## 7. Recommended future edits (Phase 1 work, not performed now)

Re-source originals at full resolution; blur all number plates; select one best frame per handover event; colour-grade the selected set consistently (the reds of bows/shirts/logo can become a brand device); crop the high-res FRONX photo to landscape for hero use; rebuild the logo as SVG with a corrected mono variant; commission team and office photography; and create fleet imagery, which is currently absent despite fleet being a claimed service.

## 8. Asset gaps

No team photos, no office/premises photos, no fleet or commercial-vehicle imagery, no customer portraits with signed releases, no vector logo, no photography of the *process* (consultation, paperwork, phone-in-hand tracking) — the exact imagery a concierge-positioning website needs most.
