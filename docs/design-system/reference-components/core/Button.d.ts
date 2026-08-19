/**
 * 반오토 표준 버튼. Primary CTA는 페이지당 목적 하나에만 쓴다.
 * @startingPoint section="Core" subtitle="Primary · secondary · ghost · tel · 3 sizes" viewport="700x260"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary=도입 상담 등 1순위 전환, secondary=보조 동선, ghost=텍스트 링크급, tel=전화 상담, onDark=다크 섹션 위 */
  variant?: "primary" | "secondary" | "ghost" | "tel" | "onDark";
  /** lg=히어로/폼 제출, md=기본, sm=조밀한 영역 */
  size?: "lg" | "md" | "sm";
  /** 제출 중 — 잠기고 스피너 표시. 중복 제출 방지에 필수 */
  loading?: boolean;
  disabled?: boolean;
  /** 폭 100% — 모바일 폼/오버레이 */
  full?: boolean;
  /** 좌측 아이콘 노드 (Lucide 권장, stroke 1.8) */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
