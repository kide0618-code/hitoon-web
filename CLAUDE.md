# HITOON - Project Overview

**Tag line**: 音楽を、一生モノにする。
**Platform**: Artist Digital Content Marketplace (Web/Mobile)
**MVP URL**: https://hitoon-music.vercel.app/

## Quick Start

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Type Check
pnpm tsc --noEmit
```

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL, Auth, Storage)           |
| Payments   | Stripe (Checkout, Payment Links, Saved Cards)  |
| Hosting    | Vercel                                         |

## Directory Structure

```
hitoon-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── globals.css               # Global styles
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   │
│   ├── (main)/                   # Main app group (with bottom nav)
│   │   ├── layout.tsx            # Layout with BottomNav
│   │   ├── page.tsx              # Home - Pickup Artists
│   │   ├── market/
│   │   │   └── page.tsx          # Artist marketplace
│   │   ├── collection/
│   │   │   ├── page.tsx          # My collection
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Card detail
│   │   └── artists/
│   │       └── [id]/
│   │           └── page.tsx      # Artist detail + Purchase
│   │
│   ├── (auth)/                   # Auth group (future)
│   │   ├── layout.tsx
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── (legal)/                  # Legal pages (no bottom nav)
│   │   ├── layout.tsx
│   │   ├── terms/
│   │   └── privacy/
│   │
│   └── api/                      # API Routes
│       ├── artists/
│       ├── cards/
│       ├── checkout/
│       └── webhooks/stripe/
│
├── components/                   # React Components
│   ├── ui/                       # Primitives (Button, Modal, Input)
│   ├── cards/                    # Card-related (ArtistCard, RarityBadge)
│   ├── layout/                   # Layout (BottomNav, PageContainer)
│   ├── forms/                    # Forms (PurchaseForm)
│   └── features/                 # Feature-specific components
│
├── lib/                          # Utilities & Clients
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client + Admin client
│   ├── stripe/
│   │   └── client.ts             # Stripe SDK
│   └── utils/
│       ├── cn.ts                 # clsx + tailwind-merge
│       └── format.ts             # Price, date, serial formatters
│
├── types/                        # TypeScript Definitions
│   ├── artist.ts
│   ├── card.ts
│   ├── purchase.ts
│   └── index.ts                  # Re-exports
│
├── config/                       # Configuration
│   ├── frame-templates.ts        # Frame template definitions (CSS classes, effects)
│   └── index.ts                  # Re-exports
│
├── constants/                    # Constants
│   ├── routes.ts                 # Route definitions
│   └── config.ts                 # App config
│
├── hooks/                        # Custom React Hooks
│
├── docs/                         # Documentation
│   ├── definition.md             # PRD (Product Requirements)
│   └── card-image.png            # Card design reference
│
└── .claude/
    └── rules/                    # Domain-specific guidelines
        ├── frontend.md
        ├── database.md
        ├── payments.md
        └── ui-design.md
```

## Core Concepts

### Business Model

1. **B2C Sales**: 管理者がアーティストのデジタルカードを出品
2. **Single Purchase**: Stripeでの都度課金（サブスク無し）
3. **Exclusive Content**: 購入者のみアクセス可能なコンテンツ
4. **Future C2C**: 将来的に2次流通マーケットを検討

### User Flow

```
[Browse] → [Artist Detail] → [Select Card] → [Purchase] → [Stripe Checkout]
                                                              ↓
[Collection] ← [Webhook] ← [Payment Complete]
     ↓
[View Exclusive Content]
```

### Key Entities

| Entity           | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| Artist           | アーティスト情報（名前、説明、画像）                          |
| CardVisual       | カードビジュアル（アーティスト画像、楽曲名）- DB管理          |
| FrameTemplate    | フレームテンプレート（枠・エフェクト）- TypeScript Config管理 |
| Card             | デジタルトレカ（価格、レアリティ、限定数）                    |
| ExclusiveContent | 購入者限定コンテンツ（動画、音楽、画像）                      |
| User             | 購入者（Email/Password, Google OAuth）                        |
| Purchase         | 購入履歴（Stripe連携）                                        |

### Card Visual & Frame System

**Design Reference**: `/docs/card-image.png`

カードは「ビジュアル（コンテンツ）」と「フレーム（装飾）」の2層構造：

```
┌─────────────────────────────────────────────────────────┐
│  CardVisual (DB: card_visuals)                          │
│  - アーティスト画像                                       │
│  - 楽曲名・サブタイトル                                   │
│  - 管理画面から登録                                      │
└─────────────────────────────────────────────────────────┘
                            +
┌─────────────────────────────────────────────────────────┐
│  FrameTemplate (TypeScript: config/frame-templates.ts)  │
│  - フレーム画像/CSS                                      │
│  - エフェクト（ホログラム、スパークル等）                   │
│  - レアリティごとに定義                                   │
│  - エンジニアが管理                                      │
└─────────────────────────────────────────────────────────┘
```

管理画面からビジュアルを作成し、1ビジュアルにつき3つのレアリティカードを自動生成。

| レアリティ | Code | 価格帯          | 発行上限   |
| ---------- | ---- | --------------- | ---------- |
| NORMAL     | N    | ¥800〜¥1,500    | 無制限     |
| RARE       | R    | ¥1,500〜¥3,000  | 100〜300枚 |
| SUPER_RARE | SR   | ¥3,000〜¥10,000 | 10〜50枚   |

## Development Guidelines

- **変更禁止**: 明示的に要求されていない変更は行わない
- **UI/UX凍結**: 事前承認なしにデザイン変更しない
- **重複防止**: 実装前に既存コードを確認する
- **報告形式**: タスク完了時は「実行結果報告」形式で報告

## Coding Principles

### 1. Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

- No features beyond what was asked.
- No abstractions for single-use code.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

- Don't "improve" adjacent code, comments, or formatting.
- Match existing style, even if you'd do it differently.
- Remove only orphaned code that YOUR changes created.

### 4. Goal-Driven Execution

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"

## Import Conventions

```typescript
// Use path aliases
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import type { Artist } from '@/types';

// Order: React → Next → External → Internal → Types
import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Rarity } from '@/types/card';
```

## Rules (Domain Guidelines)

詳細なドメイン知識は `.claude/rules/` を参照:

| File           | Description                       |
| -------------- | --------------------------------- |
| `frontend.md`  | Next.js/React/TypeScript patterns |
| `database.md`  | Supabase schema & queries         |
| `payments.md`  | Stripe integration guidelines     |
| `ui-design.md` | Design system & card styling      |
