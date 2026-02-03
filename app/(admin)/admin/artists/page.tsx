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
        <a
          href="/admin/artists/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Add Artist
        </a>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
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
                      <img
                        src={artist.image_url}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{artist.name}</p>
                      <p className="text-gray-500 text-sm truncate max-w-[200px]">
                        {artist.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {artist.member_count.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {artist.is_featured ? (
                    <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded">
                      Featured
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-800 text-gray-500 rounded">
                      -
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 font-mono">
                  {artist.display_order}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(artist.created_at).toLocaleDateString('ja-JP')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/artists/${artist.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </a>
                    <span className="text-gray-700">|</span>
                    <a
                      href={`/artists/${artist.id}`}
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
