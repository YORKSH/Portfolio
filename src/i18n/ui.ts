/**
 * 화면에 표시되는 UI 문구 번역 파일입니다.
 * 한국어(ko)에 키를 추가하면 영어(en)에도 같은 키가 있어야 합니다. 빠지면 타입 검사에서 에러가 납니다.
 */

export const languages = {
  ko: { label: '한국어', short: 'KO', htmlLang: 'ko', ogLocale: 'ko_KR' },
  en: { label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_US' },
} as const;

export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'ko';

const ko = {
  'nav.projects': '프로젝트',
  'nav.about': '소개',
  'nav.contact': '연락처',
  'nav.skip': '본문으로 건너뛰기',
  'lang.switch': 'Switch to English',

  'list.title': '프로젝트',
  'list.all': '전체',
  'list.filterLabel': '카테고리 필터',
  'list.sortLabel': '정렬',
  'list.sortDesc': '최신순',
  'list.sortAsc': '오래된순',
  'list.empty': '해당하는 프로젝트가 없습니다.',
  'list.count': '개 프로젝트',

  'project.year': '연도',
  'project.location': '위치',
  'project.category': '카테고리',
  'project.type': '유형',
  'project.prev': '이전 프로젝트',
  'project.next': '다음 프로젝트',
  'project.backToList': '목록으로',
  'project.untranslated': '이 프로젝트는 아직 영어로 번역되지 않아 한국어 원문을 표시합니다.',

  'media.zoomHint': '클릭하여 확대',
  'media.zoomHintTouch': '탭하여 확대',
  'media.close': '닫기',
  'media.prev': '이전',
  'media.next': '다음',
  'media.zoom': '확대/축소',
  'media.play': '동영상 재생',

  'about.title': '소개',
  'about.skills': '기술',

  'contact.title': '연락처',
  'contact.email': '이메일',
  'contact.copy': '복사',
  'contact.copied': '복사됨',
  'contact.social': 'SNS',

  'notFound.title': '페이지를 찾을 수 없습니다',
  'notFound.body': '주소가 바뀌었거나 삭제된 페이지일 수 있습니다.',
  'notFound.home': '프로젝트 목록으로',

  'footer.rights': 'All rights reserved.',
} as const;

export type UiKey = keyof typeof ko;

const en: Record<UiKey, string> = {
  'nav.projects': 'Projects',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.skip': 'Skip to content',
  'lang.switch': '한국어로 보기',

  'list.title': 'Projects',
  'list.all': 'All',
  'list.filterLabel': 'Filter by category',
  'list.sortLabel': 'Sort',
  'list.sortDesc': 'Newest',
  'list.sortAsc': 'Oldest',
  'list.empty': 'No matching projects.',
  'list.count': ' projects',

  'project.year': 'Year',
  'project.location': 'Location',
  'project.category': 'Category',
  'project.type': 'Type',
  'project.prev': 'Previous project',
  'project.next': 'Next project',
  'project.backToList': 'All projects',
  'project.untranslated': 'This project has not been translated yet. Showing the original Korean text.',

  'media.zoomHint': 'Click to zoom',
  'media.zoomHintTouch': 'Tap to zoom',
  'media.close': 'Close',
  'media.prev': 'Previous',
  'media.next': 'Next',
  'media.zoom': 'Zoom',
  'media.play': 'Play video',

  'about.title': 'About',
  'about.skills': 'Skills',

  'contact.title': 'Contact',
  'contact.email': 'Email',
  'contact.copy': 'Copy',
  'contact.copied': 'Copied',
  'contact.social': 'Social',

  'notFound.title': 'Page not found',
  'notFound.body': 'The page may have moved or no longer exists.',
  'notFound.home': 'Back to projects',

  'footer.rights': 'All rights reserved.',
};

export const ui: Record<Lang, Record<UiKey, string>> = { ko, en };
