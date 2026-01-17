'use client';
import { ShieldCheck, ArrowLeft, Hash, Crown } from "lucide-react"; 
import Link from "next/link";
import { useParams } from "next/navigation";
import { songs } from "../../data/songs"; 
import PurchaseAgreement from "@/components/PurchaseAgreement";

export default function SongDetail() {
  const params = useParams();
  
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const song = songs.find(s => s.id === id) || songs[0];

  return (
    <main className="pb-20">
      <Link href="/" className="mb-4 inline-flex items-center text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={16} className="mr-1"/>戻る
      </Link>
      
      {/* ▼ デジタルパス風カード */}
      <div className={`relative aspect-video w-full rounded-3xl bg-gradient-to-br ${song.color} p-6 shadow-2xl overflow-hidden mb-8 group`}>
        
        {/* 背景の装飾 */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 mix-blend-overlay"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"></div>

        {/* ▼ 修正箇所：ナンバリングバッジ */}
        <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg shadow-lg">
          <div className="bg-yellow-400 text-yellow-950 p-1 rounded-full">
             <Crown size={14} fill="currentColor" />
          </div>
          <div className="text-right leading-none">
            <span className="block text-[10px] text-yellow-200 uppercase tracking-wider font-medium mb-0.5">Next Mint</span>
            <span className="block text-white font-mono font-bold text-lg tracking-widest">#001</span>
          </div>
        </div>

        {/* 中央のアイコン */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">🎵</span>
        </div>

        {/* 左下のパス情報 */}
        <div className="absolute bottom-5 left-5">
           <p className="text-white/80 text-xs font-bold tracking-wider uppercase mb-1">Official Partner Pass</p>
           <h2 className="text-white text-2xl font-bold leading-none">{song.title}</h2>
        </div>
      </div>

      <div className="mb-8 px-2">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <span className="flex items-center gap-1 text-yellow-500 text-xs border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 rounded">
             <Hash size={12} /> 初期ロット残りわずか
          </span>
        </div>
        <p className="text-slate-400 text-lg">{song.artist}</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-500"/> 公式パートナー権
        </h3>
        
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          このパスを購入すると、あなたはこの楽曲の収益分配権を持つ「公式パートナー」になります。
          <span className="block mt-2 text-xs text-slate-400">
             ※労働契約や雇用契約ではありません。
          </span>
        </p>

        <PurchaseAgreement />
        
      </div>
    </main>
  );
}

