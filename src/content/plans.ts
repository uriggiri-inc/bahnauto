/**
 * 요금제 3종 — 베이직 · 스탠다드 · 프리미엄.
 *
 * ── 구성은 확정, 금액은 잠정 ──
 * 어떤 기능이 어느 플랜에 들어가는지는 확정본이다. 반면 **월 요금은 임의로
 * 고정한 값**이라 근거가 없다. 그래서 금액만 `dummy.ts` 를 거친다 —
 * `DUMMY_CONTENT` 가 true 인 동안 "샘플 데이터" 배너가 함께 뜬다.
 *
 * ── 합산을 맞추려 하지 말 것 ──
 * 스탠다드 금액은 **묶음 총액**이다. 개별 옵션 단가를 더한 값과 맞지
 * 않는데, 잠정 가격이라 그렇다. 계산해서 고치지 않는다.
 *
 * ── 옵션 단가는 이 파일에 두지 않는다 ──
 * 기획이 바뀌어 `/pricing` 에서 **일부 옵션의 단가를 공개**하게 됐다(베이직·
 * 스탠다드 구성에 들어가는 두 개만). 그래도 단가는 여기가 아니라
 * `dummy.ts` 의 `DUMMY_OPTION_PRICE` 에 있다 — 금액에 근거가 없어 더미 게이트를
 * 함께 써야 하고, 비공개 옵션은 값 자체를 두지 않아야 새어 나갈 경로가 없다.
 *
 * 계산기형 견적(`PricingEstimator`)은 홈과 `/pricing` 모두에서 내렸다. 기획이
 * 기능별 차등 요금제로 바뀌었기 때문이다. 컴포넌트 파일은 남겨 두었다.
 *
 * ── CTA 문구에 무료체험 "기간"을 넣지 않는다 ──
 * 기획 문서마다 14일과 7일이 갈린다. 확정 전까지 숫자를 카피에 박으면 나중에
 * 여러 화면을 뒤져야 한다. 기간이 확정되면 그때 한 곳에 상수로 둔다.
 */

import { DUMMY_PLAN_PRICE, DUMMY_PLAN_PRICE_ANNUAL } from "./dummy";
import { FEATURE_BY_KEY, type Feature } from "./features";

export type Plan = {
  key: "basic" | "standard" | "premium";
  name: string;
  /** 월간 결제 — 원/월, VAT 별도. null 이면 "별도 문의" */
  monthly: number | null;
  /** 연간 결제 시 월 환산가 — 원/월, VAT 별도. 플랜별 지정값(할인율 계산 아님) */
  annualMonthly: number | null;
  /** 카드 상단 한 줄 — 누구에게 맞는 플랜인가 */
  lead: string;
  /** 포함 기능 키 (features.ts) */
  featureKeys: readonly string[];
  /** 카드 하단 각주. 금액에 포함되지 않는 비용을 밝힌다 */
  notes: readonly string[];
  /** 카드 CTA. 플랜마다 다르다(기획 확정) */
  cta: { label: string; href: string };
  /** 가운데 카드를 시각적으로 세운다 */
  featured?: boolean;
};

/**
 * 베이직 CTA — 무료체험.
 *
 * 한동안 상담(`/contact`)으로 보냈다. 체험할 실체가 없는데 "무료체험" 이라고
 * 적으면 표시광고법 문제이고, 눌러서 상담 폼이 나오면 속았다고 느끼기 때문이다.
 * **체험용 웹 대시보드 주소가 확보되면서**(2026-08-14 확정) 도착지가 생겼고,
 * 신청 화면 `/trial` 을 거쳐 그쪽으로 넘긴다.
 *
 * ⚠️ 라벨에 기간(14일·7일)을 넣지 않는다 — 기획 문서마다 값이 갈린다(파일 머리 주석).
 */
const BASIC_CTA = { label: "무료체험", href: "/trial" } as const;

/**
 * 스탠다드·프리미엄 CTA — 서비스 문의.
 *
 * 두 플랜은 맡기는 범위가 매장마다 갈려 금액이 상담에서 정해진다. 시안이
 * 프리미엄에 지정한 문구를 스탠다드에도 그대로 쓴다 — 같은 도착지(`/contact`)에
 * 서로 다른 말을 붙이면 다른 신청으로 읽힌다.
 */
const INQUIRY_CTA = { label: "서비스 문의", href: "/contact" } as const;

export const PLANS: readonly Plan[] = [
  {
    key: "basic",
    name: "베이직",
    monthly: DUMMY_PLAN_PRICE.basic,
    annualMonthly: DUMMY_PLAN_PRICE_ANNUAL.basic,
    lead: "직접 운영하시되, 기록과 서류만 맡기고 싶은 매장",
    featureKeys: ["dashboard", "manager-support", "docs"],
    notes: ["VAT 별도"],
    cta: BASIC_CTA,
  },
  {
    key: "standard",
    name: "스탠다드",
    monthly: DUMMY_PLAN_PRICE.standard,
    annualMonthly: DUMMY_PLAN_PRICE_ANNUAL.standard,
    lead: "매니저 운영까지 맡기고 매출까지 챙기고 싶은 매장",
    featureKeys: ["dashboard", "manager-support", "docs", "ops-support", "revenue"],
    notes: ["VAT 별도", "매니저 인건비 별도 — 출근 횟수와 시간에 따라 달라집니다"],
    cta: INQUIRY_CTA,
    featured: true,
  },
  {
    key: "premium",
    name: "프리미엄",
    monthly: null,
    annualMonthly: null,
    lead: "고객 응대부터 시설·홍보까지 전부 맡기고 싶은 매장",
    featureKeys: [
      "dashboard",
      "manager-support",
      "docs",
      "ops-support",
      "dispatch",
      "b2c",
      "revenue",
      "place",
    ],
    notes: [
      "VAT 별도",
      "매니저 인건비 별도",
      "바로출동서비스는 업체별 내부 정책에 따라 추가 요금이 발생할 수 있습니다",
    ],
    cta: INQUIRY_CTA,
  },
];

/** 플랜에 포함된 기능을 features.ts 정의 그대로 돌려준다 */
export function planFeatures(plan: Plan): readonly Feature[] {
  return plan.featureKeys.map((k) => FEATURE_BY_KEY[k]);
}

/* ═══════════════════════════════════════════════════════════════
   연간 결제
   ═══════════════════════════════════════════════════════════════ */

/**
 * 연간 금액은 할인율 계산이 아니라 **플랜별 지정값**이다(사용자 지시,
 * 2026-08-14). 기존 시안 금액(19,900 / 299,900)이 연간 결제의 월 환산가가
 * 됐고 월간 결제가 새 금액(24,900 / 349,000)을 받았다 — 두 플랜의 할인폭이
 * 달라(≈20% / ≈14%) 단일 할인율 상수로는 표현할 수 없다.
 *
 * 노출 조건: 금액이 `dummy.ts` 를 거치므로 "샘플 데이터" 배너(`DUMMY_CONTENT`)
 * 아래에서만 화면에 뜬다. 배너 조건을 따로 손대지 않는다.
 */

/**
 * 연간 결제 총액(원, VAT 별도).
 *
 * 카드에 적힌 월 환산가 × 12 로 계산한다 — 총액을 따로 정하면 반올림·전달
 * 착오로 카드 숫자와 어긋날 수 있다. 보는 사람은 계산이 틀렸다고 읽는다.
 */
export function annualTotal(annualMonthly: number): number {
  return annualMonthly * 12;
}
