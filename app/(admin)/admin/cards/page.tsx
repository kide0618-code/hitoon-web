import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminCardsPage() {
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: cards } = (await (supabase.from('cards') as any)
    .select(
      `
      *,
      artist:artists (id, name),
      template:card_templates (id, name, artist_image_url)
    `
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
          is_active: boolean;
          created_at: string;
          artist: { id: string; name: string };
          template: { id: string; name: string; artist_image_url: string };
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Card
        </a>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
              <th className="px-6 py-4">Card</th>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Rarity</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Supply</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards?.map((card) => (
              <tr
                key={card.id}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {card.template?.artist_image_url && (
                      <img
                        src={card.template.artist_image_url}
                        alt={card.name}
                        className="w-12 h-16 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{card.name}</p>
                      <p className="text-gray-500 text-xs">
                        {card.template?.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {card.artist?.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${rarityStyles[card.rarity] || rarityStyles.NORMAL}`}
                  >
                    {card.rarity}
                  </span>
                </td>
                <td className="px-6 py-4 text-white">
                  ¥{card.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-400 font-mono">
                  {card.current_supply}
                  {card.total_supply !== null && ` / ${card.total_supply}`}
                </td>
                <td className="px-6 py-4">
                  {card.is_active ? (
                    <span className="text-xs px-2 py-1 bg-green-900/50 text-green-400 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-500 rounded">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/cards/${card.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </a>
                    <span className="text-gray-700">|</span>
                    <a
                      href={`/artists/${card.artist?.id}`}
                      className="text-gray-500 hover:text-gray-300 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </div>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No cards yet. Create templates first, then add cards.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
