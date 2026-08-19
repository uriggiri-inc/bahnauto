import { cn } from "@/lib/cn";

/**
 * 조건부 단계 꼬리표 — `필요 시 진행` 처럼 **모든 매장이 거치지 않는** 단계임을
 * 밝히는 짧은 표시.
 *
 * ── 왜 컴포넌트로 뽑았나 ──
 * 도입 절차 페이지에서 같은 꼬리표가 **두 섹션에** 나온다: 상단 단계 카드
 * (`ProcessSteps`)와 하단 단계별 상세(`(site)/process/page.tsx` 의 `DetailCard`).
 * 처음에는 상단만 강조했는데 사용자가 하단에도 같이 적용하라고 지시했다
 * (2026-08-18). 두 곳에 클래스 문자열을 복사해 두면 한쪽만 고쳐지는 날이 온다.
 *
 * ── 무한 루프 예외 ──
 * `ba-tag-flash` 는 **계속 번쩍인다.** `../CLAUDE.md` §4 의 무한 루프 금지에 대한
 * 의도적 예외이고 사용자가 명시 승인했다(2026-08-18). 예외에 붙는 안전장치는
 * `globals.css` 의 해당 블록에 있다:
 *   · 부모에 `ba-flash-host` 를 붙이면 그 안에 커서·포커스가 들어올 때 멈춘다
 *   · `paused` prop 으로 바깥 상태(예: `ProcessSteps` 의 `held`)로도 멈출 수 있다
 *   · 모션 축소에서는 애니메이션이 통째로 꺼지고 **정적 강조만 남는다**
 *
 * 정적 강조(파란 테두리 + 연한 파랑 배경 + 세미볼드)를 애니메이션과 별개로 둔 이유가
 * 이것이다 — 움직임이 없어도 "이 단계는 조건부"라는 정보가 사라지지 않는다.
 */
export function ConditionalTag({
  children,
  /** 바깥 상태로 애니메이션을 멈춘다. hover·포커스 정지는 CSS 가 따로 처리한다 */
  paused,
  className,
}: {
  children: React.ReactNode;
  paused?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-caption border-brand-200 bg-brand-50 text-brand rounded-full border px-2 py-0.5 font-semibold",
        "ba-tag-flash",
        paused && "is-paused",
        className,
      )}
    >
      {children}
    </span>
  );
}
