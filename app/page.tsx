'use client';
import Link from "next/link";
import { TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { songs } from "./data/songs";

export default function Home() {
  // ランキング用（ランク順）
  const rankingSongs = [...songs].sort((a, b) => a.rank - b.rank).slice(0, 3);
  // ニューリリース用（ID順の逆＝最新）
  const newSongs = [...songs].reverse().slice(0, 4);

  return (
    <main>
      {/* ヒーローセクション（特集） */}
      <section className="mb-10 pt-4">
        <div className="w-full aspect-[2/1] bg-gradient-to-r from-indigo-600 to-purple-800 rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl">🎸</div>
          <span className="relative z-10 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded w-fit mb-2">Feature</span>
          <h2 className="relative z-10 text-2xl font-bold text-white mb-1">Next Break Artist</h2>
          <p className="relative z-10 text-indigo-100 text-sm">今週注目のインディーズバンド特集</p>
        </div>
      </section>

      {/* ランキングセクション */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="text-yellow-400"/> Ranking</h2>
          <Link href="/ranking" className="text-xs text-slate-400 flex items-center">すべて見る <ChevronRight size={14}/></Link>
        </div>
        <div className="space-y-3">
          {rankingSongs.map((song, index) => (
            <Link href={`/songs/${song.id}`} key={song.id} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-transparent hover:border-slate-600 transition">
              <span className="text-2xl font-bold text-blue-500 w-8 text-center italic">{index + 1}</span>
              <div className={`w-12 h-12 rounded bg-gradient-to-br ${song.color}`}></div>
              <div>
                <h3 className="font-bold text-sm">{song.title}</h3>
                <p className="text-xs text-slate-400">{song.artist}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ニューリリースセクション */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-pink-400"/> New Releases</h2>
          <Link href="/market" className="text-xs text-slate-400 flex items-center">もっと探す <ChevronRight size={14}/></Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {newSongs.map((song) => (
            <Link href={`/songs/${song.id}`} key={song.id} className="group">
              <div className={`aspect-square rounded-xl bg-gradient-to-br ${song.color} mb-2 shadow-lg group-hover:scale-[1.02] transition duration-300`}></div>
              <h3 className="font-bold text-sm truncate">{song.title}</h3>
              <p className="text-xs text-slate-400">{song.artist}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
