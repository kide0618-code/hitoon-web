'use client';

import React from 'react';
import Link from 'next/link';
import { artists } from './data/artists'; 
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const featured = artists.slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="relative h-96 w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-transparent to-transparent">
          <h1 className="text-4xl font-extrabold mb-3">音楽を、一生モノにする。</h1>
          <Link href="/market" className="w-full sm:w-auto bg-white text-black text-center font-bold py-3 px-8 rounded-full mt-4">
            アーティストを探す
          </Link>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-5"><Sparkles className="text-yellow-500" /> Pickup Artists</h2>
        <div className="space-y-4">
          {featured.map((artist) => (
            <Link href={`/artists/${artist.id}`} key={artist.id} className="block group">
              <div className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                <img src={artist.image} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1"><h3 className="font-bold text-sm">{artist.name}</h3><p className="text-xs text-gray-500">{artist.members} Members</p></div>
                <div className="text-sm font-bold text-blue-400">¥{artist.price.toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
