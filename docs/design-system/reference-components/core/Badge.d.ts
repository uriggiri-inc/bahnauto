/** 짧은 상태·분류 라벨. 캡슐형(radius full)만 쓴다. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "brand" | "neutral" | "success" | "warning" | "danger" | "onDark";
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
