/**
 * 상담 폼이 쓰는 **선택지 목록**.
 *
 * ── 원래는 요금 계산기의 데이터였다 (2026-08-27 정리) ──
 * 이 파일에는 방문 횟수별 기본료·업종 배수·면적 배수와 `estimate()` 가 있었다.
 * 요금 계산기를 **폐기**(사용자 확정 2026-08-27, "제거하고 상담에서 안내로 대체")
 * 하면서 금액과 계산 함수를 전부 지웠다. 남은 것은 `/contact` 가 옛 계산기 링크로
 * 들어온 방문자의 선택 조건을 **문의 내용에 문장으로 옮길 때** 쓰는 id → 라벨
 * 대응표뿐이다.
 *
 * 그래서 이 파일에는 이제 **금액이 하나도 없다.** 사이트에 남은 공개 금액은
 * `content/dummy.ts` 의 `DUMMY_BASE_PRICE`(운영 대시보드 월 요금) 하나다.
 *
 * ⚠️ 계산기를 다시 만들 일이 생기면 여기에 금액을 되살리지 말고 처음부터 설계한다.
 *    지금 요금 구조는 "기본료 + 금액 비공개 옵션" 이라 곱셈식 견적이 성립하지 않는다.
 */

export type PricingOption = {
  /** 옛 계산기 쿼리스트링에 실렸던 값 — 링크 호환을 위해 바꾸지 않는다 */
  id: string;
  label: string;
};

/** 방문 횟수 */
export const VISIT_PLANS: readonly PricingOption[] = [
  { id: "w1", label: "주 1회" },
  { id: "w2", label: "주 2회" },
  { id: "w3", label: "주 3회" },
  { id: "w5", label: "주 5회" },
  { id: "w7", label: "매일" },
];

/** 업종 — PRD §7.6 상담 폼 선택지와 값을 맞춘다(폼 사전 채움에 그대로 넘긴다) */
export const STORE_TYPES: readonly PricingOption[] = [
  { id: "kids", label: "무인키즈카페" },
  { id: "icecream", label: "무인아이스크림" },
  { id: "laundry", label: "무인세탁" },
  { id: "stationery", label: "무인문구" },
  { id: "study", label: "무인스터디카페" },
  { id: "etc", label: "기타" },
];

/** 면적 구간 — 점주는 ㎡ 보다 평으로 생각하므로 라벨에 함께 적는다 */
export const AREA_BANDS: readonly PricingOption[] = [
  { id: "a1", label: "33㎡ 이하(10평 이하)" },
  { id: "a2", label: "33~66㎡(10~20평)" },
  { id: "a3", label: "66~99㎡(20~30평)" },
  { id: "a4", label: "99㎡ 초과(30평 초과)" },
];

/** 추가 관리 옵션 */
export const ADD_ONS: readonly PricingOption[] = [
  { id: "callcenter", label: "고객센터 응대" },
  { id: "stock", label: "재고·발주 대행" },
  { id: "admin", label: "행정 업무" },
];
