import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

/**
 * Layout for legal pages (terms, privacy)
 * No bottom navigation, simple back button
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center p-4">
          <Link
            href={ROUTES.HOME}
            className="p-2 -ml-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 max-w-2xl mx-auto">{children}</main>
    </div>
  );
}
