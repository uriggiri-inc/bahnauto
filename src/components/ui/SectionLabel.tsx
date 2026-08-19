import { cn } from "@/lib/cn";

/**
 * 섹션 상단의 짧은 명사구 레이블 (13.5px / 600 / letter-spacing 0.06em).
 *
 * ⚠️ 남용 금지. 모든 섹션 위에 붙이면 전부 같은 리듬이 되어 템플릿처럼 읽힌다.
 * **섹션 3개당 최대 1개**를 기준으로 삼는다. 대부분의 섹션은 헤드라인만으로 충분하다.
 *
 * 좋은 예: `반오토 운영 시스템`, `도입 절차`, `요금 안내`
 * 나쁜 예: `001 · Capabilities`, `SECTION 02` — 번호 매기기는 쓰지 않는다
 */

type Tone = "brand" | "muted" | "onDark";

export type SectionLabelProps = React.HTMLAttributes<HTMLParagraphElement> & {
  tone?: Tone;
};

const TONES: Record<Tone, string> = {
  brand: "text-brand",
  muted: "text-text-sub",
  onDark: "text-brand-300",
};

export function SectionLabel({ tone = "brand", className, children, ...rest }: SectionLabelProps) {
  return (
    <p className={cn("text-label", TONES[tone], className)} {...rest}>
      {children}
    </p>
  );
}
