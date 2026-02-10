import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminPurchasesPage() {
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: purchases } = (await (supabase.from('purchases') as any)
    .select(
      `
      *,
      card:cards (
        name,
        rarity,
        artist:artists (name)
      )
    `
    )
    .order('purchased_at', { ascending: false })
    .limit(100)) as {
    data:
      | {
          id: string;
          user_id: string | null;
          serial_number: number;
          price_paid: number;
          quantity_in_order: number;
          status: string;
          purchased_at: string;
          stripe_checkout_session_id: string;
          card: {
            name: string;
            rarity: string;
            artist: { name: string };
          };
        }[]
      | null;
  };

  // Calculate stats
  const completedPurchases = purchases?.filter((p) => p.status === 'completed') || [];
  const totalRevenue = completedPurchases.reduce(
    (sum, p) => sum + (p.price_paid || 0),
    0
  );
  const totalCards = completedPurchases.length;

  const rarityStyles: Record<string, string> = {
    NORMAL: 'bg-gray-800 text-gray-400',
    RARE: 'bg-blue-900/50 text-blue-400',
    SUPER_RARE: 'bg-purple-900/50 text-purple-400',
  };

  const statusStyles: Record<string, string> = {
    completed: 'bg-green-900/50 text-green-400',
    pending: 'bg-yellow-900/50 text-yellow-400',
    refunded: 'bg-red-900/50 text-red-400',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Purchases</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-white mt-2">
            ¥{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Cards Sold</p>
          <p className="text-3xl font-bold text-white mt-2">
            {totalCards.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-500 text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold text-white mt-2">
            ¥{totalCards > 0 ? Math.round(totalRevenue / totalCards).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
              <th className="px-6 py-4">Card</th>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Rarity</th>
              <th className="px-6 py-4">Serial</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases?.map((purchase) => (
              <tr
                key={purchase.id}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
              >
                <td className="px-6 py-4 text-white">
                  {purchase.card?.name || 'Deleted Card'}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {purchase.card?.artist?.name || '-'}
                </td>
                <td className="px-6 py-4">
                  {purchase.card?.rarity && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${rarityStyles[purchase.card.rarity] || rarityStyles.NORMAL}`}
                    >
                      {purchase.card.rarity}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 font-mono">
                  #{purchase.serial_number}
                </td>
                <td className="px-6 py-4 text-white">
                  ¥{purchase.price_paid?.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${statusStyles[purchase.status] || statusStyles.pending}`}
                  >
                    {purchase.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(purchase.purchased_at).toLocaleString('ja-JP')}
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No purchases yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
