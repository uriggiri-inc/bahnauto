# 개발 가이드

(주)우리끼리 홈페이지(`bahnauto.kr`) 개발 규칙입니다. 작업 전에 한 번 읽어주세요.

---

## 1. 전체 그림

```
로컬 작업 → feature 브랜치 push → PR 생성 → 자동 검사(CI) → 리뷰 → main 병합 → 자동 배포(CD)
                                                                              ↓
                                                                    https://bahnauto.kr
```

- **main 브랜치 = 운영 사이트입니다.** main에 병합되는 즉시 실제 사이트에 반영됩니다.
- 그래서 **main에 직접 push하지 않습니다.** 반드시 PR을 거칩니다.
- 별도 빌드 도구가 없는 순수 정적 HTML이라, 병합 후 1~2분이면 반영됩니다.

## 2. Git Flow — GitHub Flow 방식

`develop`/`release` 브랜치를 두는 전통적인 git-flow는 릴리즈 주기가 있는 제품용입니다.
이 사이트는 수정하면 바로 나가는 게 맞으므로 더 단순한 **GitHub Flow**를 씁니다.

### 브랜치 이름 규칙

| 접두사 | 용도 | 예시 |
|---|---|---|
| `feat/` | 새 섹션·기능 추가 | `feat/contact-form` |
| `fix/` | 버그 수정 | `fix/mobile-nav-overflow` |
| `content/` | 문구·이미지 등 내용 수정 | `content/company-intro` |
| `chore/` | 설정·문서·잡무 | `chore/update-readme` |

### 작업 순서

```bash
# 1. 최신 main에서 시작
git checkout main
git pull

# 2. 브랜치 생성
git checkout -b content/company-intro

# 3. 작업 후 로컬 확인
python3 -m http.server 8000     # http://localhost:8000

# 4. 커밋
git add -A
git commit -m "회사소개 문구 실제 내용으로 교체"

# 5. 푸시하고 PR 생성
git push -u origin content/company-intro
gh pr create --fill        # 또는 GitHub 웹에서 생성
```

### 커밋 메시지

한국어로 **무엇을 왜 바꿨는지** 한 줄로 적습니다. 필요하면 빈 줄 뒤에 상세 설명을 붙입니다.

```
사업영역 카드를 3개에서 4개로 확장

물류 부문이 추가되어 별도 카드로 분리했습니다.
```

접두사(`feat:` 등)를 강제하지는 않지만, 붙이고 싶으면 브랜치 접두사와 맞춰주세요.

## 3. Pull Request

- PR을 열면 **자동 검사(CI)** 가 돌아갑니다. HTML 문법과 깨진 링크를 확인합니다.
- 검사 통과 + **리뷰 승인 1개** 가 있어야 병합할 수 있습니다.
- 병합은 **Squash and merge** 를 사용합니다. main 히스토리가 PR 단위로 깔끔하게 남습니다.
- 병합 후 브랜치는 자동 삭제됩니다.

### 리뷰어가 볼 것

- 모바일(375px)에서 레이아웃이 깨지지 않는가
- 라이트/다크 모드 양쪽 다 읽히는가
- 회사 정보(상호·사업자번호·연락처)에 오타가 없는가
- 외부 링크가 살아있는가

## 4. 배포 (CD)

**GitHub Pages가 `main` 브랜치를 직접 서빙합니다.** 별도 배포 명령이 없습니다.

| 단계 | 담당 |
|---|---|
| PR 병합 | 사람 |
| 빌드·배포 | GitHub Pages 자동 (약 1분) |
| 결과 확인 | Actions 탭의 `pages-build-deployment` |

배포 상태는 저장소 **Actions** 탭에서 확인할 수 있습니다. 실패하면 초록 체크 대신 빨간 X가 뜹니다.

### 롤백

문제가 생기면 이전 상태로 되돌립니다.

```bash
git checkout main && git pull
git revert <문제_커밋_해시>
git push
```

`git revert`는 되돌리는 새 커밋을 만들기 때문에 히스토리가 안전합니다.
급할 때는 GitHub 웹에서 해당 PR을 열고 `Revert` 버튼을 눌러도 됩니다.

## 5. 건드리면 안 되는 파일

| 파일 | 이유 |
|---|---|
| `CNAME` | 커스텀 도메인 설정. 지우면 `bahnauto.kr` 연결이 끊깁니다 |
| `.nojekyll` | 지우면 Jekyll이 개입해 일부 파일이 무시될 수 있습니다 |

도메인이나 DNS를 바꿔야 하면 Owner에게 먼저 얘기해주세요.

## 6. 자주 겪는 문제

**푸시했는데 사이트에 반영이 안 돼요**
→ main에 병합됐는지 확인하세요. feature 브랜치 push만으로는 배포되지 않습니다.

**반영은 됐는데 화면이 그대로예요**
→ 브라우저 캐시입니다. `Cmd+Shift+R`(Mac) / `Ctrl+F5`(Windows)로 강력 새로고침하세요.

**main에 직접 push하려니 거부돼요**
→ 정상입니다. 브랜치 보호 규칙이 걸려 있습니다. PR을 만들어주세요.
