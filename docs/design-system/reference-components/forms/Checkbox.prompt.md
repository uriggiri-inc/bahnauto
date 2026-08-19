동의 항목과 복수 선택(가능 시간대 등)에 쓴다. `required`면 "(필수)", 아니면 "(선택)" 접두가 자동으로 붙는다.

```jsx
<Checkbox id="privacy" required label="개인정보 수집·이용 동의" description="수집 항목: 성함·연락처 / 목적: 도입 상담 / 보유 기간: 상담 종료 후 6개월" />
<Checkbox id="mkt" label="마케팅 정보 수신 동의" />
```

- 마케팅 동의는 **사전 체크 금지**.
- 필수 동의 미체크 시 제출 버튼 disabled + 사유 텍스트 안내.
