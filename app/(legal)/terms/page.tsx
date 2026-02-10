import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: '利用規約',
  description: `${APP_CONFIG.name}の利用規約`,
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert prose-sm max-w-none">
      <h1>利用規約</h1>
      <p className="text-gray-400">最終更新日: 2026年2月2日</p>

      <section>
        <h2>第1条（適用）</h2>
        <p>
          本規約は、{APP_CONFIG.name}
          （以下「当サービス」）の利用条件を定めるものです。
          ユーザーは本規約に同意の上、当サービスを利用するものとします。
        </p>
      </section>

      <section>
        <h2>第2条（定義）</h2>
        <ul>
          <li>
            「デジタルカード」とは、当サービスで販売されるアーティストのデジタルコンテンツを指します。
          </li>
          <li>
            「限定コンテンツ」とは、デジタルカード購入者のみがアクセス可能なコンテンツを指します。
          </li>
        </ul>
      </section>

      <section>
        <h2>第3条（購入・決済）</h2>
        <ol>
          <li>デジタルカードの購入は、Stripe決済を通じて行われます。</li>
          <li>決済完了後のキャンセル・返金は原則として受け付けません。</li>
          <li>購入したデジタルカードは、当サービス内でのみ有効です。</li>
        </ol>
      </section>

      <section>
        <h2>第4条（禁止事項）</h2>
        <ul>
          <li>不正な手段による購入行為</li>
          <li>限定コンテンツの無断転載・再配布</li>
          <li>他のユーザーへの迷惑行為</li>
          <li>当サービスの運営を妨害する行為</li>
        </ul>
      </section>

      <section>
        <h2>第5条（免責事項）</h2>
        <p>
          当サービスは、デジタルカードの価値の保証を行いません。
          また、システム障害等による一時的なサービス停止について、 当社は一切の責任を負いません。
        </p>
      </section>

      <section>
        <h2>第6条（規約の変更）</h2>
        <p>
          当社は、必要に応じて本規約を変更することができます。
          変更後の規約は、当サービス上に掲載した時点で効力を生じるものとします。
        </p>
      </section>
    </article>
  );
}
