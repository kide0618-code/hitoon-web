# Complete Directory Structure

## Root Level Files
- package.json, tsconfig.json, next.config.ts
- tailwind.config.js, postcss.config.mjs
- eslint.config.mjs
- .gitignore, README.md
- CLAUDE.md (project instructions)

## app/ (Next.js App Router)

```
app/
├── layout.tsx                 ✅ Root layout with metadata, fonts
├── error.tsx                  ✅ Error boundary
├── not-found.tsx              ✅ 404 page
├── globals.css                ✅ Global styles, animations
├── favicon.ico
│
├── (main)/                    # Main app routes with bottom nav
│   ├── layout.tsx             ✅ MainLayout with BottomNav
│   ├── page.tsx               ✅ Home (featured artists)
│   ├── market/
│   │   └── page.tsx           ✅ Artist list
│   ├── artists/
│   │   └── [id]/
│   │       └── page.tsx       ✅ Artist detail with card selection
│   └── collection/
│       ├── page.tsx           ✅ User's collection (mock data)
│       └── [id]/              ❌ Empty - Collection detail page
│
├── (auth)/                    ❌ EMPTY - Auth routes (future)
│   ├── login/
│   ├── signup/
│   └── (potentially) callback/
│
├── (legal)/
│   ├── layout.tsx             ✅ Legal pages layout
│   ├── terms/
│   │   └── page.tsx           ✅ Terms of service
│   └── privacy/
│       └── page.tsx           ✅ Privacy policy
│
├── api/                       ❌ ALL EMPTY - API routes structure exists
│   ├── artists/
│   ├── cards/
│   ├── checkout/
│   ├── webhooks/
│   │   └── stripe/
│   └── (missing: purchases, admin endpoints, auth)
│
└── (admin)/                   ❌ Not yet implemented - Admin dashboard
```

## components/

```
components/
├── PurchaseAgreement.tsx      ✅ Purchase modal with quantity selector
├── ui/
│   ├── button.tsx             ✅ Reusable button component
│   └── modal.tsx              ✅ Accessible modal dialog
├── layout/
│   ├── bottom-nav.tsx         ✅ Fixed bottom navigation
│   └── page-container.tsx     ✅ Page wrapper with consistent padding
├── cards/
│   ├── artist-card.tsx        ✅ Trading card component (3:4 aspect)
│   ├── card-grid.tsx          ✅ Responsive grid wrapper
│   └── rarity-badge.tsx       ✅ Rarity indicator badge
├── features/                  ❌ Empty (future organization)
└── forms/                     ❌ Empty (for future auth/checkout forms)
```

## lib/

```
lib/
├── utils/
│   ├── cn.ts                  ✅ Class merge utility (clsx + tailwind-merge)
│   └── format.ts              ✅ Formatting helpers (price, date, serial)
├── supabase/
│   ├── client.ts              ✅ Browser Supabase client
│   └── server.ts              ✅ Server & admin Supabase clients
└── stripe/
    └── client.ts              ✅ Stripe client & helpers
```

## types/

```
types/
├── index.ts                   (exports)
├── card.ts                    ✅ Card, CardTemplate, Rarity, ExclusiveContent
├── artist.ts                  ✅ Artist, ArtistWithCards, ArtistListItem
├── purchase.ts                ✅ Purchase, PurchaseStatus, CollectionItem
└── operator.ts                ✅ Operator, OperatorRole
```

## constants/

```
constants/
├── routes.ts                  ✅ Route constants and API endpoints
└── config.ts                  ✅ App config, card config, pricing
```

## Other Directories

- public/ - Static assets
- node_modules/ - Dependencies
- .next/ - Build output
- docs/ - Documentation (includes definition.md - full PRD)
- .claude/ - Project guidelines (rules for frontend, database, payments, ui-design)
