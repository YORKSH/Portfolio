#!/usr/bin/env node
/**
 * 새 프로젝트 폴더 만들기
 *
 *   npm run new 2026-river-pavilion
 *
 * src/content/projects/_template 을 복사해 src/content/projects/<이름>/ 을 만듭니다.
 */
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = path.join(root, 'src/content/projects');
const template = path.join(projectsDir, '_template');

const slug = (process.argv[2] ?? '').trim();

if (!slug) {
  console.error('\n  사용법: npm run new <폴더이름>\n  예시:   npm run new 2026-river-pavilion\n');
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`\n  "${slug}"은(는) 쓸 수 없는 이름입니다.\n  영문 소문자, 숫자, 하이픈(-)만 사용하세요. 예: 2026-river-pavilion\n`);
  process.exit(1);
}

const target = path.join(projectsDir, slug);
if (existsSync(target)) {
  console.error(`\n  이미 있는 폴더입니다: src/content/projects/${slug}\n`);
  process.exit(1);
}

cpSync(template, target, { recursive: true });

// 연도를 올해로 바꿔 둡니다.
const year = new Date().getFullYear();
for (const file of ['index.ko.mdx', 'index.en.mdx']) {
  const p = path.join(target, file);
  if (existsSync(p)) {
    writeFileSync(p, readFileSync(p, 'utf8').replace(/^year: \d{4}/m, `year: ${year}`));
  }
}

console.log(`
  ✓ 새 프로젝트 폴더를 만들었습니다: src/content/projects/${slug}/

  다음 단계
  1. index.ko.mdx 의 frontmatter(제목·연도·카테고리·bgColor 등)를 채우세요.
  2. 대표 이미지를 cover.jpg 로 바꾸고, 나머지 이미지도 같은 폴더에 넣으세요.
  3. index.en.mdx 에 영문 제목·요약·본문을 쓰세요. (없어도 됩니다)
  4. npm run dev 로 확인 → 커밋·푸시하면 자동 배포됩니다.

  주소: /ko/projects/${slug}/
`);
