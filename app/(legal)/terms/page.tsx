import type { Metadata } from 'next';
import { APP_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: '利用規約',
  description: `${APP_CONFIG.name}の利用規約`,
};

export default function TermsPage() {
  return (
    <article className="max-w-none text-sm leading-relaxed text-gray-300">
      <h1 className="mb-2 text-xl font-bold text-white">HITOON ユーザー利用規約</h1>
      <p className="mb-8 text-xs text-gray-500">最終更新日: 2026年3月4日</p>

      <div className="space-y-6">
        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第1条（定義・法的性質）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              「デジタルグッズ（コレクティブル）」とは、当社がアーティストと提携し発行する、電磁的記録としての画像、音声、または映像データ、およびこれらに付帯するサービスの利用権を指します。
            </li>
            <li>
              本商品は、鑑賞、収集、およびファンコミュニティ内での交流を主目的としたものであり、金融商品取引法上の有価証券、または資金決済法上の暗号資産（仮想通貨）ではありません。ユーザーは、本商品がいわゆる「投資スキーム」ではないことを理解し、娯楽および応援を目的として利用することに同意するものとします。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第2条（本サービスの性質）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              本サービスは、アーティスト公認のデジタルグッズをユーザーが購入・収集できるプラットフォームです。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第3条（権利の帰属と利用権）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              ユーザーがデジタルグッズを購入することで取得するのは、本サービス内で当該データを表示・再生し、第三者へ譲渡することができない「非独占的な利用許諾権（ライセンス）」のみです。所有権や著作権がユーザーに移転するものではありません。
            </li>
            <li>
              デジタルグッズに関する著作権、原盤権、肖像権その他一切の知的財産権は、アーティスト、所属事務所、または当社に留保されます。ユーザーはいかなる場合も、デジタルグッズを商用利用（複製、配布、改変、グッズ化等）することはできません。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第4条（譲渡および二次流通に関する特約）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              本サービス内でのデジタルグッズの譲渡はできません。また、本サービスのアカウントやデジタルグッズの閲覧権を、当社の承諾なく外部サイト（SNS、オークションサイト等）を用いて有償・無償を問わず譲渡・売買することを固く禁じます。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第5条（価格変動と免責）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <span className="font-medium text-gray-200">価格決定の自由:</span>{' '}
              商品の価格はアーティストの判断によって決定されます。
            </li>
            <li>
              <span className="font-medium text-gray-200">価値保証の否定:</span>{' '}
              デジタルグッズの取引価格は変動する可能性がありますが、これはトレーディングカードや骨董品と同様の相対取引の結果であり、当社はその将来的な価値や価格維持を一切保証しません。価格下落による損失について、当社は責任を負いません。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">第6条（禁止事項）</h2>
          <p className="mb-3">
            ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
          </p>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              <span className="font-medium text-gray-200">コンテンツの流出・複製：</span>{' '}
              デジタルグッズのデータ（画像、動画、音声等）を、スクリーンショット、画面録画、ダウンロード等の手段により複製し、SNSや動画サイト等へ転載・公開する行為。
            </li>
            <li>
              <span className="font-medium text-gray-200">アカウントの譲渡・売買：</span>
              本サービスのアカウント、または購入したデジタルグッズの閲覧権を、当社の承諾なく第三者に有償・無償を問わず譲渡、貸与、または担保に供する行為。
            </li>
            <li>
              <span className="font-medium text-gray-200">営業妨害：</span>{' '}
              アーティストへの誹謗中傷、ストーカー行為、または当社のサーバーに過度な負担をかける行為。
            </li>
            <li>
              <span className="font-medium text-gray-200">不正利用：</span>{' '}
              クレジットカードの不正利用、または他人のアカウントを利用する行為。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第7条（返品・キャンセル）
          </h2>
          <p>
            デジタルコンテンツの性質上、購入手続き完了後のユーザー都合による返品、キャンセル、返金は一切できないものとします。アカウントの停止（バン）になった際も同様のものとします。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第8条（免責事項・サービスの停止）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              当社は、システムの保守点検、天災、通信回線の事故等により、事前の通知なく本サービスを一時的に停止することがあります。
            </li>
            <li>
              当社は、本サービスの継続的な提供に努めますが、将来において本サービスを終了する可能性があります。サービス終了時には、購入済みのデジタルグッズは引き続き閲覧もしくはダウンロード期間を設けます。しかし不測の事態で閲覧ができなくなる場合があることを、ユーザーは予め承諾するものとします。
            </li>
            <li>
              アーティストの活動停止や契約終了により、特定のデジタルグッズの配信が停止される場合があります。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第9条（違反行為への措置）
          </h2>
          <p>
            ユーザーが本規約に違反した場合、当社は事前の通知なく、当該ユーザーのアカウントを停止（バン）もしくは制限をし、以降の本サービスの利用を禁止、制限することができるものとします。この場合、ユーザーが保有するデジタルグッズの閲覧権は喪失し、当社は受領済みの代金を返還しないものとします。
          </p>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第10条（契約の成立）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              ユーザーは、本規約の内容に同意の上、当社所定の方法により利用登録を申請し、当社がこれを承認した時点で、本規約を内容とする利用契約が成立するものとします。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第11条（未成年者の利用）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              ユーザーが未成年者である場合、親権者等の法定代理人の同意を得た上で本サービスを利用しなければなりません。
            </li>
            <li>
              未成年者のユーザーが、法定代理人の同意がないにもかかわらず同意があると偽り、または年齢について成年と偽って本サービスを利用した場合、当該利用に関する一切の法律行為を取り消すことはできません。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第12条（反社会的勢力の排除）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              ユーザーは、現在かつ将来にわたり、暴力団、暴力団員、暴力団準構成員、暴力団関係企業、総会屋等、社会運動等標榜ゴロまたは特殊知能暴力集団等、その他これらに準ずる者（以下「反社会的勢力」といいます）に該当しないこと、および反社会的勢力と不適切な関係を有しないことを表明し、保証するものとします。
            </li>
            <li>
              当社は、ユーザーが前項に違反したと判断した場合、事前の通知や催告なく、即時に利用契約を解除し、アカウントを停止または削除することができます。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第13条（アカウント情報の管理）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              ユーザーは、自己の責任において、本サービスに関するログイン情報（IDおよびパスワード等）を適切に管理・保管するものとします。これを第三者に利用させ、または貸与、譲渡、名義変更、売買等をしてはなりません。
            </li>
            <li>
              ログイン情報の管理不十分、使用上の過誤、第三者の使用等によって生じた損害の責任はユーザーが負うものとし、当社は一切の責任を負いません。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第14条（利用環境の整備）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              本サービスを利用するために必要な通信機器、ソフトウェア、通信回線等の利用環境は、ユーザーの責任と費用において用意し、維持するものとします。
            </li>
            <li>
              当社は、ユーザーの利用環境によって本サービスが正常に利用できない場合であっても、一切の責任を負いません。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第15条（非保証および免責）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              当社は、本サービスがユーザーの特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有すること、および不具合が生じないことについて、明示または黙示を問わず何ら保証するものではありません。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第16条（損害賠償の制限）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              当社は、本サービスの利用に関連してユーザーに生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
            </li>
            <li>
              当社が損害賠償責任を負う場合であっても、賠償額は、直接かつ通常の損害に限り、かつ1000円を上限とします。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第17条（契約の終了）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>ユーザーは、いつでも利用契約を終了させることができます。</li>
            <li>
              当社は、ユーザーが本規約のいずれかの条項に違反した場合、事前の通知なく利用契約を解除し、本サービスの提供を終了させることができます。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第18条（本規約の変更）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>当社は、本サービスの内容を自由に変更できるものとします。</li>
            <li>
              当社は、本規約（当社ウェブサイトに掲載する本サービスに関するルール、諸規定等を含みます。以下本項において同じ。）を変更できるものとします。当社は、本規約を変更する場合には、変更の内容及び変更の効力発生時期を、当該効力発生時期までに当社所定の方法で告知するものとします。告知された効力発生時期以降に登録ユーザーが本サービスを利用した場合又は当社の定める期間内に登録取消の手続をとらなかった場合には、登録ユーザーは、本規約の変更に同意したものとみなします。
            </li>
          </ol>
        </section>

        <section className="border-b border-gray-800 pb-6">
          <h2 className="mb-3 text-base font-bold text-white">
            第19条（分離可能性）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              本規約のいずれかの条項又はその一部が、消費者契約法その他の法令等により無効又は執行不能と判断された場合であっても、本規約の残りの規定及び一部が無効又は執行不能と判断された規定の残りの部分は、継続して完全に効力を有し、当社及び登録ユーザーは、当該無効若しくは執行不能の条項又は部分を適法とし、執行力を持たせるために必要な範囲で修正し、当該無効若しくは執行不能な条項又は部分の趣旨並びに法律的及び経済的に同等の効果を確保できるように努めるものとします。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-base font-bold text-white">
            第20条（準拠法・管轄）
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </li>
          </ol>
        </section>
      </div>
    </article>
  );
}
