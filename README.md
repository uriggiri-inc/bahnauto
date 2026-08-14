# bahnauto.kr

(주)우리끼리 공식 홈페이지. 정적 HTML로 작성되어 GitHub Pages로 배포됩니다.

## 구조

```
index.html            /            홈
about.html            /about       회사소개
service.html          /service     사업영역
contact.html          /contact     문의
404.html                           없는 경로일 때

assets/style.css      전체 스타일 (라이트·다크 모드 대응)
assets/site.js        공통 스크립트
assets/favicon.svg    파비콘

serve.py              로컬 미리보기 서버
tools/check-pages.py  페이지 검사 (CI에서도 실행)

CNAME                 커스텀 도메인 (bahnauto.kr) — 삭제 금지
.nojekyll             Jekyll 빌드 비활성화 — 삭제 금지
robots.txt            크롤러 설정
sitemap.xml           사이트맵
```

## 배포

`main` 브랜치에 병합되면 GitHub Pages가 자동으로 반영합니다. 별도 빌드 과정은 없습니다.

**`main`에는 직접 push할 수 없습니다.** 브랜치를 따서 PR을 만들어주세요.

```bash
git checkout main && git pull
git checkout -b content/내용-수정
git add -A && git commit -m "내용 수정"
git push -u origin content/내용-수정
gh pr create --fill
```

## 로컬 확인

```bash
python3 serve.py        # http://localhost:8000
```

`python3 -m http.server` 대신 이 스크립트를 쓰세요. GitHub Pages와 동일하게
확장자 없는 경로(`/about`)를 처리하고, 없는 경로는 `404.html`을 보여줍니다.

## 내용 채우기

`index.html` 안의 `<!-- TODO: ... -->` 주석과 "준비 중" 표기를 실제 정보로 교체하면 됩니다.

## 문서

| 문서 | 내용 |
|---|---|
| [docs/onboarding.md](docs/onboarding.md) | 새 팀원 시작 가이드 |
| [docs/git-flow.md](docs/git-flow.md) | 브랜치 전략 — 작은 수정부터 전면 개편까지 |
| [docs/deploy.md](docs/deploy.md) | 배포·롤백·도메인·HTTPS 운영 |
