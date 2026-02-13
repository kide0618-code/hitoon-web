'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Users, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/lib/utils/format';

interface ArtistItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  memberCount: number;
  lowestPrice: number;
}

export function MarketClient({ artists }: { artists: ArtistItem[] }) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? artists.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : artists;

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Find Artists</h1>

      {/* Spotify-style search bar */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="アーティストを検索"
          className="w-full rounded-full bg-gray-800 py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:bg-gray-700 focus:ring-2 focus:ring-white/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map((artist) => (
            <Link
              key={artist.id}
              href={ROUTES.ARTIST(artist.id)}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-surface-raised p-4 transition-all hover:border-blue-500/50 group-hover:shadow-card">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-700 transition-colors group-hover:border-blue-500/50">
                  <Image
                    src={
                      artist.imageUrl || 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist'
                    }
                    alt={artist.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold">{artist.name}</h3>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <Users size={12} className="mr-1" />
                    {artist.memberCount} Members
                  </div>
                  <p className="text-lg font-bold text-blue-400">
                    {formatPrice(artist.lowestPrice)}〜
                  </p>
                </div>
                <div className="text-xl text-gray-600 transition-colors group-hover:text-blue-400">
                  →
                </div>
              </div>
            </Link>
          ))
        ) : query ? (
          <div className="py-20 text-center">
            <Search className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="mb-2 text-gray-500">「{query}」に一致するアーティストが見つかりません</p>
          </div>
        ) : (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="mb-2 text-gray-500">アーティストがまだ登録されていません。</p>
            <p className="text-xs text-gray-600">新しいアーティストを準備中です</p>
          </div>
        )}
      </div>
    </div>
  );
}
