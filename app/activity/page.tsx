'use client';

import React from 'react';
import { artists } from '../data/artists';
import { Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CollectionPage() {
  // デモ用にすべてのアーティストを「保有済み」として表示
  const myCollection = artists;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="p-6 bg-gray-900 border-b border-gray-800 flex items-center gap-3 sticky top-0 z-10">
        <Layers className="text-blue-500" />
        <h1 className="text-2xl font-bold">Collection</h1>
      </div>

      <div className="p-4 space-y-4">
        {myCollection.map((artist) => (
          <Link href={`/artists/${artist.id}`} key={artist.id} className="block group">
            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 border border-gray-800 group-hover:border-blue-500/50 transition-all shadow-lg active:scale-[0.98]">
              {/* アーティスト画像 */}
              <div className="relative">
                <img 
                  src={artist.image} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30" 
                  alt={artist.name}
                />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5 border border-black">
                  <ShieldCheck size={12} className="text-white" />
                </div>
              </div>

              {/* テキスト情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold truncate">{artist.name}</h3>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  Membership ID: #000{artist.id}
                </p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-blue-900/30 border border-blue-800/50 rounded text-[10px] text-blue-400 font-bold">
                  CONTENT UNLOCKED
                </div>
              </div>

              {/* 矢印アイコン */}
              <div className="text-gray-600 group-hover:text-blue-400 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        ))}

        {myCollection.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>まだコレクションがありません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
