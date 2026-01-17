import Link from "next/link";
import { ArrowLeft, ShieldAlert, Scale, FileText, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* ヘッダーエリア */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="text-blue-500" size={20} />
            HITOON 利用規約
          </h1>
          <Link href="/" className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft size={16} /> 戻る
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* 前文 */}
        <div className="mb-10 p-6 bg-blue-900/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm leading-relaxed text-blue-100">
            この利用規約（以下「本規約」）は、HITOON（以下「当サービス」）において、アーティストとユーザー（公式パートナー）との間で行われる将来債権の譲渡取引、およびそれに付随する一切の関係に適用されます。<br/>
            ユーザーは、本サービスの利用をもって、本規約および重要事項説明書の内容に完全かつ取消不能な同意をしたものとみなされます。
          </p>
        </div>

        {/* 条文コンテンツ */}
        <article className="space-y-12">
          
          {/* 第1章 総則・定義 */}
          <section>
            <h2 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-4 mb-6">
              第1章 取引の性質と定義
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-slate-400"/> 第1条（法的性質の定義）
                </h3>
                <p className="text-sm leading-7 mb-4">
                  1. 本サービスにおいて取引される「パス」とは、特定の楽曲に関して将来発生する著作権使用料等の収益を受け取る権利（将来債権）の一部を、アーティストからユーザーへ譲渡する契約を証する電子的記録を指します。
                </p>
                <p className="text-sm leading-7 mb-4">
                  2. 本取引は民法上の「債権譲渡契約」であり、金融商品取引法第2条第2項に定める「有価証券（集団投資スキーム持分等）」には該当しません。ユーザーは、収益の発生がアーティストの運用能力のみに依存するものではなく、ユーザー自身の資産管理行為（第3条参照）に依存することを理解し、これを承諾します。
                </p>
              </div>
            </div>
          </section>

          {/* 第2章 ユーザーの役割（副業・労働回避） */}
          <section>
            <h2 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-4 mb-6">
              第2章 パートナーの役割と権利
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                <h3 className="text-white font-bold mb-3">第2条（非雇用・非労働の確認）</h3>
                <p className="text-sm leading-7">
                  ユーザーが本サービスを通じて行う楽曲の視聴、SNSでの共有、その他一切の普及活動は、ユーザー自身が保有する債権（資産）の価値を維持・向上させるための「任意の自己資産管理行為」であり、当社またはアーティストからの指揮命令に基づく労務の提供（労働）ではありません。したがって、労働基準法上の労働者性は認められず、最低賃金の適用等の労働法規の適用はありません。
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                <h3 className="text-white font-bold mb-3">第3条（収益分配の性質）</h3>
                <p className="text-sm leading-7">
                  ユーザーに支払われる金銭は、労働の対価（給与）ではなく、保有する債権に基づいて発生した収益の分配金（雑所得または譲渡所得）となります。ユーザーは、自己の責任において必要な確定申告等の税務処理を行うものとします。
                </p>
              </div>
            </div>
          </section>

          {/* 第3章 リスク開示（金商法・特商法対策） */}
          <section>
            <h2 className="text-xl font-bold text-white border-l-4 border-red-500 pl-4 mb-6">
              第3章 リスク開示および免責
            </h2>

            <div className="space-y-6">
              <div className="bg-red-950/20 p-6 rounded-lg border border-red-900/50">
                <h3 className="text-red-200 font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} /> 第4条（元本欠損リスク）
                </h3>
                <p className="text-sm leading-7 text-slate-300">
                  本取引は元本が保証されたものではありません。楽曲の再生実績や市場環境の変化により、収益分配総額がパスの購入価格を下回る場合、または0円となる場合があります。当社およびアーティストは、いかなる場合も元本の返還や補填を行いません。
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                <h3 className="text-white font-bold mb-3">第5条（クーリングオフの適用除外）</h3>
                <p className="text-sm leading-7">
                  本サービスで提供されるパスおよびデジタルコンテンツは、特定商取引法に定めるクーリングオフ制度の適用対象外（通信販売）となります。決済完了後のキャンセル、返品、返金はいかなる理由があっても応じられません。
                </p>
              </div>
              
              <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <ShieldAlert size={18} className="text-slate-400"/> 第6条（サービスの停止・終了）
                </h3>
                <p className="text-sm leading-7">
                  法令の改正、行政庁による指導、またはプラットフォーム（Spotify等）の仕様変更により、本サービスの継続が困難となった場合、当社はサービスを停止または終了することができます。その際、パスの買取りや将来収益の補償は行わないものとします。
                </p>
              </div>
            </div>
          </section>

          {/* 第4章 その他 */}
          <section>
            <h2 className="text-xl font-bold text-white border-l-4 border-slate-500 pl-4 mb-6">
              第4章 雑則
            </h2>
             <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-sm space-y-4">
                <p><strong>第7条（禁止事項）</strong><br/>botやスクリプトを用いた不正な再生数稼ぎ、虚偽の風説の流布、マネーロンダリング目的での取引を固く禁じます。</p>
                <p><strong>第8条（準拠法・管轄）</strong><br/>本規約は日本法に準拠し、本サービスに関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
             </div>
          </section>

        </article>

        {/* フッターアクション */}
        <div className="mt-16 pt-10 border-t border-slate-800 text-center space-y-6">
          <p className="text-slate-500 text-sm">
            本規約の内容に同意できない場合、本サービスを利用することはできません。
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            規約に同意してトップへ戻る
          </Link>
          <p className="text-xs text-slate-600 pb-10">
            制定日：2026年1月17日
          </p>
        </div>

      </div>
    </main>
  );
}
