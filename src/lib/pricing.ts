import {
  DUMMY_ADDON_PRICE,
  DUMMY_AREA_FACTOR,
  DUMMY_CONTENT,
  DUMMY_TYPE_FACTOR,
  DUMMY_VISIT_PRICE,
} from "@/content/dummy";

/**
 * 요금 데이터 — 단일 정본.
 *
 * PRD §10.4 는 `content/pricing.json` 분리를 요구한다(마케팅이 배포 없이 수정).
 * 1차에서는 타입 안전성을 위해 TS 모듈로 두되, **금액은 이 파일과
 * `content/dummy.ts` 두 곳에만** 존재하게 해서 나중에 JSON 으로 빼기 쉽게 한다.
 *
 * ⚠️ 지금 금액은 전부 **가짜**다(§13-B2 요금 체계 미확정). 화면 설계를 위해
 *    `content/dummy.ts` 의 값을 끌어다 쓰고, 페이지 상단에 샘플 배너를 띄운다.
 *
 * **실제 요금이 확정되면** `content/dummy.ts` 의 값을 실제 값으로 바꾸고
 * `DUMMY_CONTENT` 를 false 로 내린다. 그러면 배너가 사라지고 값은 그대로 쓰인다.
 */

/** 금액을 화면에 띄울 수 있는가. 더미 모드에서도 띄우되 배너로 사실을 밝힌다 */
export const PRICING_READY = true;

export type VisitPlan = {
  id: string;
  label: string;
  /** 주간 방문 횟수 */
  perWeek: number;
  /** 월 기본 이용료(원, VAT 별도) */
  monthly: number | null;
};

export type StoreType = {
  id: string;
  label: string;
  /** 기본료 대비 배수 */
  factor: number | null;
};

export type AreaBand = {
  id: string;
  label: string;
  /** 병기용 평 환산 — 점주는 ㎡ 보다 평으로 생각한다 */
  note: string;
  factor: number | null;
};

export type AddOn = {
  id: string;
  label: string;
  desc: string;
  monthly: number | null;
};

/** 더미 모드가 아니면 값을 비워 둔다 — 실수로 옛 더미가 남지 않게 */
const price = (id: string) => (DUMMY_CONTENT ? (DUMMY_VISIT_PRICE[id] ?? null) : null);
const typeFactor = (id: string) => (DUMMY_CONTENT ? (DUMMY_TYPE_FACTOR[id] ?? null) : null);
const areaFactor = (id: string) => (DUMMY_CONTENT ? (DUMMY_AREA_FACTOR[id] ?? null) : null);
const addonPrice = (id: string) => (DUMMY_CONTENT ? (DUMMY_ADDON_PRICE[id] ?? null) : null);

/** 방문 횟수 — PRD §7.5 계산기 입력 */
export const VISIT_PLANS: readonly VisitPlan[] = [
  { id: "w1", label: "주 1회", perWeek: 1, monthly: price("w1") },
  { id: "w2", label: "주 2회", perWeek: 2, monthly: price("w2") },
  { id: "w3", label: "주 3회", perWeek: 3, monthly: price("w3") },
  { id: "w5", label: "주 5회", perWeek: 5, monthly: price("w5") },
  { id: "w7", label: "매일", perWeek: 7, monthly: price("w7") },
];

/** 업종 — PRD §7.6 상담 폼 선택지와 값을 맞춘다(폼 사전 채움에 그대로 넘긴다) */
export const STORE_TYPES: readonly StoreType[] = [
  { id: "kids", label: "무인키즈카페", factor: typeFactor("kids") },
  { id: "icecream", label: "무인아이스크림", factor: typeFactor("icecream") },
  { id: "laundry", label: "무인세탁", factor: typeFactor("laundry") },
  { id: "stationery", label: "무인문구", factor: typeFactor("stationery") },
  { id: "study", label: "무인스터디카페", factor: typeFactor("study") },
  { id: "etc", label: "기타", factor: typeFactor("etc") },
];

/** 면적 구간 — REVIEW-001 F-8: 변수를 계산기 **안으로** 넣어야 결과가 신뢰를 얻는다 */
export const AREA_BANDS: readonly AreaBand[] = [
  { id: "a1", label: "33㎡ 이하", note: "10평 이하", factor: areaFactor("a1") },
  { id: "a2", label: "33~66㎡", note: "10~20평", factor: areaFactor("a2") },
  { id: "a3", label: "66~99㎡", note: "20~30평", factor: areaFactor("a3") },
  { id: "a4", label: "99㎡ 초과", note: "30평 초과", factor: areaFactor("a4") },
];

/** 추가 관리 옵션. 기본 포함인지 별도 과금인지도 §13-B 확정 대상이다 */
export const ADD_ONS: readonly AddOn[] = [
  {
    id: "callcenter",
    label: "고객센터 응대",
    desc: "매장 대표번호 응대 대행",
    monthly: addonPrice("callcenter"),
  },
  {
    id: "stock",
    label: "재고·발주 대행",
    desc: "재고 실사 및 발주 대행",
    monthly: addonPrice("stock"),
  },
  {
    id: "admin",
    label: "행정 업무",
    desc: "계약·갱신 일정 관리",
    monthly: addonPrice("admin"),
  },
];

/** 주간 횟수 → 월 방문 횟수. 4주로 세면 실제보다 적게 나온다(52주/12개월) */
export function monthlyVisits(perWeek: number) {
  return Math.round((perWeek * 52) / 12);
}

/** 3자리 구분 — PRD §7.5 AC */
export function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export type Selection = {
  visit: string;
  store: string;
  area: string;
  addOns: readonly string[];
};

export type Estimate = {
  /** 기본료 × 업종 × 면적 */
  base: number;
  /** 선택한 옵션 합계 */
  options: number;
  total: number;
};

/**
 * 예상 월 이용료.
 *
 * 하나라도 값이 없으면 **계산하지 않고 null 을 돌려준다.** 빠진 변수를 1 로 가정하고
 * 계산하면 그럴듯한 금액이 나오는데, 그 금액은 아무 근거가 없다.
 * 값이 없으면 없다고 말하는 편이 낫다.
 */
export function estimate(sel: Selection): Estimate | null {
  const plan = VISIT_PLANS.find((v) => v.id === sel.visit);
  const type = STORE_TYPES.find((t) => t.id === sel.store);
  const band = AREA_BANDS.find((a) => a.id === sel.area);

  if (!plan?.monthly || !type?.factor || !band?.factor) return null;

  // 백원 단위로 끊는다. 원 단위까지 보여주면 정밀해 보이지만 실제로는 추정치다.
  const base = Math.round((plan.monthly * type.factor * band.factor) / 100) * 100;

  let options = 0;
  for (const id of sel.addOns) {
    const found = ADD_ONS.find((o) => o.id === id);
    if (found?.monthly) options += found.monthly;
  }

  return { base, options, total: base + options };
}

/**
 * 선택 조건을 상담 폼으로 넘기는 쿼리스트링.
 * REVIEW-001 F-4 의 전환 사다리 — 계산기를 조작한 사람을 그냥 보내지 않는다.
 */
export function toContactQuery(sel: Selection) {
  const q = new URLSearchParams({ visits: sel.visit, type: sel.store, area: sel.area });
  if (sel.addOns.length) q.set("options", sel.addOns.join(","));
  return q.toString();
}
