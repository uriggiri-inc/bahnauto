import { cn } from "@/lib/cn";

/**
 * 짧은 상태·분류 라벨. 캡슐형(radius full)만 쓴다.
 *
 * 상태 표시는 **색 + 텍스트**로 한다. 이모지를 쓰지 않는다(브랜드 자산 어디에도 없음).
 * 시맨틱 톤은 매장관리 앱의 상태 컬러와 동일하게 맞춰 브랜드 일관성을 유지한다.
 */

type Tone = "brand" | "neutral" | "success" | "warning" | "danger" | "onDark";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

const TONES: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand",
  neutral: "bg-bg-subtle text-text-sub",
  success: "bg-success-bg text-success", // 앱의 '정상'
  warning: "bg-warning-bg text-warning", // 앱의 'D-30 임박'
  danger: "bg-danger-bg text-danger", // 앱의 '폐기 대상'
  onDark: "bg-white/12 text-brand-300",
};

export function Badge({ tone = "brand", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-caption inline-flex items-center rounded-full px-2.5 py-1 font-semibold",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
