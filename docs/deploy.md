# 배포 · 운영

## 배포 구조

```
main 브랜치 push
      ↓
GitHub Pages 자동 빌드 (약 1분)
      ↓
https://bahnauto.kr
```

**배포 명령이 따로 없습니다.** `main`에 병합되면 GitHub Pages가 저장소 루트를 그대로 서빙합니다.
빌드 도구(webpack, vite 등)를 쓰지 않는 순수 정적 HTML이라 가능한 구조입니다.

배포 상태는 저장소 **Actions** 탭의 `pages-build-deployment` 에서 확인합니다.

## CI (자동 검사)

`main`으로 향하는 PR에서 두 가지가 자동으로 돕니다. 설정은 `.github/workflows/pr-check.yml`.

| 검사 | 도구 | 내용 |
|---|---|---|
| HTML 문법 검사 | HTMLHint | 닫히지 않은 태그, 중복 id, 잘못된 속성 |
| 링크 검사 | `tools/check-links.py` | 깨진 내부 링크 + `CNAME`·`.nojekyll`·`404.html` 존재 확인 |

링크 검사는 네트워크를 쓰지 않습니다. 외부 사이트 사정으로 CI가 깨지는 일이 없고,
`/about` 처럼 확장자 없는 경로도 GitHub Pages와 같은 규칙으로 해석합니다.
로컬에서도 그대로 돌려볼 수 있습니다.

```bash
python3 tools/check-links.py
```

**둘 다 통과해야 병합 버튼이 활성화됩니다.**

실패하면 Actions 탭에서 해당 잡의 로그를 열어보세요. 어느 파일 몇 번째 줄인지 나옵니다.
수정 후 같은 브랜치에 push하면 자동으로 다시 검사합니다.

## 브랜치 보호 규칙

`main`에 걸린 규칙입니다.

| 항목 | 설정 |
|---|---|
| 직접 push | **금지** |
| PR 승인 | **1개 이상 필요** |
| 상태 검사 | HTML 문법 검사 + 링크 검사 통과 필수 |
| 최신 main 반영 | 필수 (병합 전 main과 동기화) |
| 리뷰 댓글 | 모두 해결되어야 병합 가능 |
| force push / 브랜치 삭제 | 금지 |
| 새 커밋 시 기존 승인 | 자동 무효화 |

Org Owner는 긴급 시 우회할 수 있게 열어뒀습니다 (`enforce_admins: false`).
**긴급 상황이 아니면 쓰지 마세요.**

## 병합 방식

**Squash and merge만 허용**합니다. 병합 커밋과 rebase 병합은 꺼져 있습니다.
병합된 브랜치는 자동으로 삭제됩니다.

## 롤백

### 방법 1 — GitHub 웹에서 (권장)

문제가 된 PR을 열고 우측 하단 **`Revert`** 버튼 → 되돌리기 PR이 자동 생성 → 병합.

### 방법 2 — 커맨드라인

```bash
git checkout main && git pull
git log --oneline -10              # 되돌릴 커밋 해시 확인
git revert <해시>
git push origin HEAD:revert-hotfix
gh pr create --fill
```

`git reset --hard` 는 쓰지 마세요. main은 force push가 막혀 있고, 히스토리를 지우는 건 위험합니다.
**`git revert`는 되돌리는 새 커밋을 만들기 때문에 안전합니다.**

## 경로 규칙

루트의 `.html` 파일 하나가 URL 하나입니다. GitHub Pages에서 실측한 동작:

| 파일 | 접속 URL | 결과 |
|---|---|---|
| `service.html` | `/service` | 200 — 리다이렉트 없음 |
| `service.html` | `/service.html` | 200 |
| `service/index.html` | `/service/` | 200 |
| `service/index.html` | `/service` | 301 → `/service/` |

리다이렉트가 없는 **`service.html` 방식**을 씁니다.
하위 경로(`/service/consulting`)가 필요해지면 그때 디렉터리 방식으로 바꾸면 됩니다.

없는 경로는 `404.html` 이 404 상태로 응답합니다.

## 도메인 · HTTPS

| 항목 | 값 |
|---|---|
| 도메인 | `bahnauto.kr` (가비아 등록) |
| 네임서버 | `ns.gabia.co.kr`, `ns1.gabia.co.kr`, `ns.gabia.net` |
| 커스텀 도메인 설정 | 저장소 루트의 `CNAME` 파일 |
| HTTPS | Let's Encrypt 인증서, GitHub 자동 발급·갱신 |
| HTTP 접속 | HTTPS로 301 리다이렉트 |
| `www.bahnauto.kr` | apex(`bahnauto.kr`)로 301 리다이렉트 |

### DNS 레코드

가비아 **My가비아 → DNS 관리툴 → bahnauto.kr → DNS 설정**

| 타입 | 호스트 | 값 | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |
| CNAME | `www` | `uriggiri-inc.github.io.` | 600 |

A 레코드 4개는 GitHub Pages의 고정 IP입니다. 장애 대비로 4개 모두 유지합니다.

> ⚠️ **`iot`, `iot-app`, `app` 레코드는 다른 서비스용입니다. 건드리지 마세요.**

### 인증서가 깨졌을 때

`CNAME` 파일이 지워지거나 DNS가 바뀌면 인증서가 무효화됩니다. 복구 절차:

1. `CNAME` 파일에 `bahnauto.kr` 한 줄이 있는지 확인
2. 저장소 **Settings → Pages** 에서 Custom domain을 지웠다가 다시 입력 → Save
3. DNS 검사 통과를 기다림 (수 분)
4. **Enforce HTTPS** 체크

## 제약사항

| 항목 | 한도 |
|---|---|
| 저장소 크기 | 1GB |
| 사이트 크기 | 1GB |
| 월 트래픽 | 100GB (soft limit) |
| 시간당 빌드 | 10회 |

서버 코드를 실행할 수 없습니다. **문의 폼은 외부 서비스가 필요합니다** — Formspree, Google Forms, 채널톡 등.

## 다른 플랫폼으로 옮겨야 한다면

이런 요구가 생기면 GitHub Pages로는 한계입니다.

- PR별 미리보기 URL이 필요할 때
- 빌드 과정이 필요할 때 (Tailwind, Astro, Next.js 등)
- 서버 로직·리다이렉트 규칙이 필요할 때
- 국내 접속 속도를 더 끌어올려야 할 때

**Cloudflare Pages** 로 옮기면 위 항목이 전부 해결되고, 저장소는 그대로 씁니다.
DNS 레코드만 교체하면 되므로 도메인 이전 없이 30분 안에 끝납니다.
