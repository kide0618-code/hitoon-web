import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: `${APP_CONFIG.name}のプライバシーポリシー`,
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>プライバシーポリシー</h1>
      <p className="text-gray-400">最終更新日: 2026年2月2日</p>

      <section>
        <h2>1. 収集する情報</h2>
        <p>当サービスでは、以下の情報を収集します：</p>
        <ul>
          <li>メールアドレス</li>
          <li>パスワード（暗号化して保存）</li>
          <li>Google アカウント情報（OAuth利用時）</li>
          <li>購入履歴</li>
          <li>アクセスログ</li>
        </ul>
      </section>

      <section>
        <h2>2. 情報の利用目的</h2>
        <ul>
          <li>サービスの提供・運営</li>
          <li>ユーザー認証</li>
          <li>購入処理</li>
          <li>お問い合わせ対応</li>
          <li>サービス改善のための分析</li>
        </ul>
      </section>

      <section>
        <h2>3. 第三者への提供</h2>
        <p>当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：</p>
        <ul>
          <li>ユーザーの同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>決済処理に必要な範囲（Stripe社への提供）</li>
        </ul>
      </section>

      <section>
        <h2>4. 決済情報について</h2>
        <p>
          クレジットカード情報は、Stripe社が安全に管理します。
          当サービスはカード番号を直接保存しません。
        </p>
      </section>

      <section>
        <h2>5. Cookieの使用</h2>
        <p>当サービスは、セッション管理およびユーザー体験向上のためにCookieを使用します。</p>
      </section>

      <section>
        <h2>6. お問い合わせ</h2>
        <p>プライバシーに関するお問い合わせは、以下までご連絡ください：</p>
        <p>support@hitoon.example.com</p>
      </section>
    </article>
  );
}
