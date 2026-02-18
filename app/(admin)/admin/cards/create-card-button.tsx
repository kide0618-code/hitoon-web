'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Artist {
  id: string;
  name: string;
}

export function CreateCardButton({ artists }: { artists: Artist[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreate = async (artistId: string) => {
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_id: artistId,
          name: '(下書き)',
          card_image_url: '',
          price: 0,
          is_active: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create draft');
      }

      router.push(`/admin/cards/${data.card.id}`);
    } catch {
      alert('カードの作成に失敗しました');
      setIsCreating(false);
      setShowDropdown(false);
    }
  };

  if (showDropdown) {
    return (
      <div className="flex items-center gap-2">
        <select
          value={selectedArtistId}
          onChange={(e) => setSelectedArtistId(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          disabled={isCreating}
        >
          <option value="">アーティストを選択</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => selectedArtistId && handleCreate(selectedArtistId)}
          disabled={!selectedArtistId || isCreating}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
        >
          {isCreating ? '作成中...' : '作成'}
        </button>
        <button
          onClick={() => {
            setShowDropdown(false);
            setSelectedArtistId('');
          }}
          className="text-sm text-gray-400 transition-colors hover:text-white"
          disabled={isCreating}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowDropdown(true)}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
    >
      + Add Card
    </button>
  );
}
