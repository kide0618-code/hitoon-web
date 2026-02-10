import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Layout for auth pages (login, signup)
 * Minimal layout without bottom nav
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/90 backdrop-blur-md">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>戻る</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
