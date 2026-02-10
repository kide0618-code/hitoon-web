# ローカル開発環境セットアップ

## 前提条件

- Node.js 20+
- pnpm
- Homebrew（macOS）

## 1. 依存パッケージインストール

```bash
pnpm install
```

## 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` に以下を設定:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase start で表示される anon key>
SUPABASE_SERVICE_ROLE_KEY=<supabase start で表示される service_role key>
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=<stripe listen で表示される whsec_xxx>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Supabase ローカル起動

```bash
# CLI インストール（初回のみ）
brew install supabase/tap/supabase

# ローカル起動
supabase start
```

起動後に表示される `anon key` / `service_role key` を `.env` に反映する。

Supabase Studio: http://127.0.0.1:54323

## 4. Stripe CLI セットアップ

```bash
# CLI インストール（初回のみ）
brew install stripe/stripe-cli/stripe

# ログイン（ブラウザが開く）
stripe login

# Webhook をローカルに転送
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

実行時に表示される webhook signing secret を `.env` の `STRIPE_WEBHOOK_SECRET` に設定:

```
> Ready! Your webhook signing secret is whsec_xxxxx
```

**注意**: `stripe listen` で生成される secret は毎回変わるため、起動のたびに `.env` を更新すること。

## 5. 開発サーバー起動

```bash
pnpm dev
```

## ターミナル構成（3つ必要）

| ターミナル | コマンド                                                        | 役割                 |
| ---------- | --------------------------------------------------------------- | -------------------- |
| 1          | `supabase start`                                                | ローカル DB          |
| 2          | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` | Webhook 転送         |
| 3          | `pnpm dev`                                                      | Next.js 開発サーバー |

## テスト決済

http://localhost:3000 にアクセスし、購入フローを実行する。

### テストカード番号

| カード番号            | 結果        |
| --------------------- | ----------- |
| `4242 4242 4242 4242` | 成功        |
| `4000 0000 0000 0002` | 拒否        |
| `4000 0000 0000 3220` | 3D セキュア |

- 有効期限: 未来の任意の日付（例: `12/34`）
- CVC: 任意の 3 桁（例: `123`）
- 名前・住所: 任意

### Webhook 単体テスト

```bash
stripe trigger checkout.session.completed
```

## 動作確認チェックリスト

- [ ] Supabase Studio（http://127.0.0.1:54323）にアクセスできる
- [ ] `pnpm dev` で http://localhost:3000 が表示される
- [ ] カード購入ボタンで Stripe Checkout 画面にリダイレクトされる
- [ ] テストカードで決済後、ターミナル 2 に `checkout.session.completed` が表示される
- [ ] Supabase Studio の `purchases` テーブルにレコードが作成される
- [ ] コレクションページに購入したカードが表示される
