import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminCardsPage() {
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: cards } = (await (supabase.from('cards') as any)
    .select(
      `
      *,
      artist:artists (id, name)
    `,
    )
    .order('created_at', { ascending: false })) as {
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
        <a
          href="/admin/cards/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          + Add Card
        </a>
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
                  <a href={`/admin/cards/${card.id}`} className="flex items-center gap-3 px-6 py-4">
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
                  <a href={`/admin/cards/${card.id}`} className="block px-6 py-4 text-gray-400">
                    {card.artist?.name}
                  </a>
                </td>
                <td>
                  <a href={`/admin/cards/${card.id}`} className="block px-6 py-4">
                    <span
                      className={`rounded px-2 py-1 text-xs ${rarityStyles[card.rarity] || rarityStyles.NORMAL}`}
                    >
                      {card.rarity}
                    </span>
                  </a>
                </td>
                <td>
                  <a href={`/admin/cards/${card.id}`} className="block px-6 py-4 text-white">
                    ¥{card.price.toLocaleString()}
                  </a>
                </td>
                <td>
                  <a
                    href={`/admin/cards/${card.id}`}
                    className="block px-6 py-4 font-mono text-gray-400"
                  >
                    {card.current_supply}
                    {card.total_supply !== null && ` / ${card.total_supply}`}
                  </a>
                </td>
                <td>
                  <a href={`/admin/cards/${card.id}`} className="block px-6 py-4">
                    {card.is_active ? (
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
