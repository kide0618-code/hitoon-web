# Key File Locations & Reference Guide

## Type Definitions (Start Here for Understanding Domain)

- `/Users/hidenari-yuda/hitoon-web/types/card.ts` - Rarity, Card, CardTemplate, ExclusiveContent types
- `/Users/hidenari-yuda/hitoon-web/types/artist.ts` - Artist, ArtistWithCards types  
- `/Users/hidenari-yuda/hitoon-web/types/purchase.ts` - Purchase, CollectionItem types
- `/Users/hidenari-yuda/hitoon-web/types/operator.ts` - Operator type
- `/Users/hidenari-yuda/hitoon-web/types/index.ts` - Type exports

## Pages Implemented

### Main App Pages
- `/Users/hidenari-yuda/hitoon-web/app/(main)/page.tsx` - Home (featured artists)
- `/Users/hidenari-yuda/hitoon-web/app/(main)/market/page.tsx` - Market/Store (all artists)
- `/Users/hidenari-yuda/hitoon-web/app/(main)/artists/[id]/page.tsx` - Artist detail with card selection
- `/Users/hidenari-yuda/hitoon-web/app/(main)/collection/page.tsx` - User's collection list (mock data)

### Layout Files
- `/Users/hidenari-yuda/hitoon-web/app/layout.tsx` - Root layout with metadata
- `/Users/hidenari-yuda/hitoon-web/app/(main)/layout.tsx` - Main layout with BottomNav
- `/Users/hidenari-yuda/hitoon-web/app/(legal)/layout.tsx` - Legal pages layout

### Legal Pages
- `/Users/hidenari-yuda/hitoon-web/app/(legal)/terms/page.tsx` - Terms of Service
- `/Users/hidenari-yuda/hitoon-web/app/(legal)/privacy/page.tsx` - Privacy Policy

### Error Pages
- `/Users/hidenari-yuda/hitoon-web/app/error.tsx` - Error boundary
- `/Users/hidenari-yuda/hitoon-web/app/not-found.tsx` - 404 page

## Components

### Layout Components
- `/Users/hidenari-yuda/hitoon-web/components/layout/bottom-nav.tsx` - Fixed bottom navigation
- `/Users/hidenari-yuda/hitoon-web/components/layout/page-container.tsx` - Page wrapper with consistent padding

### UI Components
- `/Users/hidenari-yuda/hitoon-web/components/ui/button.tsx` - Reusable button (primary, secondary, ghost, danger variants)
- `/Users/hidenari-yuda/hitoon-web/components/ui/modal.tsx` - Modal dialog with accessibility features

### Card Components
- `/Users/hidenari-yuda/hitoon-web/components/cards/artist-card.tsx` - Trading card (3:4 aspect ratio) with rarity styling
- `/Users/hidenari-yuda/hitoon-web/components/cards/card-grid.tsx` - Responsive grid layout (2-4 columns)
- `/Users/hidenari-yuda/hitoon-web/components/cards/rarity-badge.tsx` - Rarity badge indicator

### Feature Components
- `/Users/hidenari-yuda/hitoon-web/components/PurchaseAgreement.tsx` - Purchase modal with quantity selector, terms acceptance, and mock checkout

## Utilities & Helpers

### Format Utilities
- `/Users/hidenari-yuda/hitoon-web/lib/utils/format.ts` - formatPrice(), formatSerialNumber(), formatDate(), formatMemberCount()
- `/Users/hidenari-yuda/hitoon-web/lib/utils/cn.ts` - Class name merge utility (clsx + tailwind-merge)

### Supabase Integration
- `/Users/hidenari-yuda/hitoon-web/lib/supabase/client.ts` - Browser client for 'use client' components
- `/Users/hidenari-yuda/hitoon-web/lib/supabase/server.ts` - Server client and admin client with service role

### Stripe Integration
- `/Users/hidenari-yuda/hitoon-web/lib/stripe/client.ts` - Stripe client instance and helper functions (getOrCreateStripeCustomer, createCheckoutSession)

## Configuration

- `/Users/hidenari-yuda/hitoon-web/constants/routes.ts` - Route paths and API endpoint constants
- `/Users/hidenari-yuda/hitoon-web/constants/config.ts` - App config, card config, rarity pricing, pagination
- `/Users/hidenari-yuda/hitoon-web/tailwind.config.js` - Tailwind configuration
- `/Users/hidenari-yuda/hitoon-web/tsconfig.json` - TypeScript configuration (strict mode enabled)
- `/Users/hidenari-yuda/hitoon-web/next.config.ts` - Next.js configuration

## Styling

- `/Users/hidenari-yuda/hitoon-web/app/globals.css` - Global styles, theme variables, animations (holo-shine)
- `/Users/hidenari-yuda/hitoon-web/app/favicon.ico` - App favicon

## Documentation & Guidelines

- `/Users/hidenari-yuda/hitoon-web/CLAUDE.md` - Main project instructions (tech stack, directory structure, principles)
- `/Users/hidenari-yuda/hitoon-web/docs/definition.md` - Complete PRD (features, requirements, data model, API design)
- `/Users/hidenari-yuda/hitoon-web/.claude/rules/frontend.md` - Frontend patterns (Next.js 16, React 19, Tailwind)
- `/Users/hidenari-yuda/hitoon-web/.claude/rules/database.md` - Database schema, RLS policies, query patterns
- `/Users/hidenari-yuda/hitoon-web/.claude/rules/payments.md` - Stripe integration patterns and Webhook handling
- `/Users/hidenari-yuda/hitoon-web/.claude/rules/ui-design.md` - Design system, card styling, colors, typography

## Empty/Not Implemented Directories

### Empty Route Groups
- `/Users/hidenari-yuda/hitoon-web/app/(auth)/` - Needs login/, signup/ pages
- `/Users/hidenari-yuda/hitoon-web/app/(main)/collection/[id]/` - Needs page.tsx for collection detail

### Empty API Routes
- `/Users/hidenari-yuda/hitoon-web/app/api/artists/` - Needs route.ts
- `/Users/hidenari-yuda/hitoon-web/app/api/artists/[id]/` - Needs route.ts
- `/Users/hidenari-yuda/hitoon-web/app/api/cards/` - Needs route.ts
- `/Users/hidenari-yuda/hitoon-web/app/api/checkout/` - Needs route.ts
- `/Users/hidenari-yuda/hitoon-web/app/api/webhooks/stripe/` - Needs route.ts

### Not Yet Implemented
- `/Users/hidenari-yuda/hitoon-web/app/(admin)/` - Entire admin dashboard missing

### Empty Component Directories
- `/Users/hidenari-yuda/hitoon-web/components/features/` - For future feature-specific components
- `/Users/hidenari-yuda/hitoon-web/components/forms/` - Will contain auth/checkout forms
- `/Users/hidenari-yuda/hitoon-web/hooks/` - Empty directory (ready for custom hooks)

## Mock Data Locations (TO REPLACE)

- `app/(main)/page.tsx` - MOCK_ARTISTS (line 8-30)
- `app/(main)/market/page.tsx` - MOCK_ARTISTS (line 13-38)
- `app/(main)/artists/[id]/page.tsx` - MOCK_ARTISTS (line 16-89)
- `app/(main)/collection/page.tsx` - MOCK_COLLECTION (line 14-43)

All marked with TODO: Replace with Supabase query comments.

## Key Dependencies to Understand

- `@supabase/ssr@0.8.0` - Server-side rendering with Supabase Auth
- `@supabase/supabase-js@2.90.1` - Supabase JS client
- `stripe@20.3.0` - Stripe SDK for backend
- `tailwind-merge@3.4.0` - Merge Tailwind classes without conflicts
- `clsx@2.1.1` - Conditional class names
- `lucide-react@0.562.0` - Icon library
- `next@16.1.3` - Next.js framework
- `react@19.2.3` - React framework
