import { FAQ_GROUPS } from "@/content/faq";
import { absoluteUrl } from "./seo";

/**
 * `/faq` 의 FAQPage 구조화 데이터 (SEO 감사 A7 · 현황판 X-14).
 *
 * ── 화면 데이터에서 그대로 파생시킨다 ──
 * 질문·답변을 손으로 다시 적지 않고 `FAQ_GROUPS` 를 돌린다. 마크업 문장이 화면
 * 문장과 다르면 구글이 스팸 신호로 읽는다 — 손으로 복사해 두면 한쪽만 고쳐지는
 * 순간 그 상태가 된다. (실제로 PR #8 이 `바로출동서비스` → `방문관리 서비스` 로
 * 두 답변을 고쳤다. 파생시켜 두면 이런 개정이 자동으로 따라온다.)
 *
 * `formatCopy` 는 문장 사이에 `<br />` 만 넣고 **글자를 바꾸지 않으므로** 원문
 * 문자열이 화면에 보이는 문장과 같다.
 *
 * ── 24문항 전부를 넣는 근거 ──
 * `FaqTabs` 는 비활성 묶음을 DOM 에서 빼지 않고 `hidden` 으로만 감추고,
 * `FaqList` 는 `<details>` 라 닫힌 답변도 HTML 에 남는다. 즉 24문항의 질문과
 * 답변이 전부 응답 HTML 에 있다 — 마크업에만 있고 화면에는 없는 상태가 아니다.
 * ⚠️ 두 컴포넌트 중 하나라도 조건부 렌더(`{on && …}`)로 바뀌면 이 함수가 내는
 *    범위도 함께 좁혀야 한다. 그대로 두면 없는 내용을 신고하는 셈이 된다.
 *
 * ── 기대치를 부풀리지 않는다 ──
 * 구글은 2023년부터 FAQ **리치결과**(검색결과에 질문이 펼쳐지는 형태)를 정부·보건
 * 사이트로 제한했다. 이 마크업으로 그 형태가 나오지는 않는다. 그래도 넣는 이유는
 * 빙·네이버가 여전히 참고하고, 페이지가 무엇을 다루는지 알리는 신호로는 계속
 * 쓰이기 때문이다. 리치결과를 기대하고 넣는 것이 아니다.
 *
 * ⚠️ `SEARCH_OPEN = false` 인 동안은 색인 자체가 막혀 아무 효과가 없다.
 *    이 저장소에는 `_headers` 같은 이중 방어가 없고 그 한 줄이 유일한 스위치다
 *    (`lib/seo.ts`). 검색 공개(X-07) 이후부터 의미를 갖는다.
 */
export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl("/faq"),
    mainEntity: FAQ_GROUPS.flatMap((g) => g.items).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
