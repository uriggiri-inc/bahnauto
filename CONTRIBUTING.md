# 기여 가이드

**반오토(BahnAuto)** 서비스 홈페이지(`bahnauto.kr`) 저장소입니다. 운영사는 (주)우리끼리입니다.

> **2026-08-19** 손으로 만든 정적 HTML 에서 **Next.js** 로 교체했습니다.
> 이전 `docs/adding-pages.md`·`onboarding.md`·`git-flow.md`·`deploy.md` 는 그
> 방식을 설명하던 문서라 함께 지웠습니다 — 남겨 두면 없는 파일을 찾게 됩니다.
> 바뀐 구조는 [`README.md`](README.md) 에, 작업 규칙은
> [`CLAUDE.md`](CLAUDE.md) 에 있습니다.

## 먼저 읽을 것

| 상황 | 문서 |
|---|---|
| **처음 참여합니다 / 구조가 궁금합니다** | [README.md](README.md) |
| **무엇을 해도 되고 안 되는지** (보안·브랜드·콘텐츠 규칙) | [CLAUDE.md](CLAUDE.md) |
| 배포·롤백·오픈 전 점검 | [scripts/DEPLOY.md](scripts/DEPLOY.md) |
| 공지사항을 올려야 합니다 | [scripts/NOTION-NEWS-SETUP.md](scripts/NOTION-NEWS-SETUP.md) |
| 색·글자 크기 등 디자인 토큰 | [docs/design-system/](docs/design-system/) |

`CLAUDE.md` 는 이름 그대로 AI 에이전트용 문서로 시작했지만 **사람이 읽어도
같은 규칙**입니다. §1 보안 규칙은 예외 없이 우선합니다.

## 흐름

```
main = 운영 사이트 (https://bahnauto.kr)

main에서 브랜치 따기 → 커밋 → push → PR
  → 자동 검사 4종 통과 + 승인 1개 → Squash merge → 자동 배포
```

## 커밋 전에 반드시 통과시킬 것

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build:static
```

PR 검사(`.github/workflows/pr-check.yml`)가 같은 네 가지를 돌립니다. 로컬에서
먼저 통과시키면 PR 이 빨간불로 왕복하지 않습니다.

**마지막 줄을 빠뜨리지 마세요.** `npm run build` 는 통과하는데 `build:static`
만 실패하는 경우가 실제로 있었습니다. 배포는 정적 경로로 빌드합니다.

## 콘텐츠를 고칠 때

카피는 대부분 `src/content/` 에 모여 있습니다. 화면 파일(`.tsx`)에 문구를 직접
적기 전에 그쪽에 자리가 있는지 먼저 보세요.

**표시광고법 관련 규칙이 있습니다**(`CLAUDE.md` §5). 검증되지 않은 실적 수치·
후기를 쓸 수 없고, 금지어 목록이 있습니다. 요금·실적·후기는 지금 전부 샘플
데이터이고 `src/content/dummy.ts` 의 게이트로 "샘플 데이터" 띠가 함께 붙습니다.

## 사람에게 물어봐야 하는 것

되돌리기 어렵거나 외부에 영향을 주는 일은 혼자 결정하지 않습니다
(`CLAUDE.md` §1.3).

- `main` 병합·태그·배포
- 도메인·DNS 변경
- 파일·디렉터리 삭제, `git reset --hard`, `--force` 계열
- 새 외부 서비스 연동 (계정 생성·토큰 발급)
- **`SEARCH_OPEN` 을 `true` 로 바꾸는 것** — 검색 노출은 한 번 열리면 되돌리는
  데 시간이 걸립니다
