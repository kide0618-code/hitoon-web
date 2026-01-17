'use client';
import { Wallet, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"; // 👈 これを追加しました
import { songs } from "../../data/songs"; 

export default function SongDetail() {
  // 👈 paramsを受け取るのをやめて、フックでIDを取得します
  const params = useParams();
  
  // URLのIDから曲を探す (配列対策をして安全に変換)
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
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-500"/> プロモーター契約
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          このパスを購入すると、あなたはこの楽曲の「公認プロモーター」になります。
        </p>
        <button onClick={() => alert("購入デモ")} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 w-full rounded-full flex items-center justify-center gap-2">
          <Wallet size={18} /> パスを購入 (¥{song.price})
        </button>
      </div>
    </main>
  );
}
