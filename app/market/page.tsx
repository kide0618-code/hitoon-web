'use client';
import Link from "next/link";
import { Search } from "lucide-react";
import { songs } from "../data/songs";

export default function Market() {
  return (
    <main>
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input type="text" placeholder="楽曲を検索..." className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition"/>
      </div>
      <h2 className="text-xl font-bold mb-4">New Releases</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <Link href={`/songs/${song.id}`} key={song.id} className="group">
            <div className={`aspect-square rounded-xl bg-gradient-to-br ${song.color} shadow-lg mb-3 relative overflow-hidden group-hover:scale-105 transition duration-300`}></div>
            <div>
              <h3 className="font-bold text-sm truncate">{song.title}</h3>
              <p className="text-xs text-slate-400 truncate">{song.artist}</p>
              <p className="text-xs text-blue-400 mt-1">¥{song.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
