# 문서

`bahnauto.kr` 홈페이지 개발·운영 문서입니다.

| 문서 | 내용 |
|---|---|
| [onboarding.md](onboarding.md) | 새 팀원 시작 가이드 — 권한 받기부터 첫 PR까지 |
| [git-flow.md](git-flow.md) | 브랜치 전략 — 작은 수정부터 전면 개편까지 |
| [deploy.md](deploy.md) | 배포·롤백·도메인·HTTPS 운영 정보 |

## 30초 요약

```
main = 운영 사이트 (https://bahnauto.kr)

작업할 때:
  main에서 브랜치 따기 → 커밋 → push → PR → 검사 통과 + 승인 1개 → Squash merge → 자동 배포

main에 직접 push는 막혀 있습니다. 반드시 PR을 거칩니다.
```
