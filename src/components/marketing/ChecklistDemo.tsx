"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * 체크리스트 체험 — REVIEW-001 F-3 · F-6.
 *
 * **319 대신 항목을 눈으로 보게 하는 장치다.** 검증할 수 없는 큰 수는 확인 욕구만
 * 키우고 불신으로 바뀌지만, 항목명을 그대로 나열하면 나열하는 순간 검증된다.
 * 그래서 여기 뜨는 문자열은 실제 앱의 항목명이어야 한다 — 그럴듯하게 지어내면
 * 이 장치의 유일한 효용이 사라진다.
 *
 * 처음엔 스스로 순차 체크되며 "이런 게 매일 쌓인다"를 보여주고,
 * 그 뒤에는 **방문자가 직접 켜고 끌 수 있다.** 직접 만져 본 인터페이스는
 * 설명으로 읽은 것보다 오래 남는다(F-6 의 호기심 장치 목적).
 *
 * 체크박스는 진짜 `<input type="checkbox">` 다. div + onClick 으로 만들면
 * 키보드 조작과 스크린리더의 상태 안내를 전부 잃는다.
 *
 * ⚠️ PRD §7.2 에서 확인된 항목명은 8개다. 상시근무는 10개이므로 2개가 미확보이고,
 *    캡션에서 "10개 중 8개"임을 밝힌다. 나머지 2개를 받으면 ITEMS 에 추가하면 된다.
 */

/** 무인키즈카페 상시근무 항목 (PRD §7.2 에서 확인된 실제 항목명) */
const ITEMS = [
  "장난감 및 자동차 정리 정돈",
  "정글짐 내부 정리정돈",
  "청소기&정전기포",
  "물걸레 청소",
  "휴게공간 테이블&의자 닦기",
  "매점매대 정돈",
  "휴지통 비우기",
  "창문 문 단속·조명·냉난방기 확인 및 소등",
] as const;

/** 상시근무 총 항목 수. ITEMS 길이와 다른 것은 항목명 2개가 미확보이기 때문이다 */
const ROUTINE_TOTAL = 10;

const STEP_MS = 220;

export type ChecklistDemoProps = {
  items?: readonly string[];
  className?: string;
};

export function ChecklistDemo({ items = ITEMS, className }: ChecklistDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<readonly boolean[]>(() => items.map(() => false));
  /** 자동 재생이 끝났거나 사용자가 개입했는가 — 개입하면 즉시 멈춘다 */
  const [taken, setTaken] = useState(false);
  const takenRef = useRef(false);

  const stopAuto = useCallback(() => {
    takenRef.current = true;
    setTaken(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    // 화면에 들어왔을 때 시작한다. 스크롤 전에 끝나 있으면 아무도 못 본다.
    // 모션 축소 판정도 여기서 한다 — 이펙트 본문에서 바로 setState 하면 연쇄 렌더가 된다.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || timer) return;
        io.disconnect();

        // 모션 축소: 순차 재생 대신 완료 상태를 바로 보여준다. 이 장치의 목적은
        // 애니메이션이 아니라 "항목을 읽고 만지게 하는 것"이므로 정보는 그대로 남는다.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setChecked(items.map(() => true));
          return;
        }

        let n = 0;
        timer = setInterval(() => {
          // 사용자가 먼저 만졌으면 자동 재생은 그 즉시 손을 뗀다
          if (takenRef.current) {
            clearInterval(timer);
            timer = undefined;
            return;
          }
          n += 1;
          setChecked(items.map((_, i) => i < n));
          if (n >= items.length) {
            clearInterval(timer);
            timer = undefined;
          }
        }, STEP_MS);
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [items]);

  const toggle = useCallback(
    (i: number) => {
      stopAuto();
      setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));
    },
    [stopAuto],
  );

  const reset = useCallback(() => {
    stopAuto();
    setChecked(items.map(() => false));
  }, [items, stopAuto]);

  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / items.length) * 100);
  const allDone = done === items.length;

  return (
    <div
      ref={ref}
      className={cn(
        "border-border rounded-lg border bg-white p-6 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="text-h4 text-ink">오늘의 상시근무</p>
        <p className="text-body-sm tabular-nums">
          {/* 남은 개수가 줄고 느는 게 이 장치의 핵심이라 숫자에 색을 준다 */}
          <span
            className={cn(
              "ease-brand font-semibold transition-colors duration-[240ms]",
              allDone ? "text-success" : "text-brand",
            )}
          >
            {done}
          </span>
          <span className="text-text-sub"> / {items.length}</span>
        </p>
      </div>

      {/* 진행률 — 앱의 진행률 표시와 같은 규칙(브랜드 그라데이션은 게이지에만 허용) */}
      <div
        className="bg-bg-subtle mb-5 h-2 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="관리 진행률"
      >
        <div
          className="ease-brand h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width] duration-[400ms]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="flex flex-col gap-0.5">
        {items.map((label, i) => {
          const on = checked[i];
          return (
            <li key={label}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-sm px-1 py-2",
                  "ease-standard transition-colors duration-[160ms]",
                  "hover:bg-bg-subtle",
                  on ? "text-ink" : "text-text-sub",
                )}
              >
                {/* 실제 체크박스. 시각적으로만 감추고 포커스는 살린다 */}
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(i)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-[6px] border",
                    "ease-brand transition-[background-color,border-color,transform] duration-[240ms]",
                    "peer-focus-visible:ring-brand peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
                    on
                      ? "border-brand bg-brand scale-100"
                      : "border-border-strong scale-95 bg-white",
                  )}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                      "ease-brand transition-opacity duration-[160ms]",
                      on ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>

                <span className="text-body-sm">{label}</span>

                {/* 항목마다 사진이 남는다는 사실이 이 서비스의 핵심이다 */}
                <span
                  className={cn(
                    "text-caption ml-auto shrink-0",
                    "ease-standard transition-opacity duration-[160ms]",
                    on ? "text-brand opacity-100" : "opacity-0",
                  )}
                >
                  사진 첨부됨
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="border-border-light mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-caption text-text-sub">
          {taken ? "직접 켜고 끄실 수 있습니다." : "항목을 눌러 직접 체크해보세요."}
        </p>
        <button
          type="button"
          onClick={reset}
          disabled={done === 0}
          className={cn(
            "text-caption ease-standard rounded-sm px-2.5 py-1.5 font-semibold transition-colors duration-[160ms]",
            done === 0 ? "text-text-muted pointer-events-none" : "text-brand hover:bg-brand-50",
          )}
        >
          전체 해제
        </button>
      </div>

      {/* F-3 — 큰 수는 맥락과 함께 둘 때만 증거가 된다 */}
      <p className="text-caption text-text-sub mt-3">
        무인키즈카페 상시근무 {ROUTINE_TOTAL}개 항목 중 {items.length}개입니다. 여기에 주차별 항목이
        더해져 총 319개가 됩니다. 항목 수는 업종·면적에 따라 달라집니다.
      </p>
    </div>
  );
}
