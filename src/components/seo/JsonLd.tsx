/**
 * 구조화 데이터(JSON-LD) 삽입 — **화면에는 아무것도 그리지 않는다.**
 *
 * ── `dangerouslySetInnerHTML` 을 쓰는 이유 ──
 * JSON-LD 의 표준 자리는 `<script type="application/ld+json">` 안의 원문 JSON 이고,
 * React 는 `<script>` 의 자식 텍스트를 그대로 내보내지 않는다(경고를 낸다).
 * 이 API 외에 방법이 없다.
 *
 * ── 왜 §1.1 S5 위반이 아닌가 ──
 * `CLAUDE.md` §1.1 S5 가 금지하는 것은 **사용자 입력**을 이 API 에 넘기는 것이다.
 * 여기 들어오는 값은 `content/*.ts` 의 빌드 타임 상수뿐이고 폼·쿼리스트링·외부
 * 응답이 닿는 경로가 없다. 그래도 두 겹으로 막아 둔다:
 *   1. `JSON.stringify` 가 값을 JSON 문자열 안에 가둔다
 *   2. `<` 를 `\u003c` 로 바꿔 문자열 안의 `</script>` 가 태그를 닫지 못하게 한다
 *      — `JSON.stringify` 는 `<` 와 `/` 를 이스케이프하지 않으므로 이 한 줄이 없으면
 *      값에 `</script>` 가 들어오는 순간 스크립트가 끊긴다
 *
 * ⚠️ **사용자 입력이 여기 닿게 만들지 않는다.** 후기·문의 내용을 구조화 데이터로
 *    내보내야 하는 날이 오면 이 컴포넌트를 그냥 재사용하지 말고 §1.1 S5 부터
 *    다시 검토한다.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
