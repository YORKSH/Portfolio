/**
 * sitemap.xml — 공개 페이지만 포함합니다 (hidden 프로젝트 제외).
 */
import type { APIRoute } from 'astro';
import { languages, langs } from '@/i18n/ui';
import { getVisibleProjects } from '@/lib/projects';
import { localeUrl } from '@/lib/url';

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const projects = await getVisibleProjects('ko');
  const routes = ['', 'about/', 'contact/', ...projects.map((p) => `projects/${p.slug}/`)];

  const urls = routes.flatMap((route) =>
    langs.map((lang) => {
      const alternates = langs
        .map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${languages[l].htmlLang}" href="${abs(localeUrl(l, route))}"/>`,
        )
        .join('\n');
      return `  <url>\n    <loc>${abs(localeUrl(lang, route))}</loc>\n${alternates}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
