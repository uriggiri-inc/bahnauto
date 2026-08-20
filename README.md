# bahnauto.kr

**반오토(BahnAuto) 서비스 공식 홈페이지.** (주)우리끼리가 운영하는 서비스입니다.

> 이 저장소는 **회사(우리끼리) 홈페이지가 아니라 반오토 서비스 홈페이지**입니다.
> 브랜드 표기는 **반오토 / BahnAuto**, 운영사 **(주)우리끼리**는 푸터에만 표기합니다.

---

## 2026-08-19 — 손으로 만든 정적 HTML → Next.js 로 교체

이전에는 `index.html`·`about.html`·`service.html`·`contact.html` 네 장을 손으로
쓰고 `main` 브랜치 루트를 GitHub Pages 가 그대로 서빙했습니다. 페이지가 20개
넘게 늘고 폼·다크모드·스크롤 연출이 들어가면서 그 방식으로는 유지가 어려워져
**Next.js 정적 사이트**로 교체했습니다.

무엇이 바뀌었는지:

| | 이전 | 지금 |
|---|---|---|
| 소스 | 루트의 `.html` 4장 | `src/` 의 Next.js 앱 (라우트 43개) |
| 배포 | `main` 루트를 그대로 서빙 | **Actions 가 빌드 → Pages 에 업로드** |
| 주소 | `/about.html` | `/about/` (끝에 슬래시) |
| 스타일 | `assets/style.css` | Tailwind v4 (`src/app/globals.css` 의 `@theme` 가 정본) |
| 검사 | HTMLHint · `tools/check-pages.py` | 타입·린트·서식·정적빌드 4종 |

옛 주소(`/about.html` 등)는 `public/` 의 이정표 파일이 새 주소로 보냅니다 —
북마크나 검색 결과에 남은 링크가 빈 화면으로 끝나지 않게 하기 위해서입니다.

---

## 구조

```
src/app/               라우트 (App Router). 폴더 = 주소
src/components/        화면 조각
src/content/           카피·데이터 (요금·기능·FAQ·공지)
src/lib/               유틸 (조판·SEO 스위치·분석 게이트)

public/                그대로 배포되는 파일
  CNAME                커스텀 도메인 (bahnauto.kr) — 삭제 금지
  .nojekyll            Jekyll 처리 방지 — 삭제 금지
  about.html           옛 주소 이정표 3개
  service.html
  contact.html
  brand/               로고·모션

관리자-할일.md         비개발자용 — 남은 설정 작업을 링크와 함께 단계별로
scripts/
  build-static.mjs     정적 내보내기 (dist-deploy/site 생성)
  fetch-news.mjs       노션 공지 → src/content/news.json
  NOTION-NEWS-SETUP.md 노션 연결 설정 안내
  DEPLOY.md            배포 절차·오픈 전 점검 목록

.github/workflows/
  deploy.yml           main 푸시·수동·15분 예약 → 빌드 → Pages
  pr-check.yml         PR 검사 4종

CLAUDE.md              작업 규칙 (보안·브랜드·콘텐츠). **먼저 읽을 문서**
docs/design-system/    디자인 토큰 원본 명세
```

`robots.txt` 와 `sitemap.xml` 은 **파일이 아니라 코드가 만듭니다**
(`src/app/robots.ts` · `src/app/sitemap.ts`). 루트에서 찾지 마세요.

---

## 로컬에서 띄우기

```bash
npm ci
npm run dev          # http://localhost:3000
```

## 커밋 전에 반드시

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build:static   # ← 일반 build 가 아니라 이것
```

마지막 줄이 중요합니다. `npm run build` 는 통과하는데 `build:static` 만 실패하는
경우가 있습니다(메타데이터 라우트의 `force-static` 누락). **배포는 정적 경로로
빌드하므로** 그쪽으로 확인해야 배포 전에 잡힙니다.

---

## 지금 검색에 노출되지 않습니다

`src/lib/seo.ts` 의 `SEARCH_OPEN = false` 가 `robots.txt` 에 `Disallow: /` 를
내보내고 모든 페이지에 `noindex` 를 답니다.

요금·실적·후기가 아직 샘플 데이터이고 약관·개인정보처리방침 정비가 끝나지
않았습니다. **켜기 전에 끝나야 할 것**은 `scripts/DEPLOY.md` 의 오픈 전 점검
목록에 있습니다.

## 공지사항은 노션에서 씁니다

노션 데이터베이스에 글을 쓰고 상태를 `게시완료` 로 바꾸면 사이트에 나갑니다.
**연결 완료 (2026-08-20)** — Secrets 두 개가 등록돼 있고 `[fetch-news] N건을
news.json 에 반영했다.` 로그로 동작을 확인했습니다.

⚠️ **반영 시각은 보장되지 않습니다.** `cron: */15` 로 설정했지만 GitHub 은
공개 저장소의 예약 실행을 부하에 따라 미룹니다 — 실측(2026-08-20) **39~68분**
간격. 크론 주기를 줄여도 해결되지 않습니다. **즉시 반영은 Actions →
`deploy.yml` → `Run workflow` 뿐이고 1~2분 걸립니다.**

개발자용 설명은 `scripts/NOTION-NEWS-SETUP.md`, 비개발자용 단계별 안내는
[`관리자-할일.md`](관리자-할일.md) 1단계에 있습니다.
