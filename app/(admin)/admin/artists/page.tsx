import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminArtistsTable } from '@/components/features/admin-artists-table';

function getJSTNow() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return { year: jst.getUTCFullYear(), month: jst.getUTCMonth() + 1 };
}

export default async function AdminArtistsPage() {
  const supabase = await createServerSupabaseClient();
  const { year, month } = getJSTNow();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: artists } = (await (supabase.from('artists') as any)
    .select('*')
    .order('display_order', { ascending: true })) as {
    data:
      | {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          member_count: number;
          is_featured: boolean;
          display_order: number;
        }[]
      | null;
  };

  // Fetch current month's payout status for all artists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payouts } = (await (supabase.from('artist_payouts') as any)
    .select('artist_id, payout_status')
    .eq('year', year)
    .eq('month', month)) as {
    data: { artist_id: string; payout_status: string }[] | null;
  };

  const payoutMap = Object.fromEntries((payouts || []).map((p) => [p.artist_id, p.payout_status]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Artists</h1>
        <Link
          href="/admin/artists/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          + Add Artist
        </Link>
      </div>

      <AdminArtistsTable artists={artists || []} payoutMap={payoutMap} year={year} month={month} />
    </div>
  );
}
