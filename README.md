# bahnauto.kr

(주)우리끼리 공식 홈페이지. 정적 HTML로 작성되어 GitHub Pages로 배포됩니다.

## 구조

```
index.html          단일 랜딩 페이지 (hero / 회사소개 / 사업영역 / 문의)
assets/style.css    스타일 (라이트·다크 모드 대응)
assets/favicon.svg  파비콘
CNAME               커스텀 도메인 (bahnauto.kr)
robots.txt          크롤러 설정
sitemap.xml         사이트맵
.nojekyll           Jekyll 빌드 비활성화
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
python3 -m http.server 8000
# http://localhost:8000
```

## 내용 채우기

`index.html` 안의 `<!-- TODO: ... -->` 주석과 "준비 중" 표기를 실제 정보로 교체하면 됩니다.

## 문서

| 문서 | 내용 |
|---|---|
| [docs/onboarding.md](docs/onboarding.md) | 새 팀원 시작 가이드 |
| [docs/git-flow.md](docs/git-flow.md) | 브랜치 전략 — 작은 수정부터 전면 개편까지 |
| [docs/deploy.md](docs/deploy.md) | 배포·롤백·도메인·HTTPS 운영 |
