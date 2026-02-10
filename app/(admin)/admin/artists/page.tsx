import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminArtistsPage() {
  const supabase = await createServerSupabaseClient();

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
          created_at: string;
        }[]
      | null;
  };

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

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-sm text-gray-500">
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Members</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists?.map((artist) => (
              <tr
                key={artist.id}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50"
              >
                <td className="px-6 py-4">
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
                      <p className="font-medium text-white">{artist.name}</p>
                      <p className="max-w-[200px] truncate text-sm text-gray-500">
                        {artist.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{artist.member_count.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {artist.is_featured ? (
                    <span className="rounded bg-yellow-900/50 px-2 py-1 text-xs text-yellow-400">
                      Featured
                    </span>
                  ) : (
                    <span className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-gray-400">{artist.display_order}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(artist.created_at).toLocaleDateString('ja-JP')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/artists/${artist.id}`}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-700">|</span>
                    <a
                      href={`/artists/${artist.id}`}
                      className="text-sm text-gray-500 hover:text-gray-300"
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
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No artists yet. Create your first artist.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
