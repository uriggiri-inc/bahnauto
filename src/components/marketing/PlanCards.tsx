"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/marketing/serviceIcons";
import { annualTotal, PLANS, planFeatures, type Plan } from "@/content/plans";
import { cn } from "@/lib/cn";
import { easeOutCubic, readDurationMs, REDUCED_MS } from "@/lib/motion";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 요금제 3종 카드 — 계산기(`PricingEstimator`)를 대체한다.
 *
 * 계산기는 방문 횟수·면적·업종으로 금액을 만들어냈다. 기획이 **기능별 차등
 * 요금제**로 바뀌면서 그 축이 사라졌다. 지금 사용자가 골라야 하는 건
 * "몇 번 오느냐" 가 아니라 "어디까지 맡기느냐" 다.
 *
 * ── 이 카드에는 옵션 단가가 없다 ──
 * 카드는 "플랜 월 요금"만 말한다. 옵션별 추가 요금은 `/pricing` 의 옵션 표가
 * 맡는다 — 카드 안에 단가까지 넣으면 세 카드가 표가 되어 비교가 되지 않는다.
 *
 * ── 금액이 잠정이라는 표시 ──
 * 배너는 페이지 상단의 `DummyBanner` 가 이미 달고 있다. 카드마다 반복하면
 * 세 번 읽히고 시선만 흩어진다.
 *
 * ── 월간 / 연간 토글 ──
 * 연간 금액은 플랜별 지정값(`plan.annualMonthly`)이다 — 할인율 계산이 아니다.
 * 연간을 고르면 큰 숫자가 **월 환산가**로 바뀌고 아래 캡션에 연 총액이 붙는다.
 * 월 환산으로 보여주는 이유: 카드 세 장을 나란히 비교하는 화면에서 단위가
 * 섞이면(한 장은 월, 한 장은 연) 비교 자체가 성립하지 않는다.
 *
 * 금액이 튀듯 바뀌면 "다른 요금제를 본 건가" 싶어진다. 그래서 rAF 로 굴린다.
 * 지속시간은 `--dur-reveal` 토큰이라 모션 축소에서 1ms 로 떨어진다 —
 * 컴포넌트에서 따로 분기하지 않는다(`CLAUDE.md` §7).
 *
 * 프리미엄은 금액이 `null`("별도 문의")이라 토글의 영향을 받지 않는다.
 */

type Billing = "monthly" | "annual";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR");
}

/* ── 결제 주기 토글 ──────────────────────────────────────────
   네이티브 라디오를 쓴다. 좌우 화살표 이동·그룹 단위 탭 정지점을 브라우저가
   이미 정확히 처리하고 있어서, `role="radiogroup"` 을 직접 구현하면 그 동작을
   JS 로 다시 짜야 한다. 입력은 `sr-only` 로 감추고 라벨만 칠한다. */

/* 라벨에 할인율을 적지 않는다 — 플랜마다 할인폭이 달라(베이직 ≈20%,
   스탠다드 ≈14%) 하나의 숫자가 거짓말이 된다. */
const BILLING_OPTIONS: readonly { key: Billing; label: string }[] = [
  { key: "monthly", label: "월간 결제" },
  { key: "annual", label: "연간 결제" },
];

function BillingToggle({ value, onChange }: { value: Billing; onChange: (v: Billing) => void }) {
  const name = useId();

  return (
    <fieldset className="flex justify-center">
      <legend className="sr-only">결제 주기</legend>
      <div className="border-border inline-flex gap-1 rounded-[10px] border bg-white p-1">
        {BILLING_OPTIONS.map((o) => (
          <label key={o.key} className="block">
            <input
              type="radio"
              name={name}
              value={o.key}
              checked={value === o.key}
              onChange={() => onChange(o.key)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "text-body-sm text-text-sub block cursor-pointer rounded-[8px] px-4 py-2 whitespace-nowrap",
                "ease-standard transition-colors duration-[var(--dur-tab)]",
                "peer-checked:bg-brand peer-checked:text-white",
                "peer-focus-visible:outline-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── 굴러가는 금액 ───────────────────────────────────────────
   초기값이 곧 최종값이라 서버 HTML 에는 월간 금액이 그대로 들어간다.
   값이 바뀐 뒤에만 이전 값에서 새 값으로 굴린다. */

function RollingWon({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const start = from.current;
    from.current = value;
    if (!el || start === value) return;

    const dur = readDurationMs(el, "--dur-reveal", 500);
    if (dur <= REDUCED_MS) {
      setShown(value);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setShown(Math.round(start + (value - start) * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span ref={ref} className="text-h2 text-ink tabular-nums">
      {formatWon(shown)}
    </span>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const features = planFeatures(plan);
  const shownMonthly = billing === "annual" ? plan.annualMonthly : plan.monthly;

  return (
    <Card
      tone={plan.featured ? "brand" : "default"}
      /*
        패딩 28 → 24, 추천 카드 돌출 12 → 8px. 세 장이 한 화면에 담겨야 한다는
        요청(2026-08-18)에 맞춰 세로를 줄였다. 돌출 자체는 남긴다 — 색만으로는
        가운데 카드가 눈에 걸리지 않는다.
      */
      padding={24}
      className={cn("flex h-full flex-col", plan.featured && "lg:-my-2 lg:py-8")}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-h4 text-ink">{plan.name}</h3>
        {plan.featured && <Badge>추천</Badge>}
      </div>

      {/* 예약 높이 3.3em → 2.6em. 세 플랜의 리드가 모두 한 줄(넓은 화면)~두 줄이라
          3.3em 은 빈 줄을 하나 더 잡고 있었다. 예약 자체는 남긴다 — 없으면 카드마다
          금액 줄 높이가 어긋나 비교가 안 된다 */}
      <p className="text-body-sm text-text-sub mt-2 min-h-[2.6em] leading-[1.65]">
        {formatCopy(plan.lead)}
      </p>

      {/* 금액 — 카드에서 시선이 가장 먼저 닿아야 하는 자리 */}
      <p className="mt-4 flex items-baseline gap-1">
        {shownMonthly === null ? (
          <span className="text-h3 text-ink">별도 문의</span>
        ) : (
          <>
            <RollingWon value={shownMonthly} />
            <span className="text-body text-text-sub">원 / 월</span>
          </>
        )}
      </p>

      {/*
        연 총액 캡션. 비어 있어도 자리를 남긴다 — 카드 세 장의 기능 목록
        시작선이 어긋나면 비교가 안 된다(프리미엄에는 이 줄이 없다).
      */}
      <p className="text-caption text-text-sub mt-1.5 min-h-[1.5em]">
        {plan.annualMonthly !== null && billing === "annual"
          ? `연 결제 시 월 환산 · 연 총액 ${formatWon(annualTotal(plan.annualMonthly))}원`
          : null}
      </p>

      <ul className="mt-4 flex flex-1 flex-col gap-2.5 border-t pt-5">
        {features.map((f) => (
          <li key={f.key} className="text-body-sm text-ink flex items-start gap-2.5">
            <span className="text-brand mt-0.5 shrink-0">
              <ServiceIcon name={f.icon} size={18} />
            </span>
            {f.title}
          </li>
        ))}
      </ul>

      {plan.notes.length > 0 && (
        <ul className="text-caption text-text-sub mt-4 flex flex-col gap-1">
          {plan.notes.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
      )}

      {/* CTA 문구·링크는 플랜마다 다르다 — 정본은 plans.ts */}
      <Link
        href={plan.cta.href}
        className={cn(
          buttonClasses({ variant: plan.featured ? "primary" : "secondary", size: "md" }),
          "mt-5 w-full",
        )}
      >
        {plan.cta.label}
      </Link>
    </Card>
  );
}

export function PlanCards() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div>
      <div className="mb-6">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      {/* items-stretch 라야 카드 높이가 맞는다 — 금액 줄 위치가 어긋나면 비교가 안 된다 */}
      <ul className="grid items-stretch gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <li key={p.key} className="h-full">
            <PlanCard plan={p} billing={billing} />
          </li>
        ))}
      </ul>

      <p className="text-body-sm text-text-sub mt-5 text-center">
        표시 금액은 VAT 별도이며, 연간 결제는 1년 이용권을 월 단위로 환산한 금액입니다. 프리미엄
        요금은 도입 상담에서 안내드립니다.
      </p>
    </div>
  );
}
