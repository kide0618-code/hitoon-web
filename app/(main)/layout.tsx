import { BottomNav } from '@/components/layout/bottom-nav';

/**
 * Layout for main app pages with bottom navigation
 * Applies to: /, /market, /collection, /artists/*
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-20">{children}</main>
      <BottomNav />
    </>
  );
}
