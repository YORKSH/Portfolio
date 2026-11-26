/**
 * MDX 본문에서 컴포넌트에 상대 경로 문자열을 그대로 쓸 수 있게 해 주는 Vite 플러그인.
 *
 *   <Drawing src="./plan-1f.png" />
 *
 * 위 코드를 빌드 직전에 아래처럼 바꿔 줍니다. (Astro가 이미지를 최적화하려면 import가 필요)
 *
 *   import __asset0 from "./plan-1f.png";
 *   <Drawing src={__asset0} />
 *
 * 파일 이름이 틀리면 Vite가 "파일을 찾을 수 없음" 에러를 내므로 오타도 빌드 단계에서 잡힙니다.
 */

import { statSync } from 'node:fs';
import path from 'node:path';

/** 로컬 동영상 권장 최대 용량 (넘으면 빌드 시 경고) */
const VIDEO_WARN_MB = 10;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

/** 경로 문자열을 import로 바꿔 줄 컴포넌트와 속성 */
const COMPONENTS = ['Photo', 'Drawing', 'Diagram', 'Video'];
const ATTRIBUTES = ['src', 'poster'];

// <Photo ...> 태그 하나 (속성값 안의 ">" 나 {중괄호 표현식}도 안전하게 처리)
const TAG_RE = new RegExp(
  `<(?:${COMPONENTS.join('|')})\\b(?:[^>"'{]|"[^"]*"|'[^']*'|\\{[^}]*\\})*>`,
  'g',
);
// src="./file.jpg" 또는 poster='../file.jpg'
const ATTR_RE = new RegExp(`\\b(${ATTRIBUTES.join('|')})=(["'])(\\.{1,2}/[^"']+)\\2`, 'g');
// 파일 맨 앞의 frontmatter 블록
const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/;
// 변환하지 않을 구간: MDX 주석 {/* ... */}, 코드 블록 ```...``` / ~~~...~~~
const SKIP_RE = /(\{\/\*[\s\S]*?\*\/\}|^```[\s\S]*?^```|^~~~[\s\S]*?^~~~)/m;

/** @returns {import('vite').Plugin} */
export function mdxRelativeSrc() {
  return {
    name: 'portfolio:mdx-relative-src',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!file.endsWith('.mdx')) return null;

      /** @type {Map<string, string>} */
      const imports = new Map();
      const rewrite = (text) =>
        text.replace(TAG_RE, (tag) =>
          tag.replace(ATTR_RE, (_match, attr, _quote, path) => {
            let name = imports.get(path);
            if (!name) {
              name = `__asset${imports.size}`;
              imports.set(path, name);
            }
            return `${attr}={${name}}`;
          }),
        );
      // split에 캡처 그룹을 쓰면 홀수 번째 조각이 건너뛸 구간(주석·코드)입니다.
      const body = code
        .split(new RegExp(SKIP_RE.source, 'gm'))
        .map((part, i) => (i % 2 === 1 ? part : rewrite(part)))
        .join('');
      if (imports.size === 0) return null;

      for (const rel of imports.keys()) {
        if (!VIDEO_EXT.test(rel)) continue;
        try {
          const mb = statSync(path.resolve(path.dirname(file), rel)).size / 1024 / 1024;
          if (mb > VIDEO_WARN_MB) {
            this.warn(
              `${path.basename(path.dirname(file))}/${rel.replace(/^\.\//, '')} 용량이 ${mb.toFixed(1)}MB입니다. ` +
                `${VIDEO_WARN_MB}MB 이하로 줄이거나 YouTube/Vimeo 임베드를 사용하세요.`,
            );
          }
        } catch {
          /* 파일이 없으면 Vite가 import 단계에서 에러를 냅니다 */
        }
      }

      const importBlock = [...imports]
        .map(([path, name]) => `import ${name} from ${JSON.stringify(path)};`)
        .join('\n');

      const fm = body.match(FRONTMATTER_RE);
      const head = fm ? fm[0] : '';
      const rest = fm ? body.slice(head.length) : body;
      return { code: `${head}\n${importBlock}\n\n${rest}`, map: null };
    },
  };
}
