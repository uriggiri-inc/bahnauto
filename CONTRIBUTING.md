# 기여 가이드

상세 문서는 [`docs/`](docs/) 에 있습니다.

| 상황 | 읽을 문서 |
|---|---|
| 처음 참여합니다 | [docs/onboarding.md](docs/onboarding.md) |
| 어느 브랜치에 어떻게 올릴지 모르겠습니다 | [docs/git-flow.md](docs/git-flow.md) |
| 배포·롤백·도메인이 궁금합니다 | [docs/deploy.md](docs/deploy.md) |

## 요약

```
main = 운영 사이트 (https://bahnauto.kr)

main에서 브랜치 따기 → 커밋 → push → PR → 자동 검사 통과 + 승인 1개 → Squash merge → 자동 배포
```

`main`에는 직접 push할 수 없습니다. 반드시 PR을 거칩니다.

브랜치 이름은 `feat/` `fix/` `content/` `chore/` 중 하나로 시작합니다.
HTML을 크게 뜯어고칠 예정이면 `redesign/<연-월>` 브랜치를 쓰세요 —
자세한 절차는 [docs/git-flow.md](docs/git-flow.md) 의 **패턴 B** 를 참고하세요.
