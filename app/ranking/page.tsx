'use client';
import Link from "next/link";
import { Trophy, TrendingUp, Minus } from "lucide-react";
import { songs } from "../data/songs";

export default function Ranking() {
  const sortedSongs = [...songs].sort((a, b) => a.rank - b.rank);

  return (
    <main>
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-yellow-400" size={32} />
        <h1 className="text-3xl font-bold">Ranking</h1>
      </div>
      <div className="space-y-2">
        {sortedSongs.map((song, index) => (
          <Link href={`/songs/${song.id}`} key={song.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition border border-transparent hover:border-slate-700">
            <div className={`w-8 text-center font-bold text-xl ${index < 3 ? 'text-blue-400' : 'text-slate-600'}`}>{index + 1}</div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${song.color} flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{song.title}</h3>
              <p className="text-sm text-slate-400 truncate">{song.artist}</p>
            </div>
            <div className="text-slate-500">{index % 2 === 0 ? <TrendingUp size={16} className="text-green-500"/> : <Minus size={16} />}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
