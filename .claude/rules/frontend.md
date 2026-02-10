# Frontend Rules (Next.js / React / TypeScript)

## Applies to: `app/**`, `components/**`, `lib/**`, `types/**`

## Architecture Overview

### Route Groups

```
app/
├── (main)/          # Pages with BottomNav (/, /market, /collection, /artists/*)
├── (auth)/          # Auth pages without BottomNav (future)
├── (legal)/         # Legal pages with simple back button
└── api/             # API Routes
```

### Component Hierarchy

```
components/
├── ui/              # Primitive, reusable components
│   ├── button.tsx   # <Button variant="primary" size="lg" isLoading />
│   ├── modal.tsx    # <Modal isOpen onClose title>
│   └── input.tsx    # Form inputs (future)
│
├── cards/           # Card-specific components
│   ├── artist-card.tsx   # Full card display with rarity effects
│   ├── card-grid.tsx     # Grid layout wrapper
│   └── rarity-badge.tsx  # N/R/SR badge
│
├── layout/          # Layout components
│   ├── bottom-nav.tsx    # Fixed bottom navigation
│   └── page-container.tsx # Page wrapper with padding
│
└── features/        # Feature-specific (co-located with feature)
    ├── home/
    └── collection/
```

## Next.js 16 Patterns

### Route Groups (No URL Impact)

```typescript
// app/(main)/layout.tsx - Adds BottomNav
export default function MainLayout({ children }) {
  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNav />
    </>
  );
}

// app/(legal)/layout.tsx - Simple back button, no nav
export default function LegalLayout({ children }) {
  return (
    <div>
      <header><BackButton /></header>
      <main>{children}</main>
    </div>
  );
}
```

### Server vs Client Components

```typescript
// Default: Server Component (can fetch directly)
// app/(main)/market/page.tsx
export default async function MarketPage() {
  const artists = await getArtists(); // Direct DB call
  return <ArtistList artists={artists} />;
}

// Client Component (interactive)
// components/cards/artist-card.tsx
'use client';
export function ArtistCard({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => setIsHovered(true)} />;
}
```

### Dynamic Routes with Params Promise

```typescript
// app/(main)/artists/[id]/page.tsx
// Next.js 16: params is a Promise
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistPage({ params }: PageProps) {
  const { id } = use(params);
  // ...
}
```

### Metadata

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Store',
  description: 'アーティストのデジタルカードを探す',
};

// Dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtist(id);
  return {
    title: artist.name,
    description: artist.description,
  };
}
```

## TypeScript Guidelines

### Type Location

```
types/
├── artist.ts    # Artist, ArtistWithCards, ArtistListItem
├── card.ts      # Card, CardTemplate, Rarity, RARITY_CONFIG
├── purchase.ts  # Purchase, PurchaseWithDetails, CollectionItem
└── index.ts     # Re-exports all types
```

### Type Usage

```typescript
// Import from @/types
import type { Artist, Card, Rarity } from '@/types';

// Use RARITY_CONFIG for display logic
import { RARITY_CONFIG } from '@/types/card';
const config = RARITY_CONFIG[rarity]; // { code, label, frameClass, badgeClass }
```

### Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Component Patterns

### Button Component

```tsx
import { Button } from '@/components/ui/button';

// Variants: primary, secondary, ghost, danger
// Sizes: sm, md, lg
<Button variant="primary" size="lg" isLoading={isSubmitting}>
  購入する
</Button>;
```

### Card Component

```tsx
import { ArtistCard } from '@/components/cards/artist-card';

<ArtistCard
  artistName="Sample Artist"
  artistImageUrl="/image.jpg"
  songTitle="Demo Song"
  rarity="SUPER_RARE"
  serialNumber={42}
  totalSupply={100}
  owned={1}
  bonusContentUrl="https://..."
  onClick={() => handleSelect()}
/>;
```

### Page Container

```tsx
import { PageContainer } from '@/components/layout/page-container';

// Automatically adds bottom padding for nav
<PageContainer>
  <h1>Page Content</h1>
</PageContainer>;
```

## Styling Patterns

### cn() Utility

```typescript
import { cn } from '@/lib/utils/cn';

// Merges classes and handles conflicts
<div className={cn(
  'base-styles',
  isActive && 'active-styles',
  className // Allow override from props
)} />
```

### Tailwind Class Order

```tsx
<div className="
  flex flex-col           // Layout
  w-full h-64             // Sizing
  p-4 gap-2               // Spacing
  bg-gray-900 text-white  // Colors
  rounded-xl border       // Effects
  hover:border-blue-500   // States
  transition-colors       // Animation
">
```

### Responsive Design

```tsx
<div className="
  grid grid-cols-2        // Mobile: 2 columns
  sm:grid-cols-3          // Tablet: 3 columns
  lg:grid-cols-4          // Desktop: 4 columns
  gap-4
">
```

## Data Fetching

### Server Components (Preferred)

```typescript
// Direct Supabase call in Server Component
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function MarketPage() {
  const supabase = await createServerSupabaseClient();
  const { data: artists } = await supabase
    .from('artists')
    .select('*')
    .order('member_count', { ascending: false });

  return <ArtistList artists={artists} />;
}
```

### Client Components

```typescript
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function CollectionList() {
  const [purchases, setPurchases] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('purchases').select('*').then(({ data }) => {
      setPurchases(data || []);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

## Error Handling

### Error Boundary

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={reset}>もう一度試す</button>
    </div>
  );
}
```

### Loading States

```typescript
// app/(main)/market/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="aspect-[3/4] bg-gray-800 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

## Best Practices

1. **'use client' は最小限に**: インタラクティブな部分だけをClient Componentに
2. **Route Groupsを活用**: レイアウト共有のためにグループ化
3. **型はtypes/に集約**: 再利用性とメンテナンス性の向上
4. **cn()でクラス管理**: 条件付きクラスとオーバーライドを安全に
5. **パスエイリアス**: `@/` を使用して相対パスを回避
6. **Metadata**: 全ページでSEO用のmetadataを定義
7. **エラー境界**: error.tsx, not-found.tsx を必ず用意
