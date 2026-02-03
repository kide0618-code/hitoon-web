import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ children, columns = 2, className }: CardGridProps) {
  // Responsive grid: smaller gap on mobile, appropriate columns
  const gridCols = {
    2: 'grid-cols-2 gap-3 sm:gap-4',
    3: 'grid-cols-3 gap-2 sm:gap-4',
    4: 'grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid', gridCols[columns], className)}>
      {children}
    </div>
  );
}
