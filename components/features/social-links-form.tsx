'use client';

import type { SocialLink, SocialPlatform } from '@/types/artist';

/** Single-entry platforms (1 per artist). Website is handled separately as multi-entry. */
const SOCIAL_PLATFORMS: { platform: SocialPlatform; label: string; placeholder: string }[] = [
  { platform: 'spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' },
  { platform: 'apple_music', label: 'Apple Music', placeholder: 'https://music.apple.com/...' },
  { platform: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@...' },
  { platform: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
  { platform: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/...' },
  { platform: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@...' },
  { platform: 'line', label: 'LINE', placeholder: 'https://line.me/...' },
];

export interface SocialLinksFormData {
  socialLinks: Record<string, string>;
  websiteUrls: string[];
}

export function createEmptySocialLinksData(): SocialLinksFormData {
  return {
    socialLinks: Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.platform, ''])),
    websiteUrls: [''],
  };
}

export function parseSocialLinksFromApi(links: SocialLink[]): SocialLinksFormData {
  const data = createEmptySocialLinksData();
  const websites: string[] = [];
  for (const link of links) {
    if (link.platform === 'website') {
      websites.push(link.url);
    } else {
      data.socialLinks[link.platform] = link.url;
    }
  }
  data.websiteUrls = websites.length > 0 ? websites : [''];
  return data;
}

export function buildSocialLinksPayload(data: SocialLinksFormData): SocialLink[] {
  return [
    ...Object.entries(data.socialLinks)
      .filter(([, url]) => url.trim() !== '')
      .map(([platform, url]) => ({ platform: platform as SocialPlatform, url: url.trim() })),
    ...data.websiteUrls
      .filter((url) => url.trim() !== '')
      .map((url) => ({ platform: 'website' as SocialPlatform, url: url.trim() })),
  ];
}

interface SocialLinksFormSectionProps {
  value: SocialLinksFormData;
  onChange: (value: SocialLinksFormData) => void;
}

export function SocialLinksFormSection({ value, onChange }: SocialLinksFormSectionProps) {
  const { socialLinks, websiteUrls } = value;

  const updateSocialLink = (platform: string, url: string) => {
    onChange({ ...value, socialLinks: { ...socialLinks, [platform]: url } });
  };

  const updateWebsiteUrl = (index: number, url: string) => {
    const updated = [...websiteUrls];
    updated[index] = url;
    onChange({ ...value, websiteUrls: updated });
  };

  const addWebsiteUrl = () => {
    onChange({ ...value, websiteUrls: [...websiteUrls, ''] });
  };

  const removeWebsiteUrl = (index: number) => {
    onChange({ ...value, websiteUrls: websiteUrls.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="text-sm font-medium text-gray-300">Social Links</h3>
      {SOCIAL_PLATFORMS.map((p) => (
        <div key={p.platform}>
          <label className="mb-1 block text-xs text-gray-500">{p.label}</label>
          <input
            type="url"
            value={socialLinks[p.platform] || ''}
            onChange={(e) => updateSocialLink(p.platform, e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            placeholder={p.placeholder}
          />
        </div>
      ))}

      {/* Website (multiple) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs text-gray-500">Website</label>
          <button
            type="button"
            onClick={addWebsiteUrl}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            + 追加
          </button>
        </div>
        <div className="space-y-2">
          {websiteUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateWebsiteUrl(index, e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="https://..."
              />
              {websiteUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWebsiteUrl(index)}
                  className="shrink-0 text-gray-500 hover:text-red-400"
                  title="削除"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
