# 건축 프로젝트 아카이브

개인 건축 작업을 정리하고 링크로 공유하기 위한 포트폴리오 사이트입니다.

- **Astro 7 + TypeScript**, Content Collections (frontmatter는 zod로 검증)
- 순수 CSS (CSS 변수 기반, 프레임워크 없음)
- 이미지 자동 최적화 (webp, 반응형 srcset, lazy loading)
- 한국어/영어 (`/ko/…`, `/en/…`)
- GitHub Pages 자동 배포 (GitHub Actions)

---

## 목차

1. [빠른 시작](#빠른-시작)
2. [새 프로젝트 추가하는 법](#새-프로젝트-추가하는-법) ★
3. [본문에서 쓰는 컴포넌트](#본문에서-쓰는-컴포넌트)
4. [이미지 가이드](#이미지-가이드)
5. [동영상 가이드](#동영상-가이드)
6. [사이트 정보·About·Contact 수정](#사이트-정보aboutcontact-수정)
7. [디자인 조정](#디자인-조정)
8. [배포와 공유](#배포와-공유)
9. [문제 해결](#문제-해결)
10. [폴더 구조](#폴더-구조)

---

## 빠른 시작

[Node.js](https://nodejs.org) 22.23.4 이상이 필요합니다.

```bash
npm install        # 처음 한 번
npm run dev        # 개발 서버 → http://localhost:4321/Portfolio/
```

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행. 파일을 저장하면 바로 반영됩니다 |
| `npm run new <폴더이름>` | 새 프로젝트 폴더 만들기 |
| `npm run build` | 배포용 빌드 (`dist/` 폴더) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run check` | 타입·스키마 검사 |

---

## 새 프로젝트 추가하는 법

**프로젝트 1개 = 폴더 1개**입니다. `src/content/projects/` 안에 폴더를 추가하면
목록, 카테고리 필터, 상세 페이지, 이전/다음 이동, sitemap이 모두 자동으로 만들어집니다.

```
src/content/projects/
└─ 2026-river-pavilion/        ← 폴더 이름이 곧 URL (/ko/projects/2026-river-pavilion/)
   ├─ index.ko.mdx             ← 한국어 본문 + 모든 정보 (필수)
   ├─ index.en.mdx             ← 영어 본문 (선택)
   ├─ cover.jpg                ← 대표 이미지
   ├─ plan-1f.png              ← 본문에 쓸 이미지들
   └─ …
```

### 1단계 — 폴더 만들기

```bash
npm run new 2026-river-pavilion
```

템플릿(`src/content/projects/_template/`)이 복사되어 새 폴더가 생깁니다.
명령 대신 `_template` 폴더를 직접 복사해 이름을 바꿔도 됩니다.

> **폴더 이름 규칙:** 영문 소문자, 숫자, 하이픈(`-`)만 쓸 수 있습니다. 공백·한글·대문자는 안 됩니다.
> `2026-river-pavilion`처럼 연도를 앞에 붙이면 폴더가 정리하기 편합니다 (필수는 아님).
> 밑줄(`_`)로 시작하는 폴더는 빌드에서 제외됩니다 (임시 작업용으로 활용 가능).

### 2단계 — frontmatter 작성

`index.ko.mdx` 맨 위 `---` 사이를 채웁니다.

```yaml
---
title: 강변 파빌리온
year: 2026
location: 서울 마포구
category: [public, landscape]
type: personal
cover: ./cover.jpg
coverAlt: 강변 산책로 위에 놓인 목구조 파빌리온
bgColor: "#E9E6DF"
summary: 강변 산책로에 놓인 작은 쉼터. 지붕 하나로 그늘과 풍경을 동시에 만든다.
order: 1
hidden: false
---
```

| 항목 | 필수 | 설명 |
| --- | :---: | --- |
| `title` | ✔ | 프로젝트 제목 |
| `year` | ✔ | 연도 (숫자). 목록 정렬 기준 |
| `location` | ✔ | 위치 |
| `category` | ✔ | 카테고리 키 목록. `[residential]` 또는 `[cultural, public]`. 사용할 수 있는 값은 `src/config/taxonomy.ts`에 있습니다 |
| `type` | ✔ | `school`(학교 과제) / `competition`(공모전) / `personal`(개인 작업) / `professional`(실무) |
| `cover` | ✔ | 대표 이미지. 같은 폴더의 파일을 `./파일이름` 형식으로 적습니다. 목록 썸네일과 공유 미리보기에 쓰입니다 |
| `coverAlt` |  | 대표 이미지 설명 (화면낭독기용). 없으면 제목을 씁니다 |
| `bgColor` | ✔ | 상세 페이지 배경색. **반드시 따옴표로 감싸세요** (`"#E9E6DF"`). 글자색(검정/흰색)과 점 색은 자동으로 정해집니다 |
| `summary` | ✔ | 한두 문장 요약. 상세 페이지 상단, 공유 미리보기, 검색 결과에 쓰입니다 |
| `order` |  | 같은 연도 안에서 순서 (작은 숫자가 먼저) |
| `hidden` |  | `true`면 목록·이전/다음·sitemap에서 빠지고 검색엔진에 노출되지 않습니다. URL을 아는 사람은 볼 수 있습니다 (작업 중인 프로젝트나 특정인에게만 보여줄 때) |

**영문 파일(`index.en.mdx`)** 에는 번역할 항목만 적습니다. 연도·카테고리·대표 이미지·bgColor 등은 한국어 파일 값을 그대로 씁니다.

```yaml
---
title: Riverside Pavilion
summary: A small shelter on the riverside walk — a single roof that makes both shade and a view.
location: Mapo-gu, Seoul   # 선택. 없으면 한국어 값
---
```

영문 파일이 없어도 됩니다. 그러면 `/en/` 페이지에는 한국어 본문과 "아직 번역되지 않음" 안내가 표시됩니다.

### 3단계 — 이미지 넣고 본문 쓰기

1. 대표 이미지를 `cover.jpg`로 저장합니다. 템플릿에 들어 있던 회색 임시 이미지를 덮어쓰면 됩니다.
2. 나머지 이미지도 **같은 폴더**에 넣습니다. 파일 이름은 영문 소문자를 권장합니다. 예: `plan-1f.png`, `photo-01.jpg`
3. `---` 아래에 본문을 마크다운으로 쓰고, 이미지는 [컴포넌트](#본문에서-쓰는-컴포넌트)로 넣습니다.
4. `npm run dev`로 확인합니다. 파일 이름이 틀리거나 frontmatter에 문제가 있으면 터미널에 어느 파일의 어느 항목이 문제인지 표시됩니다.

### 4단계 — 배포

```bash
git add .
git commit -m "Add river pavilion"
git push
```

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드·배포합니다. 보통 1~3분 걸립니다.
진행 상황은 저장소의 **Actions** 탭에서 볼 수 있습니다.

> GitHub 웹사이트에서 파일을 직접 올려도 됩니다. 저장소에서 `src/content/projects/`로 이동한 뒤
> **Add file → Upload files**로 폴더째 끌어다 놓고 커밋하면 똑같이 배포됩니다.

---

## 본문에서 쓰는 컴포넌트

`.mdx` 파일에서는 아래 컴포넌트를 **import 없이** 바로 쓸 수 있습니다.
이미지·영상 경로는 같은 폴더 기준 `"./파일이름"` 형식으로 적습니다.

### `<Gallery>` + `<Photo>` — 이미지 그리드

```mdx
<Gallery cols={3} ratio="4/3" caption="외관">
  <Photo src="./exterior-01.jpg" alt="남측 전경" caption="남측 전경" />
  <Photo src="./exterior-02.jpg" alt="중정" />
  <Photo src="./exterior-03.jpg" alt="야경" span={2} />
</Gallery>
```

| 속성 | 설명 |
| --- | --- |
| `cols` | 데스크톱 열 수 (1~4, 기본 2). 모바일에서는 자동으로 1~2열 |
| `ratio` | 모든 사진을 같은 비율로 잘라 보여줍니다 (`"1/1"`, `"4/3"`, `"3/2"` 등). 없으면 원본 비율 |
| `caption` | 갤러리 전체 캡션 |
| `<Photo span={2}>` | 사진 하나가 2칸을 차지 |

사진을 누르면 크게 볼 수 있고, 같은 갤러리 안에서는 좌우로 넘겨 볼 수 있습니다.
`<Photo>`만 단독으로 써도 됩니다. 이때는 전체 폭으로 표시되고, `size="text"`를 붙이면 본문 폭으로 표시됩니다.

### `<Drawing>` — 도면 (클릭 시 확대·줌)

```mdx
<Drawing src="./plan-1f.png" caption="1층 평면도 1:200" />
<Drawing src="./section.png" caption="단면도 A-A" blend />
```

- 누르면 전체 화면으로 열립니다. 마우스 휠·핀치로 확대하고 드래그로 이동합니다.
- 확대해도 선이 선명하도록 **긴 변 3000~4000px**의 PNG(또는 고품질 JPG)를 권장합니다.
- `blend`: 도면의 흰 바탕을 페이지 배경색과 섞어 투명하게 보이게 합니다. 밝은 배경색에서만 쓰세요.

### `<Diagram>` — 캡션 있는 다이어그램

```mdx
<Diagram src="./massing.png" label="Diagram 01" caption="매스 전개">
경사를 따라 매스를 나누고 단차마다 테라스를 만들었다.
</Diagram>
```

데스크톱에서는 왼쪽에 캡션, 오른쪽에 이미지가 놓입니다. 태그 사이의 설명 문장은 선택입니다.
**배경이 투명한 PNG**를 쓰면 프로젝트 배경색 위에 자연스럽게 얹힙니다.

### `<Video>` — 동영상

```mdx
<Video youtube="https://youtu.be/VIDEO_ID" caption="워크스루" />
<Video vimeo="https://vimeo.com/123456789" />
<Video src="./model-rotate.mp4" poster="./cover.jpg" autoplay />
<Video src="./interview.mp4" ratio="9/16" />
```

| 속성 | 설명 |
| --- | --- |
| `youtube` | YouTube 주소 또는 영상 ID |
| `vimeo` | Vimeo 주소 또는 영상 ID (비공개 링크 주소도 가능) |
| `src` | 같은 폴더의 mp4 파일 |
| `poster` | 로컬 영상의 썸네일 이미지 |
| `autoplay` | 로컬 영상을 소리 없이 자동·반복 재생 (짧은 클립용) |
| `ratio` | 화면 비율 (기본 `"16/9"`, 세로 영상은 `"9/16"`) |
| `caption` | 캡션 |

### 그 밖의 마크다운

`## 소제목`, 문단, **굵게**, [링크](https://example.com), 목록, 인용(`>`), 표, `![설명](./image.jpg)` 모두 쓸 수 있습니다.

> 컴포넌트를 쓰지 않는다면 확장자를 `.md`로 해도 됩니다 (`index.ko.md`).

---

## 이미지 가이드

| 용도 | 권장 |
| --- | --- |
| 사진·렌더링 | JPG, 긴 변 2400~3000px, 파일당 1~3MB 이하 |
| 대표 이미지 (`cover`) | JPG, 가로 이미지, 긴 변 2400px 이상 |
| 도면 | PNG 또는 고품질 JPG, 긴 변 3000~4000px |
| 다이어그램 | 배경 투명 PNG |

- 원본을 그대로 넣으면 사이트가 자동으로 **webp 변환, 크기별 이미지 생성(srcset), 지연 로딩**을 처리합니다.
- 너무 큰 원본(예: 50MB TIFF)은 저장소 용량만 차지하니 위 크기로 줄여서 넣으세요.
  GitHub는 100MB를 넘는 파일을 거부하고, 저장소 전체는 1GB 이하를 권장합니다.
- 파일 이름은 `plan-1f.png`처럼 **영문 소문자·숫자·하이픈**으로 지으면 문제가 생기지 않습니다.

---

## 동영상 가이드

동영상은 용량이 커서 저장소와 사이트를 무겁게 만듭니다.

1. **기본은 YouTube 또는 Vimeo에 올리고 임베드하세요.** 화질·스트리밍을 플랫폼이 처리하고, 저장소 용량을 차지하지 않습니다.
   YouTube는 "일부 공개(unlisted)"로 올리면 링크가 있는 사람만 볼 수 있습니다.
2. **로컬 mp4는 짧은 클립만** 넣으세요. 모델 회전, 몇 초짜리 루프 같은 것으로, **10MB 이하**를 권장합니다.
   10MB를 넘으면 빌드할 때 경고가 표시됩니다.

로컬 클립을 줄이는 방법 ([ffmpeg](https://ffmpeg.org) 사용):

```bash
# 가로 1280px, 소리 제거, 웹 재생용 최적화
ffmpeg -i input.mov -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart clip.mp4
```

`-crf` 값을 올리면(예: 30) 용량이 더 작아지고 화질은 조금 떨어집니다.

---

## 사이트 정보·About·Contact 수정

| 바꿀 것 | 파일 |
| --- | --- |
| 이름, 사이트 설명, 이메일, SNS 링크 | `src/config/site.ts` |
| About 소개·학력·경력·수상·기술 | `src/content/about/ko.md`, `en.md` |
| 카테고리·유형 목록 (한/영 이름) | `src/config/taxonomy.ts` |
| 메뉴·버튼 등 UI 문구 번역 | `src/i18n/ui.ts` |
| 배포 주소 (도메인) | `astro.config.mjs` |

**카테고리 추가:** `src/config/taxonomy.ts`에 한 줄을 추가하면 바로 쓸 수 있습니다.

```ts
export const categories = {
  // …
  pavilion: { ko: '파빌리온', en: 'Pavilion' },
};
```

목록 필터에는 실제로 사용 중인 카테고리만 표시됩니다.
taxonomy에 없는 값을 frontmatter에 쓰면 빌드할 때 에러로 알려 줍니다 (오타 방지).

**About:** 학력·경력·수상은 `sections`로 관리합니다. 섹션 이름을 바꾸거나 `전시`, `출판` 같은 섹션을 자유롭게 추가할 수 있습니다.
프로필 사진은 `src/content/about/`에 넣고 `photo: ./profile.jpg`의 주석(`#`)을 지우면 표시됩니다.

---

## 디자인 조정

색·여백·글자 크기·점 그리드는 `src/styles/tokens.css`의 CSS 변수에서 조절합니다.

```css
--dot-size: 1px;   /* 점 반지름 */
--dot-gap: 22px;   /* 점 간격 */
--dot-color: #d9d9d9;  /* 점 색 (흰 배경 기준) */
--font-latin: 'Pretendard Variable';  /* 영문 글꼴 */
```

- **상세 페이지 색상:** `bgColor` 하나로 글자색(검정/흰색 중 명도 대비가 높은 쪽), 보조 글자색, 구분선 색, 점 색이 자동으로 계산됩니다 (`src/lib/color.ts`).
- **페이지 전환:** 목록에서 상세로 이동할 때 배경색이 부드럽게 바뀌고, 대표 이미지가 이어지며 커집니다.
  브라우저의 View Transitions 기능을 쓰므로 최신 Chrome·Edge·Safari에서 동작하고, 그 밖의 브라우저에서는 일반 페이지 이동으로 처리됩니다.
  "동작 줄이기" 설정을 켠 사용자에게는 효과가 꺼집니다.
- **글꼴:** 한글은 Pretendard입니다. 영문도 Pretendard에 포함된 Inter 기반 글꼴을 씁니다.
  다른 영문 글꼴을 쓰려면 글꼴을 불러온 뒤 `--font-latin`만 바꾸면 됩니다.

---

## 배포와 공유

### GitHub Pages 설정 (처음 한 번)

1. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
2. `main` 브랜치에 push하면 자동으로 배포됩니다 (`.github/workflows/deploy.yml`).
   Actions 탭에서 **Deploy to GitHub Pages → Run workflow**로 수동 실행할 수도 있습니다.
3. 주소: `https://yorksh.github.io/Portfolio/`
   첫 화면은 `/ko/`로 이동합니다. 영어 사용자에게는 `/en/` 링크를 보내세요.

### 커스텀 도메인을 쓸 때

1. `astro.config.mjs`에서 `SITE`를 `'https://내도메인.com'`으로, `BASE`를 `'/'`로 바꿉니다.
2. `public/CNAME` 파일을 만들고 도메인을 한 줄로 적습니다 (예: `portfolio.example.com`).
3. 저장소 Settings → Pages → Custom domain에 도메인을 입력하고, 도메인 업체에서 DNS를 설정합니다.

### 공유 미리보기 (카카오톡·SNS)

프로젝트마다 대표 이미지·제목·요약으로 미리보기(Open Graph)가 만들어집니다.
About·Contact처럼 프로젝트가 아닌 페이지는 가장 최근 프로젝트의 대표 이미지를 씁니다.

카카오톡·페이스북 등은 미리보기를 한동안 저장해 두기 때문에, 대표 이미지나 요약을 바꿔도 예전 미리보기가 보일 수 있습니다. 이때는 아래 도구에서 주소를 입력해 초기화하세요.

- 카카오톡: [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing) (카카오 개발자 로그인 필요)
- 페이스북·인스타그램: [Sharing Debugger](https://developers.facebook.com/tools/debug/)

### 숨김(hidden) 프로젝트

`hidden: true`인 프로젝트는 다음과 같이 처리됩니다.

- 목록, 이전/다음 이동, sitemap에서 빠집니다.
- 검색엔진에 노출되지 않습니다 (`noindex`).
- 페이지 자체는 만들어지므로 URL을 직접 보내면 볼 수 있습니다.

비밀번호 보호는 아닙니다. 링크를 아는 사람은 누구나 볼 수 있다는 점을 기억하세요.

---

## 문제 해결

**빌드 에러가 났어요.** 터미널(또는 GitHub Actions 로그)에 문제가 있는 파일과 항목이 표시됩니다.

| 메시지 예시 | 원인과 해결 |
| --- | --- |
| `bgColor: bgColor는 "#E6E1D3" 같은 HEX 색상이어야 합니다` | 색상 값을 따옴표로 감쌌는지, `#`과 6자리를 썼는지 확인 |
| `category.0: Invalid option: expected one of …` | 카테고리 오타. 또는 `taxonomy.ts`에 추가 필요 |
| `Could not resolve './plan.png'` | 이미지 파일 이름 오타, 또는 파일이 다른 폴더에 있음 |
| `프로젝트 폴더 이름 "…"은(는) URL로 쓸 수 없습니다` | 폴더 이름에 대문자·공백·한글이 있음 |
| `year: Invalid input: expected number` | `year: "2025"` 대신 `year: 2025` (따옴표 없이) |

**변경한 내용이 사이트에 안 보여요.** Actions 탭에서 배포가 끝났는지 확인하고, 브라우저를 새로고침(Shift+새로고침)하세요.

**예시 프로젝트 지우기:** `src/content/projects/hillside-library`와 `courtyard-house` 폴더를 삭제하면 됩니다.
`_template` 폴더는 지우지 마세요 (`npm run new`가 사용합니다).

---

## 폴더 구조

```
├─ .github/workflows/deploy.yml   GitHub Pages 자동 배포
├─ astro.config.mjs               배포 주소(site/base) 설정
├─ scripts/new-project.mjs        npm run new
├─ public/                        favicon 등 그대로 복사되는 파일
└─ src/
   ├─ content.config.ts           frontmatter 스키마 (검증 규칙)
   ├─ config/
   │  ├─ site.ts                  이름·이메일·SNS
   │  └─ taxonomy.ts              카테고리·유형
   ├─ i18n/ui.ts                  UI 문구 번역
   ├─ content/
   │  ├─ projects/<slug>/         프로젝트 (폴더 = URL)
   │  │  └─ _template/            새 프로젝트 템플릿 (빌드 제외)
   │  └─ about/ko.md, en.md       About/CV
   ├─ components/                 화면 구성 요소
   │  └─ mdx/                     본문용 Gallery·Photo·Drawing·Diagram·Video
   ├─ layouts/                    공통 레이아웃, 상세 페이지 레이아웃
   ├─ lib/
   │  ├─ color.ts                 배경색 → 글자색·점 색 자동 계산
   │  ├─ projects.ts              정렬·숨김·이전/다음·번역 처리
   │  └─ mdx-relative-src.mjs     본문 컴포넌트의 "./파일" 경로 처리
   ├─ scripts/                    브라우저 스크립트 (필터, 확대 보기)
   ├─ styles/                     tokens.css(디자인 변수), global.css, prose.css
   └─ pages/                      URL 구조
      ├─ index.astro              / → /ko/
      ├─ [lang]/index.astro       프로젝트 목록 (?category=…&sort=asc)
      ├─ [lang]/projects/[slug].astro  상세
      ├─ [lang]/about.astro, contact.astro
      └─ 404.astro, sitemap.xml.ts, robots.txt.ts
```
