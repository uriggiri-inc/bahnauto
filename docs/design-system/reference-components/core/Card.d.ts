/** 기본 카드 컨테이너 — 화이트 + 1px 보더 + radius 18 + 블루 틴트 섀도우. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: number;
  tone?: "default" | "subtle" | "brand" | "dark";
  hoverable?: boolean;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
