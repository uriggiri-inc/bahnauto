"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { easeOutCubic, readDurationMs, REDUCED_MS } from "@/lib/motion";

/**
 * 단일 수치 지표.
 *
 * ⚠️ **검증된 실측값에만 쓴다.** 표시광고법상 근거 없는 수치는 부당표시에 해당한다.
 * PRD §13-B5 의 실적 수치 4종은 아직 미확보이므로, 확보 전에는
 * 시스템에서 직접 확인되는 값(상시근무 10개 항목, 체크리스트 319개 등)만 쓴다.
 *
 * 숫자는 항상 3자리 구분 — `Intl.NumberFormat('ko-KR')` 로 포맷한 문자열을 넘긴다.
 *
 * ── 카운트업: 서버 HTML 에는 최종값이 들어간다 ──
 * `Reveal` 과 같은 원칙이다. 흔한 구현은 서버 렌더에 0 을 박아두고 JS 가 올리는데,
 * 그러면 JS 가 실패한 순간 화면에 **0 이 남는다** — 실적이 0 으로 보이는 사고다.
 * 여기서는 초기 상태가 최종값이고, 뷰포트에 들어오는 순간에만 0 으로 되돌려
 * 재생한다. 한 번 재생하면 다시 하지 않는다.
 *
 * ── 지속시간은 `--dur-counter` 토큰 ──
 * 모션 축소에서 토큰이 1ms 로 내려가므로 컴포넌트에서 `matchMedia` 분기를 두지
 * 않는다(`CLAUDE.md` §7). 그때는 애니메이션 없이 최종값 그대로 남는다.
 *
 * 숫자가 아닌 값(`"10+"` 같은 것)은 파싱하지 못하므로 그대로 정적 렌더한다.
 */

export type StatProps = {
  /** 이미 3자리 구분 포맷된 문자열 */
  value: string | number;
  unit?: string;
  label: string;
  tone?: "default" | "onDark";
  align?: "left" | "center";
};

/** 3자리 구분 쉼표만 허용한다 — 그 외 기호가 섞이면 카운트업 대상이 아니다 */
const PLAIN_NUMBER = /^\d{1,3}(,\d{3})*$/;

function parseTarget(value: string | number): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const trimmed = value.trim();
  if (!PLAIN_NUMBER.test(trimmed)) return null;

  const n = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function Stat({ value, unit, label, tone = "default", align = "left" }: StatProps) {
  const onDark = tone === "onDark";
  const target = parseTarget(value);

  const ref = useRef<HTMLSpanElement>(null);
  // 초기값 = 최종값. 서버 HTML 이 그대로 읽히는 상태로 나간다
  const [shown, setShown] = useState<number | null>(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null) return;

    const dur = readDurationMs(el, "--dur-counter", 1400);
    if (dur <= REDUCED_MS) return; // 모션 축소 — 최종값 그대로 둔다

    let raf = 0;
    let played = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        io.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          setShown(Math.round(target * easeOutCubic(p)));
          if (p < 1) raf = requestAnimationFrame(step);
        };

        setShown(0);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <div className={cn(align === "center" && "text-center")}>
      <p
        className="flex items-baseline gap-1.5"
        style={{ justifyContent: align === "center" ? "center" : undefined }}
      >
        <span
          ref={ref}
          className={cn("text-h1 tabular-nums", onDark ? "text-brand-300" : "text-brand")}
        >
          {shown === null ? value : shown.toLocaleString("ko-KR")}
        </span>
        {unit && (
          <span className={cn("text-body-lg", onDark ? "text-white/70" : "text-text-sub")}>
            {unit}
          </span>
        )}
      </p>
      <p className={cn("text-body-sm mt-2", onDark ? "text-white/70" : "text-text-sub")}>{label}</p>
    </div>
  );
}
