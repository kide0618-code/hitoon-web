import Image from 'next/image';
import { use } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ArtistFilter } from './artist-filter';
import { CreateCardButton } from './create-card-button';

interface PageProps {
  searchParams: Promise<{ artist?: string }>;
}

export default function AdminCardsPage({ searchParams }: PageProps) {
  const { artist: artistId } = use(searchParams);

  const supabase = use(createServerSupabaseClient());

  // Fetch artists for filter
  const { data: artists } = use(
    supabase.from('artists').select('id, name').order('name', { ascending: true }),
  );

  // Fetch cards with optional artist filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('cards') as any)
    .select(
      `
      *,
      artist:artists (id, name)
    `,
    )
    .order('created_at', { ascending: false });

  if (artistId) {
    query = query.eq('artist_id', artistId);
  }

  const { data: cards } = use(query) as {
    data:
      | {
          id: string;
          name: string;
          rarity: string;
          price: number;
          total_supply: number | null;
          current_supply: number;
          card_image_url: string;
          song_title: string | null;
          is_active: boolean;
          archived_at: string | null;
          created_at: string;
          artist: { id: string; name: string };
        }[]
      | null;
  };

  const rarityStyles: Record<string, string> = {
    NORMAL: 'bg-gray-800 text-gray-400',
    RARE: 'bg-blue-900/50 text-blue-400',
    SUPER_RARE: 'bg-purple-900/50 text-purple-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Cards</h1>
        <CreateCardButton artists={artists || []} />
      </div>

      <div className="flex items-center gap-3">
        <ArtistFilter artists={artists || []} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
              <th className="px-6 py-4">Card</th>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Rarity</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Supply</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {cards?.map((card) => (
              <tr
                key={card.id}
                className="cursor-pointer border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
              >
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4"
                  >
                    {card.card_image_url && (
                      <Image
                        src={card.card_image_url}
                        alt={card.name}
                        width={48}
                        height={64}
                        className="h-16 w-12 rounded object-cover"
                        unoptimized
                      />
                    )}
                    <div>
                      <p className="font-medium text-white">{card.name}</p>
                      {card.song_title && (
                        <p className="text-xs text-gray-500">{card.song_title}</p>
                      )}
                    </div>
                  </a>
                </td>
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-4 text-gray-400"
                  >
                    {card.artist?.name}
                  </a>
                </td>
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-4"
                  >
                    <span
                      className={`rounded px-2 py-1 text-xs ${rarityStyles[card.rarity] || rarityStyles.NORMAL}`}
                    >
                      {card.rarity}
                    </span>
                  </a>
                </td>
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-4 text-white"
                  >
                    ¥{card.price.toLocaleString()}
                  </a>
                </td>
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-4 font-mono text-gray-400"
                  >
                    {card.current_supply}
                    {card.total_supply !== null && ` / ${card.total_supply}`}
                  </a>
                </td>
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-4"
                  >
                    {card.archived_at ? (
                      <span className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-400">
                        Archived
                      </span>
                    ) : card.is_active ? (
                      <span className="rounded bg-green-900/50 px-2 py-1 text-xs text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-500">
                        Inactive
                      </span>
                    )}
                  </a>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No cards yet. Click &quot;+ Add Card&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
