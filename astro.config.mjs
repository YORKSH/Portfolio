// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { mdxRelativeSrc } from './src/lib/mdx-relative-src.mjs';

/**
 * 배포 주소 설정
 * - GitHub Pages 기본 주소: https://<계정>.github.io/<저장소이름>/
 * - 커스텀 도메인을 쓰면 site를 도메인으로 바꾸고 base를 '/'로 바꾸세요.
 */
const SITE = 'https://yorksh.github.io';
const BASE = '/Portfolio';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [mdx()],
  image: {
    // 반응형 이미지 스타일은 직접 작성한 CSS로 관리합니다.
    responsiveStyles: false,
  },
  vite: {
    plugins: [mdxRelativeSrc()],
  },
});
