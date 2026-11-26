/**
 * 프로젝트 카테고리와 유형 목록입니다.
 *
 * - 왼쪽 키(예: residential)는 frontmatter에 적는 값이자 URL 필터 값입니다. 영문 소문자·하이픈만 쓰세요.
 * - 새 카테고리가 필요하면 한 줄 추가하면 됩니다.
 * - 여기에 없는 값을 frontmatter에 쓰면 빌드할 때 에러로 알려줍니다 (오타 방지).
 * - 목록 페이지 필터에는 실제로 사용 중인 카테고리만 표시되며, 순서는 아래 순서를 따릅니다.
 */

export const categories = {
  residential: { ko: '주거', en: 'Residential' },
  cultural: { ko: '문화', en: 'Cultural' },
  public: { ko: '공공', en: 'Public' },
  commercial: { ko: '상업', en: 'Commercial' },
  urban: { ko: '도시', en: 'Urban' },
  interior: { ko: '인테리어', en: 'Interior' },
  landscape: { ko: '조경', en: 'Landscape' },
  exhibition: { ko: '전시', en: 'Exhibition' },
} as const;

export const projectTypes = {
  school: { ko: '학교 과제', en: 'Academic' },
  competition: { ko: '공모전', en: 'Competition' },
  personal: { ko: '개인 작업', en: 'Personal' },
  professional: { ko: '실무', en: 'Professional' },
} as const;

export type Category = keyof typeof categories;
export type ProjectType = keyof typeof projectTypes;

export const categoryKeys = Object.keys(categories) as [Category, ...Category[]];
export const projectTypeKeys = Object.keys(projectTypes) as [ProjectType, ...ProjectType[]];
