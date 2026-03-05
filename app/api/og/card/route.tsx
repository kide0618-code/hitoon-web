import { ImageResponse } from 'next/og';
import { createAdminClient } from '@/lib/supabase/server';
import type { Rarity } from '@/types/card';

const RARITY_STYLES: Record<
  Rarity,
  {
    code: string;
    label: string;
    borderColor: string;
    glowColor: string;
    badgeBg: string;
    badgeColor: string;
    frameBg: string;
    innerBg: string;
  }
> = {
  NORMAL: {
    code: 'N',
    label: 'Normal',
    borderColor: '#6b7280',
    glowColor: 'rgba(156, 163, 175, 0.2)',
    badgeBg: 'linear-gradient(135deg, #6b7280, #4b5563)',
    badgeColor: '#ffffff',
    frameBg: 'linear-gradient(160deg, #9ca3af 0%, #6b7280 50%, #9ca3af 100%)',
    innerBg: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
  },
  RARE: {
    code: 'R',
    label: 'Rare',
    borderColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    badgeBg: 'linear-gradient(135deg, #818cf8, #60a5fa, #6366f1)',
    badgeColor: '#ffffff',
    frameBg: 'linear-gradient(135deg, #60a5fa, #818cf8, #3b82f6, #a78bfa, #6366f1)',
    innerBg: 'linear-gradient(180deg, #1e293b 0%, #1e1b4b 50%, #172554 100%)',
  },
  SUPER_RARE: {
    code: 'SR',
    label: 'Super Rare',
    borderColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    badgeBg: 'linear-gradient(135deg, #fde68a, #fbbf24, #f59e0b)',
    badgeColor: '#1a1a1a',
    frameBg: 'linear-gradient(135deg, #fbbf24, #f472b6, #a78bfa, #60a5fa, #34d399, #fbbf24)',
    innerBg:
      'linear-gradient(180deg, #1a0a2e 0%, #2d1045 25%, #1a1040 50%, #0f1a3a 75%, #0a0f2e 100%)',
  },
};

interface CardOgData {
  id: string;
  name: string;
  card_image_url: string;
  song_title: string | null;
  rarity: string;
  artist_name: string;
}

async function getCardData(cardId: string): Promise<CardOgData | null> {
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: card, error } = await (supabase.from('cards') as any)
    .select('id, name, card_image_url, song_title, rarity, artist_id')
    .eq('id', cardId)
    .single();

  if (error || !card) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: artist } = await (supabase.from('artists') as any)
    .select('name')
    .eq('id', card.artist_id)
    .single();

  return {
    id: card.id,
    name: card.name,
    card_image_url: card.card_image_url,
    song_title: card.song_title,
    rarity: card.rarity,
    artist_name: artist?.name ?? '',
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('id');

  if (!cardId) {
    return new Response('カードIDが指定されていません。', { status: 400 });
  }

  const card = await getCardData(cardId);

  if (!card) {
    return new Response('カードが見つかりませんでした。', { status: 404 });
  }

  const rarity = card.rarity as Rarity;
  const style = RARITY_STYLES[rarity];

  // Card dimensions within the 1200x630 OG image
  const cardHeight = 560;
  const cardWidth = cardHeight * (3 / 4); // 420
  const borderWidth = rarity === 'SUPER_RARE' ? 6 : rarity === 'RARE' ? 5 : 4;
  const innerInset = rarity === 'SUPER_RARE' ? 10 : rarity === 'RARE' ? 8 : 6;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #000000 100%)',
        position: 'relative',
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: style.glowColor,
          filter: 'blur(100px)',
          opacity: 0.5,
        }}
      />

      {/* Card + Info layout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
        }}
      >
        {/* Trading Card */}
        <div
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            borderRadius: '16px',
            border: `${borderWidth}px solid ${style.borderColor}`,
            background: style.frameBg,
            boxShadow: `0 0 40px ${style.glowColor}, 0 0 80px ${style.glowColor}`,
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner card */}
          <div
            style={{
              position: 'absolute',
              top: `${innerInset}px`,
              left: `${innerInset}px`,
              right: `${innerInset}px`,
              bottom: `${innerInset}px`,
              borderRadius: '8px',
              background: style.innerBg,
              border: `1px solid ${style.borderColor}40`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Card Image */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.card_image_url}
                alt=""
                width={cardWidth - innerInset * 2}
                height={cardHeight * 0.75}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Gradient overlay on image */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                  }}
                >
                  IDOL
                </span>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.2,
                  }}
                >
                  {card.artist_name}
                </span>
                {card.song_title && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '2px',
                    }}
                  >
                    SONG: {card.song_title}
                  </span>
                )}
              </div>
            </div>

            {/* Info section */}
            <div
              style={{
                padding: '10px 12px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Rarity badge */}
              <span
                style={{
                  background: style.badgeBg,
                  color: style.badgeColor,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                }}
              >
                {style.code}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                }}
              >
                {style.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Text info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '480px',
          }}
        >
          {/* Card name */}
          <span
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            {card.name}
          </span>

          {/* Artist name */}
          <span
            style={{
              fontSize: '20px',
              color: '#9ca3af',
            }}
          >
            {card.artist_name}
          </span>

          {card.song_title && (
            <span
              style={{
                fontSize: '16px',
                color: '#6b7280',
              }}
            >
              {card.song_title}
            </span>
          )}

          {/* Divider */}
          <div
            style={{
              width: '60px',
              height: '2px',
              background: style.borderColor,
              marginTop: '8px',
              marginBottom: '8px',
            }}
          />

          {/* HITOON branding */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.1em',
              }}
            >
              HITOON
            </span>
            <span
              style={{
                fontSize: '13px',
                color: '#6b7280',
              }}
            >
              音楽を、一生モノにする。
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
