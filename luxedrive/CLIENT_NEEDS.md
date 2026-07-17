# Elite Class Dubai — Content Needed From Client

Every item below is a piece of real content the site is currently running with a placeholder for.
Each entry maps to the exact file and location where the final asset or text drops in.
Nothing else in the codebase needs to change — swap the value, redeploy, done.

---

## 1. Legal & Credentials

| # | Item | Where it goes | Current placeholder |
|---|------|---------------|---------------------|
| 1.1 | **RTA licence number** | `lib/vehicles.ts` → `SITE_CONFIG.licenceNumber` (empty string). Once filled, it renders automatically in the StatsBand badge row (`components/StatsBand.tsx`). | `''` — badge hidden until filled |
| 1.2 | **RTA licence confirmation** | `components/Footer.tsx` → credentials strip at the bottom (marked `CLIENT TO CONFIRM`). Replace the `— Licence # pending —` note with the real number and set `pending: false`. | "RTA Licensed — Licence # pending —" |
| 1.3 | **Year established** | `lib/vehicles.ts` → `SITE_CONFIG.establishedYear` (empty string). | `''` |
| 1.4 | **Company legal name / trade licence** (if different from "Elite Class") | `app/layout.tsx` → JSON-LD `LocalBusiness.name`. | "Elite Class" |

## 2. Photography — highest priority

All vehicle imagery currently renders a gold Car icon on a dark placeholder panel.

| # | Item | Where it goes | Spec |
|---|------|---------------|------|
| 2.1 | **Vehicle photos — 20 vehicles** | `lib/vehicles.ts` → each vehicle's `gallery: []` array (add image paths/URLs, first image = card image). Rendered in `components/FleetSection.tsx` (card image area, 16:10, and modal image area). | Min 1600×1000px, 16:10 crop preferred, consistent angle and lighting across the fleet, dark/neutral backgrounds |
| 2.2 | **Hero background video** | `public/hero.mp4` — referenced by `components/Hero.tsx` (`<source src="/hero.mp4">`). | MP4 (H.264), 1920×1080, 10–20 s loop, under 8 MB, no audio needed (muted) |
| 2.3 | **Hero poster fallback image** | `components/Hero.tsx` → `poster` attribute on the `<video>` (currently an Unsplash URL). | 1920×1080 JPG, dark/moody, a frame from the hero video works |
| 2.4 | **Open Graph share image** | `public/og-image.jpg` — referenced by `app/layout.tsx` metadata (`openGraph.images`). | Exactly 1200×630 JPG, brand wordmark + one flagship vehicle |

## 3. Verified Numbers & Proof

These are currently realistic placeholders — the client must confirm or correct them.

| # | Item | Where it goes | Current placeholder |
|---|------|---------------|---------------------|
| 3.1 | **Completed VIP transfers count** | `lib/vehicles.ts` → `SITE_CONFIG.stats.transfers` | `500` (+ suffix `+`) |
| 3.2 | **Languages actually spoken by team** | `lib/vehicles.ts` → `SITE_CONFIG.stats.languages` | `'EN · AR · FR · RU'` |
| 3.3 | **Case study 1 — artist residency** (confirm numbers: 8 vehicles, 47 transfers) | `lib/vehicles.ts` → `SITE_CONFIG.caseStudies[0].text` | "Three-night artist residency — 8 vehicles, 47 transfers, zero delays." |
| 3.4 | **Case study 2 — government delegation** (confirm 5 days / three emirates) | `lib/vehicles.ts` → `SITE_CONFIG.caseStudies[1].text` | "Government delegation, 5 days — coordinated across three emirates." |
| 3.5 | **Credential badges** (confirm all three are true) | `lib/vehicles.ts` → `SITE_CONFIG.badges` | `['RTA-licensed', 'NDA available', 'Airside protocol experience']` |

## 4. Pricing — confirm every rate

All 20 vehicles carry placeholder AED rates in `lib/vehicles.ts` → each vehicle's `pricing` object with five tiers:

- `hourly`
- `halfDay` (4 h)
- `fullDayDubai` (8 h)
- `fullDayOutside` (full day outside Dubai)
- `extraHour`

The client must review the full table (all 20 vehicles × 5 tiers = 100 numbers). Rates render in the fleet card ("From AED X / half day") and the detail modal price table (`components/FleetSection.tsx`).

Also confirm the USD/EUR conversion rates used by the (future) currency switcher: `components/FleetSection.tsx` → `CURRENCIES` constant (`USD: 0.272`, `EUR: 0.252`).

## 5. Fleet Accuracy

| # | Item | Where it goes |
|---|------|---------------|
| 5.1 | **Confirm the 20-vehicle list** — models, trims, and quantities actually operated. Add/remove entries in `lib/vehicles.ts` → `vehicles` array. | `lib/vehicles.ts` |
| 5.2 | **Confirm pax / bags capacity** per vehicle (`pax`, `bags` fields). | `lib/vehicles.ts` |
| 5.3 | **Confirm included options** per vehicle (`options` arrays — e.g. "Massage seats", "Refrigerator", "Privacy screen"). | `lib/vehicles.ts` |
| 5.4 | **Vehicle availability** — set `available: false` for any vehicle not currently bookable (renders an "Unavailable" overlay). | `lib/vehicles.ts` |

## 6. Contact & Business Details

| # | Item | Where it goes | Current value |
|---|------|---------------|---------------|
| 6.1 | **WhatsApp number** (confirm) | Hardcoded as `971542370940` in: `components/Hero.tsx`, `components/FleetSection.tsx`, `components/CoordinatedMovements.tsx`, `components/ReservationForm.tsx`, `components/Footer.tsx`, `components/WhatsAppButton.tsx`, `app/layout.tsx` (JSON-LD). | `+971 54 237 0940` |
| 6.2 | **Email** (confirm) | `components/Footer.tsx` + `app/layout.tsx` (JSON-LD). | `info@eliteclasslimo.com` |
| 6.3 | **Office address** (confirm) | `components/Footer.tsx` + `app/layout.tsx` (JSON-LD `PostalAddress`). | Bayswater Tower, Office 1003, Business Bay, Dubai |
| 6.4 | **Final production domain** | `app/layout.tsx` → JSON-LD `url` and `@id` values; also the "Sent from eliteclasslimo.com" footer line in `components/ReservationForm.tsx` → `buildWAMessage()`. | `https://elite-class-mu.vercel.app` |

## 7. Integrations (optional, site works without them)

| # | Item | Where it goes | Notes |
|---|------|---------------|-------|
| 7.1 | **Google Maps Places API key** | Load the Maps JS SDK (script tag in `app/layout.tsx`); `components/ReservationForm.tsx` already detects `window.google.maps.places.Autocomplete` and activates UAE-restricted address autocomplete on the pickup/drop-off fields automatically. | Without the key, the fields work as plain text inputs |
| 7.2 | **Analytics** (GA4 / Vercel Analytics) | `app/layout.tsx` | Not installed |

## 8. Copy Review (English)

The client should read and sign off on:

- Hero headline and sub-headline — `components/Hero.tsx`
- Discretion pillar claims ("No badges. No logos. No photographs." + 4 bullet lines) — `components/OurStandard.tsx`
- Coordinated Movements copy — `components/CoordinatedMovements.tsx`
- All 20 vehicle descriptions — `lib/vehicles.ts`
- FAQ answers (coverage area, payment methods, airport waiting policy) — `components/FAQ.tsx` and the mirrored FAQ JSON-LD in `app/layout.tsx` (keep both in sync)

---

### Priority order for launch

1. **2.1 Vehicle photos** — the single biggest visual upgrade
2. **4. Pricing confirmation** — rates are public-facing
3. **1.1 / 1.2 RTA licence number** — credibility
4. **2.2 Hero video** — first impression
5. Everything else
