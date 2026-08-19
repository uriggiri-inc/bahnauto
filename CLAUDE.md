@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 상위 폴더의 `../CLAUDE.md` 가 보안·콘텐츠·브랜드 규칙의 정본이다. 그 문서의 §1 은
> 예외 없이 우선한다. 이 문서는 **명령어와 구조**만 다룬다 — 규칙은 중복해 적지 않는다.

## 명령어

```bash
npm run dev          # 개발 서버 (Turbopack)
npm run typecheck    # next typegen && tsc --noEmit
npm run lint         # eslint
npm run format:check # prettier --check .   (실패하면 npm run format)
npm run build        # 기본 빌드

node scripts/optimize-brand-svg.mjs  # 브랜드 SVG 내장 래스터 재압축 (아래 9번)
node scripts/make-favicon.mjs        # symbol.svg → src/app/favicon.ico (16/32/48)
```

커밋 전에 위 네 가지(typecheck·lint·format:check·build)를 통과시킨다.

**테스트 러너가 없다.** `npm test` 는 존재하지 않는다. 검증은 타입체크·린트·빌드와
`/design-system`·`/lab` 육안 확인으로 한다. 테스트를 추가할 일이 생기면 러너 도입부터
사용자와 합의한다 — 임의로 프레임워크를 끌어오지 않는다.

### 빌드 대상이 셋이다

| 명령 | 산출물 | 서버 액션 | 용도 |
|---|---|---|---|
| `npm run build` | `.next/` | 있음 | 로컬 확인 |
| `npm run build:static` | `dist-deploy/site/` | **없음** | 드래그앤드롭 배포용 |
| `npm run build:cf` → `npm run preview` | `.open-next/` | 있음 | Cloudflare Workers |

`npm run preview:static` 으로 정적 산출물을 로컬 서빙해 볼 수 있다.

배포 절차와 미해결 법무 이슈는 `scripts/DEPLOY.md` 에 있다. `wrangler deploy` 는
외부 공개이므로 실행 전 사용자 확인이 필요하다(`../CLAUDE.md` §1.3).

## 구조에서 먼저 알아야 할 것

### 1. `isStatic` 한 줄이 빌드 전체를 가른다

`next.config.ts`:

```ts
const isStatic = process.env.STATIC_EXPORT === "1" || process.env.CF_PAGES === "1";
```

`CF_PAGES` 는 Cloudflare **Pages** 가 자동 주입한다(Workers 빌드에는 없다). 즉 배포
대상이 스스로 모드를 정한다 — 대시보드에 환경변수를 손으로 넣을 필요가 없다.
이 자동 감지가 빠지면 `out/` 이 생기지 않아 **모든 경로가 404** 가 된다.

`isStatic` 일 때만 켜지는 것: `output: "export"`, `images.unoptimized`,
`trailingSlash`, 그리고 아래 폼 스텁 교체.

Windows 에서 `STATIC_EXPORT=1 next build` 는 동작하지 않는다(PowerShell 에 인라인
환경변수 문법이 없다). 그래서 `scripts/build-static.mjs` 가 코드로 주입한다.

### 2. 폼은 `@/lib/form-submit` 만 거친다

화면 컴포넌트는 서버 액션을 **직접 import 하지 않는다.** 정적 빌드에서
`next.config.ts` 의 `turbopack.resolveAlias` 가 `@/lib/form-submit` 을
`form-submit.static.ts` 로 갈아끼우기 때문이다.

```
ContactForm.tsx ─→ @/lib/form-submit ─┬─ (기본)   app/(site)/contact/actions.ts  "use server"
                                       └─ (정적) lib/form-submit.static.ts       접수 불가 안내
```

`form-submit.ts` 는 re-export 만 한다. **여기에 로직을 넣지 않는다** — 교체본과
동작이 갈라지면 "미리보기에서는 되는데 배포하면 안 되는" 버그가 된다.

폼 데이터 흐름은 3단이다:

1. `lib/contact-schema.ts` · `lib/careers-schema.ts` — Zod 스키마. 클라이언트와 서버가 **공유**
2. 서버 액션이 같은 스키마로 **재검증** (진실은 서버 쪽)
3. 실패 시 **필드 이름만** 돌려준다. 입력값은 로그·응답 어디에도 남기지 않는다

### 3. 저장소 미연결 플래그

```
app/(site)/contact/actions.ts  → const LEAD_SINK_CONFIGURED = false
app/(site)/careers/actions.ts  → const APPLICANT_SINK_CONFIGURED = false
```

둘 다 `false` 인 동안 **운영 환경에서는 접수를 성공으로 처리하지 않고** 전화·카카오
안내를 돌려준다. 저장할 곳이 없는데 성공 화면을 띄우면 리드가 조용히 사라지기
때문이다. 개발 환경에서만 화면 흐름 확인용으로 통과시킨다.

저장소를 붙일 때 상담 리드와 채용 지원은 **분리 저장**한다(보유기간 정책이 다름).

### 4. 더미 콘텐츠 게이트

미확정 값은 전부 `src/content/dummy.ts` 한 곳에 모여 있고 `DUMMY_CONTENT = true` 가
게이트다.

```
content/dummy.ts ─┬─→ lib/pricing.ts        DUMMY_CONTENT 가 false 면 금액을 null 로 비운다
                  └─→ marketing/DummyBanner  7개 페이지 상단의 "샘플 데이터" 띠
```

`lib/pricing.ts` 의 `estimate()` 는 값이 하나라도 없으면 계산하지 않고 `null` 을
돌려준다. 빠진 변수를 1 로 가정하면 근거 없는 금액이 그럴듯하게 나온다.

실제 값이 들어오면: `dummy.ts` 값 교체 → `DUMMY_CONTENT = false` → 배너가 한 번에
사라진다. **개별 페이지에서 배너 조건을 바꾸지 않는다** — 가짜 값이 표시 없이 남는다.

### 5. 라우트 그룹 — 검증 화면은 셸 밖에 있다

```
app/layout.tsx          루트: <html>, 메타데이터, Pretendard <link>
├─ app/(site)/          Header + Footer + MobileStickyCTA 셸. URL 에는 영향 없음
└─ app/design-system/   셸 없음, robots noindex
   app/lab/             셸 없음, robots noindex — 반응형·스크롤 서사 가설검증용
```

`/lab` 과 `/design-system` 은 링크로 연결돼 있지 않지만 **주소를 알면 열린다.**
외부 공유 전에는 `scripts/DEPLOY.md` 의 안내를 따른다.

검색 노출은 `src/lib/seo.ts` 의 `SEARCH_OPEN` **한 줄이 정한다.** 지금 `false` 라
`robots.txt` 가 전 경로를 막고 모든 페이지에 `noindex` 가 붙는다. 이 값을 `true` 로
바꾸는 것이 정식 오픈의 마지막 단계다.

⚠️ **GitHub Pages 는 응답 헤더를 설정할 수 없다.** 이전 판에는 Cloudflare 용
`public/_headers` 가 `X-Robots-Tag: noindex` 를 함께 걸어 이중 방어를 했는데, 배포가
GitHub Pages 로 옮겨오면서 그 수단이 사라졌다 — **그 파일은 이 저장소에 없다.**
차단 장치가 하나뿐이므로 그 한 줄의 무게가 크다. 켜는 순간이 곧 공개다(§1.3).

### 6. 디자인 토큰 — 어느 파일이 진짜인가

**코드상 정본은 `src/app/globals.css` 의 `@theme` 블록뿐이다.** Tailwind v4 라
`tailwind.config.js` 가 없다(인터넷 예제는 대부분 v3 문법이라 그대로 쓰면 동작하지
않는다).

주의할 함정 둘:

- `src/styles/tokens/*.css` 는 **어디에서도 import 되지 않는다.** 디자인 명세의
  영문 사본이다. 여기를 고쳐도 화면은 바뀌지 않는다
- `docs/design-system/` 도 참조용 원본 명세다(ESLint·Prettier 대상에서 제외돼 있다).
  토큰 값을 바꾸면 `globals.css` 와 이쪽 명세를 **함께** 갱신한다

`@theme` 에 넣으면 Tailwind 유틸리티가 생기고, `:root` 에 넣으면 커스텀 CSS 전용
변수가 된다(스페이싱·지속시간·컨테이너 폭 등). 둘의 구분은 의도적이다.

반경은 역할당 하나로 고정돼 있다 — 버튼·인풋 10px, 카드 18px, 큰 패널 24px.
`--radius-md`(14) 와 `--radius-xl`(22) 는 명세 대조용으로 값만 남긴 것이고
**화면에서 쓰지 않는다.**

### 7. 모션이 다섯 층으로 나뉜다

| 층 | 어디에 | 규칙 |
|---|---|---|
| CSS 키프레임 | `globals.css` | 히어로(LCP)·로더·링 마크. JS 0바이트 |
| 컴포넌트 옆 CSS Module | `marketing/ReviewSlider.module.css` | 후기 마퀴 전용. 전역에 두면 참조자를 잃고 고아가 된다 |
| `Reveal` 컴포넌트 | `ui/Reveal.tsx` | IntersectionObserver + CSS 애니메이션 |
| rAF + `--dur-*` 토큰 읽기 | `lib/motion.ts` (`ui/Stat.tsx` 카운트업, `marketing/PlanCards.tsx` 금액 롤링) | 지속시간을 CSS 토큰에서 읽어 모션 축소 분기를 컴포넌트에 두지 않는다 |
| `motion/react` | `brand/ScrollStory*.tsx`, `StoryFloaters.tsx` 만 | 스크롤 서사 전용 |

`Reveal` 은 **서버 HTML 을 보이는 상태로 내보낸다.** `opacity-0` 을 서버 렌더에
박아두는 흔한 구현은 JS 가 실패하면 콘텐츠가 통째로 사라진다.

모션 축소 대응은 대부분 토큰 층에서 끝난다 — `prefers-reduced-motion` 에서
`--dur-*` 와 `--reveal-distance` 가 0 으로 내려가므로 컴포넌트에서 따로 분기하지
않는다.

**무한 루프는 금지다.** 예외는 아래 셋뿐이고, 전부 사용자가 명시적으로 승인한
것이다. 예외에는 **안전장치 2종이 반드시 함께 붙는다** — 하나라도 빠지면 읽는
사람이 움직임을 멈출 방법이 없다.

| 예외 | 어디에 | 정지 조건 |
|---|---|---|
| 브랜드 티커 | `globals.css` (`ba-ticker`) | hover 정지 · 모션 축소 완전 정지 |
| 후기 마퀴 | `marketing/ReviewSlider.module.css` | 줄 단위 hover·focus-within·**active**(터치) 정지 · 모션 축소에서 가로 스크롤로 대체 |
| 조건부 단계 꼬리표 | `globals.css` (`ba-tag-flash`), `marketing/ProcessSteps.tsx` | 단계 목록 hover·focus·선택 시 정지(`held` → `.is-paused`) · 모션 축소 완전 정지. 뷰포트 진입 후 재생 |

새 예외를 추가할 때는 **① 사용자 개입 시 정지 ② 모션 축소 시 완전 정지**를 함께
구현하고 이 표에 등록한다.

### 8. 법정 문서와 회사 정보

`content/company.ts` 와 `content/legal/{terms,privacy}.ts` 는 실제 법무 문서에서
옮긴 **확정본**이다. `content/legal/types.ts` 는 구조(조·항·표)만 표현하고
`marketing/LegalDocument.tsx` 가 렌더한다.

**원본 문장을 다듬지 않는다.** 읽기 좋게 고치면 어느 쪽이 진본인지 알 수 없게 된다.
값을 고칠 때는 약관·개인정보처리방침 원본과 반드시 함께 고친다.

### 9. 브랜드 SVG 에는 래스터가 박혀 있다

`public/brand/*.svg` 의 링 그라디언트는 **호를 따라** 흐른다(왼쪽 아래 진한 파랑
→ 위를 지나 → 오른쪽 아래 연한 파랑). SVG 1.1 의 `<linearGradient>` 로는
표현할 수 없는 형태라 Illustrator 가 링만 PNG 로 구워 넣는다.

그래서 **디자이너가 새 SVG 를 주면 그대로 넣지 말고 반드시 이걸 돌린다:**

```bash
node scripts/optimize-brand-svg.mjs
```

Illustrator 는 그라디언트 스톱 팔레트 413개를 `<style>` 에 통째로 쏟아내고
(실제 참조는 2~4개), 링 래스터를 1031px 로 굽는다. 이 사이트에서 링이 가장
크게 나오는 건 216 device px(72 CSS px × DPR 3)라 **5배 과잉**이다.
스크립트가 512px 로 줄인다 — 전송량 220KB → 61KB(brotli).

확인된 함정 둘:

- **`-dark` 변형에 배경 사각형이 구워져 나온다.** `<rect class="stN" .../>` 가
  뷰박스 전체를 `#262B3C` 로 채운다. 푸터 배경색과 우연히 같아 지금은 보이지
  않지만, 다른 어두운 배경에 올리면 사각형이 드러난다. `fill="none"` 으로
  바꾼다(기존 파일도 그랬다)
- **워드마크가 `#0049D0` 로 나온다.** 브랜드 정본은 `#004ACC` 다. 그라디언트
  스톱 반올림이 새어 들어온 값이고 육안 구분은 안 되지만 토큰이 갈라진다

파비콘은 `symbol.svg` 를 직접 참조하지 않는다 — 20KB 를 전 페이지에서 받게 된다.
`scripts/make-favicon.mjs` 가 만든 `src/app/favicon.ico`(4KB)와
`src/app/apple-icon.png`(180px)를 Next 파일 컨벤션이 자동으로 링크한다.
**`app/layout.tsx` 에 `icons` 를 다시 선언하면 그 자동 링크를 덮어쓴다.**

> `components/brand/RingMark.tsx` 는 링을 코드로 그리는데, 그라디언트가
> **가로 방향 선형**이다. 새 로고의 호 방향 그라디언트와 다르다. 나란히 놓이는
> 화면(홈·완료 페이지)에서 차이가 보이는지는 디자인 판단이 필요하다.

### 10. GA4 는 호스트가 정확히 일치할 때만 로드된다

`lib/analytics.ts` 의 `ANALYTICS_HOSTS` 가 유일한 스위치다. 부분일치를 허용하지
않으므로 Pages 브랜치 프리뷰(`<해시>.banauto.pages.dev`)와 로컬은 자동으로
빠진다. 허용되지 않으면 `googletagmanager.com` 요청 자체가 나가지 않는다 —
`config` 만 건너뛰면 스크립트 로드만으로 세션이 잡힌다.

`(site)` 레이아웃에만 붙인다. 루트에 두면 `/design-system`·`/lab` 트래픽이 섞인다.

라우트 이동 시 `page_view` 를 **수동으로 보내지 않는다.** GA4 향상된 측정이
기본으로 처리하고 있어 조회수가 두 배로 잡힌다.

## 알려진 미해결 항목

`scripts/DEPLOY.md` 의 "정식 공개 전 반드시 처리할 것" 목록이 정본이다. 코드에
`TODO` 로 남아 있는 것들:

- `app/layout.tsx` — `metadataBase` 미설정 (도메인 미확정 → OG·canonical 이 상대경로)
- `content/company.ts` — 통신판매업신고번호 없음
- `lib/regions.ts` — 행정안전부 최신 기준 대조 필요
- 개인정보처리방침 제2조의 수집 항목과 `/contact` 폼의 실제 필드가 불일치
