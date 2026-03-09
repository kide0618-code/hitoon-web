import { APP_CONFIG } from '@/constants/config';

/**
 * JSON-LD structured data components for SEO and LLMO
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization schema - site-wide
 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: APP_CONFIG.name,
        url: APP_CONFIG.url,
        logo: `${APP_CONFIG.url}/img/logo.png`,
        description:
          'HITOONは、アーティストのデジタルトレーディングカードを購入・コレクションできるプラットフォームです。限定コンテンツや特別なカードを通じて、音楽を一生モノにする体験を提供します。',
        sameAs: [],
      }}
    />
  );
}

/**
 * WebSite schema with search action - for sitelinks search box
 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: APP_CONFIG.name,
        url: APP_CONFIG.url,
        description: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
        inLanguage: 'ja',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${APP_CONFIG.url}/market?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

/**
 * Product schema for individual cards
 */
interface ProductJsonLdProps {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  currency?: string;
  availability: 'InStock' | 'SoldOut' | 'LimitedAvailability';
  artistName: string;
  rarity: string;
  url: string;
}

export function ProductJsonLd({
  name,
  description,
  imageUrl,
  price,
  currency = 'JPY',
  availability,
  artistName,
  rarity,
  url,
}: ProductJsonLdProps) {
  const availabilityMap = {
    InStock: 'https://schema.org/InStock',
    SoldOut: 'https://schema.org/SoldOut',
    LimitedAvailability: 'https://schema.org/LimitedAvailability',
  };

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image: imageUrl,
        brand: {
          '@type': 'Brand',
          name: artistName,
        },
        category: 'デジタルトレーディングカード',
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'レアリティ',
            value: rarity,
          },
        ],
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency: currency,
          availability: availabilityMap[availability],
          url,
          seller: {
            '@type': 'Organization',
            name: APP_CONFIG.name,
          },
        },
      }}
    />
  );
}

/**
 * ItemList schema for artist listing pages
 */
interface ArtistListItem {
  id: string;
  name: string;
  imageUrl: string | null;
  position: number;
}

export function ArtistListJsonLd({ artists }: { artists: ArtistListItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'アーティスト一覧',
        description:
          'HITOONで購入できるアーティストのデジタルトレーディングカード一覧',
        numberOfItems: artists.length,
        itemListElement: artists.map((artist) => ({
          '@type': 'ListItem',
          position: artist.position,
          item: {
            '@type': 'MusicGroup',
            name: artist.name,
            url: `${APP_CONFIG.url}/artists/${artist.id}`,
            ...(artist.imageUrl && { image: artist.imageUrl }),
          },
        })),
      }}
    />
  );
}

/**
 * BreadcrumbList schema
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/**
 * FAQPage schema - for LLMO optimization
 */
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  );
}

/**
 * MusicGroup schema for artist detail pages
 */
interface MusicGroupJsonLdProps {
  name: string;
  description: string;
  imageUrl: string | null;
  url: string;
  memberCount: number;
}

export function MusicGroupJsonLd({
  name,
  description,
  imageUrl,
  url,
  memberCount,
}: MusicGroupJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        name,
        description,
        url,
        ...(imageUrl && { image: imageUrl }),
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/FollowAction',
          userInteractionCount: memberCount,
        },
      }}
    />
  );
}
