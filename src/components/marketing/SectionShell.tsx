import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";
import type { Align, Bg, Cols, PadY, SectionText, TitleSize } from "@/content/home.config";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 설정(`home.config.ts`)의 스타일 토큰을 실제 클래스로 바꾸는 껍데기.
 *
 * 편집기가 고르는 값은 전부 아래 표 안에 있다. 표에 없는 값은 화면에 나올 수
 * 없으므로 **임의 px 이 새어 들어올 경로가 없다.** 반응형 배율은 각 토큰의
 * `clamp()` 가 이미 처리한다 — 편집기는 "어느 단계인가" 만 고른다.
 *
 * `SectionHeader` 를 그대로 쓰지 않고 여기서 다시 조립하는 이유는 제목 크기를
 * 섹션마다 바꿔야 하기 때문이다. `SectionHeader` 는 크기가 고정이다.
 */

const TITLE_CLASS: Record<TitleSize, string> = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
};

/** `--section-py` 는 clamp(56px, 7vw, 96px). 배율로 단계를 만든다 */
const PAD_CLASS: Record<PadY, string> = {
  sm: "py-[calc(var(--section-py)*0.6)]",
  md: "section-py",
  lg: "py-[calc(var(--section-py)*1.4)]",
};

const BG_CLASS: Record<Bg, string> = {
  white: "bg-white",
  subtle: "bg-bg-subtle",
  tint: "bg-bg-tint",
  ink: "bg-ink text-white",
  brand: "bg-brand text-white",
};

/** 어두운 면에서는 라벨·리드 색을 뒤집어야 한다 */
const DARK_BGS: readonly Bg[] = ["ink", "brand"];

export const COLS_CLASS: Record<Cols, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export type SectionShellProps = {
  id: string;
  text: SectionText;
  titleSize: TitleSize;
  padY: PadY;
  bg: Bg;
  align: Align;
  /** 헤더를 감싸지 않고 본문만 폭을 쓰게 할 때 (후기 슬라이드처럼) */
  bleed?: boolean;
  /**
   * 한 화면을 꽉 채운다 — 사용자 확정(2026-08-14, 홈 전 섹션).
   * 스크롤할 때 두 섹션이 반씩 걸쳐 보이지 않게 최소 높이를
   * "뷰포트 − 상단 고정 헤더"로 잡고 내용을 세로 가운데 둔다.
   * 내용이 더 길면 min-height 라 자연스럽게 늘어난다.
   */
  fill?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function SectionShell({
  id,
  text,
  titleSize,
  padY,
  bg,
  align,
  bleed = false,
  fill = false,
  className,
  children,
}: SectionShellProps) {
  const onDark = DARK_BGS.includes(bg);
  const centered = align === "center";
  const hasHeader = Boolean(text.label || text.title || text.lead);

  const header = hasHeader ? (
    <div className={cn("mb-10 md:mb-12", centered && "flex flex-col items-center text-center")}>
      {text.label && (
        <SectionLabel tone={onDark ? "onDark" : "brand"} className="mb-3">
          {text.label}
        </SectionLabel>
      )}
      {text.title && (
        <h2 className={cn(TITLE_CLASS[titleSize], onDark ? "text-white" : "text-ink")}>
          {text.title}
        </h2>
      )}
      {text.lead && (
        <p
          className={cn(
            "text-body-lg mt-4 max-w-[52rem] leading-[1.7]",
            onDark ? "text-white/80" : "text-text-sub",
          )}
        >
          {formatCopy(text.lead)}
        </p>
      )}
    </div>
  ) : null;

  return (
    <section
      id={id}
      className={cn(
        PAD_CLASS[padY],
        BG_CLASS[bg],
        fill && "flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center",
        className,
      )}
    >
      {bleed ? (
        <>
          {header && <div className="container-ba">{header}</div>}
          {children}
        </>
      ) : (
        <div className="container-ba">
          {header}
          {children}
        </div>
      )}
    </section>
  );
}
