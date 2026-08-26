"use client";

import { Fragment, useRef, useState } from "react";
import { ScreenShot, type Shot } from "./ScreenStack";
import { ServiceIcon, type ServiceIconName } from "./serviceIcons";
import { cn } from "@/lib/cn";

/**
 * 서비스 6영역 — 왼쪽 항목 목록 / 오른쪽 상세 (PRD §7.3).
 *
 * ── 접근성 판단 ──
 * PRD AC 는 `role="tablist"` · `aria-selected` 를 요구한다. 그런데 같은 AC 가
 * **모바일에서는 아코디언으로 전환**할 것도 요구한다. 두 가지를 한 DOM 으로
 * 동시에 만족시킬 수 없다 — `tablist` 는 자식이 `tab` 이어야 하는데, 아코디언은
 * 각 헤더 **바로 아래**에 패널이 와야 하므로 패널이 목록 안으로 들어오기 때문이다.
 *
 * 그래서 **디스클로저(아코디언) 시맨틱 하나로 통일**했다.
 *   · `aria-expanded` + `aria-controls` — 두 레이아웃 모두에서 유효하다
 *   · 방향키 이동은 그대로 지원한다(AC 의 실제 목적)
 *   · DOM 이 하나라 스크린리더에 같은 내용이 두 번 읽히지 않는다
 * 마크업을 두 벌 만들어 CSS 로 감추는 방법도 있지만, 그러면 보조기기 사용자가
 * 여섯 항목을 열두 번 듣게 된다. 역할 이름보다 실제로 쓸 수 있는 쪽을 택했다.
 *
 * ── CLS ──
 * 항목을 바꿔도 오른쪽 영역 높이가 출렁이지 않도록 `lg:min-h` 를 준다(AC).
 */

export type ServiceArea = {
  id: string;
  title: string;
  /** 이 영역이 해결하는 것 한 문장 */
  lead: string;
  /** 세부 3항목 */
  items: readonly string[];
  icon: ServiceIconName;
  /**
   * 영역 화면 한 장. 틀을 쓰지 않으므로 `width`/`height` 로 비율을 잡는다.
   *
   * ⚠️ **캡처가 없으면 이 값을 비운다.** 자리표시자를 라이브에 두지 않기로 했다
   *    (사용자 확정 2026-08-25). 비면 이미지 칼럼 자체가 사라지고 설명이 전체
   *    폭을 쓴다 — 빈 상자가 남는 것보다 낫다.
   */
  screen?: Shot;
};

/**
 * lg 이상에서 항목 버튼이 놓일 행. Tailwind 는 소스에 문자열이 그대로 있어야
 * 클래스를 생성하므로 배열로 박아 둔다(템플릿 문자열로 만들면 생성되지 않는다).
 */
const ROW_START = [
  "lg:row-start-1",
  "lg:row-start-2",
  "lg:row-start-3",
  "lg:row-start-4",
  "lg:row-start-5",
  "lg:row-start-6",
];

export function ServiceTabs({ areas }: { areas: readonly ServiceArea[] }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (to: number) => {
    const next = (to + areas.length) % areas.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    // 세로로 늘어선 목록이므로 위/아래가 자연스럽다.
    // 좌/우도 받아준다 — 가로 탭에 익숙한 사용자가 그렇게 누른다.
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        move(i + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        move(i - 1);
        break;
      case "Home":
        e.preventDefault();
        move(0);
        break;
      case "End":
        e.preventDefault();
        move(areas.length - 1);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-3">
      {areas.map((a, i) => {
        const on = i === active;

        return (
          <Fragment key={a.id}>
            <h3 className={cn("lg:col-start-1", ROW_START[i])}>
              <button
                type="button"
                id={`${a.id}-tab`}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                aria-expanded={on}
                aria-controls={`${a.id}-panel`}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-5 py-4 text-left",
                  "ease-standard transition-[background-color,border-color,color] duration-[200ms]",
                  on
                    ? "border-brand bg-brand text-white shadow-[var(--shadow-cta)]"
                    : "border-border text-ink hover:border-border-strong hover:bg-bg-subtle bg-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    "ease-standard transition-colors duration-[200ms]",
                    on ? "bg-white/18 text-white" : "bg-brand-100 text-brand",
                  )}
                >
                  <ServiceIcon name={a.icon} size={20} />
                </span>

                <span className="text-h4 min-w-0 flex-1">{a.title}</span>

                {/* 모바일에서는 아코디언이므로 열림 표시가 필요하다.
                    데스크톱에서는 선택된 항목이 색으로 드러나므로 숨긴다. */}
                <svg
                  aria-hidden
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "ease-standard shrink-0 transition-transform duration-[200ms] lg:hidden",
                    on && "rotate-180",
                  )}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>

            <div
              id={`${a.id}-panel`}
              role="region"
              aria-labelledby={`${a.id}-tab`}
              hidden={!on}
              className="border-border rounded-lg border bg-white p-6 shadow-[var(--shadow-card)] lg:col-start-2 lg:row-span-6 lg:row-start-1 lg:min-h-[400px] lg:p-8"
            >
              <div
                className={cn(
                  "grid gap-8 sm:items-start",
                  a.screen && "sm:grid-cols-[minmax(0,1fr)_220px]",
                )}
              >
                <div>
                  <p className="text-h3 text-ink mb-6">{a.lead}</p>

                  <ul className="flex flex-col gap-4">
                    {a.items.map((item) => (
                      <li key={item} className="text-body text-text-sub flex gap-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-brand)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                          className="mt-1 shrink-0"
                        >
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/*
                  틀 없이 원본 비율 그대로. 이 칼럼은 220px 로 좁아 **가로 PC 캡처를
                  넣으면 글자가 안 보인다** — 세로 모바일 화면을 골라 넣는다.
                  캡처가 없으면 아무것도 그리지 않는다(위 `screen` 주석 참조).
                */}
                {a.screen && <ScreenShot shot={a.screen} sizes="220px" />}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
