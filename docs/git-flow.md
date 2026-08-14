# 브랜치 전략

**반오토(BahnAuto)** 서비스 홈페이지 저장소의 브랜치 규칙입니다.

## 원칙

| 브랜치 | 역할 | 규칙 |
|---|---|---|
| `main` | **운영 사이트** — 병합 즉시 `bahnauto.kr`에 반영 | 직접 push 금지. PR + 검사 통과 + 승인 1개 필수 |
| 작업 브랜치 | 모든 수정은 여기서 | 자유롭게 push. 병합되면 자동 삭제 |

`develop`, `release` 같은 장기 브랜치는 두지 않습니다. 릴리즈 주기가 없는 사이트라 관리 비용만 늘어납니다.
대신 **변경 규모에 따라 세 가지 패턴**을 씁니다.

---

## 패턴 A — 작은 수정 (대부분의 경우)

문구 교체, 색상 조정, 링크 수정, 섹션 하나 추가처럼 **하루 안에 끝나는 작업**.

```bash
git checkout main && git pull
git checkout -b content/service-intro

# ... 수정 ...
python3 serve.py          # http://localhost:8000 에서 확인

git add -A
git commit -m "서비스 소개 문구 실제 내용으로 교체"
git push -u origin content/service-intro
gh pr create --fill
```

브랜치 이름:

| 접두사 | 용도 | 예시 |
|---|---|---|
| `feat/` | 새 섹션·기능 | `feat/contact-form` |
| `fix/` | 버그 수정 | `fix/mobile-nav-overflow` |
| `content/` | 문구·이미지 | `content/service-intro` |
| `chore/` | 설정·문서 | `chore/update-readme` |

---

## 패턴 B — HTML 전면 개편 (혼자, 1~2주 이내)

**"기존 index.html을 통째로 갈아엎는"** 작업이 여기에 해당합니다.

### 브랜치 하나에 커밋을 쌓습니다

```bash
git checkout main && git pull
git checkout -b redesign/2026-08        # redesign/<연-월> 형식
```

이후 **작업 단위로 잘게 커밋**합니다. 한 번에 다 하고 커밋 하나로 올리지 마세요.
중간에 되돌리거나 리뷰어가 따라 읽기 어려워집니다.

```bash
git commit -m "새 헤더·네비게이션 마크업 교체"
git commit -m "히어로 섹션 레이아웃 개편"
git commit -m "주요 기능 카드 그리드 재작성"
git commit -m "푸터 운영사 표기사항 정리"
```

### 작업 중에도 수시로 push

```bash
git push -u origin redesign/2026-08     # 최초 1회
git push                                 # 이후
```

로컬에만 두면 PC 사고 시 전부 날아갑니다. **하루 작업이 끝나면 반드시 push**하세요.
아직 PR을 안 열었어도 push 자체는 아무 영향이 없습니다.

### 작업 중 main이 바뀌면 따라잡기

개편 중에 다른 사람이 main에 오타 수정 같은 걸 병합할 수 있습니다.
그대로 두면 나중에 충돌이 한꺼번에 터지므로, **2~3일에 한 번** 최신 main을 가져옵니다.

```bash
git checkout main && git pull
git checkout redesign/2026-08
git merge main          # 충돌 나면 여기서 해결
git push
```

> `rebase` 대신 `merge`를 쓰는 이유: 이미 원격에 push한 브랜치를 rebase하면 히스토리가 바뀌어
> `--force` push가 필요하고, 다른 사람이 같은 브랜치를 보고 있으면 꼬입니다.
> **혼자 쓰는 브랜치이고 아직 push 전이면 rebase도 괜찮습니다.**

### 완성되면 PR 하나로

```bash
gh pr create --title "홈페이지 전면 개편" --body "..."
```

PR 본문에 **before / after 스크린샷**을 꼭 넣어주세요. 변경량이 커서 diff만으로는 리뷰가 불가능합니다.
데스크톱·모바일 각각 찍으면 좋습니다.

병합은 **Squash and merge** 입니다. 개편 커밋 수십 개가 main에는 커밋 하나로 남습니다.

---

## 패턴 C — 여러 명이 함께 개편 (2주 이상)

개편 범위가 커서 두 명 이상이 나눠 작업하는 경우에만 씁니다.
**통합 브랜치**를 하나 만들고, 각자는 그 브랜치를 향해 PR을 보냅니다.

```
main
 └─ redesign/v2                    ← 통합 브랜치 (base)
     ├─ feat/v2-header             → PR to redesign/v2
     ├─ feat/v2-services-section    → PR to redesign/v2
     └─ feat/v2-contact-form        → PR to redesign/v2
```

```bash
# 통합 브랜치 최초 생성 (한 명이 1회)
git checkout main && git pull
git checkout -b redesign/v2
git push -u origin redesign/v2

# 각자 작업
git checkout redesign/v2 && git pull
git checkout -b feat/v2-header
# ... 작업 후 ...
gh pr create --base redesign/v2 --fill      # ← base 지정이 핵심
```

`redesign/v2`로 가는 PR은 **승인 없이 병합 가능**합니다 (보호 규칙은 `main`에만 걸려 있음).
가볍게 리뷰하고 빠르게 합치세요.

전부 끝나면 마지막에 `redesign/v2` → `main` PR을 한 번 엽니다. 이때만 정식 리뷰를 받습니다.

```bash
gh pr create --base main --head redesign/v2 --title "홈페이지 v2 전면 개편"
```

---

## 어떤 패턴을 쓸지

```
파일 1~2개, 하루 이내      → 패턴 A
index.html 통째로, 혼자     → 패턴 B      ← 지금 상황
여러 명이 나눠서, 2주 이상   → 패턴 C
```

애매하면 **패턴 B**로 시작하세요. 나중에 사람이 붙으면 그 브랜치를 그대로 통합 브랜치로 쓰면 됩니다.

---

## 대규모 수정할 때 주의할 것

### 파일을 통째로 갈아엎어도 됩니다

`index.html`을 처음부터 다시 써도 괜찮습니다. git이 이전 버전을 다 갖고 있어서 언제든 되돌릴 수 있습니다.
다만 **아래 파일은 건드리지 마세요.**

| 파일 | 이유 |
|---|---|
| `CNAME` | 지우면 `bahnauto.kr` 도메인 연결이 끊깁니다 |
| `.nojekyll` | 지우면 Jekyll이 개입해 일부 경로가 404가 됩니다 |
| `.github/workflows/` | CI 설정. 바꿔야 하면 별도 PR로 |

### 페이지를 추가·삭제할 때

루트의 `.html` 파일 하나가 URL 하나입니다 (`service.html` → `/service`).
추가하면 아래 세 곳을 **함께** 고쳐야 합니다. 빠뜨리면 CI 링크 검사에서 걸립니다.

1. 전 페이지의 헤더 `<nav class="nav">` 메뉴
2. 전 페이지의 푸터 `<nav class="footer-nav">` 메뉴
3. `sitemap.xml`

헤더·푸터가 페이지마다 복제돼 있는 건 정적 HTML이라 어쩔 수 없습니다.
페이지가 6~7개를 넘어가면 그때 정적 사이트 생성기(Astro, Eleventy) 도입을 검토하세요.

### 이미지·에셋

`assets/` 아래에 넣고, 커밋 전에 용량을 확인하세요.

```bash
du -sh assets/                    # 전체 크기
find assets -size +500k -ls       # 500KB 넘는 파일 찾기
```

- 사진은 **WebP**, 로고·아이콘은 **SVG** 를 권장합니다
- 개별 파일 1MB 이상은 피해주세요. GitHub Pages는 저장소 1GB / 월 100GB 트래픽 제한이 있습니다
- 원본 PSD·AI 파일은 커밋하지 마세요 (`.gitignore`에 추가)

### 충돌이 났을 때

```bash
git merge main
# CONFLICT (content): Merge conflict in index.html
```

당황하지 말고, 파일을 열어 `<<<<<<<` `=======` `>>>>>>>` 표시를 찾습니다.
`<<<<<<< HEAD` 아래가 **내 브랜치 내용**, `=======` 아래가 **main 내용**입니다.

전면 개편 중이라면 대부분 **내 쪽을 그대로 쓰는 게 맞습니다.**

```bash
git checkout --ours index.html    # 내 브랜치 버전 채택
git add index.html
git commit
```

단, main 쪽에 들어간 수정(오타 교정 등)이 사라지니, 그 내용을 새 마크업에 반영했는지 확인하세요.

---

## PR 체크리스트

병합 전에 확인합니다. PR 템플릿에도 같은 항목이 들어 있습니다.

- [ ] 로컬에서 확인 (`python3 serve.py`)
- [ ] 모바일 폭 375px에서 레이아웃 정상
- [ ] 라이트 / 다크 모드 양쪽 확인
- [ ] 서비스명(반오토)·운영사((주)우리끼리)·연락처 표기 오타 없음
- [ ] `CNAME`, `.nojekyll`, `404.html` 파일 그대로 있음
- [ ] 메뉴를 바꿨다면 전 페이지 헤더·푸터에 모두 반영
- [ ] before / after 스크린샷 첨부 (큰 변경일 때)

---

## 커밋 메시지

한국어로 **무엇을 왜 바꿨는지** 한 줄. 필요하면 빈 줄 뒤에 상세 설명.

```
주요 기능 카드를 3개에서 4개로 확장

기능이 추가되어 별도 카드로 분리했습니다.
```

`feat:` 같은 접두사는 강제하지 않습니다. 붙일 거면 브랜치 접두사와 맞춰주세요.
