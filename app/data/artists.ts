export interface Artist {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  members: number;
  // ▼ 追加：限定コンテンツ用
  exclusiveContent?: {
    type: 'video' | 'music' | 'image';
    url: string;
    title: string;
  };
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Sample Artist A',
    description: 'エモーショナルなロックを奏でる4人組バンド。',
    price: 3000,
    image: 'https://placehold.co/600x600/1e293b/60a5fa?text=Artist+A',
    members: 120,
    exclusiveContent: {
      type: 'music',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // デモ音源
      title: 'Unreleased Demo (2025)'
    }
  },
  {
    id: '2',
    name: 'The HITOON Band',
    description: '次世代のデジタル音楽集団。',
    price: 5000,
    image: 'https://placehold.co/600x600/331133/e879f9?text=The+HITOON',
    members: 45,
    exclusiveContent: {
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4', // デモ動画
      title: 'Studio Session Movie'
    }
  },
  {
    id: '3',
    name: 'Official VIP Club',
    description: 'HITOON運営公式の特別会員権。',
    price: 10000,
    image: 'https://placehold.co/600x600/000000/fbbf24?text=VIP+CLUB',
    members: 12
  }
];
