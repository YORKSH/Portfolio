import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/** MDX 컴포넌트의 src가 올바른 이미지인지 확인하고, 아니면 이해하기 쉬운 에러를 냅니다. */
export function assertImage(src: unknown, component: string): asserts src is ImageMetadata {
  if (!src || typeof src !== 'object' || !('src' in src) || !('width' in src)) {
    throw new Error(
      `[${component}] 이미지를 찾을 수 없습니다. src에는 같은 폴더의 이미지 파일을 "./파일이름.jpg" 형식으로 적어 주세요. (받은 값: ${JSON.stringify(src)})`,
    );
  }
}

/** 확대 보기(라이트박스)에 쓸 큰 이미지 */
export async function lightboxImage(src: ImageMetadata, maxWidth = 2400) {
  if (src.format === 'svg') {
    return { href: src.src, width: src.width * 2, height: src.height * 2 };
  }
  const width = Math.min(src.width, maxWidth);
  const height = Math.round((src.height * width) / src.width);
  const img = await getImage({ src, width, format: 'webp', quality: 82 });
  return { href: img.src, width, height };
}

/** YouTube 주소 또는 ID → ID */
export function youtubeId(input: string): string {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const url = new URL(s);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1).split('/')[0];
    const v = url.searchParams.get('v');
    if (v) return v;
    const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{11})/);
    if (m) return m[1];
  } catch {
    /* 주소 형식이 아니면 그대로 사용 */
  }
  return s;
}

/** Vimeo 주소 또는 ID → { id, hash } (비공개 링크의 해시 포함) */
export function vimeoId(input: string): { id: string; hash?: string } {
  const s = input.trim();
  if (/^\d+$/.test(s)) return { id: s };
  const m = s.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/i);
  if (m) {
    let hash = m[2];
    try {
      hash = new URL(s).searchParams.get('h') ?? hash;
    } catch {
      /* noop */
    }
    return { id: m[1], hash };
  }
  return { id: s };
}
