상담 폼 / 매니저 지원서의 모든 입력을 감싸는 필드. 라벨 색에 `--color-text-muted`(3.1:1)를 쓰지 않는다.

```jsx
<Field label="연락처" required htmlFor="tel" error="올바른 휴대폰 번호를 입력해 주세요">
  <TextInput id="tel" invalid inputMode="numeric" placeholder="010-0000-0000" />
</Field>
<Field label="문의 내용" htmlFor="msg" hint="최대 500자">
  <TextInput id="msg" multiline placeholder="매장 상황을 알려주세요" />
</Field>
```
