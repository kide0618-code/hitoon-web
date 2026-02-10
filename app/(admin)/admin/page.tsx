import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  // Fetch stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [artistsResult, cardsResult, purchasesResult, revenueResult] = await Promise.all([
    (supabase.from('artists') as any).select('*', {
      count: 'exact',
      head: true,
    }),
    (supabase.from('cards') as any).select('*', {
      count: 'exact',
      head: true,
    }),
    (supabase.from('purchases') as any)
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),
    (supabase.from('purchases') as any).select('price_paid').eq('status', 'completed'),
  ]);

  const totalRevenue =
    revenueResult.data?.reduce(
      (sum: number, p: { price_paid: number }) => sum + (p.price_paid || 0),
      0,
    ) || 0;

  const stats = [
    {
      label: 'Total Artists',
      value: artistsResult.count || 0,
      href: '/admin/artists',
    },
    {
      label: 'Total Cards',
      value: cardsResult.count || 0,
      href: '/admin/cards',
    },
    {
      label: 'Total Purchases',
      value: purchasesResult.count || 0,
      href: '/admin/purchases',
    },
    {
      label: 'Total Revenue',
      value: `¥${totalRevenue.toLocaleString()}`,
      href: '/admin/purchases',
    },
  ];

  // Recent purchases
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentPurchases } = (await (supabase.from('purchases') as any)
    .select(
      `
      *,
      card:cards (
        name,
        rarity,
        artist:artists (name)
      )
    `,
    )
    .eq('status', 'completed')
    .order('purchased_at', { ascending: false })
    .limit(10)) as {
    data:
      | {
          id: string;
          serial_number: number;
          price_paid: number;
          purchased_at: string;
          card: {
            name: string;
            rarity: string;
            artist: { name: string };
          };
        }[]
      | null;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-700"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
          </a>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Recent Purchases</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
                <th className="pb-3">Card</th>
                <th className="pb-3">Artist</th>
                <th className="pb-3">Rarity</th>
                <th className="pb-3">Serial</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPurchases?.map((purchase) => (
                <tr key={purchase.id} className="border-b border-gray-800 last:border-0">
                  <td className="py-3 text-white">{purchase.card?.name}</td>
                  <td className="py-3 text-gray-400">{purchase.card?.artist?.name}</td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        purchase.card?.rarity === 'SUPER_RARE'
                          ? 'bg-purple-900/50 text-purple-400'
                          : purchase.card?.rarity === 'RARE'
                            ? 'bg-blue-900/50 text-blue-400'
                            : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {purchase.card?.rarity}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-gray-400">#{purchase.serial_number}</td>
                  <td className="py-3 text-white">¥{purchase.price_paid?.toLocaleString()}</td>
                  <td className="py-3 text-gray-500">
                    {new Date(purchase.purchased_at).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No purchases yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
