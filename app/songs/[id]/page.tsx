'use client';
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { songs } from "../../data/songs"; 

// ▼ 1. 作った同意コンポーネントを読み込む
import PurchaseAgreement from "@/components/PurchaseAgreement";

export default function SongDetail() {
  const params = useParams();
  
  // URLのIDから曲を探す
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const song = songs.find(s => s.id === id) || songs[0];

  return (
    <main className="pb-20">
      <Link href="/" className="mb-4 inline-flex items-center text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={16} className="mr-1"/>戻る
      </Link>
      
      <div className={`aspect-video w-full rounded-3xl bg-gradient-to-br ${song.color} flex items-center justify-center mb-8 shadow-2xl`}>
        <span className="text-6xl">🎵</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
        <p className="text-slate-400 text-lg">{song.artist}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8">
        {/* ▼ 2. 文言修正：「プロモーター契約」→「公式パートナー権」へ 
             これで「労働契約」ではなく「権利」であることを明確にします */}
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-500"/> 公式パートナー権
        </h3>
        
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          このパスを購入すると、あなたはこの楽曲の収益分配権を持つ「公式パートナー」になります。
          <span className="block mt-2 text-xs text-slate-400">
             ※労働契約や雇用契約ではありません。
          </span>
        </p>

        {/* ▼ 3. 以前のボタンを削除し、同意画面コンポーネントに置き換え */}
        <PurchaseAgreement />
        
      </div>
    </main>
  );
}
