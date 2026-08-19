import { Fragment } from "react";
import { formatKoreanLines } from "@/lib/typography";

/**
 * 한글 카피를 **문장 단위로 줄을 나눠** 그린다.
 *
 * ── 왜 이런 게 필요한가 (사용자 확정 2026-08-18) ──
 * 긴 리드가 한 덩어리로 흐르면 두 곳에서 읽기가 끊긴다:
 *   1. 두 문장이 한 줄에 이어 붙어 어디서 숨을 쉬어야 할지 모른다
 *   2. 「사장님이 하실 / 일과 반오토가」처럼 **한 의미 단위가 줄 끝에서 갈라진다**
 * `globals.css` 의 `word-break: keep-all` 은 어절 **내부**만 지키고,
 * `text-wrap: pretty` 는 마지막 줄 외톨이만 막는다. 둘 다 위 두 경우를 못 막는다.
 *
 * ── 문단이 아니라 줄이다 ──
 * 문장 사이에 여백을 두지 않는다(사용자 확정). 리드는 대개 두세 문장이라
 * 문단으로 완전히 떼면 성기게 보인다. `<br />` 로 줄만 바꿔 호흡을 만든다.
 *
 * ── 원문을 고치지 않는다 ──
 * 카피 문자열(`content/*.ts`)에는 줄바꿈 표시가 들어가지 않는다. 원문이 정본으로
 * 남아야 카피 검수와 법무 대조가 가능하고, 새로 추가되는 카피도 규칙에서 빠지지
 * 않는다. 계산은 `lib/typography.ts` 가 한다.
 */

/**
 * 문자열이면 조판을 적용하고, 그 밖(JSX·숫자·null)은 **그대로 통과**시킨다.
 *
 * 통과시키는 이유: `lead` 같은 prop 은 `ReactNode` 라 `<>…<strong>…</strong></>`
 * 가 들어올 수 있다. 그 안을 파고들어 문자열만 골라 바꾸면 링크·강조의 위치가
 * 조용히 어긋난다 — 손대지 않는 것이 맞다.
 */
export function formatCopy(node: React.ReactNode): React.ReactNode {
  if (typeof node !== "string") return node;

  const lines = formatKoreanLines(node);
  if (lines.length <= 1) return lines[0] ?? node;

  return lines.map((line, i) => (
    // 문장 순서가 키다 — 같은 문장이 두 번 나와도 자리로 구분된다
    <Fragment key={`${i}-${line.slice(0, 12)}`}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}
