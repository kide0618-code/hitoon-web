# HITOON

**音楽を、一生モノにする。**

Artist Digital Content Marketplace - アーティストのデジタルトレカを購入・コレクションできるプラットフォーム

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Payments | Stripe (Checkout, Webhooks) |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase account
- Stripe account

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Apply migrations
supabase db push

# (Optional) Seed sample data
supabase db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Stripe Webhook (Local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Architecture

```
hitoon-web/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Public pages (home, market, artists)
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── (legal)/                  # Legal pages (terms, privacy)
│   ├── (admin)/                  # Admin dashboard
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard
│   │       ├── artists/          # Artist management
│   │       ├── templates/        # Template management
│   │       ├── cards/            # Card management
│   │       └── purchases/        # Purchase history
│   ├── api/                      # API Routes
│   │   ├── artists/              # GET /api/artists, /api/artists/:id
│   │   ├── cards/                # GET /api/cards, /api/cards/:id
│   │   ├── purchases/            # GET /api/purchases, /api/purchases/:id
│   │   ├── checkout/             # POST /api/checkout
│   │   ├── webhooks/stripe/      # POST /api/webhooks/stripe
│   │   └── me/                   # GET/DELETE /api/me
│   └── auth/callback/            # OAuth callback
├── components/                   # React components
│   ├── ui/                       # Primitive components
│   ├── cards/                    # Card components
│   ├── layout/                   # Layout components
│   └── auth/                     # Auth components
├── lib/                          # Utilities
│   ├── supabase/                 # Supabase clients
│   └── stripe/                   # Stripe client
├── types/                        # TypeScript types
│   └── database.ts               # Database types
├── hooks/                        # React hooks
├── supabase/                     # Supabase config
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Sample data
└── docs/                         # Documentation
    └── definition.md             # Requirements
```

## Database Schema

```
artists
  └── card_templates (1:N)
        └── cards (1:3 per template: NORMAL, RARE, SUPER_RARE)
              └── exclusive_contents (1:N)
              └── purchases (1:N)

profiles (extends auth.users)
operators (admin roles)
```

### Key Features

- **Card Template System**: 1 artist → N templates → 3 cards per template (by rarity)
- **Atomic Serial Numbers**: Race condition prevention via PostgreSQL function
- **Idempotent Webhooks**: Unique constraints prevent duplicate purchases
- **RLS Policies**: Row-level security for all tables

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm type-check   # TypeScript check
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/artists` | List artists |
| GET | `/api/artists/:id` | Artist detail with templates |
| GET | `/api/cards` | List cards (filterable) |
| GET | `/api/cards/:id` | Card detail with exclusive content |
| GET | `/api/purchases` | User's purchase history |
| GET | `/api/purchases/:id` | Purchase detail |
| POST | `/api/checkout` | Create Stripe checkout |
| POST | `/api/webhooks/stripe` | Stripe webhook handler |
| GET | `/api/me` | Current user info |
| DELETE | `/api/me` | Delete account |

## Admin Access

1. Add user to `operators` table:
```sql
INSERT INTO operators (user_id, role)
VALUES ('user-uuid', 'admin');
```

2. Access `/admin` dashboard

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/hitoon-web)

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

## License

Private - All rights reserved
