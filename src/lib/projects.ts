import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, projectTypes, type Category } from '@/config/taxonomy';
import type { Lang } from '@/i18n/ui';

export type KoEntry = CollectionEntry<'projects'>;
export type EnEntry = CollectionEntry<'projectsEn'>;

/** 한 언어 기준으로 합쳐진 프로젝트 정보 */
export interface Project {
  slug: string;
  lang: Lang;
  /** 이 언어로 번역된 본문이 있는지 (ko는 항상 true) */
  translated: boolean;
  /** 렌더링할 본문 (영문 번역이 없으면 한국어 본문) */
  body: KoEntry | EnEntry;
  title: string;
  summary: string;
  location: string;
  coverAlt: string;
  data: KoEntry['data'];
}

/** 정렬: 연도 내림차순 → 같은 연도에서는 order 오름차순 → 제목 */
export function compareProjects(a: Project, b: Project): number {
  if (a.data.year !== b.data.year) return b.data.year - a.data.year;
  const ao = a.data.order ?? Number.POSITIVE_INFINITY;
  const bo = b.data.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  return a.title.localeCompare(b.title, a.lang);
}

let warnedOrphans = false;

/** hidden 포함 전체 프로젝트 (정렬됨) */
export async function getAllProjects(lang: Lang): Promise<Project[]> {
  const [ko, en] = await Promise.all([getCollection('projects'), getCollection('projectsEn')]);
  const enById = new Map(en.map((e) => [e.id, e]));

  if (!warnedOrphans) {
    warnedOrphans = true;
    const koIds = new Set(ko.map((k) => k.id));
    for (const e of en) {
      if (!koIds.has(e.id)) {
        console.warn(`[projects] "${e.id}/index.en" 파일에 짝이 되는 index.ko 파일이 없어 무시됩니다.`);
      }
    }
  }

  return ko
    .map((entry): Project => {
      const tr = lang === 'en' ? enById.get(entry.id) : undefined;
      const title = tr?.data.title ?? entry.data.title;
      return {
        slug: entry.id,
        lang,
        translated: lang === 'ko' || Boolean(tr),
        body: tr ?? entry,
        title,
        summary: tr?.data.summary ?? entry.data.summary,
        location: tr?.data.location ?? entry.data.location,
        coverAlt: tr?.data.coverAlt ?? (tr ? title : entry.data.coverAlt) ?? title,
        data: entry.data,
      };
    })
    .sort(compareProjects);
}

/** 목록에 보이는 프로젝트 (hidden 제외) */
export async function getVisibleProjects(lang: Lang): Promise<Project[]> {
  return (await getAllProjects(lang)).filter((p) => !p.data.hidden);
}

export function categoryLabel(key: Category, lang: Lang): string {
  return categories[key]?.[lang] ?? key;
}

export function typeLabel(key: KoEntry['data']['type'], lang: Lang): string {
  return projectTypes[key]?.[lang] ?? key;
}

/** 사용 중인 카테고리 (taxonomy.ts 순서) 와 개수 */
export function usedCategories(projects: Project[]): { key: Category; count: number }[] {
  const counts = new Map<Category, number>();
  for (const p of projects) for (const c of p.data.category) counts.set(c, (counts.get(c) ?? 0) + 1);
  return (Object.keys(categories) as Category[])
    .filter((key) => counts.has(key))
    .map((key) => ({ key, count: counts.get(key)! }));
}
