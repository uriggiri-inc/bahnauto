import { cn } from "@/lib/cn";

/**
 * 헤드라인 안에서 한 구절만 도드라지게 하는 표기.
 *
 * ── 페이지당 하나 ──
 * | 페이지 | tone | 형태 |
 * |---|---|---|
 * | 주요기능 `/features/[key]` | `color` | 브랜드 색으로 교체 |
 * | 요금 `/pricing` | `highlight` | 형광펜 띠 |
 * | 도입 절차 `/process` | `highlight` | 형광펜 띠 (2026-08-18 변경 — 굵은 밑줄이었다) |
 *
 * 한 화면에 두 가지 이상을 섞지 않는다 — 강조가 둘이면 강조가 없는 것과 같다.
 *
 * ⚠️ `underline`(굵은 밑줄)은 **현재 쓰는 화면이 0개다.** 요금 페이지의 형광펜을
 *    기준으로 도입 절차를 맞추라는 지시(2026-08-18)에 따라 둘 다 형광펜이 됐다.
 *    타입과 `.ba-mark-underline` 스타일은 남겨 둔다 — 지우면 되살릴 때 다크 모드
 *    대비까지 다시 잡아야 한다.
 *
 * 실제 색·두께는 `globals.css` 의 `.ba-mark-*` 에 있다. 다크 모드 대응도
 * 거기서 끝난다(이 저장소는 `dark:` 배리언트를 쓰지 않고
 * `:where(:root[data-theme="dark"])` 오버라이드로 처리한다).
 *
 * `<strong>` 이 아니라 `<span>` 이다 — 시각적 강조일 뿐 의미상 중요도가
 * 올라가는 것이 아니고, 스크린리더가 헤드라인 중간에서 톤을 바꿀 이유가 없다.
 */

export type MarkTone = "color" | "highlight" | "underline";

const TONES: Record<MarkTone, string> = {
  color: "ba-mark-color",
  highlight: "ba-mark-highlight",
  underline: "ba-mark-underline",
};

export function Mark({
  tone,
  className,
  children,
}: {
  tone: MarkTone;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={cn(TONES[tone], className)}>{children}</span>;
}
