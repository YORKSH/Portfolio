import type { Lang } from '@/i18n/ui';

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** base 경로(/Portfolio)를 붙인 사이트 내부 주소. 페이지 경로는 항상 /로 끝납니다. */
export function withBase(path = '/'): string {
  const clean = path.replace(/^\/+/, '');
  const isFile = /\.[a-z0-9]+$/i.test(clean.split(/[?#]/)[0]);
  const withSlash = clean === '' || isFile || clean.endsWith('/') ? clean : `${clean}/`;
  return `${BASE}/${withSlash}`;
}

/**
 * 언어별 페이지 주소.
 * route는 언어를 뺀 경로입니다. 예: '' (홈), 'about/', 'projects/my-project/'
 */
export function localeUrl(lang: Lang, route = ''): string {
  return withBase(`${lang}/${route}`);
}

/** 절대 주소 (OG 태그, sitemap 용) */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return site ? new URL(path, site).href : path;
}
