'use client';

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

  return (
    <div
      className={cn(
        'trading-card',
        frame.cssClass,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Inner card frame */}
      <div className="trading-card-inner">
        {/* Main Visual */}
        <div className="trading-card-image">
          <img
            src={artistImageUrl}
            alt={artistName}
            className="w-full h-full object-cover"
          />

          {/* Top corner decoration for SR */}
          {rarity === 'SUPER_RARE' && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
              <div className="w-4 h-4 sm:w-6 sm:h-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full animate-pulse" />
                <div className="absolute inset-[2px] bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-[6px] sm:text-[8px] font-black text-black">★</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay text on image */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10">
            <p className="text-[8px] sm:text-[10px] text-gray-300 uppercase tracking-widest font-medium truncate">
              IDOL
            </p>
            <p className="text-[10px] sm:text-sm font-bold text-white truncate leading-tight">
              {artistName}
            </p>
            {songTitle && (
              <p className="text-[8px] sm:text-[10px] text-gray-400 truncate mt-0.5">
                SONG: {songTitle}
              </p>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="trading-card-info">
          <div className="flex items-center justify-between gap-1">
            <RarityBadge rarity={rarity} size="sm" />
            {serialNumber !== undefined && (
              <span className="font-mono text-[8px] sm:text-[10px] text-gray-400 tracking-tight">
                {formatSerialNumber(serialNumber, totalSupply)}
              </span>
            )}
          </div>

          {owned !== undefined && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-[8px] sm:text-[10px] text-gray-500">Owned</span>
              <span className="text-[8px] sm:text-[10px] text-white font-bold">{owned}</span>
            </div>
          )}

          {/* Bonus indicator */}
          {bonusContentUrl && (
            <div className="mt-1 pt-1 border-t border-white/10">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[7px] sm:text-[9px] text-blue-400 font-bold uppercase tracking-wider">
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
