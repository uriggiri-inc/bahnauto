전 페이지 공통 sticky GNB. 메인 내비(15px/500)와 유틸리티(13px/400 + 구분선)의 위계를 반드시 분리한다.

```jsx
<Header logoSrc="assets/logo/logo-horizontal.svg" active="/system" onNavigate={setRoute} />
<Header logoSrc="assets/logo/logo-horizontal.svg" compact onNavigate={setRoute} />
```

- 앱 로그인 링크는 유틸리티에만 두고, 근처에 "계약 고객 전용" 문구가 함께 보여야 한다.
