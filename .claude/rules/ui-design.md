# UI/UX Design Rules

## Design Concept

**Keyword**: Music Fan Culture × Premium Trading Card
**Tagline**: 音楽を、一生モノにする。

**原則**:

- ダークテーマで音楽・ライブの世界観を表現
- トレカのコレクション性・所有欲を刺激
- モバイルファースト（Twitch/SNS連携を意識）

## Color Palette

| Role           | Color     | Tailwind           | Note           |
| -------------- | --------- | ------------------ | -------------- |
| Background     | `#000000` | `bg-black`         | Pure Black     |
| Surface        | `#111827` | `bg-gray-900`      | Card背景       |
| Border         | `#1f2937` | `border-gray-800`  | 控えめな区切り |
| Primary        | `#3b82f6` | `text-blue-500`    | CTA、価格      |
| Secondary      | `#e879f9` | `text-fuchsia-400` | アクセント     |
| Gold           | `#fbbf24` | `text-yellow-400`  | レジェンダリー |
| Text Primary   | `#ffffff` | `text-white`       | 見出し         |
| Text Secondary | `#6b7280` | `text-gray-500`    | サブテキスト   |

## Typography

| Use         | Font      | Class                 |
| ----------- | --------- | --------------------- |
| 本文        | Inter     | `font-sans` (default) |
| 日本語      | System UI | ブラウザデフォルト    |
| シリアルNo. | Monospace | `font-mono`           |
| 価格        | Bold      | `font-bold`           |

## Card Design (トレカスタイル)

**デザイン例**: `/docs/card-image.png`

### ビジュアル & フレームシステム概要

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
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Card (表示時に合成)                                     │
│  - CardVisual（中身） + FrameTemplate（装飾）             │
└─────────────────────────────────────────────────────────┘
```

### 1ビジュアル = 3レアリティ構成

同じビジュアル（画像データ）で、フレームテンプレートが異なる3パターンを提供:

| レアリティ      | 価格帯          | フレーム特徴              | 発行上限       |
| --------------- | --------------- | ------------------------- | -------------- |
| NORMAL (N)      | ¥800〜¥1,500    | シンプルな黒フレーム      | 無制限 or 多め |
| RARE (R)        | ¥1,500〜¥3,000  | 青〜紫のグロー効果        | 100〜300枚     |
| SUPER RARE (SR) | ¥3,000〜¥10,000 | ホログラム + ゴールド装飾 | 10〜50枚       |

### Aspect Ratio

- **3:4** (標準トレカ比率)
- 600x800px を基準

### Card Structure (デザイン例ベース)

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │ ← Rarity Frame
│  │                       │  │
│  │    Artist Visual      │  │ ← メインビジュアル (80%)
│  │    (Template Layer)   │  │
│  │                       │  │
│  ├───────────────────────┤  │
│  │ IDOL: MARIN           │  │ ← アーティスト名ラベル
│  │ SONG: OCEAN BREEZE    │  │ ← 楽曲名 / サブタイトル
│  └───────────────────────┘  │
│  Rarity: SR  #042 / 300     │ ← レアリティ & シリアル
│  Owned: 1                   │ ← 所有数
│  ┌─────┐                    │
│  │ QR  │  BONUS CONTENT     │ ← 限定コンテンツへのリンク
│  └─────┘  SPECIAL LIVE URL  │
└─────────────────────────────┘
```

### カードレイヤー構造

```
Layer 1: Background (レアリティ別グラデーション) ← FrameTemplate
Layer 2: Frame (レアリティ別デザイン) ← FrameTemplate
Layer 3: Artist Image (アップロード画像) ← CardVisual (DB)
Layer 4: Text Overlay (名前、楽曲名) ← CardVisual (DB)
Layer 5: Metadata (シリアル、レアリティバッジ) ← 自動生成
Layer 6: Effects (ホログラム、パーティクル) ← FrameTemplate
```

### Frame Template Styles (config/frame-templates.ts)

| Rarity     | Frame Color            | Background           | Effect             | CSS Class         |
| ---------- | ---------------------- | -------------------- | ------------------ | ----------------- |
| NORMAL     | `#4b5563` (gray-600)   | Dark gradient        | なし               | `card-normal`     |
| RARE       | `#3b82f6` (blue-500)   | Blue-purple gradient | Glow               | `card-rare`       |
| SUPER_RARE | `#fbbf24` (yellow-400) | Gold-pink gradient   | Hologram + Sparkle | `card-super-rare` |

```typescript
// config/frame-templates.ts
export type FrameTemplateId = 'classic-normal' | 'classic-rare' | 'classic-super-rare';

export interface FrameTemplate {
  id: FrameTemplateId;
  name: string;
  rarity: Rarity;
  cssClass: string;
  effects: string[];
  borderColor: string;
  glowColor?: string;
}

// レアリティからデフォルトフレームを取得
export function getDefaultFrameForRarity(rarity: Rarity): FrameTemplate;
```

### 管理画面での入力項目 (CardVisual)

```typescript
interface CardVisualInput {
  // 必須
  artistId: string;
  name: string; // ビジュアル名（管理用: "1st Album"等）
  artistImage: File; // アップロード画像

  // 任意
  songTitle?: string; // 楽曲名
  subtitle?: string; // サブタイトル

  // レアリティ別設定（3パターン）
  variants: {
    rarity: 'NORMAL' | 'RARE' | 'SUPER_RARE';
    price: number;
    totalSupply: number | null; // null = 無制限
    isActive: boolean;
  }[];
}
```

### CSS Implementation

```css
/* カード基本スタイル */
.card {
  aspect-ratio: 3 / 4;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

/* レアリティフレーム - 3パターン */
.card-normal {
  border: 2px solid #4b5563;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
}

.card-rare {
  border: 2px solid #3b82f6;
  background: linear-gradient(180deg, #1e3a5f 0%, #1e1b4b 100%);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.card-super-rare {
  border: 3px solid #fbbf24;
  background: linear-gradient(180deg, #44337a 0%, #831843 50%, #1e3a5f 100%);
  box-shadow:
    0 0 30px rgba(251, 191, 36, 0.4),
    inset 0 0 20px rgba(251, 191, 36, 0.1);
}

/* ホログラムエフェクト（SUPER_RARE専用） */
.holo-effect {
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 45%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 55%,
    transparent 100%
  );
  background-size: 200% 200%;
  animation: holo-shine 3s ease-in-out infinite;
}

@keyframes holo-shine {
  0%,
  100% {
    background-position: -100% 0;
  }
  50% {
    background-position: 200% 0;
  }
}

/* スパークルエフェクト（SUPER_RARE専用） */
.sparkle-effect::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #fbbf24 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* メタデータ表示 */
.card-metadata {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

/* レアリティバッジ */
.rarity-badge-n {
  background: #4b5563;
  color: #fff;
}
.rarity-badge-r {
  background: #3b82f6;
  color: #fff;
}
.rarity-badge-sr {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
}
```

### Tailwind Component Example (FrameTemplate使用)

```tsx
// components/cards/ArtistCard.tsx
import { getDefaultFrameForRarity } from '@/config/frame-templates';
import type { Rarity } from '@/types/card';

interface ArtistCardProps {
  artistName: string;
  artistImageUrl: string;
  songTitle?: string | null;
  rarity: Rarity;
  serialNumber?: number;
  totalSupply?: number | null;
  owned?: number;
  bonusContentUrl?: string | null;
}

function ArtistCard({
  artistName,
  artistImageUrl,
  songTitle,
  rarity,
  serialNumber,
  totalSupply,
  owned = 1,
  bonusContentUrl,
}: ArtistCardProps) {
  // フレームテンプレートから設定を取得
  const frame = getDefaultFrameForRarity(rarity);

  return (
    <div
      className={cn(
        'trading-card',
        frame.cssClass, // card-normal, card-rare, card-super-rare
        'transition-transform hover:scale-105',
      )}
    >
      {/* Main Visual - CardVisual (DB) */}
      <div className="relative h-[70%]">
        <img src={artistImageUrl} alt={artistName} className="h-full w-full object-cover" />
        {/* Effects - FrameTemplate */}
        {frame.effects.includes('hologram') && (
          <div className="holo-effect pointer-events-none absolute inset-0" />
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-1 p-3">
        <p className="text-xs uppercase tracking-wider text-gray-400">IDOL: {artistName}</p>
        {songTitle && <p className="text-xs text-gray-500">SONG: {songTitle}</p>}
        <div className="flex items-center justify-between pt-2 text-xs">
          <RarityBadge rarity={rarity} />
          {serialNumber !== undefined && (
            <span className="font-mono text-gray-400">
              #{String(serialNumber).padStart(3, '0')}
              {totalSupply && ` / ${totalSupply}`}
            </span>
          )}
        </div>
        {owned !== undefined && <p className="text-xs text-gray-500">Owned: {owned}</p>}
      </div>

      {/* Bonus Content Link */}
      {bonusContentUrl && (
        <div className="absolute bottom-2 right-2">
          <a href={bonusContentUrl} className="text-xs text-blue-400 underline">
            BONUS CONTENT
          </a>
        </div>
      )}
    </div>
  );
}
```

### Marketplace Grid (デザイン例準拠)

```tsx
// Marketplace: 2x3 グリッド
<div className="grid grid-cols-2 gap-4 p-4">
  {cards.map((card) => (
    <div key={card.id} className="space-y-2">
      <ArtistCard {...card} />
      <div className="text-center">
        <p className="text-lg font-bold text-white">¥{card.price.toLocaleString()}</p>
        <button className="w-full rounded-lg bg-blue-600 py-2 font-bold text-white">BUY</button>
      </div>
    </div>
  ))}
</div>
```

### Collection Detail View (デザイン例準拠)

```tsx
// My Collection: 詳細表示
<div className="p-4">
  <h1 className="mb-4 text-xl font-bold">My Collection - {totalCards} Cards</h1>
  <div className="mx-auto max-w-sm">
    <ArtistCard {...selectedCard} />
    <div className="mt-4 space-y-2 text-sm">
      <p className="text-gray-400">BONUS CONTENT:</p>
      <p className="text-blue-400">SPECIAL LIVE URL</p>
      <button className="w-full rounded-lg bg-white py-3 font-bold text-black">VIEW</button>
    </div>
  </div>
</div>
```

## Layout Patterns

### Bottom Navigation

```tsx
// 固定下部ナビ（モバイル標準）
<nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-800 bg-black/90 backdrop-blur-md">
  <div className="flex items-center justify-around p-2">{/* Home, Store, Collection */}</div>
</nav>
```

### Card Grid

```tsx
// コレクション表示
<div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
  {cards.map((card) => (
    <ArtistCard key={card.id} {...card} />
  ))}
</div>
```

### Artist List Item

```tsx
<div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-3 transition-colors hover:border-blue-500/50">
  <img className="h-16 w-16 rounded-full object-cover" />
  <div className="flex-1">
    <h3 className="font-bold">{name}</h3>
    <p className="text-xs text-gray-500">{members} Members</p>
  </div>
  <div className="font-bold text-blue-400">¥{price}</div>
</div>
```

## Animation Guidelines

### Micro-interactions

- ホバー: `transition-all duration-200`
- ボタン押下: `active:scale-95`
- カードホバー: `hover:scale-105 hover:shadow-lg`

### Loading States

```tsx
<div className="animate-pulse bg-gray-800 rounded-xl" />
<Loader2 className="animate-spin" />
```

### Success Feedback

- 購入完了: カードが光るエフェクト
- コレクション追加: スライドインアニメーション

## Responsive Design

| Breakpoint | Width    | Use                   |
| ---------- | -------- | --------------------- |
| Default    | < 640px  | モバイル（1-2列）     |
| `sm:`      | ≥ 640px  | タブレット縦（2-3列） |
| `md:`      | ≥ 768px  | タブレット横          |
| `lg:`      | ≥ 1024px | デスクトップ（3-4列） |

## Accessibility

- コントラスト比: 4.5:1 以上を維持
- タッチターゲット: 最小44x44px
- フォーカス表示: `focus:ring-2 focus:ring-blue-500`

## DO / DON'T

### DO

- ダークテーマを一貫して使用
- カードは「宝物」感を演出
- アーティスト画像を大きく見せる
- 価格・レアリティを明確に表示

### DON'T

- 白背景の使用（眩しい）
- 過度なアニメーション
- テキスト詰め込みすぎ
- 低コントラストの配色

## References

- **カードデザイン例**: `/docs/card-image.png`
- [ポケモンカード レアリティ一覧](https://www.sangatuusagi.com/pokeking/card/rarity.html)
- MVP: https://hitoon-music.vercel.app/
