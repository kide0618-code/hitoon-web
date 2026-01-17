'use client';
import Link from "next/link";
import { Award, PlayCircle, Settings, User } from "lucide-react";
import { songs } from "../data/songs";

export default function Profile() {
  // 自分が持っているパス（デモ用にID 1,2,5 を保有と仮定）
  const myPasses = songs.filter(s => [1, 2, 5].includes(s.id));

  return (
    <main>
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold">My Page</h1>
          <p className="text-slate-400 text-sm">Kyoichiro Ide</p>
        </div>
        <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>

      {/* ステータスカード */}
      <section className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={60}/></div>
          <p className="text-xs text-slate-400 mb-1">保有パス</p>
          <p className="text-3xl font-bold">12 <span className="text-sm font-normal">枚</span></p>
        </div>
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-5 rounded-2xl border border-blue-500/30">
          <p className="text-xs text-blue-300 mb-1">予想リワード</p>
          <p className="text-3xl font-bold text-white">¥ 4,280</p>
        </div>
      </section>

      {/* 保有している楽曲 */}
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PlayCircle size={20} className="text-blue-400"/> My Library
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {myPasses.map((song) => (
            <Link href={`/songs/${song.id}`} key={song.id} className="group">
              <div className={`aspect-square rounded-xl bg-gradient-to-br ${song.color} shadow-lg mb-3 relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                  <span className="text-2xl">🎵</span>
                </div>
              </div>
              <h3 className="font-bold text-sm truncate">{song.title}</h3>
              <p className="text-xs text-slate-400">{song.artist}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
