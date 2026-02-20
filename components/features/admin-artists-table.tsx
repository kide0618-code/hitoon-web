'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PayoutStatusSelect } from '@/components/features/payout-status-select';
import { FeaturedToggle } from '@/components/features/featured-toggle';
import { ArtistEditForm } from '@/components/features/artist-edit-form';

interface ArtistRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  member_count: number;
  is_featured: boolean;
  display_order: number;
  archived_at: string | null;
}

interface AdminArtistsTableProps {
  artists: ArtistRow[];
  payoutMap: Record<string, string>;
  year: number;
  month: number;
}

export function AdminArtistsTable({ artists, payoutMap, year, month }: AdminArtistsTableProps) {
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not_featured'>('all');
  const [payoutFilter, setPayoutFilter] = useState<'all' | 'pending' | 'transferred' | 'confirmed'>(
    'all',
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deleted'>('all');

  const filteredArtists = artists.filter((artist) => {
    if (nameFilter && !artist.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (featuredFilter === 'featured' && !artist.is_featured) return false;
    if (featuredFilter === 'not_featured' && artist.is_featured) return false;
    if (payoutFilter !== 'all') {
      const status = payoutMap[artist.id] || 'pending';
      if (status !== payoutFilter) return false;
    }
    if (statusFilter === 'active' && artist.archived_at) return false;
    if (statusFilter === 'deleted' && !artist.archived_at) return false;
    return true;
  });

  const handleClose = useCallback(() => {
    setSelectedArtistId(null);
  }, []);

  // Close dialog on Escape key
  useEffect(() => {
    if (!selectedArtistId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtistId, handleClose]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (selectedArtistId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArtistId]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
        <input
          type="text"
          placeholder="アーティスト名で検索..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        />
        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value as typeof featuredFilter)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Featured: すべて</option>
          <option value="featured">Featured のみ</option>
          <option value="not_featured">非Featured のみ</option>
        </select>
        <select
          value={payoutFilter}
          onChange={(e) => setPayoutFilter(e.target.value as typeof payoutFilter)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">支払い: すべて</option>
          <option value="pending">未対応</option>
          <option value="transferred">振込済</option>
          <option value="confirmed">確認済</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">ステータス: すべて</option>
          <option value="active">契約中</option>
          <option value="deleted">契約終了</option>
        </select>
        {(nameFilter ||
          featuredFilter !== 'all' ||
          payoutFilter !== 'all' ||
          statusFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setNameFilter('');
              setFeaturedFilter('all');
              setPayoutFilter('all');
              setStatusFilter('all');
            }}
            className="rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            クリア
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Members</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">表示順</th>
              <th className="px-6 py-4">支払い（{month}月）</th>
              <th className="px-6 py-4">契約終了日</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist) => (
                <tr
                  key={artist.id}
                  className="cursor-pointer border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4" onClick={() => setSelectedArtistId(artist.id)}>
                    <div className="flex items-center gap-3">
                      {artist.image_url && (
                        <Image
                          src={artist.image_url}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                          unoptimized
                        />
                      )}
                      <div>
                        <p
                          className={`font-medium ${artist.archived_at ? 'text-gray-500 line-through' : 'text-white'}`}
                        >
                          {artist.name}
                        </p>
                        <p className="max-w-[200px] truncate text-sm text-gray-500">
                          {artist.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-gray-400"
                    onClick={() => setSelectedArtistId(artist.id)}
                  >
                    {artist.member_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <FeaturedToggle artistId={artist.id} defaultValue={artist.is_featured} />
                  </td>
                  <td
                    className="px-6 py-4 font-mono text-gray-400"
                    onClick={() => setSelectedArtistId(artist.id)}
                  >
                    {artist.display_order}
                  </td>
                  <td className="px-6 py-4">
                    <PayoutStatusSelect
                      artistId={artist.id}
                      year={year}
                      month={month}
                      defaultStatus={payoutMap[artist.id] || 'pending'}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {artist.archived_at ? (
                      <span className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-400">
                        {new Date(artist.archived_at).toLocaleDateString('ja-JP')}
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {artists.length === 0
                    ? 'No artists yet. Create your first artist.'
                    : '条件に一致するアーティストがいません。'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      {selectedArtistId && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pb-12 pt-12"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-950 p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ArtistEditForm
              key={selectedArtistId}
              artistId={selectedArtistId}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </>
  );
}
