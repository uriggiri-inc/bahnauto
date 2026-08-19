"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  ADD_ONS,
  AREA_BANDS,
  STORE_TYPES,
  VISIT_PLANS,
  estimate,
  formatKRW,
  monthlyVisits,
  toContactQuery,
} from "@/lib/pricing";

/**
 * 예상 견적 계산기 — 홈에 직접 놓는 판.
 *
 * ── 왜 홈에 두는가 (REVIEW-001 F-2 · F-4) ──
 * "얼마인가"는 점주의 2순위 결정 기준인데 `/pricing` 까지 가는 비율은 낮다.
 * 그리고 계산기를 **조작한 사람은 이미 관심을 보인 사람**인데, 조작만 시키고
 * 그냥 보내면 리드가 통째로 사라진다. 그래서 결과 카드 안에 다음 단계를 붙인다.
 *
 * ── 왜 변수를 안에 넣는가 (F-8) ──
 * 방문 횟수만 받고 "면적·업종에 따라 달라집니다"를 각주로 붙이면 결과의 신뢰가
 * 0이 된다 — "그럼 이 숫자는 뭐지?"가 남기 때문이다. 업종·면적을 입력 안으로
 * 들여야 결과가 자기 조건의 답으로 읽힌다.
 *
 * ── 금액이 없는 동안 ──
 * §13-B2 확정 전이라 금액 자리는 `[확정 필요]` 다. 대신 **방문 횟수는 지금도
 * 정확히 계산된다** — 월/연 방문 횟수는 요금표와 무관하게 확정된 값이기 때문이다.
 * 선택 조건은 상담 폼으로 그대로 넘어가므로, 금액 없이도 도구로서 작동한다.
 *
 * 게이지는 원형 링이다. 막대가 아니라 링인 이유는 그것이 브랜드의 시각 언어이고
 * (심볼 = 채워지는 궤도), "한 달을 얼마나 채우는가"와 의미가 정확히 맞기 때문이다.
 */

/** 게이지 만개 기준 — 매일 방문(월 30회) */
const GAUGE_MAX = 30;

export function PricingEstimator() {
  const [visit, setVisit] = useState(VISIT_PLANS[1].id); // 주 2회 — 안내 문구의 기준
  const [store, setStore] = useState(STORE_TYPES[0].id);
  const [area, setArea] = useState(AREA_BANDS[0].id);
  const [addOns, setAddOns] = useState<string[]>([]);

  const plan = VISIT_PLANS.find((v) => v.id === visit) ?? VISIT_PLANS[0];
  const perMonth = monthlyVisits(plan.perWeek);
  const perYear = perMonth * 12;

  const animatedMonth = useCountUp(perMonth);
  const animatedYear = useCountUp(perYear);

  // 값이 하나라도 없으면 null 이 온다 — 그때는 금액 자리를 비운다
  const quote = estimate({ visit, store, area, addOns });
  const animatedTotal = useCountUp(quote?.total ?? 0);

  const query = toContactQuery({ visit, store, area, addOns });

  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-float)]">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* ══ 입력 ══════════════════════════════════════════ */}
        <div className="flex flex-col gap-6 p-6 sm:p-7">
          <Field label="매장 업종">
            <ChipGroup
              options={STORE_TYPES.map((s) => ({ id: s.id, label: s.label }))}
              value={store}
              onChange={setStore}
              name="업종"
            />
          </Field>

          <Field label="매장 면적">
            <Segmented
              options={AREA_BANDS.map((a) => ({ id: a.id, label: a.label, note: a.note }))}
              value={area}
              onChange={setArea}
              name="면적"
            />
          </Field>

          <Field label="주간 방문 횟수">
            <Segmented
              options={VISIT_PLANS.map((v) => ({ id: v.id, label: v.label }))}
              value={visit}
              onChange={setVisit}
              name="방문 횟수"
            />
          </Field>

          <Field label="추가 관리 옵션" hint="복수 선택">
            <div className="flex flex-wrap gap-2">
              {ADD_ONS.map((o) => {
                const on = addOns.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setAddOns((prev) =>
                        prev.includes(o.id) ? prev.filter((x) => x !== o.id) : [...prev, o.id],
                      )
                    }
                    className={cn(
                      "ease-standard rounded-sm border px-3.5 py-2.5 text-left transition-[background-color,border-color,transform] duration-[160ms]",
                      "active:translate-y-0",
                      on
                        ? "border-brand bg-brand-50"
                        : "border-border hover:border-border-strong bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "text-body-sm flex items-center gap-2 font-semibold",
                        on ? "text-brand" : "text-ink",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-[5px] border",
                          "ease-brand transition-colors duration-[160ms]",
                          on ? "border-brand bg-brand" : "border-border-strong bg-white",
                        )}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={on ? "opacity-100" : "opacity-0"}
                        >
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                      {o.label}
                    </span>
                    <span className="text-caption text-text-sub mt-1 block pl-6">{o.desc}</span>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        {/* ══ 결과 ══════════════════════════════════════════
            면을 바꿔 "입력하는 곳"과 "답이 나오는 곳"을 시각적으로 분리한다 */}
        <div className="bg-bg-subtle border-border flex flex-col gap-5 border-t p-6 sm:p-7 lg:border-t-0 lg:border-l">
          <div className="flex items-center gap-5">
            <Gauge value={perMonth} max={GAUGE_MAX} />
            <div>
              <p className="text-caption text-text-sub">월 방문 횟수</p>
              <p className="text-h1 text-brand tabular-nums">
                {animatedMonth}
                <span className="text-body-lg text-text-sub ml-1">회</span>
              </p>
              <p className="text-caption text-text-sub mt-1 tabular-nums">
                연 {animatedYear}회 방문
              </p>
            </div>
          </div>

          {/* 금액. 변수 중 하나라도 값이 없으면 추정하지 않고 비워 둔다 */}
          <div className="border-border rounded-lg border bg-white p-4">
            <p className="text-caption text-text-sub mb-1.5">예상 월 이용료</p>
            {quote ? (
              <>
                <p className="text-h2 text-ink tabular-nums">
                  {formatKRW(animatedTotal)}
                  <span className="text-body-lg text-text-sub ml-1">원</span>
                </p>

                {/* 어떻게 나온 금액인지 보여준다 — 총액만 던지면 근거를 물을 수 없다 */}
                <dl className="border-border-light mt-3 flex flex-col gap-1.5 border-t pt-3">
                  <div className="text-caption text-text-sub flex justify-between gap-3">
                    <dt>기본 관리 (업종·면적 반영)</dt>
                    <dd className="text-ink tabular-nums">{formatKRW(quote.base)}원</dd>
                  </div>
                  {quote.options > 0 && (
                    <div className="text-caption text-text-sub flex justify-between gap-3">
                      <dt>추가 옵션</dt>
                      <dd className="text-ink tabular-nums">+{formatKRW(quote.options)}원</dd>
                    </div>
                  )}
                </dl>
              </>
            ) : (
              <p className="text-h4 text-warning">[요금 확정 필요 · §13-B2]</p>
            )}
            <p className="text-caption text-text-sub mt-3">VAT 별도</p>
          </div>

          <p className="text-caption text-text-sub">
            선택하신 조건은 상담 신청서에 그대로 채워집니다. 지역과 현장 조건에 따라 조정될 수
            있으며, 방문 진단 후 확정 금액을 안내드립니다.
          </p>

          <Link
            href={`/contact?${query}`}
            className={buttonClasses({ size: "lg", full: true, className: "mt-auto" })}
          >
            이 조건으로 정확한 견적 받기
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-label text-ink mb-3 flex items-center gap-2">
        {label}
        {hint && <span className="text-caption text-text-sub font-normal">{hint}</span>}
      </p>
      {children}
    </div>
  );
}

type Option = { id: string; label: string; note?: string };

/**
 * 선택지가 균등 분할되는 곳에 쓴다. 활성 표시가 **미끄러져 이동**하므로
 * 어디에서 어디로 옮겼는지가 눈에 남는다 — 색만 바뀌면 그 관계가 사라진다.
 */
function Segmented({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly Option[];
  value: string;
  onChange: (id: string) => void;
  name: string;
}) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );
  const n = options.length;

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="border-border relative grid gap-1 rounded-sm border bg-white p-1"
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      {/* 미끄러지는 활성 표시. translateX 의 % 는 자기 폭 기준이라 칸 수와 무관하게 맞는다 */}
      <span
        aria-hidden
        // 6px = 외곽 10px − 안쪽 여백 4px. 동심원 반경을 맞춰야 알약이 테두리와 나란해 보인다
        className="bg-brand ease-brand absolute top-1 bottom-1 left-1 rounded-[6px] shadow-[var(--shadow-cta)] transition-transform duration-[320ms]"
        style={{
          width: `calc((100% - 0.5rem - ${(n - 1) * 4}px) / ${n})`,
          transform: `translateX(calc(${index} * (100% + 4px)))`,
        }}
      />

      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative z-10 rounded-[6px] px-2 py-2.5 text-center",
              "ease-standard transition-colors duration-[200ms]",
              on ? "text-white" : "text-text-sub hover:text-brand",
            )}
          >
            <span className="text-body-sm block font-semibold whitespace-nowrap">{o.label}</span>
            {o.note && (
              <span
                className={cn(
                  "text-caption block whitespace-nowrap",
                  on ? "text-white/70" : "text-text-sub",
                )}
              >
                {o.note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** 선택지가 6개라 균등 분할이 모바일에서 깨진다 → 줄바꿈되는 칩으로 */
function ChipGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly Option[];
  value: string;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={cn(
              "text-body-sm ease-standard rounded-full border px-4 py-2.5 font-semibold",
              "transition-[background-color,border-color,color,transform] duration-[160ms]",
              on
                ? "border-brand bg-brand -translate-y-px text-white shadow-[var(--shadow-cta)]"
                : "border-border text-text-sub hover:border-border-strong hover:text-brand bg-white",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 원형 게이지 — 브랜드 심볼(채워지는 궤도)의 어휘를 그대로 쓴다.
 * "한 달 중 얼마나 채우는가"라는 의미가 링의 형태와 정확히 맞는다.
 */
function Gauge({ value, max }: { value: number; max: number }) {
  const id = useId();
  const ratio = Math.min(1, value / max);

  return (
    <svg width="92" height="92" viewBox="0 0 140 140" fill="none" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="15" y1="0" x2="125" y2="0">
          <stop offset="0" stopColor="#004ACC" />
          <stop offset="1" stopColor="#4D86F7" />
        </linearGradient>
      </defs>

      <circle cx="70" cy="70" r="55" stroke="#E3EAF8" strokeWidth="22" />
      <circle
        cx="70"
        cy="70"
        r="55"
        stroke={`url(#${id})`}
        strokeWidth="22"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        transform="rotate(-90 70 70)"
        style={{
          strokeDashoffset: 1 - ratio,
          transition: "stroke-dashoffset 520ms var(--ease-brand)",
        }}
      />
    </svg>
  );
}

/**
 * 숫자가 튀지 않고 굴러간다. 값이 바뀌었다는 사실 자체를 인지시키는 장치다 —
 * 즉시 치환되면 바뀐 걸 못 보고 지나간다.
 */
function useCountUp(target: number, duration = 480) {
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    // 모션 축소는 구르는 시간을 0 으로 만든다. 여기서 바로 setState 하면
    // 이펙트 본문의 연쇄 렌더가 되므로, 첫 프레임에 끝나게 두고 갱신은 rAF 에 맡긴다.
    const d = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const t = d === 0 ? 1 : Math.min(1, (now - t0) / d);
      // easeOutCubic — 끝에서 부드럽게 멈춘다
      const e = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (target - from) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return shown;
}
