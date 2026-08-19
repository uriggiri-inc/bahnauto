/**
 * 아이콘 + 제목 + 설명 (+ 세부 항목) 카드. 서비스 6종, 페인포인트 4종에 쓴다.
 * @startingPoint section="Marketing" subtitle="아이콘 + 제목 + 설명 + 항목 리스트" viewport="700x300"
 */
export interface FeatureCardProps {
  /** Lucide 아이콘 노드 (stroke 1.8) */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** 세부 3항목 — 불릿 리스트 */
  items?: string[];
  tone?: "default" | "subtle" | "brand" | "dark";
}
export declare function FeatureCard(props: FeatureCardProps): JSX.Element;
