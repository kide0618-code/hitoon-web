import { cn } from '@/lib/utils/cn';
import { type Rarity, RARITY_CONFIG } from '@/types/card';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md';
  className?: string;
}

export function RarityBadge({ rarity, size = 'md', className }: RarityBadgeProps) {
  const config = RARITY_CONFIG[rarity];

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded font-bold',
        sizeClasses[size],
        config.badgeClass,
        className
      )}
    >
      {config.code}
    </span>
  );
}
