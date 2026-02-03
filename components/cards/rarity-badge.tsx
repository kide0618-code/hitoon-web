import { cn } from '@/lib/utils/cn';
import { type Rarity } from '@/types/card';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md';
  className?: string;
}

const RARITY_DISPLAY = {
  NORMAL: { code: 'N', badgeClass: 'rarity-badge-n' },
  RARE: { code: 'R', badgeClass: 'rarity-badge-r' },
  SUPER_RARE: { code: 'SR', badgeClass: 'rarity-badge-sr' },
} as const;

export function RarityBadge({ rarity, size = 'md', className }: RarityBadgeProps) {
  const config = RARITY_DISPLAY[rarity];

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[8px] sm:text-[10px] min-w-[18px] sm:min-w-[22px]',
    md: 'px-2.5 py-1 text-xs min-w-[28px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded font-bold tracking-wide',
        sizeClasses[size],
        config.badgeClass,
        className
      )}
    >
      {config.code}
    </span>
  );
}
