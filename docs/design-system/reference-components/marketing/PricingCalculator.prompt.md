`/pricing` 과 홈 요금 섹션의 핵심 인터랙션. 금액 옆 `VAT 별도` 는 예외 없이 노출된다.

```jsx
<PricingCalculator defaultPlanId="w3" plans={pricing.plans}
  onSimulate={id=>gtag('event','pricing_simulate',{plan_id:id})}
  onSubmit={id=>go('/contact?visits='+id)} />
```

- `monthly: 0` 이면 자동으로 "문의" 폴백 — 실요금 미확정 상태에서도 안전하다.
- 선택 상태를 URL 쿼리에 반영해 링크 공유가 되게 한다.
