import { cn } from "@/lib/cn";

/**
 * 반오토 표준 버튼.
 *
 * **Primary CTA 는 페이지당 목적 하나에만 쓴다.** 전환 사다리(REVIEW-001 F-4)에서
 * 각 단계의 주 행동만 primary 이고, 나머지는 secondary 이하로 내려간다.
 *
 * 디자인시스템 원본은 인라인 스타일이라 `:hover`/`:focus-visible`/미디어쿼리를
 * 표현하지 못했다 — 정의된 hover 스펙이 실제로는 동작하지 않았다.
 * API(.d.ts)는 그대로 두고 Tailwind 로 옮겨 상태를 살렸다.
 */

type Variant = "primary" | "secondary" | "ghost" | "tel" | "onDark";
type Size = "lg" | "md" | "sm";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary=1순위 전환, secondary=보조 동선, ghost=텍스트 링크급, tel=전화, onDark=다크 섹션 위 */
  variant?: Variant;
  /** lg=히어로/폼 제출, md=기본, sm=조밀한 영역 */
  size?: Size;
  /** 제출 중 — 잠기고 스피너 표시. 중복 제출 방지에 필수 */
  loading?: boolean;
  /** 폭 100% — 모바일 폼/오버레이 */
  full?: boolean;
  /** 좌측 아이콘 노드 (Phosphor 권장) */
  icon?: React.ReactNode;
};

const SIZES: Record<Size, string> = {
  // 최소 높이는 모바일 터치 타깃 44px 규정을 지킨다
  lg: "min-h-[52px] px-7 text-body",
  md: "min-h-[44px] px-5 text-body-sm",
  sm: "min-h-[36px] px-3.5 text-body-sm",
};

const VARIANTS: Record<Variant, string> = {
  // hover 는 어둡게. 밝아지지 않는다(디자인시스템 모션 규정)
  primary:
    "bg-brand text-white shadow-[var(--shadow-cta)] hover:bg-brand-hover active:bg-brand-active",
  secondary:
    "bg-white text-brand border border-border-strong hover:bg-brand-50 active:bg-brand-100",
  ghost: "bg-transparent text-text-sub hover:bg-bg-subtle hover:text-brand",
  tel: "bg-brand-100 text-brand border border-brand-200 hover:bg-brand-200",
  // onDark 는 브랜드 파랑 면 위에 놓인다 — 그 면은 다크 모드에서도 파랑이므로
  // 버튼도 항상 흰색이어야 한다. 다크 모드가 bg-white/text-brand 유틸리티를
  // 표면색으로 재정의하기 때문에(globals.css) 여기만 고정 hex 를 쓴다.
  onDark: "bg-[#ffffff] text-[#004acc] hover:bg-[#eef3ff] active:bg-[#dbe4fa]",
};

/**
 * 버튼 스타일만 필요한 곳(`<a>`, `next/link`)에서 재사용한다.
 * 버튼 모양의 링크를 만들려고 `<button>` 안에 `<a>` 를 넣으면 안 된다 —
 * 인터랙티브 요소 중첩은 마크업 위반이고 스크린리더가 잘못 읽는다.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  className,
}: {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  disabled?: boolean;
  className?: string;
} = {}) {
  return cn(
    "ease-standard inline-flex items-center justify-center gap-2 rounded-sm font-semibold",
    "tracking-[-0.01em] whitespace-nowrap",
    "transition-[background-color,transform,box-shadow] duration-[160ms]",
    // press 는 스케일 축소가 아니라 되돌아오기(디자인시스템 규정)
    "hover:-translate-y-px active:translate-y-0",
    SIZES[size],
    VARIANTS[variant],
    full && "w-full",
    disabled &&
      "pointer-events-none translate-y-0 border-transparent bg-[#EEF1F7] text-[#8B919E] shadow-none",
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  full = false,
  icon,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const off = disabled || loading;

  return (
    <button
      type={type}
      disabled={off}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, full, disabled: off, className })}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block size-[15px] shrink-0 rounded-full border-2 border-current border-t-transparent motion-safe:animate-[ba-spin_0.7s_linear_infinite]"
    />
  );
}
