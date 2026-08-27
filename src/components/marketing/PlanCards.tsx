import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { ScreenStack } from "@/components/marketing/ScreenStack";
import { SCREEN_PAIRS } from "@/content/app-screens";
import {
  PLAN_BASE,
  PLAN_OPTION_CTA,
  PLAN_OPTION_NOTE,
  PRICING_FOOTNOTE,
  planOptions,
} from "@/content/plans";
import { cn } from "@/lib/cn";

/**
 * 요금 — **기본료 카드 + 옵션 목록 카드**, 사이에 더하기 기호.
 *
 * ── 2026-08-27 전면 교체 ──
 * 이전에는 플랜 3장을 나란히 놓고 위에 월간/연간 토글을 뒀다. 담당자 수정안이
 * 구조를 바꿨다 — 운영 대시보드가 **기본**이고 나머지 여섯 기능이 **옵션**이다.
 * 그래서 사라진 장치들:
 *   · 월간/연간 토글(`BillingToggle`) — 수정안에 연간 결제가 없다
 *   · 굴러가는 금액(`RollingWon`) — 바뀔 금액이 없어졌다. 값이 하나뿐이다
 *   · 추천 배지 — 고를 플랜이 없다
 * 상태가 전부 사라져 이 컴포넌트는 **서버 컴포넌트**다(JS 0바이트).
 *
 * ── 옵션 금액을 적지 않는다 ──
 * 기획 확정 사항이다. 카드 안에는 "옵션 별 금액이 상이합니다" 한 줄만 두고,
 * 실제 금액은 상담에서 안내한다. 옵션마다 "별도 문의"를 여섯 번 적으면 그것만
 * 눈에 남는다.
 *
 * ── 왼쪽 카드의 앱 화면 ──
 * 수정안 목업이 기본료 카드 안에 PC+모바일 합성 이미지를 넣었다. 우리 사이트가
 * 이미 쓰는 `ScreenStack` 으로 재현한다 — 새 컴포넌트를 만들면 같은 그림을 두
 * 방식으로 그리게 된다.
 *
 * **`side`(나란히)를 쓴다. `overlap`(겹침)은 이 카드에서 깨진다.** 목업 그림이
 * 겹침이라 처음에는 `overlap` 으로 넣었는데, 겹침 배치는 폰을 `absolute bottom-0`
 * 으로 두고 상자 높이를 **PC 이미지 높이**로 잡는다. 카드가 좁아 PC 가 납작해지면
 * (1910×861 을 폭 86% 로 → 높이 ≈ 폭의 0.39배) 세로로 긴 폰(756×1466 을 폭 24% 로
 * → 높이 ≈ 폭의 0.47배)이 상자 위로 삐져나와 **`24,900` 금액을 덮었다.** 폭이
 * 넉넉한 `/system` 히어로에서는 같은 계산이 문제가 되지 않아 그쪽은 그대로 둔다.
 *
 * 캡처는 **데일리 리포트**다. `SCREENS` 중 유일하게 데이터가 채워진 캡처(7/29)이기
 * 때문이다(`app-screens.ts` 머리 주석). 목업에 실린 캡처는 완료율 0%·출근 0/3명 인
 * 빈 날짜라 요금 카드에서 홍보 효과가 없다.
 *
 * ── 더하기 기호 ──
 * "기본 + 옵션" 이라는 구조 자체를 그림으로 말하는 자리다. 좁은 화면에서는 카드가
 * 세로로 쌓이므로 기호도 두 카드 사이 가운데로 내려온다. 장식이라 `aria-hidden`
 * 이고, 구조는 카드 제목("옵션 기능 목록")이 글로 말한다.
 */

export function PlanCards() {
  const options = planOptions();

  return (
    <div>
      {/* lg 이상: 카드 · 기호 · 카드 3단. 그 아래로는 세로 한 줄 */}
      <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        {/* ══ 기본료 ══════════════════════════════════════════════ */}
        <div className="bg-brand flex flex-col rounded-lg p-6 text-white shadow-[var(--shadow-card)] md:p-7">
          <h3 className="text-h4">{PLAN_BASE.name}</h3>

          <p className="mt-2.5 flex items-baseline gap-1">
            <span className="text-h2 tabular-nums">
              {PLAN_BASE.monthly.toLocaleString("ko-KR")}
            </span>
            <span className="text-body text-white/80">원 / 월</span>
          </p>

          {/*
            `mt-auto` 로 CTA 를 카드 아래에 붙인다 — 오른쪽 카드의 항목 수가 달라도
            두 버튼의 높이가 맞는다(`items-stretch` 와 함께 작동한다).
          */}
          <div className="mt-6 mb-auto">
            <ScreenStack
              layout="side"
              onDark
              pc={SCREEN_PAIRS.report.pc}
              mobile={SCREEN_PAIRS.report.mobile}
            />
          </div>

          <Link
            href={PLAN_BASE.cta.href}
            className={cn(buttonClasses({ variant: "onDark", size: "md" }), "mt-7 w-full")}
          >
            {PLAN_BASE.cta.label}
          </Link>
        </div>

        {/* ══ 더하기 ══════════════════════════════════════════════ */}
        <div aria-hidden className="text-brand flex items-center justify-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>

        {/* ══ 옵션 목록 ═══════════════════════════════════════════ */}
        <div className="bg-brand-50 border-brand-200 flex flex-col rounded-lg border p-6 md:p-7">
          <h3 className="text-h4 text-ink">옵션 기능 목록</h3>

          <ul className="mt-5 mb-auto flex flex-col gap-3.5">
            {options.map((f) => (
              <li key={f.key} className="text-body-sm text-ink flex items-start gap-3">
                <span
                  className={cn(
                    "border-brand-200 grid size-7 shrink-0 place-items-center rounded-[9px] border bg-white",
                    /* 준비 중인 기능은 아이콘까지 회색으로 내려앉는다 */
                    f.comingSoon ? "text-text-sub" : "text-brand",
                  )}
                >
                  <ServiceIcon name={f.icon} size={16} />
                </span>

                {/*
                  준비 중 표시는 **글자로** 적는다(CLAUDE.md §4 — 색만으로 상태를
                  말하지 않는다). 목업의 `(준비중)` 을 그대로 쓴다.
                */}
                <span className="mt-1">
                  {f.title}
                  {f.comingSoon && <span className="text-text-sub ml-1.5">(준비중)</span>}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-caption text-text-sub mt-6">* {PLAN_OPTION_NOTE}</p>

          <Link
            href={PLAN_OPTION_CTA.href}
            className={cn(buttonClasses({ variant: "primary", size: "md" }), "mt-3 w-full")}
          >
            {PLAN_OPTION_CTA.label}
          </Link>
        </div>
      </div>

      <p className="text-body-sm text-text-sub mt-6 text-center">{PRICING_FOOTNOTE}</p>
    </div>
  );
}
