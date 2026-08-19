import { cn } from "@/lib/cn";

/**
 * 기본 카드 컨테이너 — 화이트 + 1px 보더 + radius 18 + **블루 틴트 섀도우**.
 *
 * 카드는 위계를 전달할 때만 쓴다. 그냥 묶기만 하면 되는 곳은
 * `border-t` / `divide-y` / 여백으로 처리한다.
 *
 * 금지: 검정 그림자, 좌측 컬러 보더만 있는 카드, 굵은 컬러 아웃라인 카드.
 */

type Tone = "default" | "subtle" | "brand" | "dark";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 내부 여백(px). 기본 24 */
  padding?: number;
  tone?: Tone;
  /** hover 시 살짝 떠오른다. 클릭 가능한 카드에만 쓴다 */
  hoverable?: boolean;
};

const TONES: Record<Tone, string> = {
  default: "bg-white border-border",
  subtle: "bg-bg-subtle border-border-light",
  brand: "bg-brand-50 border-brand-200",
  dark: "bg-ink border-white/14 text-white",
};

export function Card({
  padding = 24,
  tone = "default",
  hoverable = false,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      style={{ padding, ...style }}
      className={cn(
        "rounded-lg border shadow-[var(--shadow-card)]",
        TONES[tone],
        hoverable &&
          "ease-standard transition-[transform,box-shadow] duration-[160ms] hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
