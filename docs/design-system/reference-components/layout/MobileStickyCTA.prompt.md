모바일 전 페이지에서 상담 진입점이 1탭 이내에 있도록 보장하는 하단 고정 바.

```jsx
<MobileStickyCTA visible={scrollY>400} onTel={()=>location.href='tel:'} onCta={()=>go('/contact')} />
```
