/**
 * 콘텐츠 스키마 (frontmatter 검증 규칙)
 *
 * src/content/projects/<slug>/index.ko.mdx  → projects   (모든 메타데이터의 기준)
 * src/content/projects/<slug>/index.en.mdx  → projectsEn (번역할 항목만)
 * src/content/about/ko.md, en.md            → about
 *
 * 밑줄(_)로 시작하는 폴더(예: _template)는 빌드에서 제외됩니다.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryKeys, projectTypeKeys } from './config/taxonomy';

/** 'my-project/index.ko.mdx' → 'my-project' (폴더 이름이 곧 URL) */
const folderId = ({ entry }: { entry: string }) => entry.split('/')[0];

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: ['*/index.ko.{md,mdx}', '!_*/**'],
    generateId: (opts) => {
      const id = folderId(opts);
      if (!SLUG.test(id)) {
        throw new Error(
          `프로젝트 폴더 이름 "${id}"은(는) URL로 쓸 수 없습니다. 영문 소문자, 숫자, 하이픈(-)만 사용하세요. 예: 2025-hillside-library`,
        );
      }
      return id;
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      year: z.number().int().min(1900).max(2100),
      location: z.string(),
      category: z.array(z.enum(categoryKeys)).min(1, 'category를 하나 이상 지정하세요.'),
      type: z.enum(projectTypeKeys),
      cover: image(),
      /** 대표 이미지 대체 텍스트 (선택, 없으면 제목 사용) */
      coverAlt: z.string().optional(),
      bgColor: z.string().regex(HEX, 'bgColor는 "#E6E1D3" 같은 HEX 색상이어야 합니다 (따옴표 포함).'),
      summary: z.string().min(1),
      order: z.number().optional(),
      hidden: z.boolean().default(false),
    }),
});

const projectsEn = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: ['*/index.en.{md,mdx}', '!_*/**'],
    generateId: folderId,
  }),
  // 번역할 항목만 받습니다. 그 외 항목(year, bgColor 등)은 적어도 무시되고 한국어 파일 값을 씁니다.
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    location: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

const cvItem = z.object({
  period: z.union([z.string(), z.number()]).transform(String).optional(),
  title: z.string(),
  detail: z.string().optional(),
});

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '{ko,en}.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      /** 이름 아래 한 줄 소개 (예: 건축 디자이너) */
      role: z.string().optional(),
      /** 프로필 사진 (선택) */
      photo: image().optional(),
      /** 학력·경력·수상 등. 섹션은 자유롭게 추가/삭제할 수 있습니다. */
      sections: z
        .array(z.object({ title: z.string(), items: z.array(cvItem) }))
        .default([]),
      /** 기술(툴): 그룹별 목록 */
      skills: z
        .array(z.object({ group: z.string(), items: z.array(z.string()) }))
        .default([]),
    }),
});

export const collections = { projects, projectsEn, about };
