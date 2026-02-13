'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { type Rarity } from '@/types/card';
import { getDefaultFrameForRarity, getFrameTemplate } from '@/config/frame-templates';
import { RarityBadge } from './rarity-badge';
import { formatSerialNumber } from '@/lib/utils/format';
import { useCardInteraction } from '@/hooks/use-card-interaction';

interface ArtistCardProps {
  artistName: string;
  artistImageUrl: string;
  songTitle?: string | null;
  rarity: Rarity;
  frameTemplateId?: string;
  serialNumber?: number;
  totalSupply?: number | null;
  owned?: number;
  bonusContentUrl?: string | null;
  className?: string;
  onClick?: () => void;
}

function getRarityDataAttr(rarity: Rarity): string {
  switch (rarity) {
    case 'SUPER_RARE':
      return 'super_rare';
    case 'RARE':
      return 'rare';
    default:
      return 'normal';
  }
}

export function ArtistCard({
  artistName,
  artistImageUrl,
  songTitle,
  rarity,
  frameTemplateId,
  serialNumber,
  totalSupply,
  owned,
  bonusContentUrl,
  className,
  onClick,
}: ArtistCardProps) {
  const frame =
    (frameTemplateId && getFrameTemplate(frameTemplateId)) || getDefaultFrameForRarity(rarity);
  const { style, handlePointerMove, handlePointerLeave } = useCardInteraction();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cn('card interactive', className)}
      data-rarity={getRarityDataAttr(rarity)}
      data-frame={frame.cssClass}
      style={style}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="card__translater">
        <div
          className="card__rotator"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="card__front">
            {/* Main card image */}
            <div className="card__image">
              <Image src={artistImageUrl} alt={artistName} fill className="object-cover" unoptimized />
            </div>

            {/* Info overlay */}
            <div className="card__info">
              <div className="card__info-text">
                <p className="card__label">IDOL</p>
                <p className="card__name">{artistName}</p>
                {songTitle && <p className="card__song">SONG: {songTitle}</p>}
              </div>
              <div className="card__meta">
                <RarityBadge rarity={rarity} size="sm" />
                {serialNumber !== undefined && (
                  <span className="card__serial">
                    {formatSerialNumber(serialNumber, totalSupply)}
                  </span>
                )}
              </div>
              {owned !== undefined && (
                <div className="card__owned">
                  <span>Owned</span>
                  <span className="card__owned-count">{owned}</span>
                </div>
              )}
              {bonusContentUrl && (
                <div className="card__bonus">
                  <div className="card__bonus-dot" />
                  <span>Bonus Content</span>
                </div>
              )}
            </div>

            {/* Effect layers */}
            <div className="card__shine"></div>
            <div className="card__glare"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
