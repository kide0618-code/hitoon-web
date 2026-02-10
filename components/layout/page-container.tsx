import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** Add extra bottom padding for bottom navigation */
  withBottomNav?: boolean;
}

export function PageContainer({ children, className, withBottomNav = true }: PageContainerProps) {
  return (
    <div className={cn('min-h-screen bg-black text-white', withBottomNav && 'pb-24', className)}>
      {children}
    </div>
  );
}
