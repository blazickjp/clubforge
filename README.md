# ClubForge 🏌️

> PCPartPicker for custom golf clubs

Build custom golf clubs by selecting compatible components, comparing prices across retailers, and sharing your builds.

## Quick Start

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Seed with component data
npm run db:seed

# Start development server
npm run dev
```

## Project Structure

```
golf-builder/
├── README.md
├── PROJECT.md          # Full project spec & roadmap
├── schema.sql          # Database schema
├── data/
│   ├── heads.json      # Club head seed data
│   ├── shafts.json     # Shaft seed data
│   └── grips.json      # Grip seed data
├── src/
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── build.astro         # Club builder
│   │   ├── heads/[slug].astro  # Head detail pages
│   │   └── shafts/[slug].astro # Shaft detail pages
│   ├── components/
│   │   ├── Builder.tsx         # Main builder UI
│   │   ├── HeadSelector.tsx
│   │   ├── ShaftSelector.tsx
│   │   └── PriceComparison.tsx
│   ├── lib/
│   │   ├── db.ts               # Database client
│   │   ├── compatibility.ts    # Compatibility logic
│   │   └── affiliates.ts       # Affiliate link generation
│   └── styles/
│       └── global.css
├── scripts/
│   ├── init-db.ts              # Initialize SQLite database
│   ├── seed-data.ts            # Seed from JSON files
│   └── scrape-prices.ts        # Price scraping (GitHub Actions)
└── astro.config.mjs
```

## Tech Stack

- **Framework:** Astro + React islands
- **Styling:** Tailwind CSS
- **Database:** SQLite (via Drizzle ORM)
- **Hosting:** Cloudflare Pages

## Data Model

See `PROJECT.md` for full data model and `schema.sql` for database schema.

**Core entities:**
- Brands (Titleist, TaylorMade, Callaway, Ping, Cobra)
- Club Heads (drivers, fairways, hybrids)
- Shafts (Ventus, Tensei, HZRDUS, Tour AD, etc.)
- Grips (Golf Pride, SuperStroke, Lamkin)
- Adapters (brand-specific hosels)
- Retailers (2ndSwing, GlobalGolf, GolfWorks)
- Prices (per component per retailer)
- Builds (user-created configurations)

## Compatibility

All modern drivers use `.335` tip shafts. Compatibility is determined by:

1. **Tip size match** - Shaft tip must match head/adapter
2. **Adapter type** - Each brand has proprietary adapter system
3. **Club type** - Wood shafts for drivers/fairways, iron shafts for irons

The adapter auto-selects based on head brand.

## Affiliate Integration

Revenue comes from affiliate links to retailers:

| Retailer | Commission | Network |
|----------|-----------|---------|
| 2ndSwing | 5-15% | Awin |
| GlobalGolf | ~5% | TBD |
| GolfWorks | ~5% | TBD |

Links are generated with tracking parameters in `src/lib/affiliates.ts`.

## Price Scraping

Prices are updated via GitHub Actions (scheduled):

```bash
# Manual price update
npm run scrape:prices
```

Scrapers live in `scripts/scrape-prices.ts` with per-retailer modules.

## SEO Strategy

Programmatic pages for long-tail keywords:

- `/heads/titleist-tsr3-driver` - Head detail pages
- `/shafts/fujikura-ventus-blue` - Shaft detail pages
- `/builds/tsr3-ventus-blue` - Popular build combinations
- `/best-shafts-for/titleist-tsr3` - Guide pages

## Contributing

1. Add new components to `data/*.json`
2. Run `npm run db:seed` to update database
3. Verify compatibility rules make sense

## License

MIT
