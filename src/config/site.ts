/**
 * 사이트 기본 정보와 연락처를 관리하는 파일입니다.
 * 이름, 이메일, SNS 링크를 여기서만 바꾸면 헤더·푸터·Contact 페이지에 모두 반영됩니다.
 */
import type { Lang } from '@/i18n/ui';

export const site = {
  /** 헤더 왼쪽에 표시되는 이름 */
  name: {
    ko: '홍길동',
    en: 'Gildong Hong',
  } satisfies Record<Lang, string>,

  /** 검색 결과·공유 미리보기에 쓰이는 사이트 설명 */
  description: {
    ko: '건축 프로젝트 아카이브',
    en: 'Architecture project archive',
  } satisfies Record<Lang, string>,

  /** Contact 페이지에 표시되는 짧은 문장 (빈 문자열이면 표시 안 함) */
  contactNote: {
    ko: '프로젝트, 협업, 포트폴리오 관련 문의는 이메일로 연락 주세요.',
    en: 'For projects, collaborations or portfolio inquiries, please get in touch by email.',
  } satisfies Record<Lang, string>,

  email: 'hello@example.com',

  /**
   * SNS 링크. 필요 없는 항목은 지우고, 원하는 항목은 같은 형식으로 추가하세요.
   * handle은 화면에 표시되는 계정명입니다 (선택).
   */
  socials: [
    { label: 'Instagram', url: 'https://instagram.com/your-id', handle: '@your-id' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-id', handle: 'your-id' },
    { label: 'Behance', url: 'https://www.behance.net/your-id', handle: 'your-id' },
  ] as { label: string; url: string; handle?: string }[],
};
