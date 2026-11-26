/**
 * 배경색(HEX)으로부터 글자색·점 색·보조 색을 자동으로 계산합니다.
 *
 * - 글자색: WCAG 명도 대비비를 계산해 검정/흰색 중 대비가 더 높은 쪽을 선택
 * - 점 색: OKLab 색공간에서 밝기만 살짝 조정 (밝은 배경 → 조금 어둡게, 어두운 배경 → 조금 밝게)
 */

type RGB = [number, number, number];

const DARK_TEXT = '#141414';
const LIGHT_TEXT = '#ffffff';

export function normalizeHex(hex: string): string {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`잘못된 색상 값입니다: "${hex}" (예: #E6E1D3)`);
  return `#${h.toLowerCase()}`;
}

function hexToRgb(hex: string): RGB {
  const h = normalizeHex(hex).slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

function rgbToHex([r, g, b]: RGB): string {
  return `#${[r, g, b]
    .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
    .join('')}`;
}

const toLinear = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const toGamma = (l: number) => 255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055);

/** WCAG 상대 휘도 (0 = 검정, 1 = 흰색) */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** 배경색 위에서 더 잘 읽히는 글자색 (검정 또는 흰색) */
export function textColorFor(bg: string): string {
  return contrastRatio(bg, DARK_TEXT) >= contrastRatio(bg, LIGHT_TEXT) ? DARK_TEXT : LIGHT_TEXT;
}

// --- OKLab 변환 (https://bottosson.github.io/posts/oklab/) ---
function rgbToOklab(rgb: RGB): RGB {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, A, B]: RGB): RGB {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** OKLab 밝기(L)를 delta만큼 조정한 색 */
export function shiftLightness(hex: string, delta: number): string {
  const [L, A, B] = rgbToOklab(hexToRgb(hex));
  return rgbToHex(oklabToRgb([Math.min(1, Math.max(0, L + delta)), A, B]));
}

export interface Theme {
  bg: string;
  fg: string;
  isDark: boolean;
  vars: Record<string, string>;
}

/**
 * 배경색 하나로 페이지 테마(CSS 변수)를 만듭니다.
 * 점 간격·크기는 tokens.css의 --dot-gap, --dot-size에서 조절하세요.
 */
export function themeFromBg(bgInput: string): Theme {
  const bg = normalizeHex(bgInput);
  const fg = textColorFor(bg);
  const isDark = fg === LIGHT_TEXT;
  const [r, g, b] = hexToRgb(fg);
  const alpha = (a: number) => `rgb(${r} ${g} ${b} / ${a})`;

  return {
    bg,
    fg,
    isDark,
    vars: {
      '--page-bg': bg,
      '--fg': fg,
      '--fg-muted': alpha(isDark ? 0.72 : 0.62),
      '--line': alpha(isDark ? 0.28 : 0.16),
      '--dot-color': shiftLightness(bg, isDark ? 0.1 : -0.11),
      '--surface': shiftLightness(bg, isDark ? 0.05 : -0.035),
    },
  };
}

export function themeStyle(theme: Theme): string {
  return Object.entries(theme.vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

export const DEFAULT_BG = '#ffffff';
