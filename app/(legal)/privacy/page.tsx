import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: `${APP_CONFIG.name}のプライバシーポリシー`,
};

export default function PrivacyPage() {
  return (
    <article className="max-w-none text-sm leading-relaxed text-gray-300">
      <h1 className="mb-2 text-xl font-bold text-white">プライバシーポリシー</h1>
      <p className="mb-8 text-xs text-gray-500">最終更新日: 2026年3月4日</p>

      <p className="mb-8">
        HITOON運営事務局（以下「当事務局」といいます）は、当事務局が提供するサービス「HITOON」（以下「本サービス」といいます）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
      </p>

      <div className="space-y-6">
        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第1条（個人情報の定義）
          </h2>
          <p>
            「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報（個人識別情報）を指します。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第2条（個人情報の収集方法）
          </h2>
          <p>
            当事務局は、ユーザーが利用登録をする際に氏名、メールアドレスなどの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当事務局の提携先（情報提供元、広告主、広告配信先などを含みます）などから収集することがあります。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第3条（個人情報を収集・利用する目的）
          </h2>
          <p className="mb-3">
            当事務局が個人情報を収集・利用する目的は、以下のとおりです。
          </p>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              本サービスの提供・運営のため（ログイン認証、コンテンツの閲覧権限管理など）
            </li>
            <li>
              ユーザーからのお問い合わせに回答するため（本人確認を行うことを含みます）
            </li>
            <li>
              ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当事務局が提供する他のサービスの案内のメールを送付するため
            </li>
            <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
            <li>
              利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
            </li>
            <li>アーティストへの収益分配および税務処理のため</li>
            <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
            <li>上記の利用目的に付随する目的</li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第4条（利用目的の変更）
          </h2>
          <p>
            当事務局は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第5条（個人情報の第三者提供）
          </h2>
          <ol className="list-inside list-decimal space-y-3">
            <li>
              当事務局は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
              <ul className="ml-6 mt-2 list-disc space-y-1 text-gray-400">
                <li>
                  人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
                </li>
                <li>
                  公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                </li>
                <li>
                  国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                </li>
              </ul>
            </li>
            <li>
              前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
              <ul className="ml-6 mt-2 list-disc space-y-1 text-gray-400">
                <li>
                  当事務局が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
                </li>
                <li>
                  合併その他の事由による事業の承継に伴って個人情報が提供される場合
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第6条（クレジットカード情報の取扱い）
          </h2>
          <p>
            本サービスにおけるクレジットカード決済は、決済代行会社（Stripe,
            Inc.）のシステムを利用しております。当事務局のサーバー上には、お客様のクレジットカード情報は一切保存されません。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第7条（外部ツールの利用）
          </h2>
          <p className="mb-3">
            本サービスでは、サービスの品質向上および安定運用のために、以下の外部サービスを利用しています。これらのサービスにおける個人情報の取扱いは、各社のプライバシーポリシーに準拠します。
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>認証およびデータベース： Supabase</li>
            <li>メール配信： Resend</li>
            <li>決済処理： Stripe</li>
            <li>アクセス解析： Google Analytics</li>
          </ul>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第8条（Cookieの利用）
          </h2>
          <p>
            本サービスでは、ログイン状態の保持やトラフィックデータの収集のためにCookie（クッキー）を使用しています。ユーザーはブラウザの設定によりCookieを無効にすることができますが、その場合、本サービスの一部機能が利用できなくなる可能性があります。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第9条（個人情報の開示・訂正・削除）
          </h2>
          <p>
            ユーザーは、当事務局の保有する自己の個人情報が誤った情報である場合には、当事務局が定める手続きにより、当事務局に対して個人情報の訂正、追加または削除（以下「訂正等」といいます）を請求することができます。当事務局は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第10条（プライバシーポリシーの変更）
          </h2>
          <p>
            本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-white">
            第11条（お問い合わせ窓口）
          </h2>
          <p className="mb-3">
            本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
          </p>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm">
            <p className="font-medium text-white">HITOON運営事務局</p>
            <p className="mt-1">代表：井手 恭一郎</p>
            <p className="mt-1">
              Eメールアドレス：
              <span className="text-blue-400">info@hitoonstore.com</span>
            </p>
          </div>
        </section>
      </div>

      <p className="mt-8 text-right text-gray-500">以上</p>
    </article>
  );
}
