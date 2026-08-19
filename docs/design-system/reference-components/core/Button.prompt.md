Primary CTA와 모든 보조 액션에 쓰는 표준 버튼 — 1순위 전환(도입 상담)에는 항상 `variant="primary"`.

```jsx
<Button variant="primary" size="lg">무료 도입 상담 신청</Button>
<Button variant="secondary">관리 시스템 보기</Button>
<Button variant="tel" size="md">전화 상담</Button>
<Button variant="primary" loading full>제출 중</Button>
```

- hover는 어두워지는 방향(`#003BA3`) + `translateY(-1px)`. 밝아지지 않는다.
- 다크 섹션 위에서는 `variant="onDark"` (흰 배경 + 블루 텍스트).
- `loading`이면 자동으로 disabled — 폼 중복 제출 방지 요건.
