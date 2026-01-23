'use client';

import React from 'react';
import { artists } from '../data/artists';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-20 p-4">
      <h1 className="text-2xl font-bold mb-6">Find Artists</h1>
      <div className="grid grid-cols-1 gap-4">
        {artists.map((artist) => (
          <Link href={`/artists/${artist.id}`} key={artist.id} className="block bg-gray-900 rounded-xl border border-gray-800 p-3 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700">
              <img src={artist.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{artist.name}</h3>
              <div className="flex items-center text-xs text-gray-500 mb-2"><Users size={12} className="mr-1" /> {artist.members} Members</div>
              <p className="text-blue-400 font-bold">¥{artist.price.toLocaleString()}</p>
            </div>
            <div className="text-gray-600">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
