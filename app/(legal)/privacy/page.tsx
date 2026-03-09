import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: `${APP_CONFIG.name}のプライバシーポリシー`,
};

export default function PrivacyPage() {
  return (
    <article className="max-w-none text-sm leading-relaxed text-gray-300">
      <h1 className="mb-2 text-xl font-bold text-white">HITOON プライバシーポリシー</h1>

      <p className="mb-8">
        株式会社HITOON（以下「当社」といいます）は、当社が提供する音楽権利マーケットプレイス「HITOON」（以下「本サービス」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
      </p>

      <div className="space-y-6">
        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">第1条（取得する個人情報）</h2>
          <p className="mb-3">当社は、本サービスの提供にあたり、以下の情報を取得します。</p>
          <ol className="list-inside list-decimal space-y-3">
            <li>
              ユーザーから直接提供いただく情報
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>氏名、メールアドレス、ログインパスワード</li>
              </ol>
            </li>
            <li>
              自動的に取得する情報
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>端末情報、IPアドレス、OS情報、ブラウザ情報、Cookie、広告識別子（IDFA/ADID）</li>
                <li>本サービス内での行動履歴（閲覧、購入、出品、取引成立の履歴）</li>
                <li>位置情報（特定のライブ会場連動特典などを提供する場合）</li>
              </ol>
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">第2条（利用目的）</h2>
          <p className="mb-3">当社は、取得した個人情報を以下の目的で利用します。</p>
          <ol className="list-inside list-decimal space-y-3">
            <li>
              サービスの提供・運営
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>本サービスへのログイン認証、マイページの提供</li>
                <li>デジタルグッズの販売、購入の処理</li>
              </ol>
            </li>
            <li>
              決済・出金処理
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>商品代金の請求、決済処理</li>
              </ol>
            </li>
            <li>
              ユーザーへの連絡・通知
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>取引成立時の通知、重要なお知らせ、メンテナンス情報の提供</li>
              </ol>
            </li>
            <li>
              特典の照合
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>
                  デジタルグッズ保有者限定の特典（ライブチケット優先権、限定コミュニティ参加権など）の提供における本人照合
                </li>
              </ol>
            </li>
            <li>
              不正利用の防止
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>
                  クレジットカードの不正利用検知、マネーロンダリングの防止、複数アカウントによる不正操作の監視
                </li>
              </ol>
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">第3条（個人情報の第三者提供）</h2>
          <p className="mb-3">
            当社は、法令に基づく場合を除き、あらかじめユーザーの同意を得ることなく第三者に個人情報を提供しません。ただし、以下の場合はこの限りではありません。
          </p>
          <ol className="list-inside list-decimal space-y-3">
            <li>
              アーティスト（権利保有者）への提供
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>
                  デジタルグッズの保有者に対して、アーティスト自身または所属事務所が特典（ライブ招待、グッズ発送等）を提供するために必要な範囲で、保有者の情報（氏名、保有ID、連絡先等）を提供する場合があります。
                </li>
              </ol>
            </li>
            <li>
              決済代行会社・金融機関への提供
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>
                  決済処理および売上金の振込実行のため、必要な決済情報や口座情報を提供します。
                </li>
              </ol>
            </li>
            <li>
              不正検知サービスへの提供
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 text-gray-400">
                <li>
                  クレジットカードの不正利用やなりすましを防止するため、不正検知サービス提供会社（株式会社アクル等）に対し、決済情報や端末情報を提供する場合があります。
                </li>
              </ol>
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">第4条（安全管理措置）</h2>
          <p>
            当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために、必要かつ適切な措置（通信の暗号化、アクセス制限、従業員教育等）を講じます。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第5条（Cookieおよび情報収集モジュール）
          </h2>
          <p>
            本サービスでは、Google
            Analytics等のアクセス解析ツールを利用しています。これらはCookieを使用し、個人を特定しない形でトラフィックデータを収集します。ユーザーはブラウザの設定によりCookieを無効にすることができます。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第6条（保有個人データの開示・訂正・利用停止）
          </h2>
          <p>
            ユーザーは、当社の定める手続きに従い、自身の個人情報の開示、訂正、利用停止等を請求することができます。ただし、法令上の保管義務がある情報（取引履歴等）については、削除に応じられない場合があります。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-white">第7条（お問い合わせ窓口）</h2>
          <p className="mb-3">本ポリシーに関するお問い合わせは、以下の窓口までお願いいたします。</p>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm">
            <p className="font-medium text-white">株式会社HITOON 個人情報保護管理者：井手恭一郎</p>
            <p className="mt-1">
              お問い合わせフォーム：
              <span className="text-blue-400">info@hitoonstore.com</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              ※電話によるお問い合わせは受け付けておりません
            </p>
          </div>
        </section>
      </div>

      <p className="mt-8 text-right text-gray-500">以上</p>
    </article>
  );
}
