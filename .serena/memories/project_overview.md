# HITOON - Codebase Overview

## Project Purpose
HITOON is an Artist Digital Content Marketplace built with Next.js 16, React 19, TypeScript, and Tailwind CSS. It enables users to purchase digital trading cards (デジタルトレカ) of artists and unlock exclusive content. The platform supports Stripe payments and uses Supabase for authentication and database.

**Tagline**: 音楽を、一生モノにする。(Make music a lifelong possession)

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS 3.4.1 + @tailwindcss/postcss@4
- **Icons**: Lucide React 0.562.0
- **Utilities**: clsx, tailwind-merge

### Backend & Database
- **Auth & DB**: Supabase (PostgreSQL) with SSR support
- **ORM/Client**: @supabase/supabase-js v2.90.1, @supabase/ssr v0.8.0

### Payments
- **Provider**: Stripe (v20.3.0)
- **Mode**: Payment (not subscriptions)

### Hosting
- **Platform**: Vercel

## Development Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint (ESLint v9)
```

## TypeScript Configuration
- **Target**: ES2017
- **Strict Mode**: Enabled (strict: true)
- **Path Alias**: @/* maps to root directory
- **JSX**: react-jsx

## Code Style & Conventions

### Component Organization
- **App Router**: Next.js 16 App Router with Route Groups
- **Route Groups**: (main), (auth), (legal), (admin)
- **Server Components**: Default (no 'use client' needed)
- **Client Components**: Use 'use client' directive sparingly

### TypeScript
- Strong type safety with strict mode
- Types defined in /types directory
- Interface naming: `Entity` for types, `EntityProps` for component props

### File Naming
- Components: kebab-case (e.g., artist-card.tsx)
- Types: entity.ts
- Utilities: descriptive names (e.g., format.ts)

### Styling
- Tailwind CSS classes with class-value utilities
- Use `cn()` utility from lib/utils/cn.ts to merge classes
- Dark theme default (black background, gray-900 surfaces)
- Color scheme: Blue (#3b82f6), Fuchsia (#e879f9), Yellow/Gold (#fbbf24)
