import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/constants/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/collection/', '/activity', '/settings', '/cart'],
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
  };
}
