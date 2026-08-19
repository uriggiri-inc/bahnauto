/**
 * 방문 횟수별 요금 시뮬레이터.
 * 데이터는 코드가 아니라 content/pricing.json 에서 주입한다 (마케팅이 직접 수정).
 * @startingPoint section="Marketing" subtitle="플랜 선택 + 예상 금액 + 게이지" viewport="700x420"
 */
export interface PricingPlan {
  id: string;
  label: string;
  visitsPerMonth: number;
  /** 0이면 금액 대신 '문의' 로 폴백한다 — 실데이터 입력 전 안전장치 */
  monthly: number;
}
export interface PricingCalculatorProps {
  plans?: PricingPlan[];
  defaultPlanId?: string;
  note?: string;
  /** GA4 pricing_simulate 발화 */
  onSimulate?: (planId: string) => void;
  /** /contact 로 이동하며 희망 관리 횟수를 사전 채움 */
  onSubmit?: (planId: string) => void;
}
export declare function PricingCalculator(props: PricingCalculatorProps): JSX.Element;
