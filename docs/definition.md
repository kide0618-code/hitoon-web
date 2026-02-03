# HITOON - Product Requirements Document (PRD)

**Version**: 1.0.0
**Last Updated**: 2026-02-02
**Status**: Active Development
**MVP URL**: <https://hitoon-music.vercel.app/>

***

## 1. Executive Summary

### 1.1 Product Vision

> **「音楽を、一生モノにする。」**

HITOONは、アーティストのデジタルトレーディングカードを販売するマーケットプレイスです。ファンは好きなアーティストのカードを購入し、限定コンテンツにアクセスできます。

### 1.2 Problem Statement

| Problem       | Current State | HITOON Solution |
| ------------- | ------------- | --------------- |
| ファンとアーティストの距離 | SNSフォローのみ     | 所有感のあるデジタルカード   |
| デジタルコンテンツの価値  | 無料で消費される      | 限定性・希少性による価値付け  |
| 収益化の難しさ       | ライブ・グッズ依存     | デジタル販売による新収益源   |

### 1.3 Target Users

| Persona              | Description            | Primary Need   |
| -------------------- | ---------------------- | -------------- |
| **Music Fan**        | 20-35歳、特定アーティストの熱心なファン | 推しへの貢献、限定コンテンツ |
| **Casual Collector** | トレカ文化に親しみのあるユーザー       | コレクション欲、レアリティ  |
| **Artist/Label**     | 新しい収益源を求めるアーティスト       | ファンエンゲージメント、収益 |

### 1.4 Success Metrics (KPIs)

| Metric                              | Target (MVP) | Target (6mo) |
| ----------------------------------- | ------------ | ------------ |
| MAU (Monthly Active Users)          | 500          | 5,000        |
| Conversion Rate (Browse → Purchase) | 3%           | 5%           |
| Average Order Value                 | ¥2,500       | ¥3,500       |
| Repeat Purchase Rate                | 20%          | 40%          |

***

## 2. Functional Requirements

### 2.1 User-Facing Features

#### 2.1.1 Authentication (認証)

| ID       | Feature          | Priority | Description            |
| -------- | ---------------- | -------- | ---------------------- |
| AUTH-001 | Email/Password登録 | P0       | メールアドレスとパスワードでの新規登録    |
| AUTH-002 | Google OAuth     | P0       | Googleアカウントでのソーシャルログイン |
| AUTH-003 | パスワードリセット        | P1       | メール経由でのパスワード再設定        |
| AUTH-004 | セッション管理          | P0       | JWTベースのセッション維持         |
| AUTH-005 | メール認証            | P0       | 購入前にメールアドレス確認必須        |
| AUTH-006 | 認証メール再送          | P1       | 認証メールの再送信機能            |
| AUTH-007 | アカウント削除          | P1       | 個人情報保護法対応（退会機能）        |

**認証ポリシー**:

* 未ログインでも全ページ閲覧可能（カード一覧、詳細など）
* 購入時のみログイン必須
* メール認証完了後に購入可能
* アカウント削除時は購入履歴を匿名化して保持（法的要件）

#### 2.1.2 Marketplace (マーケットプレイス)

| ID      | Feature  | Priority | Description         |
| ------- | -------- | -------- | ------------------- |
| MKT-001 | ホーム画面    | P0       | おすすめアーティスト表示（管理者選定） |
| MKT-002 | アーティスト一覧 | P0       | 全アーティストのグリッド表示      |
| MKT-003 | アーティスト詳細 | P0       | プロフィール、カード一覧、価格表示   |
| MKT-004 | カード詳細    | P0       | レアリティ、シリアル、在庫状況     |
| MKT-005 | 検索・フィルタ  | P2       | 名前検索、レアリティフィルタ      |
| MKT-006 | ソート機能    | P2       | 価格順、人気順、新着順         |

**テンプレート仕様**:

* 1アーティスト = 複数テンプレート可能（アルバム別、シングル別など）
* 1テンプレート → 3カード (NORMAL, RARE, SUPER\_RARE)

#### 2.1.3 Purchase Flow (購入フロー)

| ID      | Feature | Priority | Description         |
| ------- | ------- | -------- | ------------------- |
| PUR-001 | 数量選択    | P0       | 一度に複数枚購入可能          |
| PUR-002 | 単品購入    | P0       | Stripe Checkoutへの遷移 |
| PUR-003 | 利用規約同意  | P0       | 購入前の規約同意チェック        |
| PUR-004 | 決済完了処理  | P0       | Webhook経由での購入確定     |
| PUR-005 | 購入確認メール | P1       | 購入完了通知              |
| PUR-006 | カート機能   | P2       | 複数カードの一括購入（将来実装）    |

**購入ポリシー**:

* 同一ユーザーが同じカードを無制限に購入可能（異なるシリアルNo.取得）
* 数量選択で一度に複数枚購入可能
* 返金は原則不可（デジタル商品のため）
* 在庫競合時は過剰販売を許容し、手動対応

**技術要件**:

* Webhook冪等性: `stripe_checkout_session_id`でユニーク制約
* シリアルNo.採番: PostgreSQL関数でアトミックに処理（Race Condition防止）
* 購入完了メール: Webhook成功後に自動送信

**Supported Payment Methods**:

* クレジットカード (Visa, Mastercard, AMEX, JCB)
* Apple Pay
* Google Pay
* Stripe Link

**収益分配**:

* 売上の100%は運営の収益
* アーティストへの支払いは別途対応（Stripe Connect等は将来検討）

#### 2.1.4 Collection (コレクション)

| ID      | Feature   | Priority | Description      |
| ------- | --------- | -------- | ---------------- |
| COL-001 | 所有カード一覧   | P0       | 購入済みカードのグリッド表示   |
| COL-002 | カード詳細表示   | P0       | シリアルNo、購入日、レアリティ |
| COL-003 | 限定コンテンツ閲覧 | P0       | 購入者のみアクセス可能なURL  |
| COL-004 | QRコード表示   | P2       | コンテンツへのクイックアクセス  |

**限定コンテンツ仕様**:

* 外部URL（YouTube限定公開、Vimeo等）を想定
* レアリティ別にコンテンツ設定可能（例：SRだけの特別映像）
* 1カードに複数コンテンツを紐付け可能
* 許可ドメイン: youtube.com, vimeo.com, soundcloud.com

**コレクション表示仕様**:

* 同一カード複数所持時: グルーピング表示（例: "×3" バッジ）
* 展開表示: タップで個別シリアルNo.一覧を表示
* ソート: 購入日順、アーティスト順、レアリティ順

### 2.2 Admin Features (管理画面)

**実装方式**: 同一アプリ内 `/admin` ルート（Route Group）
**管理者判定**: `operators`テーブルで`user_id`を管理

#### 2.2.0 Access Control

| ID      | Feature | Priority | Description             |
| ------- | ------- | -------- | ----------------------- |
| ADM-000 | 管理者認証   | P0       | operatorsテーブルで権限確認      |
| ADM-001 | ロール管理   | P2       | admin, super\_admin（将来） |

#### 2.2.1 Dashboard

| ID      | Feature    | Priority | Description     |
| ------- | ---------- | -------- | --------------- |
| ADM-001 | 売上サマリー     | P1       | 日次/週次/月次の売上グラフ  |
| ADM-002 | ユーザー数推移    | P1       | 登録者数、アクティブユーザー数 |
| ADM-003 | 人気カードランキング | P2       | 売上上位カード一覧       |

#### 2.2.2 User Management (ユーザー管理)

| ID      | Feature | Priority | Description  |
| ------- | ------- | -------- | ------------ |
| USR-001 | ユーザー一覧  | P1       | 登録ユーザーのリスト表示 |
| USR-002 | ユーザー詳細  | P1       | プロフィール、購入履歴  |
| USR-003 | ユーザー検索  | P2       | メールアドレス、名前検索 |

#### 2.2.3 Card Template Management (カードテンプレート管理)

| ID      | Feature  | Priority | Description   |
| ------- | -------- | -------- | ------------- |
| TPL-001 | テンプレート作成 | P0       | 画像アップロード、情報入力 |
| TPL-002 | レアリティ設定  | P0       | 3パターンの価格・在庫設定 |
| TPL-003 | プレビュー    | P1       | 作成前のカード表示確認   |
| TPL-004 | 公開/非公開切替 | P0       | カードの販売状態管理    |

**Template Input Fields**:

```
Required:
  - template_name: String (管理用識別子: "1st Album", "Summer Single")
  - artist_image: File (最大10MB, 600x800px推奨)

Optional:
  - song_title: String
  - subtitle: String

Per Rarity (NORMAL, RARE, SUPER_RARE):
  - price: Number (JPY)
  - total_supply: Number | null (unlimited)
  - is_active: Boolean
  - bonus_contents: Array<{
      url: String (許可ドメイン: youtube.com, vimeo.com, soundcloud.com)
      type: 'video' | 'music' | 'image'
      title: String
      description: String (optional)
    }>
```

**テンプレート運用**:

* 1アーティストに対して複数テンプレート作成可能
* 例: アルバムA用テンプレート、シングルB用テンプレート
* `template_name`で管理画面上での識別を容易に

#### 2.2.4 Sales Management (売上管理)

| ID      | Feature | Priority | Description   |
| ------- | ------- | -------- | ------------- |
| SLS-001 | 決済履歴一覧  | P1       | 全取引のリスト表示     |
| SLS-002 | 決済詳細    | P1       | 購入者、カード、金額、日時 |
| SLS-003 | CSV出力   | P2       | 会計用データエクスポート  |

#### 2.2.5 Payout Management (出金管理)

| ID      | Feature   | Priority | Description      |
| ------- | --------- | -------- | ---------------- |
| PAY-001 | 出金リクエスト一覧 | P1       | 未処理リクエストの表示      |
| PAY-002 | ステータス変更   | P1       | 未対応 → 処理中 → 振込完了 |
| PAY-003 | 出金履歴      | P2       | 過去の出金記録          |

### 2.3 Future Expansion (将来拡張)

| Phase   | Feature       | Description    |
| ------- | ------------- | -------------- |
| Phase 2 | C2C 2次流通      | ユーザー間でのカード売買   |
| Phase 2 | オークション        | 限定カードの入札販売     |
| Phase 3 | アーティストダッシュボード | アーティスト自身の売上確認  |
| Phase 3 | ファンクラブ機能      | 継続課金、会員限定コンテンツ |

***

## 3. Non-Functional Requirements

### 3.1 Performance

| Metric              | Requirement   |
| ------------------- | ------------- |
| Page Load Time      | < 2.0s (LCP)  |
| Time to Interactive | < 3.0s        |
| API Response Time   | < 200ms (p95) |
| Concurrent Users    | 1,000+        |

### 3.2 Security

| Requirement | Implementation           |
| ----------- | ------------------------ |
| 認証          | Supabase Auth (JWT)      |
| 認可          | Row Level Security (RLS) |
| 決済情報        | Stripe管理（PCI DSS準拠）      |
| 通信          | HTTPS必須                  |
| XSS対策       | React自動エスケープ             |
| CSRF対策      | SameSite Cookie          |

### 3.3 Scalability

| Component | Strategy                           |
| --------- | ---------------------------------- |
| Database  | Supabase PostgreSQL (auto-scaling) |
| Storage   | Supabase Storage (CDN配信)           |
| Compute   | Vercel Edge Functions              |
| Cache     | Vercel Edge Cache / SWR            |

### 3.4 Availability

| Metric                         | Target      |
| ------------------------------ | ----------- |
| Uptime                         | 99.9%       |
| RTO (Recovery Time Objective)  | < 1 hour    |
| RPO (Recovery Point Objective) | < 5 minutes |

### 3.5 Compliance

| Regulation | Status           |
| ---------- | ---------------- |
| 特定商取引法     | 必須（販売者情報、返品ポリシー） |
| 個人情報保護法    | プライバシーポリシー掲載     |
| 資金決済法      | Stripe経由のため適用外   |

### 3.6 Observability (監視・可観測性)

| Component     | Tool              | Purpose              |
| ------------- | ----------------- | -------------------- |
| Error Tracking| Sentry            | エラー検知・スタックトレース       |
| Analytics     | Vercel Analytics  | パフォーマンス・トラフィック       |
| Uptime        | Vercel/BetterStack| 稼働監視                 |
| Logs          | Vercel Logs       | リクエストログ              |
| Alerts        | Slack Integration | 異常検知時の通知             |

**アラート条件**:

* エラー率 > 1%
* API応答時間 > 1s (p95)
* 決済失敗率 > 5%
* 過剰販売発生

***

## 4. System Architecture

### 4.1 Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                        │
│  Next.js 16 (App Router) + React 19 + TypeScript        │
│  Tailwind CSS + Lucide Icons                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      API Layer                           │
│  Next.js API Routes + Vercel Edge Functions             │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│   Supabase      │ │   Stripe    │ │  Supabase       │
│   PostgreSQL    │ │   Payments  │ │  Storage        │
│   + Auth        │ │             │ │  (Images/Media) │
└─────────────────┘ └─────────────┘ └─────────────────┘
```

### 4.2 Data Flow

```
User Journey:

[Browse] ──GET /artists──▶ [Artist List]
                               │
                               ▼
[Artist Detail] ◀──GET /artists/:id──
                               │
                               ▼
[Purchase] ──POST /checkout──▶ [Stripe Checkout]
                               │
                               ▼
[Webhook] ◀──checkout.session.completed──
                               │
                               ▼
[DB Update] ──INSERT purchase + UPDATE card.current_supply──
                               │
                               ▼
[Collection] ──GET /purchases──▶ [My Cards]
                               │
                               ▼
[Exclusive Content] ◀──RLS protected──
```

### 4.3 Infrastructure

| Service    | Provider            | Purpose                             |
| ---------- | ------------------- | ----------------------------------- |
| Hosting    | Vercel              | Next.js deployment, Edge Functions  |
| Database   | Supabase            | PostgreSQL, Real-time subscriptions |
| Auth       | Supabase Auth       | User management, OAuth              |
| Storage    | Supabase Storage    | Image/media hosting                 |
| Payments   | Stripe              | Checkout, webhooks                  |
| Domain     | Vercel / Cloudflare | DNS, SSL                            |
| Monitoring | Vercel Analytics    | Performance tracking                |

***

## 5. Data Model

### 5.1 Entity Relationship Diagram

```
                                               ┌─────────────┐
                                               │  operators  │
                                               └──────┬──────┘
                                                      │
                                                     N:1
                                                      │
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│   artists   │──1:N──│  card_templates  │──1:3──│    cards    │
│ (is_featured)│       └──────────────────┘       └─────────────┘
└─────────────┘                                        │
                                                       │
                              ┌─────────────────────────┤
                              │                        │
                             1:N                      1:N
                              │                        │
                              ▼                        ▼
                    ┌──────────────────┐       ┌─────────────┐
                    │exclusive_contents│       │  purchases  │
                    │  (per card/rarity)│       └─────────────┘
                    └──────────────────┘              │
                                                     N:1
                                                      │
                                                      ▼
                                               ┌─────────────┐
                                               │   profiles  │
                                               │ (auth.users)│
                                               └─────────────┘
```

### 5.2 Table Definitions

#### operators (管理者)

| Column      | Type        | Constraints                       | Description         |
| ----------- | ----------- | --------------------------------- | ------------------- |
| id          | UUID        | PK                                |                     |
| user\_id    | UUID        | FK → auth.users, UNIQUE, NOT NULL | 管理者のユーザーID          |
| role        | TEXT        | DEFAULT 'admin'                   | admin, super\_admin |
| created\_at | TIMESTAMPTZ | DEFAULT NOW()                     |                     |

#### artists

| Column         | Type        | Constraints                     | Description |
| -------------- | ----------- | ------------------------------- | ----------- |
| id             | UUID        | PK, DEFAULT gen\_random\_uuid() |             |
| name           | TEXT        | NOT NULL                        | アーティスト名     |
| description    | TEXT        |                                 | 説明文         |
| image\_url     | TEXT        |                                 | プロフィール画像URL |
| member\_count  | INT         | DEFAULT 0                       | ファン数（集計値）   |
| is\_featured   | BOOLEAN     | DEFAULT FALSE                   | おすすめ表示フラグ   |
| display\_order | INT         | DEFAULT 0                       | おすすめ表示順     |
| created\_at    | TIMESTAMPTZ | DEFAULT NOW()                   |             |
| updated\_at    | TIMESTAMPTZ | DEFAULT NOW()                   |             |

#### card\_templates

| Column             | Type        | Constraints   | Description             |
| ------------------ | ----------- | ------------- | ----------------------- |
| id                 | UUID        | PK            |                         |
| artist\_id         | UUID        | FK → artists  |                         |
| name               | TEXT        | NOT NULL      | テンプレート名（管理用識別子）         |
| artist\_image\_url | TEXT        | NOT NULL      | カード用アーティスト画像（最大10MB）    |
| song\_title        | TEXT        |               | 楽曲名                     |
| subtitle           | TEXT        |               | サブタイトル                  |
| is\_active         | BOOLEAN     | DEFAULT TRUE  |                         |
| created\_at        | TIMESTAMPTZ | DEFAULT NOW() |                         |
| updated\_at        | TIMESTAMPTZ | DEFAULT NOW() |                         |

**Note**:

* 1アーティストに対して複数テンプレート作成可能（アルバム別等）
* 限定コンテンツは`exclusive_contents`テーブルでcard単位に管理

#### cards

| Column          | Type        | Constraints                              | Description |
| --------------- | ----------- | ---------------------------------------- | ----------- |
| id              | UUID        | PK                                       |             |
| template\_id    | UUID        | FK → card\_templates                     |             |
| artist\_id      | UUID        | FK → artists                             |             |
| name            | TEXT        | NOT NULL                                 | カード名        |
| description     | TEXT        |                                          | 説明          |
| rarity          | TEXT        | CHECK IN ('NORMAL','RARE','SUPER\_RARE') |             |
| price           | INT         | NOT NULL                                 | 価格（円）       |
| total\_supply   | INT         | NULL = unlimited                         | 発行上限        |
| current\_supply | INT         | DEFAULT 0                                | 現在発行数       |
| is\_active      | BOOLEAN     | DEFAULT TRUE                             |             |
| created\_at     | TIMESTAMPTZ |                                          |             |
| updated\_at     | TIMESTAMPTZ |                                          |             |

**Unique Constraint**: `(template_id, rarity)`

#### exclusive\_contents (限定コンテンツ)

| Column         | Type        | Constraints                        | Description |
| -------------- | ----------- | ---------------------------------- | ----------- |
| id             | UUID        | PK                                 |             |
| card\_id       | UUID        | FK → cards                         | レアリティ別に紐付け  |
| type           | TEXT        | CHECK IN ('video','music','image') |             |
| url            | TEXT        | NOT NULL                           | 外部URL       |
| title          | TEXT        | NOT NULL                           |             |
| description    | TEXT        |                                    |             |
| display\_order | INT         | DEFAULT 0                          | 表示順         |
| created\_at    | TIMESTAMPTZ | DEFAULT NOW()                      |             |

**Note**: card\_id単位で紐付け → SR専用コンテンツなどを設定可能

#### purchases

| Column                        | Type        | Constraints                                 | Description      |
| ----------------------------- | ----------- | ------------------------------------------- | ---------------- |
| id                            | UUID        | PK                                          |                  |
| user\_id                      | UUID        | FK → auth.users                             |                  |
| card\_id                      | UUID        | FK → cards                                  |                  |
| serial\_number                | INT         | NOT NULL                                    | シリアルNo（レアリティ別採番） |
| price\_paid                   | INT         | NOT NULL                                    | 購入時価格            |
| quantity\_in\_order           | INT         | DEFAULT 1                                   | 注文内の購入枚数         |
| stripe\_checkout\_session\_id | TEXT        | NOT NULL                                    | 冪等性チェック用         |
| stripe\_payment\_intent\_id   | TEXT        |                                             |                  |
| status                        | TEXT        | CHECK IN ('pending','completed','refunded') |                  |
| purchased\_at                 | TIMESTAMPTZ | DEFAULT NOW()                               |                  |

**Note**:

* 数量選択時は複数レコード作成（quantity=3なら3レコード）
* 同一ユーザーが同じカードを無制限に購入可能

**技術的制約**:

* `(stripe_checkout_session_id, card_id, serial_number)` でユニーク制約
* Webhook再送時の重複挿入を防止

### 5.3 Rarity System

| Rarity     | Code | Price Range    | Supply            | Frame Design |
| ---------- | ---- | -------------- | ----------------- | ------------ |
| Normal     | N    | ¥800〜¥1,500    | Unlimited or High | シンプル黒フレーム    |
| Rare       | R    | ¥1,500〜¥3,000  | 100〜300枚          | 青〜紫グロー       |
| Super Rare | SR   | ¥3,000〜¥10,000 | 10〜50枚            | ゴールド + ホログラム |

**シリアルNo.採番**:

* レアリティ別に採番（N #1, R #1, SR #1 がそれぞれ存在）
* 例: NORMAL #42/∞, RARE #15/100, SUPER\_RARE #3/30

***

## 6. API Design

### 6.1 Public Endpoints

| Method | Endpoint                      | Description          | Auth                 |
| ------ | ----------------------------- | -------------------- | -------------------- |
| GET    | /api/artists                  | アーティスト一覧             | -                    |
| GET    | /api/artists/:id              | アーティスト詳細             | -                    |
| GET    | /api/artists/:id/templates    | アーティストのテンプレート一覧      | -                    |
| GET    | /api/cards                    | カード一覧                | -                    |
| GET    | /api/cards/:id                | カード詳細                | -                    |
| POST   | /api/checkout                 | Checkout Session作成   | Required + Verified  |
| GET    | /api/purchases                | 購入履歴                 | Required             |
| GET    | /api/purchases/:id/content    | 限定コンテンツURL           | Required + Ownership |
| GET    | /api/me                       | 現在のユーザー情報            | Required             |
| DELETE | /api/me                       | アカウント削除              | Required             |
| POST   | /api/auth/resend-verification | 認証メール再送              | Required             |

**認可レベル**:

* `-`: 認証不要
* `Required`: ログイン必須
* `Required + Verified`: ログイン + メール認証必須
* `Required + Ownership`: ログイン + リソース所有権必須

### 6.2 Webhook Endpoints

| Method | Endpoint             | Description    | Validation             |
| ------ | -------------------- | -------------- | ---------------------- |
| POST   | /api/webhooks/stripe | Stripe webhook | Signature verification |

### 6.3 Admin Endpoints

| Method | Endpoint                 | Description | Auth  |
| ------ | ------------------------ | ----------- | ----- |
| GET    | /api/admin/users         | ユーザー一覧      | Admin |
| GET    | /api/admin/sales         | 売上一覧        | Admin |
| POST   | /api/admin/templates     | テンプレート作成    | Admin |
| PUT    | /api/admin/templates/:id | テンプレート更新    | Admin |
| PUT    | /api/admin/payouts/:id   | 出金ステータス更新   | Admin |

### 6.4 Authentication Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │ Supabase │                  │   App    │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                             │                             │
     │  1. signInWithPassword()    │                             │
     │────────────────────────────▶│                             │
     │                             │                             │
     │  2. Return JWT + User       │                             │
     │◀────────────────────────────│                             │
     │                             │                             │
     │  3. API Request + JWT       │                             │
     │─────────────────────────────────────────────────────────▶│
     │                             │                             │
     │                             │  4. Verify JWT              │
     │                             │◀────────────────────────────│
     │                             │                             │
     │  5. Response                │                             │
     │◀─────────────────────────────────────────────────────────│
```

***

## 7. UI/UX Specification

### 7.1 Screen List

**ユーザー向け (main)**

| Screen        | Route             | Description       |
| ------------- | ----------------- | ----------------- |
| Home          | `/`               | おすすめアーティスト（管理者選定） |
| Marketplace   | `/market`         | アーティスト一覧グリッド      |
| Artist Detail | `/artists/:id`    | カード選択、購入ボタン       |
| Collection    | `/collection`     | 所有カード一覧           |
| Card Detail   | `/collection/:id` | シリアル、限定コンテンツ      |

**法務 (legal)**

| Screen  | Route      | Description |
| ------- | ---------- | ----------- |
| Terms   | `/terms`   | 利用規約        |
| Privacy | `/privacy` | プライバシーポリシー  |

**管理画面 (admin)**

| Screen    | Route              | Description |
| --------- | ------------------ | ----------- |
| Dashboard | `/admin`           | 売上サマリー、統計   |
| Artists   | `/admin/artists`   | アーティスト管理    |
| Templates | `/admin/templates` | カードテンプレート管理 |
| Users     | `/admin/users`     | ユーザー一覧      |
| Sales     | `/admin/sales`     | 決済履歴        |

### 7.2 Card Template System

**Reference Design**: `/docs/card-image.png`

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │                       │  │
│  │    Artist Visual      │  │  ← Layer 3: Uploaded Image
│  │                       │  │
│  ├───────────────────────┤  │  ← Layer 2: Rarity Frame
│  │ IDOL: {artist_name}   │  │  ← Layer 4: Text Overlay
│  │ SONG: {song_title}    │  │
│  └───────────────────────┘  │
│  Rarity: {N/R/SR}  #{serial}│  ← Layer 5: Metadata
│  Owned: {count}             │
│  ┌─────┐                    │
│  │ QR  │  BONUS CONTENT     │  ← Layer 6: Bonus Link
│  └─────┘                    │
└─────────────────────────────┘  ← Layer 1: Background
```

### 7.3 Design System

| Token             | Value   | Usage           |
| ----------------- | ------- | --------------- |
| `--color-bg`      | #000000 | Page background |
| `--color-surface` | #111827 | Card background |
| `--color-primary` | #3b82f6 | CTA, links      |
| `--color-accent`  | #e879f9 | Highlights      |
| `--color-gold`    | #fbbf24 | Super Rare      |
| `--font-sans`     | Inter   | Body text       |
| `--font-mono`     | SF Mono | Serial numbers  |
| `--radius-card`   | 12px    | Card corners    |

***

## 8. Milestones

### Phase 1: MVP (Target: 2026-03-01)

| Week | Deliverable                   |
| ---- | ----------------------------- |
| W1-2 | DB設計、Supabase構築、認証実装          |
| W3-4 | カードテンプレートシステム、管理画面基盤          |
| W5-6 | Marketplace UI、購入フロー、Stripe連携 |
| W7-8 | Collection UI、限定コンテンツ、テスト     |

### Phase 2: Growth (Target: 2026-06-01)

* C2C 2次流通機能
* 検索・フィルタ強化
* プッシュ通知
* アーティストダッシュボード

### Phase 3: Scale (Target: 2026-12-01)

* オークション機能
* ファンクラブ（サブスク）
* API公開
* 多言語対応

***

## 9. Risks and Mitigations

| Risk                  | Impact | Probability | Mitigation                    |
| --------------------- | ------ | ----------- | ----------------------------- |
| Stripeの決済失敗           | High   | Low         | リトライ機構、エラーハンドリング              |
| 在庫の競合（Race Condition） | High   | Medium      | PostgreSQL関数でアトミック処理          |
| Webhook重複実行           | High   | Medium      | checkout\_session\_idでユニーク制約   |
| 決済成功後のDB書き込み失敗        | High   | Low         | Webhookリトライ、手動リカバリー手順書        |
| 画像の大量アップロード           | Medium | Medium      | ファイルサイズ制限（10MB）、圧縮            |
| 不正アクセス                | High   | Low         | RLS、Rate Limiting、監査ログ        |
| Supabaseサービス障害        | High   | Low         | エラーページ、ステータス監視                |
| 外部コンテンツURL無効          | Medium | Medium      | 許可ドメインリスト、定期チェック              |
| アカウント乗っ取り             | High   | Low         | メール認証必須、パスワード強度チェック           |

**過剰販売時の対応手順**:

1. 管理者に自動アラート送信
2. 影響を受けたユーザーへ個別連絡
3. 返金または次回購入クーポン提供
4. 24時間以内の解決を目標

***

## 10. Glossary

| Term                  | Definition                         |
| --------------------- | ---------------------------------- |
| **Card**              | アーティストのデジタルトレーディングカード              |
| **Template**          | カード生成の元となるデータセット（画像、テキスト）          |
| **Rarity**            | カードの希少度（NORMAL, RARE, SUPER\_RARE） |
| **Serial Number**     | 各カードの一意の発行番号（レアリティ別に採番）            |
| **Exclusive Content** | 購入者のみアクセス可能な限定コンテンツ（外部URL）         |
| **Operator**          | 管理画面にアクセス可能な管理者ユーザー                |
| **Featured**          | ホーム画面に表示されるおすすめアーティスト              |
| **Checkout Session**  | Stripe決済フローのセッション                  |
| **Webhook**           | 外部サービスからのイベント通知                    |
| **RLS**               | Row Level Security（行レベルセキュリティ）     |

***

## Appendix

### A. References

* MVP Design: <https://hitoon-music.vercel.app/>
* Card Design Example: `/docs/card-image.png`
* Pokemon Card Rarity: <https://www.sangatuusagi.com/pokeking/card/rarity.html>

### B. Change Log

| Version | Date       | Author | Changes                                                      |
| ------- | ---------- | ------ | ------------------------------------------------------------ |
| 1.0.0   | 2026-02-02 | -      | Initial PRD                                                  |
| 1.1.0   | 2026-02-02 | -      | 要件詳細化: 複数購入、レアリティ別コンテンツ、管理者判定、在庫ポリシー等                        |
| 1.2.0   | 2026-02-02 | -      | 技術的改善: Webhook冪等性、シリアルNo.採番のRace Condition対策、監視要件追加、API拡充 |

### C. Stakeholders

| Role          | Responsibility |
| ------------- | -------------- |
| Product Owner | 要件定義、優先順位決定    |
| Tech Lead     | アーキテクチャ、技術選定   |
| Developer     | 実装、テスト         |
| Designer      | UI/UX設計        |

