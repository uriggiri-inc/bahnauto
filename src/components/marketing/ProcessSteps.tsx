"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ConditionalTag } from "@/components/marketing/ConditionalTag";
import { formatCopy } from "@/components/ui/Copy";

/**
 * 도입 절차 — 단계가 순서대로 넘어가는 진행 애니메이션.
 *
 * 왜 자동으로 넘기는가: 4단계가 한 화면에 나란히 있으면 "카드 4장"으로 읽히지
 * **순서**로는 읽히지 않는다. 하나씩 강조가 옮겨가고 그 사이를 화살표가 흐르면
 * 비로소 절차로 읽힌다. 점주가 알고 싶은 건 목록이 아니라 "어디까지 내가 하고,
 * 언제 시작되는가"이므로 순서 자체가 정보다.
 *
 * 사용자가 개입하면(호버·포커스·클릭) 즉시 멈춘다 — 읽는 중에 강조가 옮겨가면
 * 방해가 된다. 클릭하면 그 단계에 고정된다.
 *
 * 모션 축소: 순환을 끄고 전 단계를 동등하게 보여준다. 이 섹션의 정보는
 * 애니메이션이 아니라 텍스트에 있으므로 잃는 것이 없다.
 */

export type Step = {
  no: string;
  title: string;
  desc: string;
  /** 점주가 하실 일 — 부담 인식을 낮추는 장치(PRD §7.4) */
  owner: string;
  /** 조건부 단계임을 밝히는 짧은 꼬리표 (예: `필요 시`, `스탠다드 이상`) */
  tag?: string;
};

/** 단계가 넘어가는 간격 — 사용자 확정(2026-08-14): 1.2초 */
const CYCLE_MS = 1200;

/**
 * **첫 이동까지의 시간.** 이게 없으면 화면에 들어온 뒤 1.2초 동안 아무것도
 * 움직이지 않는다 — `setInterval` 은 첫 발화도 한 주기를 기다리기 때문이다.
 * 사용자가 "반응이 늦다"고 지적한 지점이 정확히 이 죽은 시간이었다
 * (2026-08-18). 스크롤이 멎기 전에 이미 01 → 02 가 시작되어야 순서로 읽힌다.
 */
const FIRST_MS = 350;

/**
 * 스크롤이 멈췄다고 보는 시간.
 *
 * 왜 필요한가: 커서를 가만히 둔 채 스크롤하면 카드가 커서 **아래로 미끄러져
 * 들어오면서** `pointerenter` 가 발화한다. 브라우저 입장에서는 맞는 이벤트지만
 * 사용자는 아무것도 하지 않았다. 그걸 "보고 있다"로 받아 순환을 멈추면
 * **화면에 도착했는데 아무 일도 일어나지 않는다.** 커서를 치워야 비로소
 * 움직이기 시작하니 "늦게 반응한다"로 느껴진다.
 */
const SCROLL_IDLE_MS = 200;

export function ProcessSteps({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  /** 순환을 멈춰야 하는 상태 — 사용자가 보고 있거나 직접 골랐다 */
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  /** 지금 스크롤 중인가 — 스크롤로 밀려든 포인터 이벤트를 걸러내는 데 쓴다 */
  const scrollingRef = useRef(false);

  // 화면 밖에서는 돌리지 않는다. 보지도 않는 애니메이션에 프레임을 쓸 이유가 없다.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    /*
      스크롤 중에는 포인터 이벤트를 "사용자 개입"으로 보지 않는다(위 상수 주석).
      `setState` 가 아니라 ref 라서 스크롤마다 렌더가 돌지 않는다 — 스크롤
      핸들러에서 상태를 갱신하면 그 자체가 스크롤을 버벅이게 만든다.
    */
    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      scrollingRef.current = true;
      clearTimeout(idle);
      idle = setTimeout(() => {
        scrollingRef.current = false;
      }, SCROLL_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
    };
  }, []);

  const running = visible && !held && !reduced;

  /*
    `setInterval` 하나로는 첫 발화가 한 주기(1.2초) 뒤다. 첫 이동만 `FIRST_MS`
    뒤에 하고 그 다음부터 1.2초 간격으로 돈다 — 스스로 다음 타이머를 예약하는
    방식이라 두 타이머가 겹쳐 이중 발화하는 일이 없다.
  */
  useEffect(() => {
    if (!running) return;

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setActive((i) => (i + 1) % steps.length);
      timer = setTimeout(tick, CYCLE_MS);
    };
    timer = setTimeout(tick, FIRST_MS);

    return () => clearTimeout(timer);
  }, [running, steps.length]);

  const pick = useCallback((i: number) => {
    setHeld(true);
    setActive(i);
  }, []);

  /** 커서가 들어왔다 — 단, 스크롤로 밀려든 것이면 개입이 아니다 */
  const onPointerIn = useCallback(() => {
    if (scrollingRef.current) return;
    setHeld(true);
  }, []);

  return (
    <ol
      ref={ref}
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:gap-x-9",
        // 단계 수만큼 열을 준다. 5단계를 4열에 넣으면 마지막 하나만 다음 줄로
        // 떨어져 "네 단계 + 덤"으로 읽힌다.
        steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4",
      )}
      onPointerEnter={onPointerIn}
      /*
        `pointermove` 도 본다: 스크롤로 커서 아래에 들어온 상태에서 사용자가
        **실제로 커서를 움직이면** 그때는 개입이다. `pointerenter` 는 이미
        지나갔으므로 이 핸들러가 없으면 순환이 멈추지 않는다.
      */
      onPointerMove={onPointerIn}
      onPointerLeave={() => setHeld(false)}
    >
      {steps.map((s, i) => {
        // 모션 축소일 때는 특정 단계만 강조하지 않는다
        const on = !reduced && i === active;
        const flowing = !reduced && running && i === active && i < steps.length - 1;

        return (
          <li key={s.no} className="relative">
            <button
              type="button"
              onClick={() => pick(i)}
              onFocus={() => setHeld(true)}
              aria-current={on ? "step" : undefined}
              className={cn(
                // `ba-flash-host` — 카드 어디에 커서·포커스가 들어오면 꼬리표
                // 번쩍임이 멈춘다(globals.css). 무한 루프 예외의 안전장치다
                "ba-flash-host h-full w-full rounded-lg border p-6 text-left",
                "ease-brand transition-[transform,box-shadow,border-color,background-color] duration-[400ms]",
                on
                  ? "border-brand -translate-y-1.5 bg-white shadow-[var(--shadow-cta)]"
                  : "border-border-light bg-bg-subtle shadow-none",
              )}
            >
              <span className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "text-label inline-flex items-center justify-center rounded-full px-2.5 py-1",
                    "ease-brand transition-colors duration-[400ms]",
                    on ? "bg-brand text-white" : "bg-brand-100 text-brand",
                  )}
                >
                  {s.no}
                </span>
                {/* 조건부 단계 — 모든 매장이 거치지 않는다는 사실을 카드 안에서 밝힌다 */}
                {/*
                  조건부 단계 꼬리표. 강조와 번쩍임은 `ConditionalTag` 가 들고 있다 —
                  하단 "단계별 상세" 섹션과 **같은 컴포넌트**를 쓴다(사용자 지시
                  2026-08-18). 클래스를 두 곳에 복사해 두면 한쪽만 고쳐지는 날이 온다.

                  `paused={held}` — 단계 목록에 커서를 올리거나 단계를 고르면 멈춘다.
                  카드 단위 정지는 `ba-flash-host` 가 CSS 로 따로 처리한다.
                */}
                {s.tag && <ConditionalTag paused={held}>{s.tag}</ConditionalTag>}
              </span>

              <p className="text-h4 text-ink mb-2">{s.title}</p>
              <p className="text-body-sm text-text-sub mb-4">{formatCopy(s.desc)}</p>

              {/* 페인 카드와 같은 골격 — 구분선 pt-4 + 한 줄. 값을 맞춰야 형제로 읽힌다 */}
              <p
                className={cn(
                  "text-body-sm border-t pt-4",
                  "ease-standard transition-colors duration-[400ms]",
                  on ? "border-brand-200 text-brand" : "border-border-light text-text-sub",
                )}
              >
                {s.owner}
              </p>
            </button>

            {/* ── 다음 단계로 흐르는 화살표 ──
                마지막 단계 뒤에는 없다. lg 에서는 우측 간격, 그 아래에서는 아래쪽. */}
            {i < steps.length - 1 && (
              <Arrow flowing={flowing} active={on} last={i === steps.length - 2} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Arrow({ flowing, active, last }: { flowing: boolean; active: boolean; last: boolean }) {
  const color = active ? "var(--color-brand)" : "var(--color-border-strong)";

  return (
    <>
      {/* lg — 카드 사이 가로 간격(gap-x-9 = 36px)의 한가운데 */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-9 hidden w-9 -translate-y-1/2 justify-center lg:flex"
      >
        <Glyph color={color} flowing={flowing} />
      </span>

      {/* sm 이하 — 카드 아래. 2열 배치에서 짝수 번째 뒤에는 줄이 바뀌므로 숨긴다 */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -bottom-4 left-1/2 flex h-4 -translate-x-1/2 rotate-90 items-center lg:hidden",
          last && "sm:hidden",
        )}
      >
        <Glyph color={color} flowing={flowing} />
      </span>
    </>
  );
}

function Glyph({ color, flowing }: { color: string; flowing: boolean }) {
  return (
    <svg width="34" height="16" viewBox="0 0 34 16" fill="none" aria-hidden>
      {/* 흐르는 점선 — 진행 중일 때만 움직인다 */}
      <line
        x1="1"
        y1="8"
        x2="24"
        y2="8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 8"
        className={flowing ? "ba-flow-line" : undefined}
        style={{ transition: "stroke 400ms var(--ease-standard)" }}
      />
      <path
        d="m25 3 5 5-5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 400ms var(--ease-standard)" }}
      />
    </svg>
  );
}
