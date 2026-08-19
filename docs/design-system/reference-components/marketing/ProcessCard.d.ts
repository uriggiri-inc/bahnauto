/** 도입 절차 단계 카드. 다크 섹션이 기본. */
export interface ProcessCardProps {
  /** '01' 같은 2자리 문자열 */
  step: string;
  title: string;
  description: string;
  /** 점주의 부담 인식을 낮추는 2열 구분 */
  ownerOwner?: string;
  ownerBahnauto?: string;
  tone?: "dark" | "light";
}
export declare function ProcessCard(props: ProcessCardProps): JSX.Element;
