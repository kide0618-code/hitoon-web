'use client';
import { Headphones, ExternalLink } from "lucide-react"; // アイコンを音楽用に変更
import { songs } from "../data/songs";

export default function Activity() {
  // 今回は例として ID:1 (Midnight City) をターゲットにします
  const targetSong = songs.find(s => s.id === 1) || songs[0];

  const handlePlay = () => {
    // データの demoUrl を新しいタブで開く
    window.open(targetSong.demoUrl, '_blank');
  };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-2">Activities</h1>
      <p className="text-slate-400 text-sm mb-8">楽曲を聴いて再生回数に貢献しよう</p>
      
      <div className={`bg-gradient-to-br ${targetSong.color} rounded-2xl p-6 shadow-lg relative overflow-hidden`}>
        {/* 背景の装飾 */}
        <div className="absolute top-0 right-0 p-6 opacity-20">
          <Headphones size={100} className="text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-2xl mb-1">{targetSong.title}</h3>
              <p className="text-slate-200 text-sm">{targetSong.artist}</p>
              <p className="text-xs text-white/70 mt-2">あなたの担当: 10口</p>
            </div>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30">
              未完了
            </span>
          </div>

          <button 
            onClick={handlePlay} 
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-6 rounded-full w-full text-sm flex items-center justify-center gap-2 transition shadow-xl"
          >
            <ExternalLink size={18} /> サブスクで聴く
          </button>
        </div>
      </div>
    </main>
  );
}
