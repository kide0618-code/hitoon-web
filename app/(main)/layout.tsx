import { BottomNav } from '@/components/layout/bottom-nav';
import { ProfileButton } from '@/components/layout/profile-button';

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
      <ProfileButton />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </>
  );
}
