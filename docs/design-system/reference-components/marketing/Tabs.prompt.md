서비스 6종 영역에 쓴다. 탭 6개는 모바일 가로폭에서 파편화되므로 반드시 `mode="accordion"` 으로 전환한다.

```jsx
<Tabs mode={isMobile?'accordion':'tabs'} items={[{id:'care',label:'체계적인 매장 관리',content:<FeatureCard .../>}]} />
```
