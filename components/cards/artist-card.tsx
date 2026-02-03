'use client';

import { cn } from '@/lib/utils/cn';
import { type Rarity, RARITY_CONFIG } from '@/types/card';
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
  const config = RARITY_CONFIG[rarity];

  return (
    <div
      className={cn(
        'aspect-[3/4] rounded-xl overflow-hidden relative cursor-pointer',
        'bg-gradient-to-b from-gray-800 to-gray-900',
        'border-2 transition-transform hover:scale-105',
        config.frameClass,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Main Visual */}
      <div className="relative h-[65%]">
        <img
          src={artistImageUrl}
          alt={artistName}
          className="w-full h-full object-cover"
        />
        {/* Hologram effect for SUPER_RARE */}
        {rarity === 'SUPER_RARE' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)',
              backgroundSize: '200% 200%',
              animation: 'holo-shine 3s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Info Section */}
      <div className="p-3 space-y-1 bg-gray-900/80">
        <p className="text-xs text-gray-400 uppercase tracking-wider truncate">
          IDOL: {artistName}
        </p>
        {songTitle && (
          <p className="text-xs text-gray-500 truncate">SONG: {songTitle}</p>
        )}

        <div className="flex items-center justify-between text-xs pt-2">
          <RarityBadge rarity={rarity} />
          {serialNumber !== undefined && (
            <span className="font-mono text-gray-400">
              {formatSerialNumber(serialNumber, totalSupply)}
            </span>
          )}
        </div>

        {owned !== undefined && (
          <p className="text-xs text-gray-500">Owned: {owned}</p>
        )}
      </div>

      {/* Bonus Content Indicator */}
      {bonusContentUrl && (
        <div className="absolute bottom-2 right-2">
          <span className="text-[10px] text-blue-400 bg-blue-900/50 px-2 py-0.5 rounded">
            BONUS
          </span>
        </div>
      )}
    </div>
  );
}
