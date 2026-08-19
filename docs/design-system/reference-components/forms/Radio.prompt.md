선택지가 3개 이하로 짧을 때 쓰는 카드형 라디오.

```jsx
<Radio name="move" columns={3} value={v} onChange={e=>setV(e.target.value)} options={['자차','대중교통','도보']} />
```
