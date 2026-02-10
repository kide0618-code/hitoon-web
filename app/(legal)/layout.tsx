import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

/**
 * Layout for legal pages (terms, privacy)
 * No bottom navigation, simple back button
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-black/90 backdrop-blur-md">
        <div className="flex items-center p-4">
          <Link
            href={ROUTES.HOME}
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl p-6">{children}</main>
    </div>
  );
}
