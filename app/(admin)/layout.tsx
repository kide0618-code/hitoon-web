import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Check if user is an operator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: operator } = (await (supabase.from('operators') as any)
    .select('role')
    .eq('user_id', user.id)
    .single()) as { data: { role: string } | null };

  if (!operator) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold text-white">
              HITOON Admin
            </Link>
            <span className="text-xs px-2 py-1 bg-blue-600 rounded text-white">
              {operator.role}
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/artists"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Artists
            </Link>
            <Link
              href="/admin/templates"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/admin/cards"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cards
            </Link>
            <Link
              href="/admin/purchases"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Purchases
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              ← Back to Site
            </Link>
          </nav>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
