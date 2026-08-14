# 새 팀원 시작 가이드

`bahnauto.kr` 홈페이지 개발에 처음 참여할 때 순서대로 따라하면 됩니다. 30분이면 첫 PR까지 갑니다.

---

## 1. 계정 준비

1. **GitHub 계정**이 없다면 만듭니다 → https://github.com/signup
2. **2단계 인증(2FA)을 켭니다.** Organization 정책상 필수입니다.
   Settings → Password and authentication → Two-factor authentication
3. 초대 메일의 링크로 **`uriggiri-inc` Organization 초대를 수락**합니다.
4. Owner에게 **`web` 팀에 추가**해달라고 요청합니다. 이 팀이 저장소 쓰기 권한을 갖습니다.

권한이 제대로 붙었는지 확인:

```bash
gh auth login          # 브라우저로 로그인
gh api user/orgs --jq '.[].login'
# uriggiri-inc 가 보이면 정상
```

## 2. 개발 환경

필요한 건 **git과 브라우저뿐**입니다. Node.js나 빌드 도구는 필요 없습니다.

```bash
# macOS
brew install git gh

# 확인
git --version
gh --version
```

`gh` (GitHub CLI)는 필수는 아니지만 PR 만들 때 편합니다.

## 3. 저장소 받기

```bash
gh repo clone uriggiri-inc/bahnauto
cd bahnauto
```

또는 gh 없이:

```bash
git clone https://github.com/uriggiri-inc/bahnauto.git
cd bahnauto
```

git 사용자 정보를 설정해두세요.

```bash
git config user.name "이름"
git config user.email "본인@이메일"
```

## 4. 로컬에서 띄워보기

```bash
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 엽니다. 파일을 수정하고 새로고침하면 바로 반영됩니다.

> `index.html`을 파일 탐색기에서 더블클릭해 열어도 보이긴 하지만,
> 절대경로(`/assets/style.css`)가 깨지므로 **반드시 위 명령으로 서버를 띄워서** 확인하세요.

## 5. 프로젝트 구조

```
index.html              단일 랜딩 페이지 — 대부분의 작업이 여기서 일어납니다
assets/
  style.css             전체 스타일 (라이트·다크 모드 대응)
  favicon.svg           파비콘
docs/                   이 문서들
.github/workflows/      PR 자동 검사 설정
CNAME                   커스텀 도메인 — 건드리지 마세요
.nojekyll               Jekyll 비활성화 — 건드리지 마세요
robots.txt / sitemap.xml   검색엔진용
```

## 6. 첫 PR 만들어보기

```bash
# 1. 최신 main에서 브랜치 따기
git checkout main && git pull
git checkout -b chore/first-pr

# 2. 아무거나 작게 수정 (예: README 오타)

# 3. 커밋
git add -A
git commit -m "README 오타 수정"

# 4. push
git push -u origin chore/first-pr

# 5. PR 생성
gh pr create --fill
```

PR을 열면 자동 검사가 돕니다. 초록 체크가 뜨고 리뷰 승인 1개를 받으면 **Squash and merge** 로 병합합니다.
병합되면 1분 안에 https://bahnauto.kr 에 반영됩니다.

## 7. 다음으로 읽을 것

- [git-flow.md](git-flow.md) — 브랜치 전략. **HTML을 크게 수정할 예정이면 반드시 읽어주세요**
- [deploy.md](deploy.md) — 배포·롤백·도메인 운영 정보

---

## 꼭 기억할 것

| | |
|---|---|
| ❌ | `main`에 직접 push — 막혀 있습니다 |
| ❌ | `CNAME`, `.nojekyll` 파일 수정·삭제 — 사이트가 죽습니다 |
| ❌ | `git push --force` — 막혀 있고, 필요할 일도 없습니다 |
| ✅ | 브랜치 따고 → PR → 리뷰 → Squash merge |
| ✅ | 하루 작업 끝나면 브랜치 push (PR 안 열어도 됨) |
| ✅ | 큰 변경은 before/after 스크린샷 첨부 |

## 막혔을 때

| 증상 | 해결 |
|---|---|
| `git push`가 거부됨 (`protected branch`) | main에 직접 push한 것입니다. 브랜치를 따서 PR을 만드세요 |
| PR 검사가 빨간 X | Actions 탭 → 실패한 잡 → 로그에서 파일·줄 번호 확인 |
| 병합 버튼이 회색 | 승인 1개 또는 검사 통과가 남았습니다. PR 상단에 사유가 표시됩니다 |
| 사이트에 반영이 안 됨 | main에 병합됐는지 확인. 됐다면 `Cmd+Shift+R`로 캐시 강력 새로고침 |
| 권한이 없다고 나옴 | `web` 팀에 추가됐는지 Owner에게 확인 |
