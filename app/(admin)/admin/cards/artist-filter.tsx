'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ArtistFilterProps {
  artists: { id: string; name: string }[];
}

export function ArtistFilter({ artists }: ArtistFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentArtistId = searchParams.get('artist') || '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      router.push(`/admin/cards?artist=${value}`);
    } else {
      router.push('/admin/cards');
    }
  };

  return (
    <select
      value={currentArtistId}
      onChange={handleChange}
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
    >
      <option value="">All Artists</option>
      {artists.map((artist) => (
        <option key={artist.id} value={artist.id}>
          {artist.name}
        </option>
      ))}
    </select>
  );
}
