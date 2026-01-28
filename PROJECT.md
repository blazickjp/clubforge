# ClubForge - Golf Club Builder & Price Comparison

> "PCPartPicker for custom golf clubs"

## Concept

Help golfers build custom clubs by:
1. Selecting compatible components (head + shaft + grip + adapter)
2. Comparing prices across multiple retailers
3. Understanding what works together and why

## Revenue Model

### Primary: Affiliate Commissions
- 2ndSwing: 5-15% commission
- GlobalGolf: ~5% (TBD)
- Rock Bottom Golf: ~5% (TBD)
- GolfWorks: ~5% (TBD)

**Example:** $500 driver build → $25-75 commission

### Secondary: Display Ads
- Golf demographic = high income = premium CPMs
- Target: $20-40 RPM once traffic established

### Future: Premium Features
- Price alerts
- Build history
- Advanced filters
- Saved builds

---

## Data Model

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐
│     Brand       │     │   ClubHead      │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ name            │────▶│ brand_id        │
│ logo_url        │     │ model           │
│ website         │     │ year            │
└─────────────────┘     │ type (driver/   │
                        │   wood/hybrid)  │
                        │ loft_options[]  │
                        │ adjustable      │
                        │ adapter_type    │
                        │ tip_size        │
                        └─────────────────┘
                               │
                               ▼
┌─────────────────┐     ┌─────────────────┐
│     Shaft       │     │    Adapter      │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ brand           │     │ brand_id        │
│ model           │     │ name            │
│ flex_options[]  │     │ tip_size        │
│ weight_options[]│     │ compatible_heads│
│ tip_size        │     └─────────────────┘
│ launch          │
│ spin            │            │
│ torque          │            │
│ kick_point      │            ▼
└─────────────────┘     ┌─────────────────┐
        │               │      Grip       │
        │               ├─────────────────┤
        │               │ id              │
        │               │ brand           │
        │               │ model           │
        │               │ size_options[]  │
        │               │ weight          │
        │               │ material        │
        │               └─────────────────┘
        │
        ▼
┌─────────────────┐     ┌─────────────────┐
│  RetailerPrice  │     │    Retailer     │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ component_type  │     │ name            │
│ component_id    │     │ affiliate_url   │
│ retailer_id     │────▶│ commission_rate │
│ price           │     │ logo_url        │
│ url             │     └─────────────────┘
│ in_stock        │
│ last_updated    │
└─────────────────┘

┌─────────────────┐
│      Build      │
├─────────────────┤
│ id              │
│ user_id (opt)   │
│ head_id         │
│ shaft_id        │
│ adapter_id      │
│ grip_id         │
│ total_price     │
│ created_at      │
│ share_slug      │
└─────────────────┘
```

### Compatibility Rules

```typescript
interface CompatibilityRule {
  head_adapter_type: string;    // e.g., "titleist_surefit"
  required_tip_size: string;    // e.g., ".335"
  compatible_shafts: string[];  // shaft IDs or tip_size match
}
```

**Adapter Types by Brand:**
| Brand | Adapter System | Tip Size |
|-------|---------------|----------|
| Titleist | SureFit | .335 |
| TaylorMade | Tip Sleeve | .335 |
| Callaway | OptiFit | .335 |
| Ping | Adapter | .335 |
| Cobra | MyFly | .335 |

Most modern drivers use .335 tip, but older models and some fairways use .350.

---

## Tech Stack

### Frontend
- **Framework:** Astro (static + islands)
- **Styling:** Tailwind CSS
- **Interactivity:** React islands for builder UI
- **State:** Zustand (lightweight)

### Backend/Data
- **Database:** SQLite (simple, portable) → PostgreSQL later
- **ORM:** Drizzle (type-safe, lightweight)
- **API:** Astro API routes

### Infrastructure
- **Hosting:** Cloudflare Pages (free tier)
- **Database:** Turso (SQLite edge) or local file
- **Price Scraping:** GitHub Actions (scheduled)
- **Domain:** ~$12/year

### Why This Stack?
- Zero hosting cost to start
- Fast static pages (SEO)
- Easy to add interactivity where needed
- SQLite is plenty for MVP scale

---

## MVP Scope

### Phase 1: Data Foundation (Week 1-2)

**Heads to include (5 brands × 2-3 models):**
- Titleist: TSR2, TSR3, TSR4
- TaylorMade: Qi10, Qi10 Max, Qi10 LS
- Callaway: Paradym, Paradym X, Paradym Triple Diamond
- Ping: G430 Max, G430 LST, G430 SFT
- Cobra: Darkspeed, Darkspeed Max, Darkspeed LS

**Shafts to include (15-20 popular models):**
- Fujikura Ventus (Blue, Black, Red)
- Mitsubishi Tensei (Pro White, AV Blue)
- Project X HZRDUS (Smoke, Black)
- Graphite Design Tour AD (DI, IZ, UB)
- UST Mamiya Helium (Black, Blue)

**Grips (5-10 models):**
- Golf Pride Z-Grip, MCC, Tour Velvet
- SuperStroke S-Tech
- Lamkin Crossline

**Retailers (3-4 to start):**
- 2ndSwing
- GlobalGolf
- GolfWorks
- Rock Bottom Golf

### Phase 2: Core Builder (Week 3-4)
- [ ] Component selection UI
- [ ] Compatibility filtering
- [ ] Price comparison display
- [ ] Affiliate link integration
- [ ] Build sharing (unique URLs)

### Phase 3: SEO Pages (Week 5-6)
- [ ] Individual head pages
- [ ] Individual shaft pages  
- [ ] "[Head] + [Shaft] build" combo pages
- [ ] "Best shafts for [Head]" guide pages
- [ ] Sitemap generation

### Phase 4: Polish & Launch (Week 7-8)
- [ ] Price alerts (email)
- [ ] User accounts (optional)
- [ ] Analytics
- [ ] Submit to golf forums/Reddit

---

## Competitive Advantage (The Moat)

1. **Compatibility Database** — The knowledge of what fits what is scattered. We centralize it.

2. **Price Aggregation** — No one compares prices across component retailers.

3. **Free vs $300 Fittings** — Club Champion charges $150-400. We give away the "what goes with what" for free.

4. **SEO Long-tail** — Thousands of "[head] + [shaft]" combinations = thousands of indexable pages.

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Affiliate programs reject us | Start with 2ndSwing (easy approval), build traffic first |
| Price scraping blocked | Use multiple sources, consider API partnerships |
| Big retailer builds competing tool | Move fast, build community, add features they won't |
| Compatibility data wrong | Crowdsource corrections, cite sources |

---

## Success Metrics

**Month 1:** 
- MVP live with 15 heads, 20 shafts
- 100 organic sessions

**Month 3:**
- 1,000 organic sessions/month
- First affiliate commissions

**Month 6:**
- 10,000 sessions/month
- $500/month affiliate revenue

**Month 12:**
- 50,000 sessions/month
- $2,000+/month revenue

---

## Next Steps

1. [ ] Set up project (Astro + Tailwind)
2. [ ] Design database schema
3. [ ] Research & input head data (manual)
4. [ ] Research & input shaft data (manual)
5. [ ] Build compatibility matrix
6. [ ] Create basic UI
7. [ ] Add price scraping
8. [ ] Launch MVP

---

## Name Ideas

- ClubForge
- BuildMyDriver
- ShaftMatch
- GolfBuild
- ClubCraft
- FairwayForge
- The Club Builder
- CustomClubHQ

*Working name: **ClubForge***
