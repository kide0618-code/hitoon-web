'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { type Rarity } from '@/types/card';
import { getDefaultFrameForRarity } from '@/config/frame-templates';
import { RarityBadge } from './rarity-badge';
import { formatSerialNumber } from '@/lib/utils/format';

interface ArtistCardProps {
  artistName: string;
  artistImageUrl: string;
  songTitle?: string | null;
  rarity: Rarity;
  serialNumber?: number;
  totalSupply?: number | null;
  owned?: number;
  bonusContentUrl?: string | null;
  className?: string;
  onClick?: () => void;
}

export function ArtistCard({
  artistName,
  artistImageUrl,
  songTitle,
  rarity,
  serialNumber,
  totalSupply,
  owned,
  bonusContentUrl,
  className,
  onClick,
}: ArtistCardProps) {
  const frame = getDefaultFrameForRarity(rarity);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cn(
        'trading-card',
        frame.cssClass,
        onClick &&
          'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        className,
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Inner card frame */}
      <div className="trading-card-inner">
        {/* Main Visual */}
        <div className="trading-card-image">
          <Image src={artistImageUrl} alt={artistName} fill className="object-cover" unoptimized />

          {/* Top corner decoration for SR */}
          {rarity === 'SUPER_RARE' && (
            <div className="absolute right-1 top-1 sm:right-2 sm:top-2">
              <div className="relative h-4 w-4 sm:h-6 sm:w-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-yellow-300 to-amber-500" />
                <div className="absolute inset-[2px] flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600">
                  <span className="text-[6px] font-black text-black sm:text-[8px]">★</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay text on image */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-2 sm:p-3">
            <p className="truncate text-2xs font-medium uppercase tracking-widest text-gray-300 sm:text-xs">
              IDOL
            </p>
            <p className="truncate text-xs font-bold leading-tight text-white sm:text-sm">
              {artistName}
            </p>
            {songTitle && (
              <p className="mt-0.5 truncate text-2xs text-gray-400 sm:text-xs">SONG: {songTitle}</p>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="trading-card-info">
          <div className="flex items-center justify-between gap-1">
            <RarityBadge rarity={rarity} size="sm" />
            {serialNumber !== undefined && (
              <span className="font-mono text-2xs tracking-tight text-gray-400 sm:text-xs">
                {formatSerialNumber(serialNumber, totalSupply)}
              </span>
            )}
          </div>

          {owned !== undefined && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-2xs text-gray-500 sm:text-xs">Owned</span>
              <span className="text-2xs font-bold text-white sm:text-xs">{owned}</span>
            </div>
          )}

          {/* Bonus indicator */}
          {bonusContentUrl && (
            <div className="mt-1 border-t border-white/10 pt-1">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 sm:h-2 sm:w-2" />
                <span className="text-2xs font-bold uppercase tracking-wider text-blue-400">
                  Bonus Content
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
