import { defaultLang, langs, ui, type Lang, type UiKey } from './ui';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (langs as string[]).includes(value);
}

/** 번역 함수: const t = useTranslations(lang); t('nav.about') */
export function useTranslations(lang: Lang) {
  return (key: UiKey) => ui[lang][key] ?? ui[defaultLang][key];
}

/** 언어별 페이지 경로 목록 (getStaticPaths 용) */
export function langPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}
